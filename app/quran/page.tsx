import Link from "next/link";
import { getQuranSurah } from "../../src/lib/quran-enc";

export const dynamic = "force-dynamic";

export default async function QuranPage() {
  let data: Awaited<ReturnType<typeof getQuranSurah>> | null = null;
  try {
    data = await getQuranSurah("english_saheeh", 1);
  } catch {
    data = null;
  }

  return (
    <main className="content-page">
      <header className="page-nav"><Link href="/">← بلّغ</Link><span>القرآن الكريم</span></header>
      <section className="page-hero compact-hero">
        <p className="eyebrow">ترجمة المعاني مع توثيق واضح</p>
        <h1>سورة الفاتحة<br /><em>بالعربية والإنجليزية.</em></h1>
        <p>تُسحب هذه الصفحة مباشرة من موسوعة القرآن الكريم، دون تعديل للنص أو الترجمة.</p>
      </section>

      {data ? (
        <>
          <div className="source-bar">
            <span>المصدر: <a href={data.source.officialUrl} target="_blank" rel="noreferrer">{data.source.attribution}</a></span>
            <span>مفتاح الترجمة: {data.source.translationKey}</span>
            <span>آخر مزامنة: {new Intl.DateTimeFormat("ar-SA", { dateStyle: "medium" }).format(new Date(data.source.syncedAt))}</span>
          </div>
          <section className="verse-list" aria-label="سورة الفاتحة وترجمة معانيها">
            {data.verses.map((verse) => (
              <article className="verse" key={verse.id}>
                <span className="verse-number">{verse.aya}</span>
                <p className="arabic-verse" lang="ar" dir="rtl">{verse.arabic_text}</p>
                <p className="translation-verse" lang="en" dir="ltr">{verse.translation}</p>
                {verse.footnotes ? <details><summary>الهوامش الأصلية</summary><p lang="en" dir="ltr">{verse.footnotes}</p></details> : null}
              </article>
            ))}
          </section>
          <aside className="source-proof">
            <div><span className="proof-label">تنبيه توثيقي</span><h2>هذه ترجمة لمعاني القرآن</h2><p>لا تمثل الترجمة النص القرآني العربي، وقد حُفظت كما وردت من المصدر الرسمي.</p></div>
            <a href="https://quranenc.com/en/home/api" target="_blank" rel="noreferrer">توثيق API ↗</a>
          </aside>
        </>
      ) : (
        <aside className="source-proof">
          <div><span className="proof-label">المصدر مؤقتًا غير متاح</span><h2>تعذر جلب المحتوى الآن.</h2><p>لم نعرض أي نسخة بديلة غير موثقة. حاول تحديث الصفحة لاحقًا أو زر المصدر الرسمي.</p></div>
          <a href="https://quranenc.com/" target="_blank" rel="noreferrer">زيارة QuranEnc ↗</a>
        </aside>
      )}
    </main>
  );
}
