import { NextRequest, NextResponse } from "next/server";
import { getHadith } from "../../../src/lib/hadeeth-enc";

export const revalidate = 86400;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  const language = searchParams.get("language") ?? "ar";

  if (!id) return NextResponse.json({ error: "Hadith id is required." }, { status: 400 });

  try {
    return NextResponse.json(await getHadith(id, language));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to retrieve Hadith source.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
