import { env } from "@/env";
import { Button } from "@/presentation/components/button";
import { Whatsapp } from "@/presentation/components/whatsapp";
import Image from "next/image";
import type { Sections } from "../(private)/content/page";

// ✅ Note: precisa ser async se você usa `await fetch()`
export default async function Home() {
  const res = await fetch(`${env.URL}/api/`, {
    method: "GET",
  });
  const sections = await res.json();
  return (
    <>
      <main className="">
        {sections.map((section: Sections) => {
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
                      {section.content.map((p, index) => (
                        <p
                          key={index}
                          className="text-primary"
                          dangerouslySetInnerHTML={{ __html: p }}
                        />
                      ))}
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
