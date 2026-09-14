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

export async function getQuranSurah(translationKey = "english_saheeh", surah = 1): Promise<QuranSurahResponse> {
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
    source: { ...sourceRecord("QURAN_ENC"), translationKey },
  };
}
