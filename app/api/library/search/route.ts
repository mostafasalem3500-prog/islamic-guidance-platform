import { NextRequest, NextResponse } from "next/server";
import { searchIndexedLibrary } from "../../../../src/lib/library-search";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim() ?? "";
  const language = request.nextUrl.searchParams.get("language") ?? "ar";
  if (query.length < 2 || query.length > 180 || !/^[a-z]{2,3}$/i.test(language)) return NextResponse.json({ error: "تحقق من عبارة البحث واللغة." }, { status: 400 });
  try {
    return NextResponse.json({ query, results: await searchIndexedLibrary(query, language) });
  } catch {
    return NextResponse.json({ error: "فهرس المكتبة غير جاهز حاليًا. حاول لاحقًا." }, { status: 503 });
  }
}
