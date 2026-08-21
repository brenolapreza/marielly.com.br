/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { getSiteContent } from "../../lib/content";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  return {
    title: `Sobre mim | ${content.brand.name}`,
    description: content.aboutPage.intro,
    openGraph: { title: `Sobre mim | ${content.brand.name}`, description: content.aboutPage.intro, type: "profile", locale: "pt_BR" },
    twitter: { card: "summary", title: `Sobre mim | ${content.brand.name}`, description: content.aboutPage.intro }
  };
}

export default async function AboutPage() {
  const content = await getSiteContent();
  const theme = {
    "--page-bg": content.colors.background,
    "--page-surface": content.colors.surface,
    "--page-ink": content.colors.ink,
    "--page-muted": content.colors.muted,
    "--page-accent": content.colors.accent,
    "--page-sage": content.colors.sage,
    "--page-line": content.colors.line,
    "--page-whatsapp": content.colors.whatsapp
  } as CSSProperties;

  return (
    <main className="site-main about-page" style={theme}>
      <section className="about-page-hero container">
        <div className="about-page-copy">
          <p className="eyebrow">{content.aboutPage.eyebrow}</p>
          <h1>{content.aboutPage.title}</h1>
          <p className="about-page-intro">{content.aboutPage.intro}</p>
          <Link className="text-link" href="/#contato">Vamos conversar</Link>
        </div>
        <div className="about-page-visual image-frame">
          <img src={content.aboutPage.image} alt={content.aboutPage.imageAlt} fetchPriority="high" />
          <span className="image-number">02 / minha história</span>
        </div>
      </section>

      <section className="story-section container">
        <div className="story-label"><span>01</span><p>Vida pessoal</p></div>
        <div className="story-copy">
          <h2>{content.aboutPage.personalTitle}</h2>
          {content.aboutPage.personalParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
      </section>

      <section className="professional-section">
        <div className="container professional-grid">
          <div className="story-label"><span>02</span><p>Vida profissional</p></div>
          <div className="story-copy">
            <h2>{content.aboutPage.professionalTitle}</h2>
            {content.aboutPage.professionalParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </div>
        </div>
      </section>

      <section className="about-page-cta container">
        <div>
          <p className="eyebrow">Um próximo passo possível</p>
          <h2>Se fizer sentido para você, podemos conversar.</h2>
        </div>
        <Link className="button button-primary" href="/#contato">Entrar em contato</Link>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div><span className="brand-mark footer-mark">{content.brand.shortName}</span><span>{content.brand.name}</span></div>
          <p>{content.footer.description}</p>
          <a href={content.footer.instagramUrl} className="footer-social" target="_blank" rel="noreferrer">Instagram</a>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} {content.brand.name}</span><span>{content.brand.role}</span></div>
      </footer>
    </main>
  );
}
