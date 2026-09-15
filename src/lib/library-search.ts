import { database } from "./db";

export type IndexedLibraryResult = {
  externalId: string;
  title: string;
  author: string | null;
  language: string;
  itemType: string;
  description: string | null;
  originalUrl: string;
  provider: string;
};

function normalizeQuery(value: string) {
  return value.normalize("NFKC").replace(/[^\p{L}\p{N}\s-]/gu, " ").replace(/\s+/g, " ").trim();
}

export async function searchIndexedLibrary(query: string, language: string, limit = 12): Promise<IndexedLibraryResult[]> {
  const phrase = normalizeQuery(query);
  if (phrase.length < 2) return [];
  const tokens = phrase.split(" ").filter((word) => word.length > 1).slice(0, 8);
  if (!tokens.length) return [];
  const search = tokens.join(" & ");
  const { rows } = await database().query<{
    external_id: string; title: string; author: string | null; language: string; item_type: string; description: string | null; original_url: string; provider: string;
  }>(
    `SELECT library_items.external_id, library_items.title, library_items.author, library_items.language, library_items.item_type, library_items.description, library_items.original_url, sources.provider
     FROM library_items JOIN sources ON sources.id = library_items.source_id
     WHERE library_items.language = $1
       AND (to_tsvector('simple', coalesce(library_items.title, '') || ' ' || coalesce(library_items.author, '') || ' ' || coalesce(library_items.description, '')) @@ to_tsquery('simple', $2)
            OR library_items.title ILIKE '%' || $3 || '%' OR coalesce(library_items.description, '') ILIKE '%' || $3 || '%')
     ORDER BY ts_rank(to_tsvector('simple', coalesce(library_items.title, '') || ' ' || coalesce(library_items.description, '')), to_tsquery('simple', $2)) DESC, library_items.title ASC
     LIMIT $4`,
    [language, search, phrase, Math.min(Math.max(limit, 1), 20)],
  );
  return rows.map((row) => ({ externalId: row.external_id, title: row.title, author: row.author, language: row.language, itemType: row.item_type, description: row.description, originalUrl: row.original_url, provider: row.provider }));
}
