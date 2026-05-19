// app/legal/en/tos/page.tsx
import type { Metadata } from "next";
import LegalLayout, { LegalSection, P, UL, LI, EmailLink } from "../../legal-layout";

export const metadata: Metadata = {
  title: "Terms of Service | Pomotomo",
  description: "Rules and conditions governing your use of the App.",
};

const SIBLINGS = [
  { href: "/legal/en/privacy", label: "Privacy Policy" },
  { href: "/legal/en/tos",     label: "Terms of Service" },
  { href: "/legal/en/aup",     label: "Acceptable Use Policy" },
];

const sections: LegalSection[] = [
  {
    id: "acceptance",
    heading: "1. Acceptance of Terms",
    content: (
      <>
        <P>
          By accessing or using this Pomodoro productivity application {`("the
          App")`}, you agree to be bound by these Terms of Service {`("Terms")`}. If
          you do not agree to these Terms, please do not use the App.
        </P>
        <P>
          These Terms apply to all users of the App, including users of the
          session tracking, note-taking, and chat features.
        </P>
      </>
    ),
  },
  {
    id: "description",
    heading: "2. Description of the App",
    content: (
      <>
        <P>
          The App is a free, open-source productivity tool that provides:
        </P>
        <UL>
          <LI>Pomodoro-style session timers for focused work intervals</LI>
          <LI>Note-taking functionality</LI>
          <LI>Chat features for communicating with other users</LI>
        </UL>
        <P>
          The App is provided free of charge. The source code is available
          under the GNU Affero General Public License v3.0 (AGPL-3.0).
        </P>
      </>
    ),
  },
  {
    id: "eligibility",
    heading: "3. Eligibility",
    content: (
      <>
        <P>
          You must be at least 13 years of age to use the App. By using the
          App, you represent and warrant that you meet this requirement.
        </P>
        <P>
          If you are using the App on behalf of an organization, you represent
          that you have the authority to bind that organization to these Terms.
        </P>
      </>
    ),
  },
  {
    id: "accounts",
    heading: "4. User Accounts",
    content: (
      <>
        <P>
          To access certain features of the App, you may need to create an
          account. You agree to:
        </P>
        <UL>
          <LI>Provide accurate and complete information when creating your account</LI>
          <LI>Keep your login credentials confidential</LI>
          <LI>Notify us promptly of any unauthorized use of your account</LI>
          <LI>Take responsibility for all activities that occur under your account</LI>
        </UL>
        <P>
          We reserve the right to suspend or terminate accounts that violate
          these Terms.
        </P>
      </>
    ),
  },
  {
    id: "acceptable-use",
    heading: "5. Acceptable Use",
    subsections: [
      {
        id: "permitted-use",
        heading: "5.1 Permitted Use",
        content: (
          <P>
            You may use the App for personal productivity, collaboration, and
            communication purposes in accordance with these Terms.
          </P>
        ),
      },
      {
        id: "prohibited-conduct",
        heading: "5.2 Prohibited Conduct",
        content: (
          <>
            <P>You agree not to:</P>
            <UL>
              <LI>Post or transmit content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable</LI>
              <LI>Impersonate any person or entity</LI>
              <LI>Attempt to gain unauthorized access to any part of the App or its systems</LI>
              <LI>Use the App to send spam or unsolicited messages</LI>
              <LI>Upload malware, viruses, or any other malicious code</LI>
              <LI>Interfere with or disrupt the {`App's infrastructure or other users' access`}</LI>
              <LI>Use the App in any way that violates applicable laws or regulations</LI>
              <LI>Collect or harvest other {`users'`} personal information without their consent</LI>
            </UL>
          </>
        ),
      },
      {
        id: "content-responsibility",
        heading: "5.3 Content Responsibility",
        content: (
          <P>
            You are solely responsible for any content you post, share, or
            transmit through the App, including notes and chat messages. We do
            not endorse or verify user-generated content.
          </P>
        ),
      },
    ],
  },
  {
    id: "intellectual-property",
    heading: "6. Intellectual Property",
    subsections: [
      {
        id: "open-source",
        heading: "6.1 Open Source Code",
        content: (
          <P>
            {`The App's `}source code is licensed under the GNU Affero General
            Public License v3.0 (AGPL-3.0). You may view, use, and contribute
            to the code in accordance with that license.
          </P>
        ),
      },
      {
        id: "your-content",
        heading: "6.2 Your Content",
        content: (
          <P>
            You retain ownership of all content you create within the App,
            including your notes and messages. By using the App, you grant us a
            limited, non-exclusive license to store and display your content
            solely for the purpose of operating the App.
          </P>
        ),
      },
      {
        id: "copyright",
        heading: "6.3 Copyright",
        content: (
          <P>
            If you believe content in the App infringes your copyright, please
            contact us at <EmailLink /> with details of the alleged
            infringement.
          </P>
        ),
      },
    ],
  },
  {
    id: "disclaimers",
    heading: "7. Disclaimers",
    content: (
      <>
        <P>
          {`THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" `}WITHOUT WARRANTIES OF
          ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE APP WILL BE
          UNINTERRUPTED, ERROR-FREE, OR FREE OF HARMFUL COMPONENTS.
        </P>
        <P>
          We make no warranty regarding the accuracy, reliability, or
          completeness of any content within the App.
        </P>
      </>
    ),
  },
  {
    id: "liability",
    heading: "8. Limitation of Liability",
    content: (
      <>
        <P>
          To the fullest extent permitted by applicable law, we shall not be
          liable for any indirect, incidental, special, consequential, or
          punitive damages arising from your use of or inability to use the App.
        </P>
        <P>
          Our total liability to you for any claims arising from these Terms or
          your use of the App shall not exceed the amount you have paid us in
          the twelve months preceding the claim. Since the App is free, this
          amount is zero.
        </P>
        <P>
          Note: Some jurisdictions, including Japan under the Consumer Contract
          Act (消費者契約法), do not allow the exclusion of certain warranties or
          limitation of certain liabilities. In such jurisdictions, the above
          limitations apply only to the extent permitted by law.
        </P>
      </>
    ),
  },
  {
    id: "termination",
    heading: "9. Termination",
    content: (
      <>
        <P>
          You may stop using the App at any time and request deletion of your
          account by contacting us.
        </P>
        <P>
          We reserve the right to suspend or terminate your access to the App
          at any time, with or without notice, for conduct that we determine
          violates these Terms or is harmful to other users, us, or third
          parties.
        </P>
        <P>
          Upon termination, your right to use the App ceases immediately.
          Provisions of these Terms that by their nature should survive
          termination will survive, including intellectual property provisions
          and disclaimers.
        </P>
      </>
    ),
  },
  {
    id: "governing-law",
    heading: "10. Governing Law",
    content: (
      <>
        <P>
          These Terms are governed by the laws of Japan, without regard to
          conflict of law principles, given that the App primarily targets users
          in Japan.
        </P>
        <P>
          Any disputes arising from these Terms or your use of the App shall be
          subject to the exclusive jurisdiction of the courts of Japan.
        </P>
      </>
    ),
  },
  {
    id: "changes",
    heading: "11. Changes to These Terms",
    content: (
      <>
        <P>
          We may update these Terms from time to time. We will notify users of
          significant changes by updating the effective date and, where
          possible, through the App or by email.
        </P>
        <P>
          Continued use of the App after changes take effect constitutes
          acceptance of the updated Terms.
        </P>
      </>
    ),
  },
  {
    id: "contact",
    heading: "12. Contact",
    content: (
      <P>
        If you have questions about these Terms, please contact us at{" "}
        <EmailLink />. We will respond to all inquiries within 30 days.
      </P>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalLayout
      title="Terms of Service"
      effectiveDate="May 19, 2026"
      badge="Terms of Service"
      description="Rules and conditions governing your use of the App, including your rights and responsibilities."
      sections={sections}
      lang="en"
      siblings={SIBLINGS}
    />
  );
}