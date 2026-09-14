/* eslint-disable react-hooks/error-boundaries -- async source failures are handled before data is rendered */
import Link from "next/link";
import { getIslamHouseCategoryItems } from "../../../../src/lib/islamhouse";

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const result = await getIslamHouseCategoryItems(id);
    return <main className="content-page"><header className="page-nav"><Link href="/library">← المكتبة</Link><span>مواد التصنيف</span></header><section className="page-hero compact-hero"><p className="eyebrow">فهرس رسمي</p><h1>مواد موثقة<br /><em>من التصنيف المختار.</em></h1></section><div className="source-bar"><span>المصدر: <a href={result.source.officialUrl} target="_blank" rel="noreferrer">{result.source.attribution}</a></span><span>عدد المواد: {result.data.length}</span></div><section className="library-grid">{result.data.map((item) => <article key={item.id}><span>{item.datatype}</span><h2>{item.title}</h2><p>{item.slang ? `لغة المادة: ${item.slang}` : ""}</p><Link href={`/library/item/${item.id}`}>عرض البيانات والملف ↗</Link></article>)}</section></main>;
  } catch { return <main className="content-page"><header className="page-nav"><Link href="/library">← المكتبة</Link></header><aside className="source-proof"><div><span className="proof-label">تعذر الاتصال</span><h2>لم نتمكن من جلب مواد هذا التصنيف.</h2><p>لم نعرض بديلًا غير موثق.</p></div></aside></main>; }
}
