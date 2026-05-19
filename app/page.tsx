import type { Metadata } from "next";
import { HomeLanding } from "@/components/landing/home-landing";

export const metadata: Metadata = {
  title: "Pomotomo ポモトモ | 友達と集中できるポモドーロ",
  description:
    "Pomotomo（ポモトモ）は、友達と一緒に集中できるポモドーロアプリ。タイマー、ノート、ToDo、デイリーリストをひとつにまとめて、勉強と仕事の習慣づくりを支えます。",
  alternates: {
    canonical: "/",
    languages: {
      ja: "/",
      en: "/",
    },
  },
  keywords: [
    "ポモドーロ",
    "ポモドーロタイマー",
    "集中アプリ",
    "作業アプリ",
    "勉強アプリ",
    "友達と勉強",
    "友達と作業",
    "習慣化アプリ",
    "Pomodoro timer",
    "focus app",
    "study with friends",
    "productivity app",
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: "Pomotomo ポモトモ",
    url: "https://pomotomo.me/",
    title: "Pomotomo ポモトモ | 友達と集中するポモドーロアプリ",
    description:
      "友達とゆるくつながりながら、しっかり集中。ポモドーロ、ノート、ToDo、デイリーリストで毎日の作業を整えます。",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pomotomo ポモトモ",
    description: "友達と集中できるポモドーロ・作業アプリ",
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Pomotomo ポモトモ",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "Web",
  inLanguage: ["ja", "en"],
  url: "https://pomotomo.me/",
  description:
    "友達と一緒に作業・勉強に集中できるポモドーロアプリ。タイマー、ノート、ToDo、デイリーリストをまとめて使えます。",
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeLanding />
    </>
  );
}
