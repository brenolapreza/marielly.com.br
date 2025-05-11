/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { n2m } from "./lib/notion";
import type { Section } from "./lib/notion/types";
import { Button } from "./ui/components/button";
import { Whatsapp } from "./ui/components/whatsapp";
import type { Key } from "react";

export default async function Home() {
  const mdBlocks = await n2m.pageToMarkdown(
    "1f0d872b-594c-80ab-acb1-0037ce171424"
  );
  const mdString = n2m.toMarkdownString(mdBlocks);

  function parseMarkdownToSections(markdown: string): Section[] {
    const sections = markdown.split(/^---$/m); // separa pelas linhas '---'

    return sections.map((rawSection) => {
      const section: Section = {
        section: 0,
      };

      const sectionNumber = rawSection.match(/# Seção (\d+)/);
      if (sectionNumber) section.section = Number(sectionNumber[1]);

      const title = rawSection.match(/\*\*Título:\*\* (.+)/);
      if (title) section.title = title[1].trim();

      const subtitle = rawSection.match(/\*\*Subtítulo:\*\* (.+)/);
      if (subtitle) section.subtitle = subtitle[1].trim();

      const button = rawSection.match(/\[\*\*(.+?)\*\*\]\((https?:\/\/.+?)\)/);
      if (button) {
        section.button = {
          content: button[1],
          link: button[2],
        };
      }

      const contentMatches = [...rawSection.matchAll(/\d+\. (.+)/g)];
      if (contentMatches.length > 0) {
        section.content = contentMatches.map((m) => m[1]);
      } else {
        const contentText = rawSection.match(
          /\*\*Conteúdo:\*\*([\s\S]+?)(?:\[|\n#|$)/
        );
        if (contentText) section.content = contentText[1].trim();
      }

      if (section.section === 3) {
        const cards = [
          ...rawSection.matchAll(
            /!\[.*\]\((.+?)\)[\s\S]+?\*\*Conteúdo:\*\* (.+)/g
          ),
        ];
        section.cards = cards.map(([, image, content]) => ({
          image,
          content: content.trim(),
        }));
      }

      if (section.section === 5) {
        const buttons = [
          ...rawSection.matchAll(
            /\[\*\*(.+?)\*\*\]\((mailto:|https:\/\/wa\.me)(.+?)\)/g
          ),
        ];
        section.buttons = buttons.map(
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          ([_, content, typePrefix, linkSuffix]) => ({
            content,
            link: `${typePrefix}${linkSuffix}`,
            type: typePrefix.includes("wa.me") ? "whatsapp" : "email",
          })
        );
      }

      return section;
    });
  }

  const sections = parseMarkdownToSections(mdString.parent);
  return (
    <>
      <main className="">
        {sections.map((section: Section) => {
          switch (section.section) {
            case 1:
              return (
                <section
                  id="home"
                  key={section.section}
                  className="w-full container flex flex-col md:flex-row md:gap-2 gap-8 justify-center md:justify-between pt-8 md:pt-16"
                >
                  <div className="flex flex-col gap-4 md:gap-2 items-center md:items-start">
                    <h1 className="font-black text-tertiary text-4xl text-center md:text-start">
                      {section.title}
                    </h1>
                    <h2 className="font-light text-2xl text-center md:text-start">
                      {section.subtitle}
                    </h2>
                    <h3 className="font-light">{section.content}</h3>
                    <Button>{section?.button?.content}</Button>
                  </div>
                  <Image
                    alt="Foto Marielly"
                    src="/marielly.png"
                    width={400}
                    height={400}
                  />
                </section>
              );

            case 2:
            case 4:
              return (
                <section key={section.section} className="bg-secondary">
                  <div className="w-full container flex flex-col md:flex-row md:gap-8 gap-8 justify-center md:justify-between py-8 px-0 md:py-16">
                    {section.section === 2 && (
                      <Image
                        alt="Foto Marielly"
                        src="/marielly-secoundary.svg"
                        width={400}
                        height={400}
                      />
                    )}
                    <div className="flex flex-col gap-4 md:gap-2 items-center">
                      {Array.isArray(section?.content) ? (
                        section.content.map(
                          (p: any, index: Key | null | undefined) => (
                            <p
                              key={index}
                              className="text-primary"
                              dangerouslySetInnerHTML={{ __html: p }}
                            />
                          )
                        )
                      ) : (
                        <p
                          className="text-primary"
                          dangerouslySetInnerHTML={{
                            __html: section?.content || "",
                          }}
                        />
                      )}
                    </div>
                  </div>
                </section>
              );

            case 3:
              return (
                <section
                  key={section.section}
                  id="terapia"
                  className="bg-primary"
                >
                  <div className="w-full container flex flex-col md:gap-8 gap-8 justify-center items-center md:justify-center py-8 px-0 md:py-16">
                    <h2 className="text-4xl text-center text-tertiary">
                      {section.title}
                    </h2>
                    <p className="text-[20px] text-center text-tertiary">
                      {section.subtitle}
                    </p>
                    <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
                      {section.cards &&
                        section?.cards.map((card, i) => (
                          <div
                            key={i}
                            className="flex flex-col w-[320px] items-center"
                          >
                            <Image
                              alt="Foto Marielly"
                              src={card.image}
                              className="w-full"
                              width={350}
                              height={230}
                            />
                            <div className="bg-secondary p-4 h-full">
                              <span className="text-primary">
                                {card.content}
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                    <Button>{section?.button?.content}</Button>
                  </div>
                </section>
              );

            case 5:
              return (
                <section
                  id="contato"
                  key={section.section}
                  className="bg-tertiary/10 py-16 px-4 text-center"
                >
                  <div className="max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold text-tertiary mb-4">
                      {section.title}
                    </h2>
                    <p className="text-lg text-tertiary mb-6">
                      {section.subtitle}
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                      {section.buttons &&
                        section?.buttons.map((btn, idx) => (
                          <a
                            key={idx}
                            href={btn.link}
                            target={btn.type === "email" ? undefined : "_blank"}
                            rel="noopener noreferrer"
                            className={`px-6 py-3 rounded-lg font-semibold transition ${
                              btn.type === "whatsapp"
                                ? "bg-secondary text-white hover:bg-secondary/70"
                                : "bg-tertiary text-white hover:bg-tertiary/70"
                            }`}
                          >
                            {btn.content}
                          </a>
                        ))}
                    </div>
                  </div>
                </section>
              );

            case 6:
              return (
                <section
                  key={section.section}
                  className="w-full container flex flex-col md:flex-row md:gap-12 gap-8 justify-center md:justify-between pt-8 md:pt-16"
                >
                  <Image
                    alt="Foto Marielly"
                    src="/marielly.png"
                    width={400}
                    height={400}
                  />
                  <div className="flex flex-col gap-4 md:gap-2 items-center md:items-start">
                    <h2 className="font-light text-2xl text-center md:text-start">
                      {section.subtitle}
                    </h2>
                    <h3 className="font-light">{section.content}</h3>
                    <div className="pb-8">
                      <Button>{section?.button?.content}</Button>
                    </div>
                  </div>
                </section>
              );

            default:
              return null;
          }
        })}
      </main>
      <Whatsapp />
    </>
  );
}
