import Link from "next/link";
import { getIslamHouseCategories, getIslamHouseItems, getIslamHouseSections } from "../../src/lib/islamhouse";

export const dynamic = "force-dynamic";

function itemTitle(item: Record<string, unknown>) {
  const candidates = [item.title, item.name, item.item_title, item.description];
  return candidates.find((value) => typeof value === "string" && value.trim()) as string | undefined;
}

export default async function LibraryPage() {
  let sections: Awaited<ReturnType<typeof getIslamHouseSections>> | null = null;
  let books: Awaited<ReturnType<typeof getIslamHouseItems>> | null = null;
  let categories: Awaited<ReturnType<typeof getIslamHouseCategories>> | null = null;
  try {
    [sections, books, categories] = await Promise.all([
      getIslamHouseSections("ar", "ar"),
      getIslamHouseItems("books", "ar", "ar", 1, 12),
      getIslamHouseCategories("ar"),
    ]);
  } catch {
    sections = null;
    books = null;
    categories = null;
  }

  return (
    <main className="content-page">
      <header className="page-nav"><Link href="/">← بلّغ</Link><span>المكتبة الإسلامية</span></header>
      <section className="page-hero compact-hero">
        <p className="eyebrow">معرفة أوسع من مصدر موثّق</p>
        <h1>مكتبة إسلامية<br /><em>من IslamHouse.</em></h1>
        <p>هذه المواد تُجلب مباشرة من المصدر الرسمي، مع إبقاء رابط المصدر وبياناته متاحة عند فتح كل مادة.</p>
      </section>

      {sections && books && categories ? (
        <>
          <div className="source-bar">
            <span>المصدر: <a href={books.source.officialUrl} target="_blank" rel="noreferrer">{books.source.attribution}</a></span>
            <span>اللغة: العربية</span>
            <span>مواد الكتب المعروضة: {books.data.length}</span>
          </div>
          <section className="library-types">
            {sections.data.filter((section) => section.block_name !== "showall").map((section) => (
              <span key={section.block_name}>{section.block_name} · {section.items_count.toLocaleString("ar-SA")}</span>
            ))}
          </section>
          <section className="library-types" aria-label="التصنيفات العلمية">
            {categories.data.slice(1, 25).map((category) => <Link key={category.id} href={`/library/category/${category.id}`}>{category.title}</Link>)}
          </section>
          <section className="library-grid" aria-label="كتب من إسلام هاوس">
            {books.data.map((book, index) => (
              <article key={String(book.id ?? index)}>
                <span>IslamHouse</span>
                <h2>{itemTitle(book) ?? "مادة من المكتبة الإسلامية"}</h2>
                <p>المادة محفوظة في المصدر الرسمي. ستضاف صفحة التفاصيل وبيانات المؤلف والملفات في المرحلة التالية.</p>
                {book.id ? <Link href={`/library/item/${book.id}`}>عرض المادة والملف ↗</Link> : <a href={books.source.officialUrl} target="_blank" rel="noreferrer">عرض المصدر الرسمي ↗</a>}
              </article>
            ))}
          </section>
        </>
      ) : (
        <aside className="source-proof">
          <div><span className="proof-label">المصدر مؤقتًا غير متاح</span><h2>تعذر جلب المكتبة الآن.</h2><p>لم نعرض مواد بديلة أو منسوخة. يمكنك الرجوع إلى IslamHouse مباشرة.</p></div>
          <a href="https://islamhouse.com/" target="_blank" rel="noreferrer">زيارة IslamHouse ↗</a>
        </aside>
      )}
    </main>
  );
}
