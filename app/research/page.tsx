"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";

type Language = "ar" | "en" | "ru" | "uz";
type Audience = "seeker" | "new-muslim" | "muslim" | "dai";
type Result = {
  plan: { keywords: string[]; searchOrder: string[]; organizer: "ai" | "rules" };
  sources: Array<{ id: string; label: string; provider: string; href: string }>;
  libraryResults: Array<{ externalId: string; title: string; author: string | null; itemType: string; description: string | null; originalUrl: string; provider: string }>;
};

const languages: Array<[Language, string]> = [["ar", "العربية"], ["en", "English"], ["ru", "Русский"], ["uz", "O‘zbek"]];
const copy = {
  ar: { brand: "← بلّغ", nav: "مساعد البحث الموثّق", eyebrow: "لكل رحلة · كل لغة · مصدر ظاهر", title: <>ابحث عن الدليل،<br /><em>لا عن جوابٍ مُنشأ.</em></>, intro: "يُنظّم النظام البحث فقط، ثم يعرض لك المصادر الرسمية لتقرأ النص في موضعه. لا يصدر فتاوى ولا يكتب أدلة من عنده.", topic: "ما الموضوع الذي تريد دراسته؟", placeholder: "مثال: كيف أتعرف إلى معنى التوحيد؟", audience: "رحلتك", language: "لغة البحث", submit: "جهّز ملف البحث", loading: "يجري تنظيم البحث…", error: "تعذر تجهيز البحث.", plan: "خطة البحث", heading: "ابدأ بهذه الكلمات والمصادر", ai: "تنظيم AI", rules: "تنظيم أساسي", notice: "هذه كلمات تنظيم للبحث وليست جوابًا دينيًا أو أدلة. النتائج أدناه من فهرس المواد الرسمية، ويؤدي كل رابط إلى المصدر الأصلي.", open: "افتح المصدر الموثق ←", indexed: "نتائج مفهرسة", materials: "مواد من المصدر الرسمي", prepared: "إعداد:", original: "افتح المادة من مصدرها ↗", empty: "لم تُفهرس بعد مادة مطابقة لهذه العبارة. يمكنك فتح الفهرس الرسمي أو إعادة صياغة الكلمات.", guard: "ضابط المنصة", guardTitle: "الترتيب آلي، والدليل من مصدره.", guardText: "لن تنسب المنصة للقرآن أو السنة إلا النص الذي أعاده المصدر الرسمي مع رابط الإحالة وبياناته.", source: { quran: "القرآن الكريم", hadith: "الحديث النبوي", library: "الكتب والمواد" }, audienceLabels: { seeker: "باحث عن الإسلام", "new-muslim": "مسلم جديد", muslim: "مسلم", dai: "داعية" } },
  en: { brand: "Baligh →", nav: "Verified research assistant", eyebrow: "Every journey · Every language · Visible source", title: <>Find the evidence,<br /><em>not a generated answer.</em></>, intro: "The system only organizes research, then presents official sources so you can read the text in context. It does not issue rulings or create evidence.", topic: "What would you like to study?", placeholder: "Example: What does tawhid mean?", audience: "Your journey", language: "Research language", submit: "Prepare research brief", loading: "Organizing research…", error: "Research could not be prepared.", plan: "Research plan", heading: "Start with these terms and sources", ai: "AI organizer", rules: "Basic organizer", notice: "These are research terms, not a religious answer or evidence. Results come from the official-material index and each link opens the original source.", open: "Open verified source →", indexed: "Indexed results", materials: "Materials from the official source", prepared: "Prepared by:", original: "Open original source ↗", empty: "No indexed material matches this phrase yet. Open the official catalogue or try different terms.", guard: "Platform safeguard", guardTitle: "Automation organizes; the source provides evidence.", guardText: "The platform attributes Qur’an or Sunnah only when the official source returns the text with its reference data.", source: { quran: "The Qur’an", hadith: "Prophetic hadith", library: "Books and materials" }, audienceLabels: { seeker: "Seeking Islam", "new-muslim": "New Muslim", muslim: "Muslim", dai: "Da‘iyah / caller" } },
  ru: { brand: "Балиг →", nav: "Проверенный поиск", eyebrow: "Для каждого пути · На каждом языке · С видимым источником", title: <>Ищите доказательство,<br /><em>а не сгенерированный ответ.</em></>, intro: "Система только организует поиск и показывает официальные источники, чтобы вы прочитали текст в его контексте. Она не выносит религиозных решений и не создаёт доказательства.", topic: "Какую тему вы хотите изучить?", placeholder: "Пример: Что означает таухид?", audience: "Ваш путь", language: "Язык поиска", submit: "Подготовить поиск", loading: "Организуем поиск…", error: "Не удалось подготовить поиск.", plan: "План поиска", heading: "Начните с этих слов и источников", ai: "Организовано ИИ", rules: "Базовая организация", notice: "Это слова для поиска, а не религиозный ответ или доказательства. Результаты взяты из индекса официальных материалов; каждая ссылка ведёт к первоисточнику.", open: "Открыть источник →", indexed: "Проиндексированные результаты", materials: "Материалы из официального источника", prepared: "Подготовил:", original: "Открыть источник ↗", empty: "Пока нет проиндексированного материала по этой фразе. Откройте официальный каталог или измените слова поиска.", guard: "Правило платформы", guardTitle: "Автоматизация упорядочивает; источник даёт доказательство.", guardText: "Платформа относит текст к Корану или Сунне только если официальный источник вернул его с данными ссылки.", source: { quran: "Коран", hadith: "Пророческие хадисы", library: "Книги и материалы" }, audienceLabels: { seeker: "Ищу ислам", "new-muslim": "Новый мусульманин", muslim: "Мусульманин", dai: "Призыв к исламу" } },
  uz: { brand: "Balig‘ →", nav: "Tasdiqlangan qidiruv", eyebrow: "Har bir yo‘l · Har bir til · Manbasi ochiq", title: <>Dalilni izlang,<br /><em>yaratilgan javobni emas.</em></>, intro: "Tizim faqat qidiruvni tartiblaydi, so‘ng matnni o‘z o‘rnida o‘qishingiz uchun rasmiy manbalarni ko‘rsatadi. U fatvo bermaydi va dalil yaratmaydi.", topic: "Qaysi mavzuni o‘rganmoqchisiz?", placeholder: "Misol: Tavhid nimani anglatadi?", audience: "Sizning yo‘lingiz", language: "Qidiruv tili", submit: "Qidiruv rejasini tayyorlash", loading: "Qidiruv tartiblanmoqda…", error: "Qidiruv rejasini tayyorlab bo‘lmadi.", plan: "Qidiruv rejasi", heading: "Mana shu so‘zlar va manbalardan boshlang", ai: "AI tartibladi", rules: "Asosiy tartiblash", notice: "Bular qidiruv so‘zlari, diniy javob yoki dalil emas. Natijalar rasmiy materiallar indeksidan olinadi va har bir havola asl manbaga olib boradi.", open: "Tasdiqlangan manbani ochish →", indexed: "Indekslangan natijalar", materials: "Rasmiy manbadagi materiallar", prepared: "Tayyorlagan:", original: "Asl manbani ochish ↗", empty: "Bu ibora uchun hali indekslangan material yo‘q. Rasmiy katalogni oching yoki qidiruv so‘zlarini o‘zgartiring.", guard: "Platforma qoidasi", guardTitle: "Avtomatika tartiblaydi; dalil manbadan keladi.", guardText: "Platforma Qur’on yoki Sunnatga faqat rasmiy manba matnni havola ma’lumotlari bilan qaytarganida nisbat beradi.", source: { quran: "Qur’on", hadith: "Nabaviy hadislar", library: "Kitoblar va materiallar" }, audienceLabels: { seeker: "Islomni izlovchi", "new-muslim": "Yangi musulmon", muslim: "Musulmon", dai: "Da’vatchi" } },
} as const;

export default function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [audience, setAudience] = useState<Audience>("seeker");
  const [language, setLanguage] = useState<Language>("ar");
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const text = copy[language];
  const sourceLabels = useMemo(() => text.source, [text]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setResult(null); setLoading(true);
    try {
      const response = await fetch("/api/research/plan", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, audience, language }) });
      const body = await response.json() as Result & { error?: string };
      if (!response.ok || body.error) throw new Error(body.error ?? text.error);
      setResult(body);
    } catch (reason) { setError(reason instanceof Error ? reason.message : text.error); } finally { setLoading(false); }
  }

  return <main className="content-page research-page" dir={language === "ar" ? "rtl" : "ltr"} lang={language}>
    <header className="page-nav"><Link href="/">{text.brand}</Link><span>{text.nav}</span></header>
    <section className="research-hero"><p className="eyebrow">{text.eyebrow}</p><h1>{text.title}</h1><p>{text.intro}</p></section>
    <form className="research-form" onSubmit={submit}>
      <label htmlFor="topic">{text.topic}</label><textarea id="topic" value={topic} onChange={(event) => setTopic(event.target.value)} minLength={2} maxLength={180} placeholder={text.placeholder} required />
      <div className="research-selects"><label>{text.audience}<select value={audience} onChange={(event) => setAudience(event.target.value as Audience)}>{(Object.keys(text.audienceLabels) as Audience[]).map((value) => <option key={value} value={value}>{text.audienceLabels[value]}</option>)}</select></label><label>{text.language}<select value={language} onChange={(event) => setLanguage(event.target.value as Language)}>{languages.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label></div>
      <button className="button primary" type="submit" disabled={loading}>{loading ? text.loading : text.submit} <b>←</b></button>
    </form>
    {error ? <p className="research-error" role="alert">{error}</p> : null}
    {result ? <section className="research-result" aria-live="polite"><div className="research-result-head"><div><p className="eyebrow">{text.plan}</p><h2>{text.heading}</h2></div><span>{result.plan.organizer === "ai" ? text.ai : text.rules}</span></div><div className="keyword-list">{result.plan.keywords.map((keyword) => <span key={keyword}>{keyword}</span>)}</div><p className="research-notice">{text.notice}</p>
      <div className="research-source-grid">{result.plan.searchOrder.map((id) => { const source = result.sources.find((item) => item.id === id); if (!source) return null; const label = sourceLabels[id as keyof typeof sourceLabels] ?? source.label; return <Link href={source.href} className="research-source" key={source.id}><small>{source.provider}</small><strong>{label}</strong><span>{text.open}</span></Link>; })}</div>
      <section className="indexed-results" aria-label={text.materials}><div><p className="eyebrow">{text.indexed}</p><h2>{text.materials}</h2></div>{result.libraryResults.length ? <div className="indexed-result-list">{result.libraryResults.map((item) => <article className="indexed-result" key={item.externalId}><small>{item.provider} · {item.itemType}</small><h3>{item.title}</h3>{item.author ? <p>{text.prepared} {item.author}</p> : null}{item.description ? <p>{item.description.slice(0, 240)}{item.description.length > 240 ? "…" : ""}</p> : null}<a href={item.originalUrl} target="_blank" rel="noreferrer">{text.original}</a></article>)}</div> : <p className="research-empty">{text.empty}</p>}</section>
    </section> : null}
    <aside className="source-proof"><div><span className="proof-label">{text.guard}</span><h2>{text.guardTitle}</h2><p>{text.guardText}</p></div></aside>
  </main>;
}
