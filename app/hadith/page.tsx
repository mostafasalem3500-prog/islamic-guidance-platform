import Link from "next/link";
import { sourceRecord } from "../../src/lib/content-source";

export default function HadithPage() {
  const source = sourceRecord("HADEETH_ENC");
  return (
    <main className="content-page">
      <header className="page-nav"><Link href="/">← بلّغ</Link><span>الحديث النبوي</span></header>
      <section className="page-hero">
        <p className="eyebrow">حديث موثق · شرح مفهوم</p>
        <h1>السنة النبوية<br /><em>كما تُقرأ بفهم.</em></h1>
        <p>ستتيح هذه المساحة البحث بالموضوع وعرض الحديث وترجمته وشرحه مع الإحالة المباشرة إلى المصدر الرسمي.</p>
      </section>
      <section className="hadith-focus">
        <p>سيبدأ المحتوى بالمحاور التي يحتاجها المسلم الجديد:</p>
        <div><span>الإيمان</span><span>الصلاة</span><span>الأخلاق</span><span>الأسرة</span><span>الدعاء</span></div>
      </section>
      <aside className="source-proof">
        <div><span className="proof-label">المصدر الرسمي</span><h2>{source.label}</h2><p>النص والترجمة والشرح ستحتفظ جميعها بالبيانات الوصفية الأصلية.</p></div>
        <a href={source.officialUrl} target="_blank" rel="noreferrer">زيارة {source.attribution} ↗</a>
      </aside>
    </main>
  );
}
