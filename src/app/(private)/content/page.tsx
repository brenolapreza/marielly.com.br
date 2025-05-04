"use client";

import { Button } from "@/presentation/components/button";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

type FormValues = {
  sections: {
    section: number;
    title?: string;
    subtitle?: string;
    content: string[];
    image?: string;
    button?: { link: string; content: string };
    cards?: { image: string; content: string }[];
    buttons?: { type: string; link: string; content: string }[];
  }[];
};

export default function ContentManager() {
  const [loading, setLoading] = useState(true);
  const [savedData, setSavedData] = useState<FormValues | null>(null);

  const { register, control, handleSubmit, reset } = useForm<FormValues>();

  const { fields } = useFieldArray({
    control,
    name: "sections",
  });

  useEffect(() => {
    fetch("/api")
      .then((res) => res.json())
      .then((data) => {
        reset({
          sections: data.map((section: any) => ({
            section: section.section,
            title: section.title || "",
            subtitle: section.subtitle || "",
            content: Array.isArray(section.content)
              ? section.content
              : [section.content],
            image: section.image || "",
            button: section.button || undefined,
            cards: section.cards || [],
            buttons: section.buttons || [],
          })),
        });
        setLoading(false);
      });
  }, [reset]);

  const onSubmit = async (data: FormValues) => {
    const res = await fetch("/api", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setSavedData(data);
      alert("Conteúdo salvo com sucesso!");
    } else {
      alert("Erro ao salvar o conteúdo.");
    }
  };

  if (loading) {
    return <p className="text-center mt-20">Carregando conteúdo...</p>;
  }

  return (
    <div className="mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Gerenciar Conteúdo do Site</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        {fields.map((field, index) => (
          <div
            key={field.id}
            className="border border-gray-300 rounded-xl p-6 flex flex-col gap-4 bg-white shadow-md"
          >
            <label className="font-semibold">Seção</label>
            <input
              {...register(`sections.${index}.section`)}
              className="border p-2 rounded-md w-full"
              type="number"
            />

            <label className="font-semibold">Título</label>
            <input
              {...register(`sections.${index}.title`)}
              className="border p-2 rounded-md w-full"
            />

            <label className="font-semibold">Subtítulo</label>
            <textarea
              {...register(`sections.${index}.subtitle`)}
              className="border p-2 rounded-md w-full"
            />

            <label className="font-semibold">Texto principal</label>
            <textarea
              {...register(`sections.${index}.content.0`)}
              className="border p-2 rounded-md w-full"
            />

            <label className="font-semibold">Imagem</label>
            <input
              {...register(`sections.${index}.image`)}
              className="border p-2 rounded-md w-full"
            />

            <label className="font-semibold">Cards</label>
            {field.cards?.map((_, cardIndex) => (
              <div key={cardIndex} className="flex flex-col gap-2">
                <input
                  {...register(`sections.${index}.cards.${cardIndex}.image`)}
                  placeholder="Imagem do card"
                  className="border p-2 rounded-md w-full"
                />
                <textarea
                  {...register(`sections.${index}.cards.${cardIndex}.content`)}
                  placeholder="Conteúdo do card"
                  className="border p-2 rounded-md w-full"
                />
              </div>
            ))}

            <label className="font-semibold">Botões</label>
            {field.buttons?.map((_, buttonIndex) => (
              <div key={buttonIndex} className="flex flex-col gap-2">
                <input
                  {...register(
                    `sections.${index}.buttons.${buttonIndex}.content`
                  )}
                  placeholder="Conteúdo do botão"
                  className="border p-2 rounded-md w-full"
                />
                <input
                  {...register(`sections.${index}.buttons.${buttonIndex}.link`)}
                  placeholder="Link do botão"
                  className="border p-2 rounded-md w-full"
                />
                <input
                  {...register(`sections.${index}.buttons.${buttonIndex}.type`)}
                  placeholder="Tipo de botão (whatsapp, email, etc.)"
                  className="border p-2 rounded-md w-full"
                />
              </div>
            ))}
          </div>
        ))}

        <Button>Salvar conteúdo</Button>
      </form>

      {savedData && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Prévia do conteúdo salvo</h2>
          {savedData.sections.map((section, i) => (
            <div key={i} className="mb-6 border-t pt-4">
              <h3 className="text-xl font-bold">{section.title}</h3>
              <p className="text-gray-700">{section.subtitle}</p>
              {section.content.map((content, idx) => (
                <p key={idx} dangerouslySetInnerHTML={{ __html: content }} />
              ))}
              {section.image && (
                <>
                  <p className="font-semibold mt-2">Imagem:</p>
                  <Image src={section.image} alt="img" className="w-64" />
                </>
              )}
              <div className="mt-4 flex gap-4 flex-wrap">
                {section.buttons?.map((btn, idx) => (
                  <a
                    key={idx}
                    href={btn.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-6 py-3 rounded-lg font-semibold transition ${
                      btn.type === "whatsapp"
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {btn.content}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
