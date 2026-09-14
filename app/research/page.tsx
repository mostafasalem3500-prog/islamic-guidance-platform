"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";

type Result = {
  plan: { keywords: string[]; searchOrder: string[]; organizer: "ai" | "rules" };
  sources: Array<{ id: string; label: string; provider: string; href: string }>;
};

const audiences = [
  ["seeker", "باحث عن الإسلام"],
  ["new-muslim", "مسلم جديد"],
  ["muslim", "مسلم"],
  ["dai", "داعية"],
] as const;
const languages = [["ar", "العربية"], ["en", "English"], ["ru", "Русский"], ["uz", "O‘zbek"]] as const;

export default function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState("seeker");
  const [language, setLanguage] = useState("ar");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(""); setResult(null); setLoading(true);
    try {
      const response = await fetch("/api/research/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, audience, language }) });
      const body = await response.json() as Result & { error?: string };
      if (!response.ok || body.error) throw new Error(body.error ?? "تعذر تجهيز البحث.");
      setResult(body);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "تعذر تجهيز البحث.");
    } finally { setLoading(false); }
  }

  return <main className="content-page research-page">
    <header className="page-nav"><Link href="/">← بلّغ</Link><span>مساعد البحث الموثّق</span></header>
    <section className="research-hero">
      <p className="eyebrow">لكل رحلة · كل لغة · مصدر ظاهر</p>
      <h1>ابحث عن الدليل،<br /><em>لا عن جوابٍ مُنشأ.</em></h1>
      <p>يُنظّم النظام البحث فقط، ثم يعرض لك المصادر الرسمية لتقرأ النص في موضعه. لا يصدر فتاوى ولا يكتب أدلة من عنده.</p>
    </section>
    <form className="research-form" onSubmit={submit}>
      <label htmlFor="topic">ما الموضوع الذي تريد دراسته؟</label>
      <textarea id="topic" value={topic} onChange={(event) => setTopic(event.target.value)} minLength={2} maxLength={180} placeholder="مثال: كيف أتعرف إلى معنى التوحيد؟" required />
      <div className="research-selects">
        <label>رحلتك<select value={audience} onChange={(event) => setAudience(event.target.value)}>{audiences.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>لغة البحث<select value={language} onChange={(event) => setLanguage(event.target.value)}>{languages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      </div>
      <button className="button primary" type="submit" disabled={loading}>{loading ? "يجري تنظيم البحث…" : "جهّز ملف البحث"} <b>←</b></button>
    </form>
    {error ? <p className="research-error" role="alert">{error}</p> : null}
    {result ? <section className="research-result" aria-live="polite">
      <div className="research-result-head"><div><p className="eyebrow">خطة البحث</p><h2>ابدأ بهذه الكلمات والمصادر</h2></div><span>{result.plan.organizer === "ai" ? "تنظيم AI" : "تنظيم أساسي"}</span></div>
      <div className="keyword-list">{result.plan.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div>
      <p className="research-notice">هذه كلمات تنظيم للبحث وليست جوابًا دينيًا أو أدلة. عند اكتمال الفهرسة ستُجلب النتائج المطابقة مباشرة تحت كل مصدر.</p>
      <div className="research-source-grid">{result.plan.searchOrder.map((id) => {
        const source = result.sources.find((item) => item.id === id); if (!source) return null;
        return <Link href={source.href} className="research-source" key={source.id}><small>{source.provider}</small><strong>{source.label}</strong><span>افتح المصدر الموثق ←</span></Link>;
      })}</div>
    </section> : null}
    <aside className="source-proof"><div><span className="proof-label">ضابط المنصة</span><h2>الترتيب آلي، والدليل من مصدره.</h2><p>لن تنسب المنصة للقرآن أو السنة إلا النص الذي أعاده المصدر الرسمي مع رابط الإحالة وبياناته.</p></div></aside>
  </main>;
}
