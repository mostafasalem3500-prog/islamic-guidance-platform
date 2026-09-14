import Link from "next/link";
import { getHadith } from "../../../src/lib/hadeeth-enc";

export const dynamic = "force-dynamic";

export default async function HadithDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let result: Awaited<ReturnType<typeof getHadith>> | null = null;
  try {
    result = await getHadith(id, "ar");
  } catch {
    result = null;
  }

  return (
    <main className="content-page">
      <header className="page-nav"><Link href="/hadith">← فهرس الحديث</Link><span>الحديث النبوي</span></header>
      {result ? (
        <>
          <section className="page-hero compact-hero">
            <p className="eyebrow">حديث موثّق من الموسوعة</p>
            <h1>{result.data.title}</h1>
            <p>{result.data.attribution}{result.data.grade ? <> · {result.data.grade}</> : null}</p>
          </section>
          <div className="source-bar"><span>المصدر: <a href={result.source.officialUrl} target="_blank" rel="noreferrer">{result.source.attribution}</a></span><span>رقم المادة: {result.data.id}</span></div>
          <article className="hadith-detail">
            <p className="hadith-text">{result.data.hadeeth}</p>
            {result.data.explanation ? <section><h2>الشرح</h2><p>{result.data.explanation}</p></section> : null}
            {result.data.hints?.length ? <section><h2>فوائد وإرشادات</h2><ul>{result.data.hints.map((hint, index) => <li key={index}>{hint}</li>)}</ul></section> : null}
            {result.data.reference ? <section><h2>المرجع</h2><p>{result.data.reference}</p></section> : null}
          </article>
          <aside className="source-proof"><div><span className="proof-label">حفظ النص والنسبة</span><h2>لم يُعدّل هذا المحتوى.</h2><p>النص والشرح وبيانات الحديث معروضة من المصدر الرسمي كما وردت فيه.</p></div><a href={result.source.officialUrl} target="_blank" rel="noreferrer">زيارة المصدر ↗</a></aside>
        </>
      ) : (
        <aside className="source-proof"><div><span className="proof-label">المصدر مؤقتًا غير متاح</span><h2>تعذر جلب الحديث الآن.</h2><p>لم نعرض نصًا بديلًا غير موثق.</p></div><Link href="/hadith">العودة للفهرس</Link></aside>
      )}
    </main>
  );
}
