import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { PreferencesProvider } from "@/components/preferences/preferences-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  metadataBase: new URL("https://pomotomo.me"),
  title: {
    default: "Pomotomo ポモトモ",
    template: "%s | Pomotomo ポモトモ",
  },
  description:
    "友達と一緒に集中できるポモドーロアプリ。Pomotomo helps you focus with timers, notes, and collaborative study workflows.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("h-full", "antialiased", inter.variable, "font-sans")}
    >
      <body className="min-h-full flex flex-col">
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
