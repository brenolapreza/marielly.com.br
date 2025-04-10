import { Button } from "@/components/button";
import { Header } from "@/components/header";
import Image from "next/image";

export default function Home() {
  return (
    <main>
      <Header />
      <section className="w-full container h-screen flex flex-col md:flex-row gap-2 justify-center md:h-auto md:justify-between md:py-16">
        <div className="flex flex-col gap-2 items-center md:items-start">
          <h1 className="font-black text-tertiary text-4xl text-center md:text-start">
            Olá, muito prazer!
          </h1>
          <h2 className="font-light text-2xl text-center  md:text-start">
            Me chamo Marielly, sou psicóloga e minha missão é ser uma
            facilitadora no seu processo de autoconhecimento e transformação
            pessoal.{" "}
          </h2>
          <h3 className="font-light">Atendimento psicóloga online</h3>
          <Button>Conhecer</Button>
        </div>
        <div className="flex flex-col gap-2 items-center">
          <Image
            alt="Foto Marielly"
            src="/marielly-main.svg"
            width={800}
            height={800}
          />
        </div>
      </section>
    </main>
  );
}
