import { NextResponse } from "next/server";
import { islamHouseStatus } from "../../../../src/lib/islamhouse";

export async function GET() {
  const status = islamHouseStatus();
  return NextResponse.json({
    ...status,
    message: status.usingEnvironmentKey
      ? "IslamHouse connection uses the configured environment key."
      : "IslamHouse connection uses the official public API key.",
  });
}
