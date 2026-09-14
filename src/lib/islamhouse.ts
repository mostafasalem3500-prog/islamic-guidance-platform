import { sourceRecord, type SourceRecord } from "./content-source";

const BASE_URL = "https://api3.islamhouse.com/v3";
const PUBLIC_KEY = "paV29H2gm56kvLP";

export type IslamHouseSection = {
  block_name: string;
  type: string;
  items_count: number;
  api_url: string;
};

export type IslamHouseItem = Record<string, unknown> & {
  title?: string;
  id?: number | string;
  url?: string;
};

export type IslamHouseResponse<T> = {
  data: T;
  source: SourceRecord;
};

function key() {
  return process.env.ISLAMHOUSE_API_KEY || PUBLIC_KEY;
}

function language(value: string) {
  if (!/^[a-z]{2,3}$/i.test(value)) throw new Error("Invalid IslamHouse language.");
  return value;
}

async function request<T>(path: string) {
  const response = await fetch(`${BASE_URL}/${key()}/${path}`, { next: { revalidate: 86400 } });
  if (!response.ok) throw new Error("IslamHouse source is currently unavailable.");
  return (await response.json()) as T;
}

export async function getIslamHouseSections(flang = "ar", slang = "ar"): Promise<IslamHouseResponse<IslamHouseSection[]>> {
  const output = await request<IslamHouseSection[]>(`main/sitecontent/${language(flang)}/${language(slang)}/json`);
  if (!Array.isArray(output)) throw new Error("Unexpected IslamHouse sections response.");
  return { data: output, source: sourceRecord("ISLAM_HOUSE") };
}

export async function getIslamHouseItems(type = "books", flang = "ar", slang = "ar", page = 1, limit = 12): Promise<IslamHouseResponse<IslamHouseItem[]>> {
  if (!/^[a-z]+$/i.test(type) || !Number.isInteger(page) || page < 1 || page > 100 || !Number.isInteger(limit) || limit < 1 || limit > 50) {
    throw new Error("Invalid IslamHouse list request.");
  }

  const output = await request<IslamHouseItem[] | { data?: IslamHouseItem[] }>(
    `main/${type}/${language(flang)}/${language(slang)}/${page}/${limit}/json`,
  );
  const items = Array.isArray(output) ? output : output.data;
  if (!Array.isArray(items)) throw new Error("Unexpected IslamHouse items response.");
  return { data: items, source: sourceRecord("ISLAM_HOUSE") };
}

export const islamHouseConfig = {
  baseUrl: BASE_URL,
  documentationUrl: "https://documenter.getpostman.com/view/7929737/TzkyMfPc",
  usesPublicKey: true,
} as const;

export function islamHouseStatus() {
  return {
    configured: true,
    usingEnvironmentKey: Boolean(process.env.ISLAMHOUSE_API_KEY),
    source: sourceRecord("ISLAM_HOUSE"),
    documentationUrl: islamHouseConfig.documentationUrl,
  };
}
