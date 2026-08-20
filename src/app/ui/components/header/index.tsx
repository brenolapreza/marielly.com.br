import Link from "next/link";
import type { SiteContent } from "../../../lib/content";

export function Header({ content }: { content: SiteContent }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link className="brand" href="/#home" aria-label={`Ir para o início — ${content.brand.name}`}>
          <span className="brand-mark">{content.brand.shortName}</span>
          <span className="brand-copy">
            <strong>{content.brand.name}</strong>
            <small>{content.brand.role}</small>
          </span>
        </Link>
        <nav className="main-nav" aria-label="Navegação principal">
          <Link href="/sobre-mim">{content.navigation.aboutLabel}</Link>
          <Link href="/#processo">{content.navigation.methodLabel}</Link>
          <Link className="nav-contact" href="/#contato">{content.navigation.contactLabel}</Link>
        </nav>
      </div>
    </header>
  );
}
