export type ResearchAudience = "seeker" | "new-muslim" | "muslim" | "dai";
export type ResearchLanguage = "ar" | "en" | "ru" | "uz";

export type ResearchPlan = {
  topic: string;
  keywords: string[];
  audience: ResearchAudience;
  language: ResearchLanguage;
  searchOrder: Array<"quran" | "hadith" | "library">;
  organizer: "ai" | "rules";
};

const audienceTerms: Record<ResearchAudience, string[]> = {
  seeker: ["معنى الإسلام", "أساسيات الإيمان"],
  "new-muslim": ["تعلم تدريجي", "تطبيق عملي"],
  muslim: ["أدلة وتعلم"],
  dai: ["مواد مناسبة للمشاركة", "لغة المتلقي"],
};

function uniqueTerms(value: string) {
  return [...new Set(
    value
      .normalize("NFKC")
      .toLocaleLowerCase()
      .match(/[\p{L}\p{N}]{2,}/gu)
      ?.filter((term) => !["من", "عن", "على", "الى", "إلى", "the", "and", "for", "with"].includes(term))
      .slice(0, 8) ?? [],
  )];
}

function isPlan(value: unknown): value is Pick<ResearchPlan, "keywords" | "searchOrder"> {
  if (!value || typeof value !== "object" || !("keywords" in value) || !("searchOrder" in value)) return false;
  const candidate = value as { keywords?: unknown; searchOrder?: unknown };
  return Array.isArray(candidate.keywords)
    && candidate.keywords.every((item) => typeof item === "string")
    && Array.isArray(candidate.searchOrder)
    && candidate.searchOrder.every((item) => item === "quran" || item === "hadith" || item === "library");
}

async function organizeWithAi(topic: string, audience: ResearchAudience, language: ResearchLanguage): Promise<Pick<ResearchPlan, "keywords" | "searchOrder"> | null> {
  const apiKey = process.env.OPENAI_API_KEY;
  const model = process.env.OPENAI_RESEARCH_MODEL;
  if (!apiKey || !model) return null;

  const schema = {
    type: "object",
    additionalProperties: false,
    required: ["keywords", "searchOrder"],
    properties: {
      keywords: { type: "array", items: { type: "string" }, minItems: 1, maxItems: 8 },
      searchOrder: { type: "array", items: { type: "string", enum: ["quran", "hadith", "library"] }, minItems: 1, maxItems: 3 },
    },
  };

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "developer",
          content: "You organize source retrieval for an Islamic research tool. Return only research keywords and source order. Do not answer the user, write religious content, invent citations, translate, issue rulings, or add explanations.",
        },
        {
          role: "user",
          content: JSON.stringify({ topic, audience, language, audienceContext: audienceTerms[audience] }),
        },
      ],
      text: { format: { type: "json_schema", name: "research_plan", strict: true, schema } },
    }),
    signal: AbortSignal.timeout(8000),
  });

  if (!response.ok) return null;
  const payload = (await response.json()) as { output_text?: string };
  if (!payload.output_text) return null;
  try {
    const output: unknown = JSON.parse(payload.output_text);
    return isPlan(output) ? output : null;
  } catch {
    return null;
  }
}

export async function createResearchPlan(input: { topic: string; audience: ResearchAudience; language: ResearchLanguage }): Promise<ResearchPlan> {
  const aiPlan = await organizeWithAi(input.topic, input.audience, input.language);
  return {
    topic: input.topic,
    audience: input.audience,
    language: input.language,
    keywords: (aiPlan?.keywords ?? uniqueTerms(input.topic)).slice(0, 8),
    searchOrder: (aiPlan?.searchOrder ?? ["quran", "hadith", "library"]).filter((value, index, all) => all.indexOf(value) === index),
    organizer: aiPlan ? "ai" : "rules",
  };
}
