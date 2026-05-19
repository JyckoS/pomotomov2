// app/legal/en/privacy/page.tsx
import type { Metadata } from "next";
import LegalLayout, { EmailLink, LegalSection, LI, P, UL } from "../../legal-layout";

export const metadata: Metadata = {
  title: "Privacy Policy | Pomotomo",
  description: "How we collect, use, and protect your personal information.",
};

const SIBLINGS = [
  { href: "/legal/en/privacy", label: "Privacy Policy" },
  { href: "/legal/en/tos",     label: "Terms of Service" },
  { href: "/legal/en/aup",     label: "Acceptable Use Policy" },
];

const sections: LegalSection[] = [
  {
    id: "introduction",
    heading: "1. Introduction",
    content: (
      <>
        <P>
          This Privacy Policy explains how we collect, use, store, and protect
          your personal information when you use our Pomodoro productivity
          application {`("the App")`}, which includes session tracking, note-taking,
          and chat features.
        </P>
        <P>
          The App is operated by an individual developer based in Indonesia,
          targeting users in Japan. By using the App, you agree to the practices
          described in this Privacy Policy.
        </P>
        <P>This Policy is intended to comply with:</P>
        <UL>
          <LI>{`Japan's`} Act on the Protection of Personal Information (APPI), as amended in 2022</LI>
          <LI>{`Indonesia's`} Personal Data Protection Law (UU PDP), enacted 2022</LI>
          <LI>Applicable international data protection standards</LI>
        </UL>
      </>
    ),
  },
  {
    id: "information-we-collect",
    heading: "2. Information We Collect",
    subsections: [
      {
        id: "account-information",
        heading: "2.1 Account Information",
        content: (
          <>
            <P>When you create an account, we collect:</P>
            <UL>
              <LI>Email address</LI>
              <LI>Username or display name</LI>
              <LI>Password (stored in hashed, non-recoverable form)</LI>
            </UL>
          </>
        ),
      },
      {
        id: "session-data",
        heading: "2.2 Productivity Session Data",
        content: (
          <>
            <P>We collect data generated during your use of the App, including:</P>
            <UL>
              <LI>Pomodoro session start times, end times, and durations</LI>
              <LI>Focus and break intervals you configure</LI>
              <LI>Session completion records and productivity statistics</LI>
            </UL>
          </>
        ),
      },
      {
        id: "notes",
        heading: "2.3 Notes",
        content: (
          <P>
            Any notes you create within the App are stored on our servers to
            enable sync across devices. Note content is stored as you write it
            and is not analyzed for advertising or third-party purposes.
          </P>
        ),
      },
      {
        id: "chat-messages",
        heading: "2.4 Chat Messages",
        content: (
          <P>
            Messages sent through the App chat feature are stored to enable
            delivery and conversation history. Chat messages may include text
            and any other content you choose to share.
          </P>
        ),
      },
      {
        id: "technical-data",
        heading: "2.5 Technical Data",
        content: (
          <>
            <P>We automatically collect certain technical information, including:</P>
            <UL>
              <LI>IP address</LI>
              <LI>Browser type and version</LI>
              <LI>Device type and operating system</LI>
              <LI>Pages accessed and time spent in the App</LI>
              <LI>Error logs and crash reports</LI>
            </UL>
          </>
        ),
      },
    ],
  },
  {
    id: "how-we-use",
    heading: "3. How We Use Your Information",
    content: (
      <>
        <P>We use your information solely for the following purposes:</P>
        <UL>
          <LI>To provide and operate the App and its features</LI>
          <LI>To maintain your session history, notes, and chat messages</LI>
          <LI>To improve app performance and fix technical issues</LI>
          <LI>To respond to your support requests</LI>
          <LI>To detect and prevent abuse or misuse of the App</LI>
        </UL>
        <P>
          We do not use your data for advertising. We do not sell your data to
          third parties. We do not use your data to train AI models.
        </P>
      </>
    ),
  },
  {
    id: "data-storage",
    heading: "4. Data Storage and Security",
    content: (
      <>
        <P>
          Your data is stored on secure servers. We implement reasonable
          technical and organizational measures to protect your personal
          information from unauthorized access, alteration, disclosure, or
          destruction.
        </P>
        <P>
          However, no method of transmission over the Internet is 100% secure.
          While we strive to protect your data, we cannot guarantee absolute
          security.
        </P>
        <P>
          We retain your data for as long as your account remains active. If you
          delete your account, we will delete your personal data within 30 days,
          except where retention is required by law.
        </P>
      </>
    ),
  },
  {
    id: "data-sharing",
    heading: "5. Data Sharing and Disclosure",
    content: (
      <>
        <P>
          We do not share your personal information with third parties except in
          the following limited circumstances:
        </P>
        <UL>
          <LI>
            With service providers who assist in operating the App (e.g.,
            hosting providers), who are bound by confidentiality obligations
          </LI>
          <LI>When required by law, regulation, or valid legal process</LI>
          <LI>
            To protect the rights, safety, or property of users or the public
          </LI>
        </UL>
        <P>
          The App is open source under the GNU Affero General Public License
          v3.0 (AGPL-3.0). The open source license applies to the application
          code only and does not affect the privacy of your data.
        </P>
      </>
    ),
  },
  {
    id: "your-rights",
    heading: "6. Your Rights",
    subsections: [
      {
        id: "appi-rights",
        heading: "6.1 Rights Under Japan's APPI",
        content: (
          <>
            <P>If you are a user in Japan, you have the right to:</P>
            <UL>
              <LI>Request disclosure of your personal information we hold</LI>
              <LI>Request correction of inaccurate personal information</LI>
              <LI>Request deletion of your personal information</LI>
              <LI>Request suspension of use of your personal information</LI>
              <LI>Object to the third-party provision of your personal information</LI>
            </UL>
          </>
        ),
      },
      {
        id: "uudp-rights",
        heading: "6.2 Rights Under Indonesia's UU PDP",
        content: (
          <>
            <P>If you are a data subject under Indonesian law, you have the right to:</P>
            <UL>
              <LI>Access your personal data</LI>
              <LI>Correct incomplete or inaccurate data</LI>
              <LI>Request deletion of your data</LI>
              <LI>Withdraw consent at any time</LI>
              <LI>File a complaint with the relevant authority</LI>
            </UL>
          </>
        ),
      },
      {
        id: "exercise-rights",
        heading: "6.3 How to Exercise Your Rights",
        content: (
          <P>
            To exercise any of these rights, please contact us at{" "}
            <EmailLink />. We will respond to your request within 30 days.
          </P>
        ),
      },
    ],
  },
  {
    id: "cookies",
    heading: "7. Cookies and Tracking",
    content: (
      <>
        <P>The App may use cookies and similar technologies for:</P>
        <UL>
          <LI>Maintaining your login session</LI>
          <LI>Remembering your preferences</LI>
          <LI>Basic analytics to understand how the App is used</LI>
        </UL>
        <P>
          You can control cookie settings through your browser. Disabling
          cookies may affect the functionality of the App.
        </P>
      </>
    ),
  },
  {
    id: "children",
    heading: "8. Children's Privacy",
    content: (
      <P>
        The App is not intended for users under the age of 13. We do not
        knowingly collect personal information from children under 13. If we
        become aware that we have collected data from a child under 13, we will
        delete it promptly.
      </P>
    ),
  },
  {
    id: "contact",
    heading: "9. Contact Us",
    content: (
      <>
        <P>
          If you have questions about this Privacy Policy or wish to exercise
          your data rights, please contact us at <EmailLink />. We will respond
          to all inquiries within 30 days.
        </P>
      </>
    ),
  },
  {
    id: "changes",
    heading: "10. Changes to This Policy",
    content: (
      <>
        <P>
          We may update this Privacy Policy from time to time. When we do, we
          will update the effective date at the top of this page. For
          significant changes, we will notify users through the App or by email
          where possible.
        </P>
        <P>
          Continued use of the App after changes take effect constitutes
          acceptance of the updated Policy.
        </P>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalLayout
      title="Privacy Policy"
      effectiveDate="May 19, 2026"
      badge="Privacy Policy"
      description="How we collect, use, store, and protect your personal information when you use the App."
      sections={sections}
      lang="en"
      siblings={SIBLINGS}
    />
  );
}