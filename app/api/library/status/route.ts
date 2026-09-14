import { NextResponse } from "next/server";
import { islamHouseStatus } from "../../../../src/lib/islamhouse";

export async function GET() {
  const status = islamHouseStatus();
  return NextResponse.json({
    ...status,
    configured: status.configured,
    message: status.configured
      ? "IslamHouse connection is configured."
      : "Add ISLAMHOUSE_API_KEY to enable the official library sync.",
  });
}
