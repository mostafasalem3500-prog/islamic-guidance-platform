"use client";

import Link from "next/link";
import { useState } from "react";

const destinations = [
  { value: "quran", label: "القرآن الكريم", href: "/quran", source: "QuranEnc.com" },
  { value: "hadith", label: "الحديث النبوي", href: "/hadith", source: "HadeethEnc.com" },
  { value: "library", label: "المكتبة الإسلامية", href: "/library", source: "IslamHouse.com" },
  { value: "new-muslim", label: "رحلة المسلم الجديد", href: "/new-muslim", source: "بلّغ + مصادر موثقة" },
];

export default function DawahPage() {
  const [destination, setDestination] = useState(destinations[0].value);
  const selected = destinations.find((item) => item.value === destination) ?? destinations[0];

  async function copyLink() {
    const shareLink = new URL(selected.href, window.location.origin).toString();
    await navigator.clipboard.writeText(shareLink);
    window.alert("تم نسخ الرابط للمشاركة.");
  }

  return (
    <main className="content-page">
      <header className="page-nav"><Link href="/">← بلّغ</Link><span>مركز الداعية</span></header>
      <section className="page-hero compact-hero">
        <p className="eyebrow">شارك المعرفة بثقة</p>
        <h1>رابط واحد،<br /><em>ومصدر واضح.</em></h1>
        <p>اختر وجهة دعوية موثقة، ثم انسخ الرابط لمشاركته مع الشخص المناسب بلغته.</p>
      </section>
      <section className="share-studio">
        <label htmlFor="content">اختر المحتوى</label>
        <select id="content" value={destination} onChange={(event) => setDestination(event.target.value)}>
          {destinations.map((item) => <option value={item.value} key={item.value}>{item.label}</option>)}
        </select>
        <div className="share-preview">
          <span>المحتوى المختار</span>
          <h2>{selected.label}</h2>
          <p>المصدر: {selected.source}</p>
          <code>{selected.href}</code>
        </div>
        <button className="button primary" type="button" onClick={copyLink}>نسخ رابط المشاركة <b>←</b></button>
      </section>
      <p className="notice">هذا الرابط يحيل إلى صفحة توضح المصدر وبياناته. لا ينشئ نصًا دعويًا منسوبًا إلى المصادر الرسمية ولا يغير محتواها.</p>
    </main>
  );
}
