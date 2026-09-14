import { NextRequest, NextResponse } from "next/server";
import { createResearchPlan, type ResearchAudience, type ResearchLanguage } from "../../../../src/lib/research-planner";

const audiences = new Set<ResearchAudience>(["seeker", "new-muslim", "muslim", "dai"]);
const languages = new Set<ResearchLanguage>(["ar", "en", "ru", "uz"]);
const requests = new Map<string, { count: number; resetAt: number }>();

function allowed(request: NextRequest) {
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const current = requests.get(address);
  if (!current || current.resetAt < now) {
    requests.set(address, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (current.count >= 12) return false;
  current.count += 1;
  return true;
}

export async function POST(request: NextRequest) {
  if (!allowed(request)) return NextResponse.json({ error: "حاول مرة أخرى بعد دقيقة." }, { status: 429 });
  try {
    const body: unknown = await request.json();
    if (!body || typeof body !== "object") throw new Error("invalid");
    const input = body as { topic?: unknown; audience?: unknown; language?: unknown };
    const topic = typeof input.topic === "string" ? input.topic.trim().replace(/\s+/g, " ") : "";
    if (topic.length < 2 || topic.length > 180 || !audiences.has(input.audience as ResearchAudience) || !languages.has(input.language as ResearchLanguage)) {
      return NextResponse.json({ error: "تحقق من الموضوع واللغة ونوع المستخدم." }, { status: 400 });
    }
    const plan = await createResearchPlan({ topic, audience: input.audience as ResearchAudience, language: input.language as ResearchLanguage });
    if (!plan.keywords.length) return NextResponse.json({ error: "لم نتمكن من استخراج كلمات بحث كافية من الموضوع." }, { status: 422 });
    return NextResponse.json({
      plan,
      sources: [
        { id: "quran", label: "القرآن الكريم", provider: "QuranEnc", href: "/quran" },
        { id: "hadith", label: "الحديث النبوي", provider: "HadeethEnc", href: "/hadith" },
        { id: "library", label: "الكتب والمواد", provider: "IslamHouse", href: "/library" },
      ],
    });
  } catch {
    return NextResponse.json({ error: "تعذر تجهيز خطة البحث. أعد المحاولة." }, { status: 400 });
  }
}
