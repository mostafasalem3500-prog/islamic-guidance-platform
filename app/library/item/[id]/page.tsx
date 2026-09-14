/* eslint-disable react-hooks/error-boundaries -- async source failures are handled before data is rendered */
import Link from "next/link";
import { getIslamHouseItem } from "../../../../src/lib/islamhouse";

export const dynamic = "force-dynamic";

export default async function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const result = await getIslamHouseItem(id); const item = result.data; const author = item.prepared_by?.map((person) => person.title).filter(Boolean).join("، ");
    return <main className="content-page"><header className="page-nav"><Link href="/library">← المكتبة</Link><span>بيانات المادة</span></header><section className="page-hero compact-hero"><p className="eyebrow">{item.type ?? "مادة موثقة"}</p><h1>{item.title ?? "مادة من إسلام هاوس"}</h1><p>{item.description ?? "لا يوجد وصف مختصر متاح من المصدر."}</p></section><div className="source-bar"><span>المصدر: <a href={result.source.officialUrl} target="_blank" rel="noreferrer">{result.source.attribution}</a></span>{author ? <span>إعداد/تأليف: {author}</span> : null}</div><section className="library-grid">{item.attachments?.map((file, index) => <article key={file.url ?? index}><span>{file.extension_type ?? "ملف"}</span><h2>{file.description ?? "الملف الأصلي"}</h2><p>يفتح هذا الرابط الملف المنشور من المصدر الرسمي.</p>{file.url ? <a href={file.url} target="_blank" rel="noreferrer">فتح الملف الأصلي ↗</a> : null}</article>)}</section></main>;
  } catch { return <main className="content-page"><header className="page-nav"><Link href="/library">← المكتبة</Link></header><aside className="source-proof"><div><span className="proof-label">تعذر الاتصال</span><h2>لم نتمكن من جلب بيانات المادة.</h2></div></aside></main>; }
}
