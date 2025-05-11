import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";
import { Header } from "./ui/components/header";

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
      <body className={`${geistSans.variable} antialiased scroll-smooth`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
