import { sourceRecord } from "./content-source";

export const islamHouseConfig = {
  baseUrl: "https://api3.islamhouse.com/v3",
  documentationUrl: "https://documenter.getpostman.com/view/7929737/TzkyMfPc",
  requiresPublicKey: true,
} as const;

export function islamHouseStatus() {
  return {
    configured: Boolean(process.env.ISLAMHOUSE_API_KEY),
    source: sourceRecord("ISLAM_HOUSE"),
    documentationUrl: islamHouseConfig.documentationUrl,
  };
}
