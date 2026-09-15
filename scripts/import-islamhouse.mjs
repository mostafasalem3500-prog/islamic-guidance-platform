import pg from "pg";

const baseUrl = "https://api3.islamhouse.com/v3";
const key = process.env.ISLAMHOUSE_API_KEY || "paV29H2gm56kvLP";
const rootCategory = process.argv[2] || "192525";
const language = process.argv[3] || "ar";
const maxItems = Math.min(Math.max(Number(process.argv[4] || 30), 1), 50);

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required to import official metadata.");

async function source(path) {
  const response = await fetch(`${baseUrl}/${key}/${path}`);
  if (!response.ok) throw new Error(`IslamHouse API returned ${response.status} for ${path}`);
  return response.json();
}

function clean(value) {
  return typeof value === "string" ? value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim() : null;
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
try {
  await client.connect();
  await client.query("BEGIN");
  const sourceRow = await client.query(
    `INSERT INTO sources (provider, official_url, license_url, synced_at)
     VALUES ('IslamHouse', 'https://islamhouse.com/', 'https://islamhouse.com/ar/category/192525/showall/showall/1/', now())
     ON CONFLICT (provider) DO UPDATE SET synced_at = now()
     RETURNING id`,
  );
  const sourceId = sourceRow.rows[0].id;
  const children = await source(`categories/viewcat/${rootCategory}/${language}/showall/json`);
  const category = Array.isArray(children) ? children.find((item) => /^\d+$/.test(String(item?.id))) : null;
  if (!category) throw new Error("No importable subcategory was returned by IslamHouse.");
  const rawItems = await source(`categories/viewitems/${category.id}/showall/${language}/showall/json`);
  const items = (Array.isArray(rawItems) ? rawItems : []).slice(0, maxItems);
  for (const item of items) {
    if (!item?.id || !item?.title) continue;
    const detail = await source(`main/get-item/${item.id}/${language}/json`).catch(() => item);
    const title = clean(detail?.title) || clean(item.title);
    if (!title) continue;
    const author = Array.isArray(detail?.prepared_by) ? detail.prepared_by.map((person) => clean(person?.title)).filter(Boolean).join("، ") || null : null;
    const type = clean(detail?.type) || clean(item?.datatype) || "showall";
    const url = `https://islamhouse.com/${language}/${type}/${item.id}/`;
    await client.query(
      `INSERT INTO library_items (source_id, external_id, title, author, language, item_type, description, original_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       ON CONFLICT (source_id, external_id) DO UPDATE SET title=EXCLUDED.title, author=EXCLUDED.author, item_type=EXCLUDED.item_type, description=EXCLUDED.description, original_url=EXCLUDED.original_url`,
      [sourceId, String(item.id), title, author, language, type, clean(detail?.description), url],
    );
  }
  await client.query("COMMIT");
  console.log(`Imported ${items.length} official IslamHouse records from category ${category.id}.`);
} catch (error) {
  await client.query("ROLLBACK").catch(() => {});
  throw error;
} finally {
  await client.end();
}
