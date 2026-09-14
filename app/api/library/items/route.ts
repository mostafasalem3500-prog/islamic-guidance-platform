import { NextRequest, NextResponse } from "next/server";
import { getIslamHouseItems } from "../../../../src/lib/islamhouse";

export const revalidate = 86400;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") ?? "books";
  const flang = searchParams.get("flang") ?? "ar";
  const slang = searchParams.get("slang") ?? flang;
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "12");

  try {
    return NextResponse.json(await getIslamHouseItems(type, flang, slang, page, limit));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to retrieve IslamHouse source.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
