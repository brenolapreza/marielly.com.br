import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

const geistSans = Raleway({
  variable: "--font-raleway-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Marielly Lapreza",
  description: "Psicóloga - Atendimento psicóloga online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
    </html>
  );
}
