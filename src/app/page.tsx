import { Button } from "@/components/button";
import { Header } from "@/components/header";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Header />
      <section className="w-full container flex flex-col md:flex-row md:gap-2 gap-8 justify-center md:justify-between pt-8 md:pt-16">
        <div className="flex flex-col gap-4 md:gap-2 items-center md:items-start">
          <h1 className="font-black text-tertiary text-4xl text-center md:text-start">
            Olá, muito prazer!
          </h1>
          <h2 className="font-light text-2xl text-center  md:text-start">
            Me chamo Marielly, sou psicóloga e minha missão é ser uma
            facilitadora no seu processo de autoconhecimento e transformação
            pessoal.
          </h2>
          <h3 className="font-light">Atendimento psicóloga online</h3>
          <Button>Conhecer</Button>
        </div>

        <Image
          alt="Foto Marielly"
          src="/marielly.png"
          width={400}
          height={400}
        />
      </section>
      <section className="bg-secondary">
        <div className="w-full container flex flex-col md:flex-row md:gap-8 gap-8 justify-center md:justify-between p-8 md:py-16">
          <Image
            alt="Foto Marielly"
            src="/marielly-secoundary.svg"
            width={400}
            height={400}
          />
          <div className="flex flex-col gap-4 md:gap-2 items-center">
            <p className="text-primary">
              Trabalho com a abordagem da Terapia Cognitivo-Comportamental
              (TCC), que busca identificar e modificar pensamentos e crenças
              disfuncionais que podem estar impactando sua vida, gerando
              comportamentos prejudiciais ou emoções intensas como ansiedade,
              depressão e estresse.
            </p>
            <p className="text-primary">
              Meu objetivo é oferecer um atendimento humanizado, com uma escuta
              empática e sem julgamentos, proporcionando acolhimento e suporte
              psicológico necessário para que, juntas, possamos encontrar as
              melhores estratégias para superar as dificuldades que te afligem e
              promover mais clareza, equilíbrio e qualidade de vida.
            </p>
            <p className="text-primary">
              <strong>
                Se você busca apoio psicológico ou quer saber mais sobre meu
                trabalho, entre em contato. Vamos juntas nesse processo de
                transformação!
              </strong>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
