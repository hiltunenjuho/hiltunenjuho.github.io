import { useLayoutEffect, useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent, ReactNode } from "react";
import { useSitePreferences } from "../sitePreferences";

interface CardCarouselProps {
  id: string;
  label: string;
  cards: ReactNode[];
}

export function CardCarousel({ id, label, cards }: CardCarouselProps) {
  const { locale } = useSitePreferences();
  const isFinnish = locale === "fi";
  const [activeIndex, setActiveIndex] = useState(0);
  const [viewportHeight, setViewportHeight] = useState<number>();
  const activeCardRef = useRef<HTMLElement | null>(null);
  const pointerStart = useRef<{ id: number; x: number; y: number } | null>(null);
  const cardWidthPercent = 100 / cards.length;
  const trackId = `${id}CardTrack`;

  useLayoutEffect(() => {
    const activeCard = activeCardRef.current;
    if (!activeCard) {
      return;
    }

    const updateHeight = () => {
      setViewportHeight(activeCard.getBoundingClientRect().height);
    };

    updateHeight();
    const resizeObserver = new ResizeObserver(updateHeight);
    resizeObserver.observe(activeCard);
    return () => resizeObserver.disconnect();
  }, [activeIndex]);

  function moveToCard(index: number) {
    if (index < 0 || index >= cards.length) {
      return;
    }
    setActiveIndex(index);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      moveToCard(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      moveToCard(activeIndex + 1);
    }
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    if (!event.isPrimary || event.button !== 0) {
      return;
    }
    pointerStart.current = {
      id: event.pointerId,
      x: event.clientX,
      y: event.clientY,
    };
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    const start = pointerStart.current;
    if (!start || event.pointerId !== start.id) {
      return;
    }

    const distanceX = event.clientX - start.x;
    const distanceY = event.clientY - start.y;
    pointerStart.current = null;
    if (Math.abs(distanceX) < 50 || Math.abs(distanceX) <= Math.abs(distanceY) * 1.2) {
      return;
    }

    moveToCard(activeIndex + (distanceX < 0 ? 1 : -1));
  }

  function handlePointerCancel(event: PointerEvent<HTMLDivElement>) {
    if (pointerStart.current?.id === event.pointerId) {
      pointerStart.current = null;
    }
  }

  return (
    <div
      className="aboutCarousel cardCarousel"
      id={id}
      role="region"
      aria-roledescription={isFinnish ? "karuselli" : "carousel"}
      aria-label={label}
    >
      <div
        className="aboutCardControls cardCarouselControls"
        role="group"
        aria-label={isFinnish ? "Korttien selaus" : "Card navigation"}
      >
        <div className="cardCarouselArrowControls">
          <button
            className="aboutCardButton cardCarouselButton"
            type="button"
            aria-label={isFinnish ? "Edellinen kortti" : "Previous card"}
            aria-controls={trackId}
            aria-disabled={activeIndex === 0}
            disabled={activeIndex === 0}
            onClick={() => moveToCard(activeIndex - 1)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              chevron_backward
            </span>
          </button>
          <button
            className="aboutCardButton cardCarouselButton"
            type="button"
            aria-label={isFinnish ? "Seuraava kortti" : "Next card"}
            aria-controls={trackId}
            aria-disabled={activeIndex === cards.length - 1}
            disabled={activeIndex === cards.length - 1}
            onClick={() => moveToCard(activeIndex + 1)}
          >
            <span className="material-symbols-outlined" aria-hidden="true">
              chevron_forward
            </span>
          </button>
        </div>
        <div
          className="cardCarouselIndicators"
          role="group"
          aria-label={isFinnish ? "Valitse kortti" : "Choose a card"}
        >
          {cards.map((_, index) => (
            <button
              className={`cardCarouselIndicator${index === activeIndex ? " active" : ""}`}
              key={index}
              type="button"
              aria-label={
                isFinnish
                  ? `Näytä kortti ${index + 1}`
                  : `Show card ${index + 1}`
              }
              aria-current={index === activeIndex ? "true" : undefined}
              aria-controls={trackId}
              onClick={() => moveToCard(index)}
            />
          ))}
        </div>
        <span className="cardCarouselStatus" aria-live="polite">
          {activeIndex + 1} / {cards.length}
        </span>
      </div>
      <div
        className="aboutCardViewport cardCarouselViewport"
        tabIndex={0}
        aria-label={
          isFinnish
            ? "Selaa kortteja nuolinäppäimillä tai pyyhkäisemällä."
            : "Use the arrow keys or swipe to browse the cards."
        }
        style={viewportHeight ? { height: `${viewportHeight}px` } : undefined}
        onKeyDown={handleKeyDown}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
      >
        <div
          className="aboutCardTrack cardCarouselTrack"
          id={trackId}
          style={{
            width: `${cards.length * 100}%`,
            transform: `translateX(-${activeIndex * cardWidthPercent}%)`,
          }}
        >
          {cards.map((card, index) => (
            <article
              className="sectionContainer aboutCard cardCarouselCard"
              key={index}
              ref={index === activeIndex ? activeCardRef : undefined}
              aria-roledescription="slide"
              aria-label={
                isFinnish ? `${index + 1} / ${cards.length}` : `${index + 1} of ${cards.length}`
              }
              aria-hidden={index !== activeIndex}
              style={{ flexBasis: `${cardWidthPercent}%` }}
            >
              {card}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
