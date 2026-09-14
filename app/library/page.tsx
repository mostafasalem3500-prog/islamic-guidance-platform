import Link from "next/link";
import { islamHouseStatus } from "../../src/lib/islamhouse";

const formats = ["كتب", "مقالات", "فتاوى", "صوتيات", "فيديو", "ملفات مرفقة"];

export default function LibraryPage() {
  const status = islamHouseStatus();
  return (
    <main className="content-page">
      <header className="page-nav"><Link href="/">← بلّغ</Link><span>المكتبة الإسلامية</span></header>
      <section className="page-hero compact-hero">
        <p className="eyebrow">معرفة أوسع من مصدر موثّق</p>
        <h1>مكتبة إسلامية<br /><em>بلغات العالم.</em></h1>
        <p>الكتب والمقالات والفتاوى والمواد المرئية ستصل من IslamHouse مع رابطها الأصلي وبيانات ناشرها.</p>
      </section>
      <section className="library-types">
        {formats.map((format) => <span key={format}>{format}</span>)}
      </section>
      <aside className="source-proof">
        <div>
          <span className="proof-label">حالة الربط</span>
          <h2>{status.configured ? "المكتبة جاهزة للمزامنة" : "بانتظار تهيئة مفتاح IslamHouse"}</h2>
          <p>{status.configured ? "سيتم عرض مواد المصدر مباشرة مع بياناتها الوصفية." : "تم تجهيز الواجهة وطبقة الحالة؛ أضف ISLAMHOUSE_API_KEY في إعدادات النشر لتفعيل فهرسة المكتبة."}</p>
        </div>
        <a href={status.documentationUrl} target="_blank" rel="noreferrer">توثيق API ↗</a>
      </aside>
    </main>
  );
}
