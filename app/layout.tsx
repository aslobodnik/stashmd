import type { Metadata } from "next";
import { IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "stashmd - AI skills that prove themselves",
  description: "A curated directory of AI agent skills where every skill proves itself with before/after demos. See the difference before you install.",
  metadataBase: new URL("https://www.stash.md"),
  openGraph: {
    title: "stashmd - AI skills that prove themselves",
    description: "A curated directory of AI agent skills where every skill proves itself with before/after demos.",
    siteName: "stashmd",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "stashmd - AI skills that prove themselves",
    description: "A curated directory of AI agent skills where every skill proves itself with before/after demos.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${instrumentSerif.variable} ${ibmPlexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
