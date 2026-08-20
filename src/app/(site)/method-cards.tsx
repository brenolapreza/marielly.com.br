"use client";

/* eslint-disable @next/next/no-img-element */
import { useEffect, useRef, useState } from "react";
import type { SiteContent } from "../lib/content";

export function MethodCards({ cards }: { cards: SiteContent["method"]["cards"] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (activeIndex === null) return;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveIndex(null);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeIndex]);

  const activeCard = activeIndex === null ? null : cards[activeIndex];

  return (
    <>
      <div className="method-cards">
        {cards.map((card, index) => (
          <article className="method-card" key={`${card.title}-${index}`}>
            <div className="card-image"><img src={card.image} alt={card.imageAlt} loading="lazy" /></div>
            <div className="card-body">
              <span className="card-number">0{index + 1}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <button className="card-more" type="button" onClick={() => setActiveIndex(index)} aria-haspopup="dialog">
                Entenda este passo <span aria-hidden="true">↗</span>
              </button>
              <div className="method-card-seo-copy" aria-hidden="true"><p>{card.details}</p></div>
            </div>
          </article>
        ))}
      </div>

      {activeCard && (
        <div className="method-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveIndex(null); }}>
          <section className="method-modal" role="dialog" aria-modal="true" aria-labelledby="method-modal-title" tabIndex={-1}>
            <button ref={closeButtonRef} className="method-modal-close" type="button" onClick={() => setActiveIndex(null)} aria-label="Fechar explicação">×</button>
            <span className="card-number">0{(activeIndex ?? 0) + 1} / como funciona</span>
            <h2 id="method-modal-title">{activeCard.title}</h2>
            <p className="method-modal-lead">{activeCard.description}</p>
            <p>{activeCard.details}</p>
            <button className="button button-primary method-modal-action" type="button" onClick={() => setActiveIndex(null)}>Voltar aos passos <span aria-hidden="true">↓</span></button>
          </section>
        </div>
      )}
    </>
  );
}
