/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import type { SiteContent } from "../lib/content";

type SectionKey = "brand" | "seo" | "navigation" | "hero" | "about" | "aboutPage" | "method" | "contact" | "footer" | "colors";

function Field({ label, value, onChange, multiline = false, type = "text", placeholder }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; type?: string; placeholder?: string }) {
  return <div className="cms-field"><label>{label}</label>{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /> : <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />}</div>;
}

function ImageField({ id, label, value, onChange }: { id: string; label: string; value: string; onChange: (value: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", file);
      const response = await fetch("/api/cms/upload", { method: "POST", body: formData });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Não foi possível enviar a imagem.");
      onChange(body.url);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Não foi possível enviar a imagem.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  return <div className="cms-image-field"><Field label={label} value={value} onChange={onChange} /><div className="cms-upload-row"><label className="cms-upload-button" htmlFor={id}>{uploading ? "Enviando..." : "Enviar imagem"}<input id={id} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/avif" onChange={upload} disabled={uploading} /></label><span>JPG, PNG ou WebP - até 8 MB</span></div>{error && <small className="cms-upload-error">{error}</small>}</div>;
}

export function CmsEditor({ initialContent }: { initialContent: SiteContent }) {
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState(false);

  function updateSection<K extends SectionKey>(section: K, field: keyof SiteContent[K], value: string) {
    setContent((previous) => ({ ...previous, [section]: { ...previous[section], [field]: value } }));
  }

  function updateCard(index: number, field: "title" | "description" | "details" | "image" | "imageAlt", value: string) {
    setContent((previous) => ({ ...previous, method: { ...previous.method, cards: previous.method.cards.map((card, cardIndex) => cardIndex === index ? { ...card, [field]: value } : card) } }));
  }

  function updateAboutPageParagraph(section: "personalParagraphs" | "professionalParagraphs", index: number, value: string) {
    setContent((previous) => ({ ...previous, aboutPage: { ...previous.aboutPage, [section]: previous.aboutPage[section].map((paragraph, paragraphIndex) => paragraphIndex === index ? value : paragraph) } }));
  }

  async function save() {
    setSaving(true); setNotice(""); setError(false);
    try {
      const response = await fetch("/api/cms/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.error || "Não foi possível salvar.");
      setContent(body.content);
      setNotice("Alterações salvas. O site público já está atualizado.");
    } catch (saveError) {
      setError(true); setNotice(saveError instanceof Error ? saveError.message : "Não foi possível salvar agora.");
    } finally { setSaving(false); }
  }

  async function logout() {
    await fetch("/api/cms/logout", { method: "POST" });
    window.location.reload();
  }

  return (
    <main className="cms-shell">
      <header className="cms-topbar"><div className="cms-brand"><span className="cms-brand-mark">ML</span><span>Configuração do site</span></div><div className="cms-top-actions"><Link href="/" target="_blank">Ver site</Link><button className="cms-logout" onClick={logout}>Sair</button></div></header>
      <div className="cms-content">
        <div className="cms-heading"><div><h1>Seu espaço de edição.</h1><p>Atualize o que aparece no site. As mudanças são salvas quando você clicar no botão.</p></div><button className="cms-save" onClick={save} disabled={saving}>{saving ? "Salvando..." : "Salvar alterações"}</button></div>
        {notice && <p className={`cms-notice${error ? " error" : ""}`} role="status">{notice}</p>}
        <div className="cms-grid">
          <section className="cms-panel"><h2>Identidade</h2><p>Nome que aparece no cabeçalho e no rodapé.</p><div className="cms-fields"><Field label="Nome profissional" value={content.brand.name} onChange={(value) => updateSection("brand", "name", value)} /><div className="cms-fields two-col"><Field label="Abreviação" value={content.brand.shortName} onChange={(value) => updateSection("brand", "shortName", value)} /><Field label="Especialidade" value={content.brand.role} onChange={(value) => updateSection("brand", "role", value)} /></div></div></section>
          <section className="cms-panel"><h2>Navegação</h2><p>Rótulos dos links no menu principal.</p><div className="cms-fields"><Field label="Link sobre" value={content.navigation.aboutLabel} onChange={(value) => updateSection("navigation", "aboutLabel", value)} /><Field label="Link processo" value={content.navigation.methodLabel} onChange={(value) => updateSection("navigation", "methodLabel", value)} /><Field label="Link contato" value={content.navigation.contactLabel} onChange={(value) => updateSection("navigation", "contactLabel", value)} /></div></section>
          <section className="cms-panel cms-panel-wide"><h2>Primeira impressão</h2><p>O conteúdo principal da primeira tela do site.</p><div className="cms-fields two-col"><Field label="Pequeno título" value={content.hero.eyebrow} onChange={(value) => updateSection("hero", "eyebrow", value)} /><Field label="Texto em destaque" value={content.hero.highlight} onChange={(value) => updateSection("hero", "highlight", value)} /><Field label="Título principal" value={content.hero.title} onChange={(value) => updateSection("hero", "title", value)} multiline /><Field label="Descrição" value={content.hero.description} onChange={(value) => updateSection("hero", "description", value)} multiline /><Field label="Texto do botão" value={content.hero.primaryButtonLabel} onChange={(value) => updateSection("hero", "primaryButtonLabel", value)} /><Field label="Link do botão" value={content.hero.primaryButtonUrl} onChange={(value) => updateSection("hero", "primaryButtonUrl", value)} /><Field label="Texto do link secundário" value={content.hero.secondaryButtonLabel} onChange={(value) => updateSection("hero", "secondaryButtonLabel", value)} /><Field label="Imagem principal (URL ou /arquivo)" value={content.hero.image} onChange={(value) => updateSection("hero", "image", value)} /><Field label="Descrição da imagem" value={content.hero.imageAlt} onChange={(value) => updateSection("hero", "imageAlt", value)} /></div></section>
          <section className="cms-panel"><h2>Sobre mim</h2><p>Apresente sua abordagem de forma próxima na página inicial.</p><div className="cms-fields"><Field label="Pequeno título" value={content.about.eyebrow} onChange={(value) => updateSection("about", "eyebrow", value)} /><Field label="Título" value={content.about.title} onChange={(value) => updateSection("about", "title", value)} multiline /><Field label="Primeiro parágrafo" value={content.about.paragraphs[0] || ""} onChange={(value) => setContent((previous) => ({ ...previous, about: { ...previous.about, paragraphs: [value, previous.about.paragraphs[1] || ""] } }))} multiline /><Field label="Segundo parágrafo" value={content.about.paragraphs[1] || ""} onChange={(value) => setContent((previous) => ({ ...previous, about: { ...previous.about, paragraphs: [previous.about.paragraphs[0] || "", value] } }))} multiline /><ImageField id="about-image-upload" label="Imagem (URL ou /arquivo)" value={content.about.image} onChange={(value) => updateSection("about", "image", value)} /><Field label="Descrição da imagem" value={content.about.imageAlt} onChange={(value) => updateSection("about", "imageAlt", value)} /></div></section>
          <section className="cms-panel cms-panel-wide"><h2>Página Sobre mim</h2><p>Conte sua história pessoal e profissional com mais espaço. Este conteúdo aparece em /sobre-mim.</p><div className="cms-fields two-col"><Field label="Pequeno título" value={content.aboutPage.eyebrow} onChange={(value) => updateSection("aboutPage", "eyebrow", value)} /><Field label="Título da página" value={content.aboutPage.title} onChange={(value) => updateSection("aboutPage", "title", value)} multiline /><Field label="Introdução" value={content.aboutPage.intro} onChange={(value) => updateSection("aboutPage", "intro", value)} multiline /><ImageField id="about-page-image-upload" label="Imagem da página (URL ou /arquivo)" value={content.aboutPage.image} onChange={(value) => updateSection("aboutPage", "image", value)} /><Field label="Descrição da imagem" value={content.aboutPage.imageAlt} onChange={(value) => updateSection("aboutPage", "imageAlt", value)} /><div className="cms-field cms-field-group"><span className="cms-field-group-title">Vida pessoal</span><Field label="Título da seção" value={content.aboutPage.personalTitle} onChange={(value) => updateSection("aboutPage", "personalTitle", value)} />{content.aboutPage.personalParagraphs.map((paragraph, index) => <Field key={`personal-${index}`} label={`Parágrafo ${index + 1}`} value={paragraph} onChange={(value) => updateAboutPageParagraph("personalParagraphs", index, value)} multiline />)}</div><div className="cms-field cms-field-group"><span className="cms-field-group-title">Vida profissional</span><Field label="Título da seção" value={content.aboutPage.professionalTitle} onChange={(value) => updateSection("aboutPage", "professionalTitle", value)} />{content.aboutPage.professionalParagraphs.map((paragraph, index) => <Field key={`professional-${index}`} label={`Parágrafo ${index + 1}`} value={paragraph} onChange={(value) => updateAboutPageParagraph("professionalParagraphs", index, value)} multiline />)}</div></div></section>
          <section className="cms-panel"><h2>Contato</h2><p>Facilite o próximo passo para quem visitar o site.</p><div className="cms-fields"><Field label="Pequeno título" value={content.contact.eyebrow} onChange={(value) => updateSection("contact", "eyebrow", value)} /><Field label="Título" value={content.contact.title} onChange={(value) => updateSection("contact", "title", value)} multiline /><Field label="Descrição" value={content.contact.description} onChange={(value) => updateSection("contact", "description", value)} multiline /><Field label="Texto do WhatsApp" value={content.contact.whatsappLabel} onChange={(value) => updateSection("contact", "whatsappLabel", value)} /><Field label="Link do WhatsApp" value={content.contact.whatsappUrl} onChange={(value) => updateSection("contact", "whatsappUrl", value)} /><Field label="Texto do e-mail" value={content.contact.emailLabel} onChange={(value) => updateSection("contact", "emailLabel", value)} /><Field label="Seu e-mail" value={content.contact.emailUrl} onChange={(value) => updateSection("contact", "emailUrl", value)} /></div></section>
          <section className="cms-panel cms-panel-wide"><h2>Como funciona</h2><p>Edite a seção e os cards que explicam seu trabalho. A explicação completa aparece em um modal ao clicar em cada card.</p><div className="cms-fields two-col"><Field label="Pequeno título" value={content.method.eyebrow} onChange={(value) => updateSection("method", "eyebrow", value)} /><Field label="Título" value={content.method.title} onChange={(value) => updateSection("method", "title", value)} /><Field label="Descrição" value={content.method.description} onChange={(value) => updateSection("method", "description", value)} multiline /></div><div className="cms-fields" style={{ marginTop: 27 }}>{content.method.cards.map((card, index) => <div className="cms-card-editor" key={index}><div className="cms-card-preview"><img src={card.image} alt="" /></div><div className="cms-card-fields"><strong>Card 0{index + 1}</strong><Field label="Título" value={card.title} onChange={(value) => updateCard(index, "title", value)} /><Field label="Resumo do card" value={card.description} onChange={(value) => updateCard(index, "description", value)} multiline /><Field label="Explicação completa do modal" value={card.details} onChange={(value) => updateCard(index, "details", value)} multiline /><ImageField id={`card-image-upload-${index}`} label="Imagem (URL ou /arquivo)" value={card.image} onChange={(value) => updateCard(index, "image", value)} /><Field label="Descrição da imagem" value={card.imageAlt} onChange={(value) => updateCard(index, "imageAlt", value)} /></div></div>)}</div></section>
          <section className="cms-panel cms-panel-wide"><h2>Cores</h2><p>Personalize a paleta sem perder o equilíbrio visual do layout.</p><div className="cms-fields two-col">{([ ["background", "Fundo"], ["surface", "Superfície"], ["ink", "Texto"], ["muted", "Texto suave"], ["accent", "Destaque"], ["sage", "Verde sálvia"], ["line", "Linhas"], ["whatsapp", "WhatsApp"] ] as Array<[keyof SiteContent["colors"], string]>).map(([key, label]) => <div className="cms-color-field" key={key}><Field label={label} value={content.colors[key]} onChange={(value) => setContent((previous) => ({ ...previous, colors: { ...previous.colors, [key]: value } }))} /><input aria-label={`Escolher cor: ${label}`} type="color" value={/^#[0-9a-fA-F]{6}$/.test(content.colors[key]) ? content.colors[key] : "#ffffff"} onChange={(event) => setContent((previous) => ({ ...previous, colors: { ...previous.colors, [key]: event.target.value } }))} /></div>)}</div></section>
          <section className="cms-panel"><h2>Rodapé</h2><p>Informações finais e rede social.</p><div className="cms-fields"><Field label="Descrição" value={content.footer.description} onChange={(value) => updateSection("footer", "description", value)} multiline /><Field label="Link do Instagram" value={content.footer.instagramUrl} onChange={(value) => updateSection("footer", "instagramUrl", value)} /></div></section>
          <section className="cms-panel"><h2>SEO</h2><p>Como o site aparece nos mecanismos de busca.</p><div className="cms-fields"><Field label="Título da página" value={content.seo.title} onChange={(value) => updateSection("seo", "title", value)} /><Field label="Descrição da página" value={content.seo.description} onChange={(value) => updateSection("seo", "description", value)} multiline /></div></section>
        </div>
      </div>
    </main>
  );
}
