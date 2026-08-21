/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from "react";
import { getSiteContent } from "../lib/content";
import { MethodCards } from "./method-cards";

export const dynamic = "force-dynamic";

function ExternalLink({ href, children, className = "", ariaLabel }: { href: string; children: React.ReactNode; className?: string; ariaLabel?: string }) {
  const external = href.startsWith("http");
  return <a className={className} href={href} aria-label={ariaLabel} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>{children}</a>;
}

function HighlightedTitle({ title, highlight }: { title: string; highlight: string }) {
  const parts = title.split(highlight);
  if (parts.length === 1) return <>{title}</>;
  return <>{parts.map((part, index) => <span key={`${part}-${index}`}>{part}{index < parts.length - 1 && <em>{highlight}</em>}</span>)}</>;
}

export default async function Home() {
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
    <main className="site-main" style={theme}>
      <section className="hero container" id="home">
        <div className="hero-copy">
          <p className="eyebrow">{content.hero.eyebrow}</p>
          <h1><HighlightedTitle title={content.hero.title} highlight={content.hero.highlight} /></h1>
          <p className="hero-description">{content.hero.description}</p>
          <div className="hero-actions">
            <ExternalLink href={content.hero.primaryButtonUrl} className="button button-primary">{content.hero.primaryButtonLabel}</ExternalLink>
            <a className="text-link" href="#sobre">{content.hero.secondaryButtonLabel}</a>
          </div>
          <div className="hero-note"><span className="note-dot" /> Atendimento individual, 100% online</div>
        </div>
        <div className="hero-visual">
          <div className="visual-caption"><span>01</span><span>presença &amp; cuidado</span></div>
          <img src={content.hero.image} alt={content.hero.imageAlt} fetchPriority="high" />
        </div>
      </section>

      <section className="intro-strip" aria-label="Princípios do atendimento">
        <div className="container intro-grid">
          <p><span>01</span> Escuta com presença</p>
          <p><span>02</span> Respeito à sua história</p>
          <p><span>03</span> Caminhos possíveis</p>
        </div>
      </section>

      <section className="about-section container section-grid" id="sobre">
        <div className="about-visual image-frame">
          <img src={content.about.image} alt={content.about.imageAlt} loading="lazy" />
          <span className="image-number">02 / sobre</span>
        </div>
        <div className="about-copy section-copy">
          <p className="eyebrow">{content.about.eyebrow}</p>
          <h2>{content.about.title}</h2>
          {content.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <a className="text-link" href="/sobre-mim">Conheça minha história</a>
        </div>
      </section>

      <section className="method-section" id="processo">
        <div className="container method-heading">
          <div>
            <p className="eyebrow">{content.method.eyebrow}</p>
            <h2>{content.method.title}</h2>
          </div>
          <p>{content.method.description}</p>
        </div>
        <div className="container"><MethodCards cards={content.method.cards} /></div>
      </section>

      <section className="contact-section container" id="contato">
        <div className="contact-inner">
          <div><p className="eyebrow">{content.contact.eyebrow}</p><h2>{content.contact.title}</h2></div>
          <div className="contact-copy"><p>{content.contact.description}</p><div className="contact-actions"><ExternalLink href={content.contact.whatsappUrl} className="button button-light">{content.contact.whatsappLabel}</ExternalLink><ExternalLink href={content.contact.emailUrl} className="contact-email">{content.contact.emailLabel}</ExternalLink></div></div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container footer-inner">
          <div><span className="brand-mark footer-mark">{content.brand.shortName}</span><span>{content.brand.name}</span></div>
          <p>{content.footer.description}</p>
          <ExternalLink href={content.footer.instagramUrl} className="footer-social">Instagram</ExternalLink>
        </div>
        <div className="container footer-bottom"><span>© {new Date().getFullYear()} {content.brand.name}</span><span>Psicologia clínica online</span></div>
      </footer>

      <ExternalLink href={content.contact.whatsappUrl} className="whatsapp-float" ariaLabel="Falar pelo WhatsApp"><span aria-hidden="true">wa</span></ExternalLink>
    </main>
  );
}
