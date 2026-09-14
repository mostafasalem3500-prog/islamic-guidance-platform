import Link from "next/link";
import { getHadithsByCategory } from "../../../../src/lib/hadeeth-enc";

export const dynamic = "force-dynamic";

export default async function HadithCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let list: Awaited<ReturnType<typeof getHadithsByCategory>> | null = null;
  try {
    list = await getHadithsByCategory(id, "ar");
  } catch {
    list = null;
  }

  return (
    <main className="content-page">
      <header className="page-nav"><Link href="/hadith">← فهرس الحديث</Link><span>الأحاديث النبوية</span></header>
      <section className="page-hero compact-hero">
        <p className="eyebrow">من المصدر الرسمي</p>
        <h1>أحاديث هذا<br /><em>الموضوع.</em></h1>
      </section>
      {list ? (
        <>
          <div className="source-bar"><span>المصدر: <a href={list.source.officialUrl} target="_blank" rel="noreferrer">{list.source.attribution}</a></span><span>عدد النتائج المعروضة: {list.data.length}</span></div>
          <section className="hadith-list">
            {list.data.map((hadith) => (
              <article key={hadith.id}>
                <span>حديث موثّق</span>
                <h2>{hadith.title}</h2>
                <Link href={`/hadith/${hadith.id}`}>عرض الحديث والشرح ←</Link>
              </article>
            ))}
          </section>
        </>
      ) : (
        <aside className="source-proof"><div><span className="proof-label">المصدر مؤقتًا غير متاح</span><h2>تعذر جلب الأحاديث الآن.</h2><p>لم نعرض بيانات بديلة غير موثقة.</p></div><Link href="/hadith">العودة للفهرس</Link></aside>
      )}
    </main>
  );
}
