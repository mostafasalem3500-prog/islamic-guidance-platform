import { sourceRecord, type SourceRecord } from "./content-source";

const API = "https://hadeethenc.com/api/v1";

export type HadithCategory = {
  id: string;
  title: string;
  hadeeths_count: string;
  parent_id?: string;
};

export type HadithDetails = {
  id: string;
  title: string;
  hadeeth: string;
  attribution: string;
  grade: string;
  explanation: string;
  hints: string[];
  categories: string[];
  translations: string[];
  reference?: string;
};

export type HadithSourceResponse<T> = {
  data: T;
  source: SourceRecord;
};

function isLanguage(value: string) {
  return /^[a-z]{2,3}$/i.test(value);
}

export async function getHadithRootCategories(language = "ar"): Promise<HadithSourceResponse<HadithCategory[]>> {
  if (!isLanguage(language)) throw new Error("Invalid HadeethEnc language.");

  const response = await fetch(`${API}/categories/roots/?language=${encodeURIComponent(language)}`, {
    next: { revalidate: 86400 },
  });
  if (!response.ok) throw new Error("HadeethEnc source is currently unavailable.");

  const payload = (await response.json()) as HadithCategory[] | { data?: HadithCategory[]; result?: HadithCategory[] };
  const categories = Array.isArray(payload) ? payload : (payload.data ?? payload.result);
  if (!Array.isArray(categories)) throw new Error("Unexpected HadeethEnc response.");

  return { data: categories, source: sourceRecord("HADEETH_ENC") };
}

export async function getHadith(id: string, language = "ar"): Promise<HadithSourceResponse<HadithDetails>> {
  if (!/^\d+$/.test(id) || !isLanguage(language)) throw new Error("Invalid HadeethEnc request.");

  const response = await fetch(
    `${API}/hadeeths/one/?language=${encodeURIComponent(language)}&id=${encodeURIComponent(id)}`,
    { next: { revalidate: 86400 } },
  );
  if (!response.ok) throw new Error("HadeethEnc source is currently unavailable.");

  const payload = (await response.json()) as HadithDetails | { data?: HadithDetails };
  const hadith = "data" in payload && payload.data ? payload.data : payload;
  if (!hadith.id || !hadith.hadeeth) throw new Error("Unexpected HadeethEnc response.");

  return { data: hadith, source: sourceRecord("HADEETH_ENC") };
}


export type HadithListItem = {
  id: string;
  title: string;
  translations: string[];
};

export async function getHadithsByCategory(categoryId: string, language = "ar", page = 1, perPage = 20): Promise<HadithSourceResponse<HadithListItem[]>> {
  if (!/^\d+$/.test(categoryId) || !isLanguage(language) || !Number.isInteger(page) || page < 1 || page > 100 || !Number.isInteger(perPage) || perPage < 1 || perPage > 30) {
    throw new Error("Invalid HadeethEnc list request.");
  }

  const url = new URL(`${API}/hadeeths/list/`);
  url.searchParams.set("language", language);
  url.searchParams.set("category_id", categoryId);
  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(perPage));

  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) throw new Error("HadeethEnc source is currently unavailable.");

  const payload = (await response.json()) as { data?: HadithListItem[] } | HadithListItem[];
  const list = Array.isArray(payload) ? payload : payload.data;
  if (!Array.isArray(list)) throw new Error("Unexpected HadeethEnc response.");

  return { data: list, source: sourceRecord("HADEETH_ENC") };
}
