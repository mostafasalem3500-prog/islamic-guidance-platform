import { NextRequest, NextResponse } from "next/server";
import { getQuranSurah } from "../../../../src/lib/quran-enc";

export const revalidate = 86400;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const translation = searchParams.get("translation") ?? "english_saheeh";
  const surah = Number(searchParams.get("surah") ?? "1");

  try {
    const data = await getQuranSurah(translation, surah);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to retrieve Quran source.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
