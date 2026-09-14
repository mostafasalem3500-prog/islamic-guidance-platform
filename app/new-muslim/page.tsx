import Link from "next/link";

const weekOne = [
  ["اليوم 1", "الشهادتان", "ماذا تعنيان وكيف تبدأ رحلتك بهما؟"],
  ["اليوم 2", "الطهارة", "مقدمة لطيفة للوضوء ومعناه."],
  ["اليوم 3", "الصلاة", "لماذا نصلي؟ ثم تعلم الخطوات بتدرج."],
  ["اليوم 4", "الفاتحة", "حفظها وفهم معناها بصوت ونص."],
  ["اليوم 5", "الأخلاق", "كيف ينعكس الإيمان في حياتك اليومية؟"],
];

export default function NewMuslimPage() {
  return (
    <main className="content-page">
      <header className="page-nav"><Link href="/">← بلّغ</Link><span>المسلم الجديد</span></header>
      <section className="page-hero">
        <p className="eyebrow">خطة خاصة بك</p>
        <h1>لست وحدك في<br /><em>بداية الطريق.</em></h1>
        <p>برنامج هادئ لمدة 30 يومًا، يبدأ بما تحتاجه اليوم ويترك لك مساحة للتعلم في وقتك.</p>
      </section>
      <section className="plan">
        <div><p className="eyebrow">الأسبوع الأول</p><h2>تثبيت البدايات.</h2><p>سيتم ربط كل درس بمادة موثقة من المكتبات الرسمية، مع فصل واضح بين المادة الأصلية والشرح التعليمي.</p></div>
        <ol>{weekOne.map(([day,title,text])=><li key={day}><b>{day}</b><div><h3>{title}</h3><p>{text}</p></div><span>←</span></li>)}</ol>
      </section>
    </main>
  );
}
