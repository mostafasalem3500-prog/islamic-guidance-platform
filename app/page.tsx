const journeys = [
  { icon: "✦", title: "أتعرّف إلى الإسلام", text: "رحلة واضحة وهادئة لفهم الإيمان والقرآن والرسالة.", action: "ابدأ الرحلة" },
  { icon: "◌", title: "أنا مسلم جديد", text: "خطة عملية في أول 30 يومًا: الصلاة والقرآن والأساسيات.", action: "ابدأ خطتي" },
  { icon: "⌕", title: "لدي سؤال", text: "ابحث في محتوى موثق، واعرف مصدر كل إجابة.", action: "ابحث الآن" },
  { icon: "↗", title: "أنا داعية", text: "أنشئ صفحة مشاركة موثقة بلغات متعددة ورمز QR.", action: "مركز الداعية" },
];

const trustMetrics = [
  { value: "3", label: "مصادر محتوى رسمية" },
  { value: "147", label: "لغة معتمدة في الدليل" },
  { value: "0", label: "نصوص تُعدّل أو تُنسب خطأً" },
];

const sources = [
  { name: "القرآن الكريم", source: "QuranEnc", detail: "ترجمات معاني القرآن وإصدار الترجمة" },
  { name: "الحديث النبوي", source: "HadeethEnc", detail: "النص والترجمة والشرح الموثق" },
  { name: "المكتبة الإسلامية", source: "IslamHouse", detail: "كتب، مقالات، فتاوى، صوت وفيديو" },
];

export default function Home() {
  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top"><span>ب</span> بلّغ</a>
        <div className="nav-links">
          <a href="#journeys">الرحلات</a>
          <a href="#sources">المصادر</a>
          <a href="/dawah">للدعاة</a>
          <button className="lang" type="button">English</button>
        </div>
      </nav>

      <section className="hero" id="top">
        <div className="hero-copy-wrap">
          <p className="eyebrow">معرفة موثقة · بلغة يفهمها القلب</p>
          <h1>طريقك إلى الإسلام<br /><em>يبدأ بخطوة واضحة.</em></h1>
          <p className="hero-copy">بلّغ منصة متعددة اللغات تساعد الباحث عن الحقيقة، والمسلم الجديد، والداعية على الوصول إلى محتوى إسلامي موثّق ومناسب لرحلته.</p>
          <div className="hero-actions">
            <a className="button primary" href="#journeys">ابدأ من هنا <b>←</b></a>
            <a className="button quiet" href="/quran">استكشف القرآن</a>
          </div>
          <div className="trust-line"><span>✓</span> النصوص الأصلية لا تُعدَّل · المصدر والإصدار ظاهران دائمًا</div>
        </div>
        <aside className="hero-compass" aria-label="رحلة بلّغ">
          <div className="compass-ring"><span>بلّغ</span></div>
          <div className="compass-card card-quran"><b>القرآن</b><small>ترجمات بإصدارها</small></div>
          <div className="compass-card card-hadith"><b>الحديث</b><small>شرح موثّق</small></div>
          <div className="compass-card card-library"><b>المكتبة</b><small>معرفة أوسع</small></div>
        </aside>
      </section>

      <section className="trust-grid" aria-label="منهج بلّغ">
        {trustMetrics.map((metric) => <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>)}
        <a href="#sources">منهج التوثيق ←</a>
      </section>

      <section className="journeys section" id="journeys">
        <div className="section-heading">
          <p className="eyebrow">اختر ما تحتاجه الآن</p>
          <h2>لست بحاجة إلى معرفة كل شيء دفعة واحدة.</h2>
          <p>نرشدك إلى الخطوة التالية المناسبة لك، بلغتك وبمحتوى موثّق.</p>
        </div>
        <div className="journey-grid">
          {journeys.map((journey) => (
            <article className="journey-card" key={journey.title}>
              <span className="journey-icon">{journey.icon}</span>
              <h3>{journey.title}</h3>
              <p>{journey.text}</p>
              <a href={journey.title === "أتعرّف إلى الإسلام" ? "/new-muslim" : journey.title === "لدي سؤال" ? "/hadith" : journey.title === "أنا مسلم جديد" ? "/new-muslim" : "/dawah"}>{journey.action} ←</a>
            </article>
          ))}
        </div>
      </section>

      <section className="path section">
        <div className="path-copy">
          <p className="eyebrow">مسار الباحث عن الإسلام</p>
          <h2>من السؤال الأول إلى بداية مستقرة.</h2>
          <p>رحلة لطيفة بلا جدل، تضع أمامك المعرفة الأساسية ثم تترك لك مساحة التفكير والاختيار.</p>
        </div>
        <ol className="path-list">
          <li><b>01</b><span>ما هو الإسلام؟</span></li>
          <li><b>02</b><span>من هو الله؟</span></li>
          <li><b>03</b><span>من هو محمد ﷺ؟</span></li>
          <li><b>04</b><span>القرآن: رسالة الإسلام</span></li>
          <li><b>05</b><span>كيف أبدأ؟</span></li>
        </ol>
      </section>

      <section className="sources section" id="sources">
        <div className="section-heading">
          <p className="eyebrow">شفافية قبل كل شيء</p>
          <h2>مصدر كل مادة واضح ويمكن الرجوع إليه.</h2>
          <p>نحفظ اسم المصدر، الرابط الأصلي، المؤلف أو المترجم عند توفره، رقم الإصدار، وتاريخ آخر مزامنة.</p>
        </div>
        <div className="source-list">
          {sources.map((item) => (
            <article className="source-card" key={item.source}>
              <div><h3>{item.name}</h3><p>{item.detail}</p></div>
              <span>{item.source}</span>
            </article>
          ))}
        </div>
        <p className="notice">أي شرح مبسّط أو إجابة مولّدة ستظهر بوضوح بوصفها إعدادًا مستقلًا، ولن تُنسب إلى المصدر الرسمي.</p>
      </section>

      <section className="dawah section" id="dawah">
        <p className="eyebrow">للجهات والدعاة</p>
        <h2>شارك الخير بثقة، لا بروابط مشتتة.</h2>
        <p>أنشئ صفحة دعوية قصيرة بلغة المتلقي، تجمع مواد موثقة، رابطًا قابلًا للمشاركة، ورمز QR.</p>
        <a className="button primary" href="/dawah">استكشف مركز الداعية <b>←</b></a>
      </section>

      <footer>
        <span className="brand"><span>ب</span> بلّغ</span>
        <p>منصة مستقلة تستخدم محتوى منشورًا من مصادره الرسمية مع حفظ النسبة والبيانات الوصفية.</p>
      </footer>
    </main>
  );
}
