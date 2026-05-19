// app/legal/_components/LegalLayout.tsx
// Shared layout for all legal document pages (EN + JA)
// Server Component — no interactivity needed

import Link from "next/link";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LegalSection {
  id: string;
  heading: string;
  subsections?: {
    id: string;
    heading: string;
    content: React.ReactNode;
  }[];
  content?: React.ReactNode;
}

interface LegalLayoutProps {
  title: string;
  effectiveDate: string;
  badge: string;          // e.g. "Privacy Policy"
  description: string;
  sections: LegalSection[];
  lang: "en" | "ja";
  /** sibling links shown in the sidebar */
  siblings: { href: string; label: string }[];
  /** back link */
  backHref?: string;
}

// ─── Sidebar nav ─────────────────────────────────────────────────────────────

function SidebarNav({
  sections,
  siblings,
  lang,
  backHref,
}: {
  sections: LegalSection[];
  siblings: { href: string; label: string }[];
  lang: string;
  backHref: string;
}) {
  return (
    <aside className="hidden lg:flex flex-col gap-6 w-56 shrink-0">
      {/* Back to legal index */}
      <Link
        href={backHref}
        className="inline-flex items-center gap-1.5 group w-fit"
        style={{ textDecoration: "none" }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
          className="text-[#a39e98] group-hover:text-[#0075de] transition-colors duration-150">
          <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ fontSize: "13px", fontWeight: 500, color: "#a39e98", lineHeight: "1.43" }}
          className="group-hover:text-[#0075de] transition-colors duration-150">
          Legal
        </span>
      </Link>

      {/* Sibling document links */}
      <div className="flex flex-col gap-1">
        <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em",
          color: "#a39e98", textTransform: "uppercase", lineHeight: "1.33" }}
          className="mb-1 px-2">
          {lang === "en" ? "Documents" : "ドキュメント"}
        </span>
        {siblings.map((s) => (
          <Link key={s.href} href={s.href}
            className="rounded-[5px] px-2 py-1.5 transition-colors duration-150 hover:bg-[#f6f5f4]"
            style={{ fontSize: "13px", fontWeight: 500, color: "#615d59",
              lineHeight: "1.43", textDecoration: "none" }}>
            {s.label}
          </Link>
        ))}
      </div>

      {/* On-page section anchors */}
      <div className="flex flex-col gap-1">
        <span style={{ fontSize: "11px", fontWeight: 600, letterSpacing: "0.08em",
          color: "#a39e98", textTransform: "uppercase", lineHeight: "1.33" }}
          className="mb-1 px-2">
          {lang === "en" ? "On this page" : "このページ"}
        </span>
        {sections.map((s) => (
          <a key={s.id} href={`#${s.id}`}
            className="rounded-[5px] px-2 py-1 transition-colors duration-150 hover:bg-[#f6f5f4]"
            style={{ fontSize: "13px", fontWeight: 400, color: "#615d59",
              lineHeight: "1.43", textDecoration: "none" }}>
            {s.heading}
          </a>
        ))}
      </div>
    </aside>
  );
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function Section({ section }: { section: LegalSection }) {
  return (
    <section id={section.id} className="flex flex-col gap-4 scroll-mt-8">
      {/* H2 section heading */}
      <h2 style={{
        fontSize: "22px", fontWeight: 700, lineHeight: "1.27",
        letterSpacing: "-0.25px", color: "rgba(0,0,0,0.95)",
      }}>
        {section.heading}
      </h2>

      {/* Optional direct content */}
      {section.content && (
        <div className="flex flex-col gap-3">{section.content}</div>
      )}

      {/* Subsections */}
      {section.subsections?.map((sub) => (
        <div key={sub.id} id={sub.id} className="flex flex-col gap-2 scroll-mt-8">
          <h3 style={{
            fontSize: "16px", fontWeight: 600, lineHeight: "1.5",
            color: "rgba(0,0,0,0.95)",
          }}>
            {sub.heading}
          </h3>
          <div className="flex flex-col gap-2">{sub.content}</div>
        </div>
      ))}
    </section>
  );
}

// ─── Shared prose helpers (exported for use in page files) ───────────────────

export function P({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "15px", fontWeight: 400, lineHeight: "1.7",
      color: "#615d59" }}>
      {children}
    </p>
  );
}

export function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="flex flex-col gap-1.5 pl-5"
      style={{ listStyleType: "disc", color: "#615d59" }}>
      {children}
    </ul>
  );
}

export function LI({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ fontSize: "15px", fontWeight: 400, lineHeight: "1.7",
      color: "#615d59" }}>
      {children}
    </li>
  );
}

export function EmailLink() {
  return (
    <a href="mailto:softjico@gmail.com"
      style={{ color: "#0075de", textDecoration: "none" }}
      className="hover:underline">
      softjico@gmail.com
    </a>
  );
}

// ─── Main layout ─────────────────────────────────────────────────────────────

export default function LegalLayout({
  title,
  effectiveDate,
  badge,
  description,
  sections,
  lang,
  siblings,
  backHref = "/legal",
}: LegalLayoutProps) {
  return (
    <main className="min-h-screen w-full" style={{ background: "#f6f5f4" }}>
      <div className="mx-auto w-full max-w-5xl px-6 py-16 sm:py-20">

        {/* Mobile back link */}
        <Link href={backHref}
          className="lg:hidden inline-flex items-center gap-1.5 group mb-8"
          style={{ textDecoration: "none" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"
            className="text-[#a39e98] group-hover:text-[#0075de] transition-colors duration-150">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: "13px", fontWeight: 500, color: "#a39e98" }}
            className="group-hover:text-[#0075de] transition-colors duration-150">
            Legal
          </span>
        </Link>

        <div className="flex gap-12">

          {/* ── Sidebar ── */}
          <SidebarNav
            sections={sections}
            siblings={siblings}
            lang={lang}
            backHref={backHref}
          />

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Document header */}
            <div className="mb-10 flex flex-col gap-3">
              {/* Badge */}
              <span className="inline-flex w-fit items-center rounded-[9999px] px-2.5 py-1"
                style={{ background: "#f2f9ff", color: "#097fe8",
                  fontSize: "12px", fontWeight: 600, lineHeight: "1.33",
                  letterSpacing: "0.125px" }}>
                {badge}
              </span>

              {/* Title */}
              <h1 style={{
                fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 700,
                lineHeight: "1.1", letterSpacing: "-1.0px",
                color: "rgba(0,0,0,0.95)",
              }}>
                {title}
              </h1>

              {/* Description */}
              <p style={{ fontSize: "16px", fontWeight: 400, lineHeight: "1.5",
                color: "#615d59", maxWidth: "520px" }}>
                {description}
              </p>

              {/* Effective date */}
              <div className="flex items-center gap-2 mt-1">
                <span style={{ fontSize: "13px", fontWeight: 400,
                  color: "#a39e98", lineHeight: "1.43" }}>
                  Effective date
                </span>
                <span className="inline-flex items-center rounded-[9999px] px-2 py-0.5"
                  style={{ background: "#f6f5f4", color: "#615d59",
                    fontSize: "12px", fontWeight: 600, lineHeight: "1.33",
                    letterSpacing: "0.125px", border: "1px solid rgba(0,0,0,0.08)" }}>
                  {effectiveDate}
                </span>
              </div>
            </div>

            {/* Divider */}
            <div className="mb-10 w-full"
              style={{ height: "1px", background: "rgba(0,0,0,0.08)" }} />

            {/* Document body — white card */}
            <div className="flex flex-col gap-10 rounded-2xl border border-black/10 bg-white p-8"
              style={{
                boxShadow: "rgba(0,0,0,0.04) 0px 4px 18px, rgba(0,0,0,0.027) 0px 2.025px 7.85px, rgba(0,0,0,0.02) 0px 0.8px 2.93px, rgba(0,0,0,0.01) 0px 0.175px 1.04px",
              }}>
              {sections.map((section, i) => (
                <>
                  <Section key={section.id} section={section} />
                  {/* Divider between sections */}
                  {i < sections.length - 1 && (
                    <div className="w-full"
                      style={{ height: "1px", background: "rgba(0,0,0,0.06)" }} />
                  )}
                </>
              ))}
            </div>

            {/* Footer note */}
            <p className="mt-8 text-center"
              style={{ fontSize: "13px", fontWeight: 400,
                lineHeight: "1.43", color: "#a39e98" }}>
              Questions? Contact us at{" "}
              <a href="mailto:softjico@gmail.com"
                style={{ color: "#0075de", textDecoration: "none" }}
                className="hover:underline">
                softjico@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}