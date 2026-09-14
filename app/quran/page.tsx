import Link from "next/link";
import { sourceRecord } from "@/src/lib/content-source";

const steps = [
  ["١", "اختر اللغة", "لا تظهر إلا الترجمات المتاحة فعليًا من المصدر."],
  ["٢", "اقرأ المعنى", "يظهر النص العربي مع ترجمة المعنى المعتمدة."],
  ["٣", "تحقق من المصدر", "اسم الناشر، رقم الإصدار والرابط الأصلي ترافق المادة."],
];

export default function QuranPage() {
  const source = sourceRecord("QURAN_ENC");
  return (
    <main className="content-page">
      <header className="page-nav"><Link href="/">← بلّغ</Link><span>القرآن الكريم</span></header>
      <section className="page-hero">
        <p className="eyebrow">ترجمة المعاني مع توثيق واضح</p>
        <h1>اقرأ القرآن<br /><em>بلغة تفهمها.</em></h1>
        <p>هنا ستظهر السور والآيات والترجمات الرسمية بعد تفعيل الاتصال المباشر بواجهة المصدر.</p>
      </section>
      <section className="feature-steps">
        {steps.map(([number, title, text]) => <article key={number}><b>{number}</b><h2>{title}</h2><p>{text}</p></article>)}
      </section>
      <aside className="source-proof">
        <div><span className="proof-label">المصدر الرسمي</span><h2>{source.label}</h2><p>لن يُعرض أي نص مترجم هنا من دون اسم المصدر وبيانات الإصدار.</p></div>
        <a href={source.officialUrl} target="_blank" rel="noreferrer">زيارة {source.attribution} ↗</a>
      </aside>
    </main>
  );
}
