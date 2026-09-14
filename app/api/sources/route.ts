import { NextResponse } from "next/server";
import { officialProviders } from "@/src/lib/content-source";

export const revalidate = 3600;

export async function GET() {
  return NextResponse.json({
    providers: Object.entries(officialProviders).map(([id, provider]) => ({
      id,
      ...provider,
      policy: "Original attributed content is never modified.",
    })),
    generatedAt: new Date().toISOString(),
  });
}
