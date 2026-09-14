import Link from "next/link";
import { getHadithRootCategories } from "../../src/lib/hadeeth-enc";

export const dynamic = "force-dynamic";

export default async function HadithPage() {
  let catalog: Awaited<ReturnType<typeof getHadithRootCategories>> | null = null;
  try {
    catalog = await getHadithRootCategories("ar");
  } catch {
    catalog = null;
  }

  return (
    <main className="content-page">
      <header className="page-nav"><Link href="/">← بلّغ</Link><span>الحديث النبوي</span></header>
      <section className="page-hero compact-hero">
        <p className="eyebrow">حديث موثق · شرح مفهوم</p>
        <h1>موسوعة الحديث<br /><em>من مصدرها الرسمي.</em></h1>
        <p>اختر موضوعًا لتصل لاحقًا إلى الأحاديث وشرحها وترجماتها، مع الحفاظ على بيانات النسبة الأصلية.</p>
      </section>

      {catalog ? (
        <>
          <div className="source-bar">
            <span>المصدر: <a href={catalog.source.officialUrl} target="_blank" rel="noreferrer">{catalog.source.attribution}</a></span>
            <span>الفهرس باللغة العربية</span>
            <span>آخر مزامنة: {new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(new Date(catalog.source.syncedAt))}</span>
          </div>
          <section className="category-grid" aria-label="موضوعات الحديث">
            {catalog.data.map((category) => (
              <article key={category.id}>
                <span>{category.hadeeths_count} حديثًا</span>
                <h2>{category.title}</h2>
                <p>استكشف الأحاديث الموثقة في هذا الموضوع.</p>
                <Link href={`/hadith/category/${category.id}`}>استكشف الأحاديث ←</Link>
              </article>
            ))}
          </section>
          <aside className="source-proof">
            <div><span className="proof-label">التوثيق والنسبة</span><h2>كل نص وشرح من المصدر.</h2><p>ستعرض صفحة الحديث لاحقًا النص ودرجة الحديث والشرح والمرجع كما يرد من موسوعة الأحاديث النبوية.</p></div>
            <a href="https://documenter.getpostman.com/view/5211979/TVev3j7q" target="_blank" rel="noreferrer">توثيق API ↗</a>
          </aside>
        </>
      ) : (
        <aside className="source-proof">
          <div><span className="proof-label">المصدر مؤقتًا غير متاح</span><h2>تعذر جلب فهرس الموضوعات الآن.</h2><p>لم نعرض بيانات بديلة غير موثقة. يمكنك الرجوع إلى الموقع الرسمي للموسوعة.</p></div>
          <a href="https://hadeethenc.com/" target="_blank" rel="noreferrer">زيارة HadeethEnc ↗</a>
        </aside>
      )}
    </main>
  );
}
