import { promises as fs } from "node:fs";
import path from "node:path";
import { assertProductionStorage, hasBlobStorage, readPublicBlob, writePublicBlob } from "./storage";

export type SiteContent = {
  brand: {
    name: string;
    shortName: string;
    role: string;
  };
  seo: {
    title: string;
    description: string;
  };
  navigation: {
    aboutLabel: string;
    methodLabel: string;
    contactLabel: string;
  };
  hero: {
    eyebrow: string;
    title: string;
    highlight: string;
    description: string;
    primaryButtonLabel: string;
    primaryButtonUrl: string;
    secondaryButtonLabel: string;
    image: string;
    imageAlt: string;
  };
  about: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    image: string;
    imageAlt: string;
  };
  aboutPage: {
    eyebrow: string;
    title: string;
    intro: string;
    personalTitle: string;
    personalParagraphs: string[];
    professionalTitle: string;
    professionalParagraphs: string[];
    image: string;
    imageAlt: string;
  };
  method: {
    eyebrow: string;
    title: string;
    description: string;
    cards: Array<{
      title: string;
      description: string;
      details: string;
      image: string;
      imageAlt: string;
    }>;
  };
  contact: {
    eyebrow: string;
    title: string;
    description: string;
    whatsappLabel: string;
    whatsappUrl: string;
    emailLabel: string;
    emailUrl: string;
  };
  footer: {
    description: string;
    instagramUrl: string;
  };
  colors: {
    background: string;
    surface: string;
    ink: string;
    muted: string;
    accent: string;
    sage: string;
    line: string;
    whatsapp: string;
  };
};

const defaultSiteContent: SiteContent = {
  brand: { name: "Marielly Lapreza", shortName: "ML", role: "Psicóloga clínica" },
  seo: {
    title: "Marielly Lapreza | Psicologia clínica online",
    description: "Acolhimento e psicoterapia online para você se escutar com mais calma, clareza e presença."
  },
  navigation: { aboutLabel: "Sobre mim", methodLabel: "Como funciona", contactLabel: "Contato" },
  hero: {
    eyebrow: "Psicologia clínica online",
    title: "Um espaço seguro para você voltar a si.",
    highlight: "voltar a si",
    description: "A psicoterapia pode ser um lugar de pausa, escuta e cuidado — no seu ritmo e com acolhimento de verdade.",
    primaryButtonLabel: "Agendar conversa",
    primaryButtonUrl: "https://wa.me/5511999999999",
    secondaryButtonLabel: "Conhecer meu trabalho",
    image: "/marielly.png",
    imageAlt: "Marielly Lapreza, psicóloga clínica"
  },
  about: {
    eyebrow: "Sobre mim",
    title: "Cuidar da mente também é aprender a se ouvir.",
    paragraphs: [
      "Sou Marielly, psicóloga clínica, e acredito em uma psicoterapia construída com presença, respeito e parceria.",
      "Meu trabalho é oferecer um espaço acolhedor para você compreender o que sente, encontrar novos caminhos e viver com mais leveza."
    ],
    image: "/image_help-01.png",
    imageAlt: "Atendimento de psicoterapia online"
  },
  aboutPage: {
    eyebrow: "Prazer, eu sou a Marielly",
    title: "Uma pessoa inteira por trás da profissional.",
    intro: "Conheça um pouco da minha história, dos valores que me acompanham e do caminho que me trouxe até a psicologia clínica.",
    personalTitle: "Quem existe além do consultório",
    personalParagraphs: [
      "Este espaço é para compartilhar, com a minha própria voz, as experiências, relações e valores que também fazem parte de quem sou.",
      "Aos poucos, vou contar mais sobre a minha vida pessoal e sobre o que me inspira a cuidar de pessoas com presença e sensibilidade."
    ],
    professionalTitle: "Minha trajetória profissional",
    professionalParagraphs: [
      "Sou Marielly, psicóloga clínica, e construo meu trabalho com escuta, acolhimento e respeito pela singularidade de cada história.",
      "Na psicoterapia, ofereço um espaço seguro para compreender o que você sente, encontrar novos caminhos e caminhar no seu ritmo."
    ],
    image: "/marielly.png",
    imageAlt: "Marielly Lapreza, psicóloga clínica"
  },
  method: {
    eyebrow: "Um processo possível",
    title: "Terapia com acolhimento e direção.",
    description: "Cada processo é único. Juntos, vamos construir um caminho que faça sentido para a sua história.",
    cards: [
      { title: "Escuta sem julgamentos", description: "Um espaço para falar com liberdade e ser acolhido como você é.", details: "Na terapia, você encontra um lugar de escuta atenta, sem pressa e sem julgamentos. Falar sobre o que acontece por dentro pode ajudar a organizar sentimentos, reconhecer necessidades e construir uma relação mais cuidadosa consigo.", image: "/image_help-02.png", imageAlt: "Mãos acolhendo durante uma conversa" },
      { title: "Clareza para o presente", description: "Vamos olhar para pensamentos, emoções e comportamentos com mais gentileza.", details: "Juntos, vamos observar pensamentos, emoções e comportamentos que aparecem no seu dia a dia. Com mais clareza, fica possível compreender padrões, fazer escolhas conscientes e encontrar respostas que respeitem o momento que você está vivendo.", image: "/image_help-01.png", imageAlt: "Pessoa em atendimento online" },
      { title: "Mudanças no seu ritmo", description: "Pequenos passos consistentes podem abrir espaço para uma vida mais alinhada.", details: "Cada pessoa tem seu tempo, seus limites e seus recursos. O processo terapêutico não precisa ser uma corrida: ele pode acontecer em passos possíveis, celebrando descobertas e mudanças que façam sentido para a sua realidade.", image: "/marielly.png", imageAlt: "Marielly Lapreza em seu espaço de trabalho" }
    ]
  },
  contact: {
    eyebrow: "Vamos conversar?",
    title: "Seu próximo passo pode começar com uma mensagem.",
    description: "Se você sente que é hora de olhar para si com mais cuidado, estou aqui para te ouvir.",
    whatsappLabel: "Falar pelo WhatsApp",
    whatsappUrl: "https://wa.me/5511999999999",
    emailLabel: "Enviar e-mail",
    emailUrl: "mailto:contato@mariellylapreza.com.br"
  },
  footer: {
    description: "Psicologia clínica online com acolhimento, presença e respeito à sua história.",
    instagramUrl: "https://instagram.com/"
  },
  colors: {
    background: "#F6F2EC", surface: "#E7DED1", ink: "#2D302A", muted: "#687067",
    accent: "#A4752A", sage: "#85927D", line: "#D8CFC3", whatsapp: "#25D366"
  }
};

const contentPath = path.join(process.cwd(), "content", "site-content.json");
const contentBlobPath = "cms/site-content.json";
const textLimit = (value: unknown, fallback: string, max = 500) =>
  typeof value === "string" && value.trim() ? value.trim().slice(0, max) : fallback;
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);
const color = (value: unknown, fallback: string) =>
  typeof value === "string" && /^#[0-9a-fA-F]{6}$/.test(value.trim()) ? value.trim() : fallback;
const safeUrl = (value: unknown, fallback: string, allowMail = false) => {
  if (typeof value !== "string") return fallback;
  const candidate = value.trim();
  const valid = candidate.startsWith("/") || candidate.startsWith("https://") ||
    candidate.startsWith("http://") || (allowMail && (candidate.startsWith("mailto:") || candidate.startsWith("tel:")));
  return valid ? candidate.slice(0, 1000) : fallback;
};

function readParagraphs(value: unknown, fallback: string[], max = 4) {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string").map((item) => item.trim().slice(0, 700)).filter(Boolean).slice(0, max)
    : fallback;
}

function normalizeContent(input: unknown): SiteContent {
  const source = isRecord(input) ? input : {};
  const section = (key: string) => isRecord(source[key]) ? source[key] as Record<string, unknown> : {};
  const brand = section("brand");
  const seo = section("seo");
  const navigation = section("navigation");
  const hero = section("hero");
  const about = section("about");
  const aboutPage = section("aboutPage");
  const method = section("method");
  const contact = section("contact");
  const footer = section("footer");
  const colors = section("colors");
  const paragraphs = readParagraphs(about.paragraphs, defaultSiteContent.about.paragraphs);
  const personalParagraphs = readParagraphs(aboutPage.personalParagraphs, defaultSiteContent.aboutPage.personalParagraphs);
  const professionalParagraphs = readParagraphs(aboutPage.professionalParagraphs, defaultSiteContent.aboutPage.professionalParagraphs);
  const rawCards = Array.isArray(method.cards) ? method.cards : [];
  const cards = rawCards.slice(0, 4).map((rawCard, index) => {
    const card = isRecord(rawCard) ? rawCard : {};
    const fallback = defaultSiteContent.method.cards[index] ?? defaultSiteContent.method.cards[0];
    return {
      title: textLimit(card.title, fallback.title, 100),
      description: textLimit(card.description, fallback.description, 300),
      details: textLimit(card.details, fallback.details, 900),
      image: safeUrl(card.image, fallback.image),
      imageAlt: textLimit(card.imageAlt, fallback.imageAlt, 160)
    };
  });

  return {
    brand: {
      name: textLimit(brand.name, defaultSiteContent.brand.name, 80),
      shortName: textLimit(brand.shortName, defaultSiteContent.brand.shortName, 8),
      role: textLimit(brand.role, defaultSiteContent.brand.role, 80)
    },
    seo: {
      title: textLimit(seo.title, defaultSiteContent.seo.title, 150),
      description: textLimit(seo.description, defaultSiteContent.seo.description, 250)
    },
    navigation: {
      aboutLabel: textLimit(navigation.aboutLabel, defaultSiteContent.navigation.aboutLabel, 40),
      methodLabel: textLimit(navigation.methodLabel, defaultSiteContent.navigation.methodLabel, 40),
      contactLabel: textLimit(navigation.contactLabel, defaultSiteContent.navigation.contactLabel, 40)
    },
    hero: {
      eyebrow: textLimit(hero.eyebrow, defaultSiteContent.hero.eyebrow, 80),
      title: textLimit(hero.title, defaultSiteContent.hero.title, 180),
      highlight: textLimit(hero.highlight, defaultSiteContent.hero.highlight, 80),
      description: textLimit(hero.description, defaultSiteContent.hero.description, 350),
      primaryButtonLabel: textLimit(hero.primaryButtonLabel, defaultSiteContent.hero.primaryButtonLabel, 50),
      primaryButtonUrl: safeUrl(hero.primaryButtonUrl, defaultSiteContent.hero.primaryButtonUrl, true),
      secondaryButtonLabel: textLimit(hero.secondaryButtonLabel, defaultSiteContent.hero.secondaryButtonLabel, 60),
      image: safeUrl(hero.image, defaultSiteContent.hero.image),
      imageAlt: textLimit(hero.imageAlt, defaultSiteContent.hero.imageAlt, 160)
    },
    about: {
      eyebrow: textLimit(about.eyebrow, defaultSiteContent.about.eyebrow, 80),
      title: textLimit(about.title, defaultSiteContent.about.title, 180),
      paragraphs: paragraphs.length ? paragraphs : defaultSiteContent.about.paragraphs,
      image: safeUrl(about.image, defaultSiteContent.about.image),
      imageAlt: textLimit(about.imageAlt, defaultSiteContent.about.imageAlt, 160)
    },
    aboutPage: {
      eyebrow: textLimit(aboutPage.eyebrow, defaultSiteContent.aboutPage.eyebrow, 80),
      title: textLimit(aboutPage.title, defaultSiteContent.aboutPage.title, 180),
      intro: textLimit(aboutPage.intro, defaultSiteContent.aboutPage.intro, 450),
      personalTitle: textLimit(aboutPage.personalTitle, defaultSiteContent.aboutPage.personalTitle, 160),
      personalParagraphs: personalParagraphs.length ? personalParagraphs : defaultSiteContent.aboutPage.personalParagraphs,
      professionalTitle: textLimit(aboutPage.professionalTitle, defaultSiteContent.aboutPage.professionalTitle, 160),
      professionalParagraphs: professionalParagraphs.length ? professionalParagraphs : defaultSiteContent.aboutPage.professionalParagraphs,
      image: safeUrl(aboutPage.image, defaultSiteContent.aboutPage.image),
      imageAlt: textLimit(aboutPage.imageAlt, defaultSiteContent.aboutPage.imageAlt, 160)
    },
    method: {
      eyebrow: textLimit(method.eyebrow, defaultSiteContent.method.eyebrow, 80),
      title: textLimit(method.title, defaultSiteContent.method.title, 180),
      description: textLimit(method.description, defaultSiteContent.method.description, 350),
      cards: cards.length ? cards : defaultSiteContent.method.cards
    },
    contact: {
      eyebrow: textLimit(contact.eyebrow, defaultSiteContent.contact.eyebrow, 80),
      title: textLimit(contact.title, defaultSiteContent.contact.title, 180),
      description: textLimit(contact.description, defaultSiteContent.contact.description, 350),
      whatsappLabel: textLimit(contact.whatsappLabel, defaultSiteContent.contact.whatsappLabel, 50),
      whatsappUrl: safeUrl(contact.whatsappUrl, defaultSiteContent.contact.whatsappUrl, true),
      emailLabel: textLimit(contact.emailLabel, defaultSiteContent.contact.emailLabel, 50),
      emailUrl: safeUrl(contact.emailUrl, defaultSiteContent.contact.emailUrl, true)
    },
    footer: {
      description: textLimit(footer.description, defaultSiteContent.footer.description, 250),
      instagramUrl: safeUrl(footer.instagramUrl, defaultSiteContent.footer.instagramUrl)
    },
    colors: {
      background: color(colors.background, defaultSiteContent.colors.background),
      surface: color(colors.surface, defaultSiteContent.colors.surface),
      ink: color(colors.ink, defaultSiteContent.colors.ink),
      muted: color(colors.muted, defaultSiteContent.colors.muted),
      accent: color(colors.accent, defaultSiteContent.colors.accent),
      sage: color(colors.sage, defaultSiteContent.colors.sage),
      line: color(colors.line, defaultSiteContent.colors.line),
      whatsapp: color(colors.whatsapp, defaultSiteContent.colors.whatsapp)
    }
  };
}

export async function getSiteContent(): Promise<SiteContent> {
  if (hasBlobStorage()) {
    try {
      const blob = await readPublicBlob(contentBlobPath);
      if (blob) return normalizeContent(JSON.parse(blob.text));
    } catch {
      // Keep the bundled content available if Blob is temporarily unreachable.
    }
  }

  try {
    const file = await fs.readFile(contentPath, "utf8");
    return normalizeContent(JSON.parse(file));
  } catch {
    return defaultSiteContent;
  }
}

export async function saveSiteContent(input: unknown): Promise<SiteContent> {
  const nextContent = normalizeContent(input);
  assertProductionStorage();

  if (hasBlobStorage()) {
    await writePublicBlob(contentBlobPath, `${JSON.stringify(nextContent, null, 2)}\n`);
    return nextContent;
  }

  await fs.mkdir(path.dirname(contentPath), { recursive: true });
  const temporaryPath = `${contentPath}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(nextContent, null, 2)}\n`, { encoding: "utf8", mode: 0o600 });
  await fs.rename(temporaryPath, contentPath);
  return nextContent;
}
