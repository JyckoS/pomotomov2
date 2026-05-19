// app/legal/en/aup/page.tsx
import type { Metadata } from "next";
import LegalLayout, { LegalSection, P, UL, LI, EmailLink } from "../../legal-layout";

export const metadata: Metadata = {
  title: "Acceptable Use Policy | Pomotomo",
  description: "Guidelines for appropriate use of the App's chat and content features.",
};

const SIBLINGS = [
  { href: "/legal/en/privacy", label: "Privacy Policy" },
  { href: "/legal/en/tos",     label: "Terms of Service" },
  { href: "/legal/en/aup",     label: "Acceptable Use Policy" },
];

const sections: LegalSection[] = [
  {
    id: "purpose",
    heading: "1. Purpose",
    content: (
      <>
        <P>
          {`This Acceptable Use Policy ("AUP") defines the rules for using this
          Pomodoro productivity application ("the App"), particularly its chat
          and note-sharing features. This AUP exists to keep the App safe,
          respectful, and productive for all users.`}
        </P>
        <P>
          This AUP is incorporated into and forms part of our Terms of Service.
          By using the App, you agree to this AUP.
        </P>
      </>
    ),
  },
  {
    id: "scope",
    heading: "2. Scope",
    content: (
      <>
        <P>
          This AUP applies to all content and behavior within the App,
          including:
        </P>
        <UL>
          <LI>Messages sent through the chat feature</LI>
          <LI>Notes created or shared within the App</LI>
          <LI>Your account name, profile information, and any other user-generated content</LI>
          <LI>Any interactions with other users of the App</LI>
        </UL>
      </>
    ),
  },
  {
    id: "prohibited-content",
    heading: "3. Prohibited Content",
    content: <P>You must not create, post, transmit, or share content that falls into any of the categories below.</P>,
    subsections: [
      {
        id: "harmful-illegal",
        heading: "3.1 Harmful or Illegal Content",
        content: (
          <UL>
            <LI>Violates any applicable law or regulation in Japan, Indonesia, or your country of residence</LI>
            <LI>Promotes, facilitates, or glorifies illegal activities</LI>
            <LI>Contains threats of violence or harm toward any person or group</LI>
            <LI>Constitutes child sexual abuse material (CSAM) or any sexual content involving minors</LI>
            <LI>Facilitates or encourages self-harm or suicide</LI>
          </UL>
        ),
      },
      {
        id: "harassing-abusive",
        heading: "3.2 Harassing or Abusive Content",
        content: (
          <UL>
            <LI>Harasses, bullies, intimidates, or threatens other users</LI>
            <LI>Targets individuals based on race, ethnicity, nationality, religion, gender, sexual orientation, disability, or any other protected characteristic</LI>
            <LI>Is deliberately designed to cause distress to another user</LI>
            <LI>Impersonates another person, user, or entity in a misleading way</LI>
          </UL>
        ),
      },
      {
        id: "spam-disruptive",
        heading: "3.3 Spam or Disruptive Content",
        content: (
          <UL>
            <LI>Sends unsolicited bulk messages or repetitive content</LI>
            <LI>Promotes commercial products or services without authorization</LI>
            <LI>Contains malware, viruses, phishing links, or other malicious code</LI>
            <LI>Artificially inflates engagement or uses automated bots</LI>
          </UL>
        ),
      },
      {
        id: "privacy-violations",
        heading: "3.4 Privacy Violations",
        content: (
          <UL>
            <LI>Shares another {`person's`} private or personal information without their consent (doxxing)</LI>
            <LI>Records, captures, or distributes private communications without consent</LI>
            <LI>Collects other {`users'`} personal data through the App without authorization</LI>
          </UL>
        ),
      },
    ],
  },
  {
    id: "prohibited-behavior",
    heading: "4. Prohibited Behavior",
    content: (
      <>
        <P>In addition to prohibited content, you must not:</P>
        <UL>
          <LI>Attempt to gain unauthorized access to any part of the {`App`}, its servers, or other {`users'`} accounts</LI>
          <LI>Reverse engineer, decompile, or tamper with the App in ways that violate the AGPL-3.0 license or these terms</LI>
          <LI>Interfere with or disrupt the {`App's`} services or infrastructure</LI>
          <LI>Use the App to conduct or facilitate any form of fraud</LI>
          <LI>Create multiple accounts to circumvent a suspension or ban</LI>
          <LI>Use the App in any way that could damage its reputation or harm other users</LI>
        </UL>
      </>
    ),
  },
  {
    id: "enforcement",
    heading: "5. Enforcement",
    subsections: [
      {
        id: "our-rights",
        heading: "5.1 Our Rights",
        content: (
          <>
            <P>
              We reserve the right to take action against any user who violates
              this AUP. Actions we may take include:
            </P>
            <UL>
              <LI>Issuing a warning</LI>
              <LI>Temporarily suspending your account</LI>
              <LI>Permanently terminating your account</LI>
              <LI>Removing content that violates this AUP</LI>
              <LI>Reporting conduct to relevant authorities where required by law</LI>
            </UL>
          </>
        ),
      },
      {
        id: "reporting",
        heading: "5.2 Reporting Violations",
        content: (
          <>
            <P>
              If you encounter content or behavior that violates this AUP,
              please report it to us at <EmailLink />. Please include as much
              detail as possible, including screenshots or message references
              where applicable. We will review all reports and take appropriate
              action.
            </P>
          </>
        ),
      },
      {
        id: "no-obligation",
        heading: "5.3 No Obligation to Monitor",
        content: (
          <P>
            We are not obligated to actively monitor all content within the
            App. However, we reserve the right to review content when
            violations are reported or suspected.
          </P>
        ),
      },
    ],
  },
  {
    id: "no-liability",
    heading: "6. No Liability for User Content",
    content: (
      <>
        <P>
          We are not responsible for content posted by users. The App provides
          communication tools, and users are solely responsible for the content
          they create and share.
        </P>
        <P>
          We do not endorse any user-generated content and make no
          representations about its accuracy, legality, or appropriateness.
        </P>
      </>
    ),
  },
  {
    id: "applicable-law",
    heading: "7. Applicable Law",
    content: (
      <>
        <P>
          This AUP is governed by the laws of Japan. Users in Japan should be
          aware that certain conduct prohibited here may also constitute
          violations of Japanese law, including but not limited to:
        </P>
        <UL>
          <LI>The Act on Punishment of Activities Relating to Child Prostitution and Child Pornography</LI>
          <LI>The Act on Promotion of Information and Communications Network Utilization and Information Protection (relating to defamation and privacy)</LI>
          <LI>The Penal Code provisions on defamation (名誉毀損) and insult (侮辱)</LI>
        </UL>
        <P>
          We will cooperate with Japanese law enforcement authorities where
          legally required to do so.
        </P>
      </>
    ),
  },
  {
    id: "changes",
    heading: "8. Changes to This Policy",
    content: (
      <P>
        We may update this AUP from time to time. When we do, we will update
        the effective date at the top of this page. Continued use of the App
        after changes take effect constitutes acceptance of the updated AUP.
      </P>
    ),
  },
  {
    id: "contact",
    heading: "9. Contact",
    content: (
      <P>
        For questions about this AUP or to report a violation, contact us at{" "}
        <EmailLink />. We aim to respond to all reports within 72 hours.
      </P>
    ),
  },
];

export default function AUPPage() {
  return (
    <LegalLayout
      title="Acceptable Use Policy"
      effectiveDate="May 19, 2026"
      badge="Acceptable Use Policy"
      description="Rules governing what content and behavior is permitted within the App, especially in chat."
      sections={sections}
      lang="en"
      siblings={SIBLINGS}
    />
  );
}