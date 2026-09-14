import Link from "next/link";
import { getQuranSurah, getQuranTranslations } from "../../src/lib/quran-enc";

export const dynamic = "force-dynamic";

const languages = [
  { code: "en", label: "English", defaultKey: "english_saheeh" },
  { code: "ru", label: "Русский", defaultKey: "" },
  { code: "uz", label: "O‘zbek", defaultKey: "" },
  { code: "tr", label: "Türkçe", defaultKey: "" },
  { code: "fr", label: "Français", defaultKey: "" },
];

export default async function QuranPage({ searchParams }: { searchParams: Promise<{ language?: string }> }) {
  const requested = (await searchParams).language ?? "en";
  const activeLanguage = languages.find((language) => language.code === requested) ?? languages[0];

  let translationKey = activeLanguage.defaultKey;
  let version: string | undefined;
  let translationTitle = activeLanguage.label;

  try {
    const translations = await getQuranTranslations(activeLanguage.code, activeLanguage.code);
    const selected = translations.find((translation) => translation.key === translationKey) ?? translations[0];
    if (!selected) throw new Error("No translation available.");
    translationKey = selected.key;
    version = selected.version;
    translationTitle = selected.title;
    const data = await getQuranSurah(translationKey, 1, version);

    return (
      <main className="content-page">
        <header className="page-nav"><Link href="/">← بلّغ</Link><span>القرآن الكريم</span></header>
        <section className="page-hero compact-hero">
          <p className="eyebrow">ترجمة المعاني مع توثيق واضح</p>
          <h1>سورة الفاتحة<br /><em>بلغتك.</em></h1>
          <p>تُسحب هذه الصفحة مباشرة من موسوعة القرآن الكريم، دون تعديل للنص أو الترجمة.</p>
        </section>
        <nav className="language-chips" aria-label="اختيار لغة الترجمة">
          {languages.map((language) => <Link className={language.code === activeLanguage.code ? "active" : ""} href={"/quran?language=" + language.code} key={language.code}>{language.label}</Link>)}
        </nav>
        <p className="translation-label">الترجمة المختارة: <b>{translationTitle}</b></p>
        <div className="source-bar">
          <span>المصدر: <a href={data.source.officialUrl} target="_blank" rel="noreferrer">{data.source.attribution}</a></span>
          <span>مفتاح الترجمة: {data.source.translationKey}</span>
          {data.source.version ? <span>الإصدار: {data.source.version}</span> : null}
          <span>آخر مزامنة: {new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(new Date(data.source.syncedAt))}</span>
        </div>
        <section className="verse-list" aria-label="سورة الفاتحة وترجمة معانيها">
          {data.verses.map((verse) => (
            <article className="verse" key={verse.id}>
              <span className="verse-number">{verse.aya}</span>
              <p className="arabic-verse" lang="ar" dir="rtl">{verse.arabic_text}</p>
              <p className="translation-verse" lang={activeLanguage.code} dir="ltr">{verse.translation}</p>
              {verse.footnotes ? <details><summary>الهوامش الأصلية</summary><p lang={activeLanguage.code} dir="ltr">{verse.footnotes}</p></details> : null}
            </article>
          ))}
        </section>
        <aside className="source-proof">
          <div><span className="proof-label">تنبيه توثيقي</span><h2>هذه ترجمة لمعاني القرآن</h2><p>لا تمثل الترجمة النص القرآني العربي، وقد حُفظت كما وردت من المصدر الرسمي.</p></div>
          <a href="https://quranenc.com/en/home/api" target="_blank" rel="noreferrer">توثيق API ↗</a>
        </aside>
      </main>
    );
  } catch {
    return (
      <main className="content-page">
        <header className="page-nav"><Link href="/">← بلّغ</Link><span>القرآن الكريم</span></header>
        <section className="page-hero compact-hero"><p className="eyebrow">الترجمة والمعنى</p><h1>المصدر مؤقتًا<br /><em>غير متاح.</em></h1></section>
        <aside className="source-proof"><div><span className="proof-label">حماية التوثيق</span><h2>تعذر جلب الترجمة المطلوبة.</h2><p>لم نعرض بديلًا غير موثق. جرّب لغة أخرى أو عُد لاحقًا.</p></div><a href="https://quranenc.com/" target="_blank" rel="noreferrer">زيارة QuranEnc ↗</a></aside>
      </main>
    );
  }
}
