import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { getSiteContent } from "./lib/content";
import "./globals.css";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: content.seo.title,
    description: content.seo.description,
    keywords: ["psicóloga", "psicoterapia online", "Marielly Lapreza"],
    openGraph: { title: content.seo.title, description: content.seo.description, type: "website", locale: "pt_BR" },
    robots: { index: true, follow: true }
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const content = await getSiteContent();
  const theme = {
    "--site-bg": content.colors.background,
    "--site-surface": content.colors.surface,
    "--site-ink": content.colors.ink,
    "--site-muted": content.colors.muted,
    "--site-accent": content.colors.accent,
    "--site-sage": content.colors.sage,
    "--site-line": content.colors.line,
    "--site-whatsapp": content.colors.whatsapp
  } as CSSProperties;

  return (
    <html lang="pt-BR">
      <body style={theme}>
        {children}
      </body>
    </html>
  );
}
