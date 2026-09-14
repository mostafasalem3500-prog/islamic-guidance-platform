import { sourceRecord, type SourceRecord } from "./content-source";

const API = "https://quranenc.com/api/v1";

export type QuranVerse = {
  id: string;
  sura: string;
  aya: string;
  arabic_text: string;
  translation: string;
  footnotes: string;
};

export type QuranSurahResponse = {
  verses: QuranVerse[];
  source: SourceRecord & { translationKey: string };
};

function validPositive(value: string | number, max: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= 1 && parsed <= max;
}

export async function getQuranSurah(translationKey = "english_saheeh", surah = 1, version?: string): Promise<QuranSurahResponse> {
  if (!/^[a-z0-9_]+$/i.test(translationKey) || !validPositive(surah, 114)) {
    throw new Error("Invalid Quran translation or surah request.");
  }

  const response = await fetch(
    `${API}/translation/sura/${encodeURIComponent(translationKey)}/${surah}`,
    { next: { revalidate: 86400 } },
  );

  if (!response.ok) throw new Error("QuranEnc source is currently unavailable.");

  const payload = (await response.json()) as { result?: QuranVerse[] };
  if (!Array.isArray(payload.result)) throw new Error("Unexpected QuranEnc response.");

  return {
    verses: payload.result,
    source: { ...sourceRecord("QURAN_ENC", version), translationKey },
  };
}


export type QuranTranslation = {
  key: string;
  language_iso_code: string;
  version: string;
  last_update: string;
  title: string;
  description: string;
};

export async function getQuranTranslations(language: string, localization = "en"): Promise<QuranTranslation[]> {
  if (!/^[a-z]{2,3}$/i.test(language) || !/^[a-z]{2,3}$/i.test(localization)) {
    throw new Error("Invalid QuranEnc language request.");
  }

  const url = new URL(`${API}/translations/list/${encodeURIComponent(language)}`);
  url.searchParams.set("localization", localization);
  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) throw new Error("QuranEnc translations are currently unavailable.");

  const payload = (await response.json()) as QuranTranslation[] | { result?: QuranTranslation[]; data?: QuranTranslation[] };
  const translations = Array.isArray(payload) ? payload : (payload.result ?? payload.data);
  if (!Array.isArray(translations)) throw new Error("Unexpected QuranEnc translations response.");
  return translations;
}
