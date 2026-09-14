import { NextRequest, NextResponse } from "next/server";
import { getHadithRootCategories } from "../../../../src/lib/hadeeth-enc";

export const revalidate = 86400;

export async function GET(request: NextRequest) {
  const language = new URL(request.url).searchParams.get("language") ?? "ar";
  try {
    return NextResponse.json(await getHadithRootCategories(language));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to retrieve Hadith source.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
