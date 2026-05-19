// app/legal/page.tsx
// Server Component — no interactivity needed, pure static content
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Legal | Pomotomo ポモトモ",
  description: "Privacy Policy, Terms of Service, and Acceptable Use Policy",
};

// Legal document link card data
const jaDocuments = [
  {
    href: "/legal/ja/privacy",
    title: "プライバシーポリシー",
    subtitle: "Privacy Policy",
    description: "個人情報の収集・利用・保護について",
  },
  {
    href: "/legal/ja/tos",
    title: "利用規約",
    subtitle: "Terms of Service",
    description: "本アプリの利用条件と規則について",
  },
  {
    href: "/legal/ja/aup",
    title: "利用規定",
    subtitle: "Acceptable Use Policy",
    description: "チャットおよびコンテンツの利用ルールについて",
  },
];

const enDocuments = [
  {
    href: "/legal/en/privacy",
    title: "Privacy Policy",
    subtitle: "プライバシーポリシー",
    description: "How we collect, use, and protect your data",
  },
  {
    href: "/legal/en/tos",
    title: "Terms of Service",
    subtitle: "利用規約",
    description: "Rules and conditions governing use of the app",
  },
  {
    href: "/legal/en/aup",
    title: "Acceptable Use Policy",
    subtitle: "利用規定",
    description: "Guidelines for chat and content conduct",
  },
];

// Individual document card
function DocCard({
  href,
  title,
  subtitle,
  description,
}: {
  href: string;
  title: string;
  subtitle: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group flex flex-col gap-1.5 rounded-xl border border-black/10 bg-white p-5 transition-all duration-200 hover:border-black/20 hover:shadow-[rgba(0,0,0,0.04)_0px_4px_18px,rgba(0,0,0,0.027)_0px_2.025px_7.85px,rgba(0,0,0,0.02)_0px_0.8px_2.93px,rgba(0,0,0,0.01)_0px_0.175px_1.04px]"
      style={{ textDecoration: "none" }}
    >
      {/* Arrow icon */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          {/* Main title */}
          <span
            className="text-[rgba(0,0,0,0.95)] transition-colors duration-200 group-hover:text-[#0075de]"
            style={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "1.5",
              letterSpacing: "normal",
            }}
          >
            {title}
          </span>
          {/* Subtitle (other language) */}
          <span
            style={{
              fontSize: "12px",
              fontWeight: 500,
              lineHeight: "1.33",
              letterSpacing: "0.125px",
              color: "#a39e98",
            }}
          >
            {subtitle}
          </span>
        </div>
        {/* Arrow */}
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="mt-0.5 shrink-0 text-[#a39e98] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[#0075de]"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {/* Description */}
      <span
        style={{
          fontSize: "14px",
          fontWeight: 400,
          lineHeight: "1.43",
          color: "#615d59",
        }}
      >
        {description}
      </span>
    </Link>
  );
}

// Language section block
function LangSection({
  lang,
  badge,
  label,
  authoritative,
  docs,
}: {
  lang: string;
  badge: string;
  label: string;
  authoritative?: boolean;
  docs: typeof jaDocuments;
}) {
  return (
    <div className="flex flex-col gap-4">
      {/* Section header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          {/* Language badge */}
          <span
            className="inline-flex items-center rounded-[9999px] px-2.5 py-1"
            style={{
              background: "#f2f9ff",
              color: "#097fe8",
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: "1.33",
              letterSpacing: "0.125px",
            }}
          >
            {badge}
          </span>
          {/* Language label */}
          <span
            style={{
              fontSize: "16px",
              fontWeight: 600,
              lineHeight: "1.5",
              color: "rgba(0,0,0,0.95)",
            }}
          >
            {label}
          </span>
        </div>
        {/* Authoritative tag */}
        {authoritative && (
          <span
            className="inline-flex items-center rounded-[9999px] px-2.5 py-1"
            style={{
              background: "#f6f5f4",
              color: "#615d59",
              fontSize: "12px",
              fontWeight: 600,
              lineHeight: "1.33",
              letterSpacing: "0.125px",
            }}
          >
            Authoritative version · 正式版
          </span>
        )}
      </div>

      {/* Document cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {docs.map((doc) => (
          <DocCard key={doc.href} {...doc} />
        ))}
      </div>
    </div>
  );
}

export default function LegalPage() {
  return (
    // Warm white page background
    <main
      className="min-h-screen w-full"
      style={{ background: "#f6f5f4" }}
    >
      {/* Centered content container */}
      <div className="mx-auto w-full max-w-3xl px-6 py-16 sm:py-24">

        {/* Header */}
        <div className="mb-12 flex flex-col gap-3">
          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 48px)",
              fontWeight: 700,
              lineHeight: "1.00",
              letterSpacing: "-1.5px",
              color: "rgba(0,0,0,0.95)",
            }}
          >
            Legal
          </h1>
          <p
            style={{
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: "1.5",
              color: "#615d59",
              maxWidth: "480px",
            }}
          >
            Our policies are available in Japanese and English. The Japanese
            version is the legally authoritative version.
            <br />
            <span style={{ color: "#a39e98", fontSize: "14px" }}>
              日本語版が正式な版となります。
            </span>
          </p>
        </div>

        {/* White card container */}
        <div
          className="flex flex-col gap-8 rounded-2xl border border-black/10 bg-white p-6 sm:p-8"
          style={{
            boxShadow:
              "rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.85px, rgba(0,0,0,0.02) 0px 0.8px 2.93px, rgba(0,0,0,0.01) 0px 0.175px 1.04px",
          }}
        >
          {/* Japanese section — primary */}
          <LangSection
            lang="ja"
            badge="🇯🇵 JA"
            label="日本語"
            authoritative
            docs={jaDocuments}
          />

          {/* Divider */}
          <div
            className="w-full"
            style={{ height: "1px", background: "rgba(0,0,0,0.08)" }}
          />

          {/* English section */}
          <LangSection
            lang="en"
            badge="🇬🇧 EN"
            label="English"
            docs={enDocuments}
          />
        </div>

        {/* Footer note */}
        <p
          className="mt-8 text-center"
          style={{
            fontSize: "13px",
            fontWeight: 400,
            lineHeight: "1.43",
            color: "#a39e98",
          }}
        >
          Questions? Contact us at{" "}
          <a
            href="mailto:softjico@gmail.com"
            style={{
              color: "#0075de",
              textDecoration: "none",
            }}
            className="hover:underline"
          >
            softjico@gmail.com
          </a>
        </p>
      </div>
    </main>
  );
}