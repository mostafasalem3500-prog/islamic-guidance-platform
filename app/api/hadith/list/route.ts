import { NextRequest, NextResponse } from "next/server";
import { getHadithsByCategory } from "../../../../src/lib/hadeeth-enc";

export const revalidate = 86400;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get("category_id");
  const language = searchParams.get("language") ?? "ar";

  if (!categoryId) return NextResponse.json({ error: "category_id is required." }, { status: 400 });

  try {
    return NextResponse.json(await getHadithsByCategory(categoryId, language));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to retrieve Hadith source.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
