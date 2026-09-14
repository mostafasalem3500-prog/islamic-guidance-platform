import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "بلّغ | دليل موثّق إلى الإسلام",
  description: "منصة إسلامية متعددة اللغات للباحثين عن الإسلام والمهتدين الجدد والدعاة.",
  applicationName: "بلّغ",
  keywords: ["الإسلام", "القرآن", "الحديث", "المسلم الجديد", "الدعوة"],
  openGraph: {
    title: "بلّغ | دليل موثّق إلى الإسلام",
    description: "معرفة موثقة بلغة يفهمها القلب.",
    type: "website",
    locale: "ar_SA",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
