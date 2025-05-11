export type Section = {
  section: number;
  title?: string;
  subtitle?: string;
  content?: string | string[];
  button?: { content: string; link?: string };
  cards?: { content: string; image: string }[];
  buttons?: { content: string; link: string; type?: "whatsapp" | "email" }[];
};
