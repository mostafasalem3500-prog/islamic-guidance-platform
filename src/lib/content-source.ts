export type ContentProvider = "QURAN_ENC" | "HADEETH_ENC" | "ISLAM_HOUSE";

export type SourceRecord = {
  provider: ContentProvider;
  label: string;
  officialUrl: string;
  attribution: string;
  version?: string;
  syncedAt: string;
  isOriginalText: boolean;
};

export const officialProviders = {
  QURAN_ENC: {
    label: "موسوعة القرآن الكريم للترجمة",
    officialUrl: "https://quranenc.com/",
    attribution: "QuranEnc.com",
  },
  HADEETH_ENC: {
    label: "موسوعة الأحاديث النبوية",
    officialUrl: "https://hadeethenc.com/",
    attribution: "HadeethEnc.com",
  },
  ISLAM_HOUSE: {
    label: "إسلام هاوس",
    officialUrl: "https://islamhouse.com/",
    attribution: "IslamHouse.com",
  },
} as const;

export function sourceRecord(provider: ContentProvider, version?: string): SourceRecord {
  const item = officialProviders[provider];
  return {
    provider,
    ...item,
    version,
    syncedAt: new Date().toISOString(),
    isOriginalText: true,
  };
}
