import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import ProtectedImage from "./ProtectedImage";
type Photo = { src: string; thumb: string; alt: string; caption: string };
export default function Gallery({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [slide, setSlide] = useState(0);
  const [closing, setClosing] = useState(false);
  const closingRef = useRef(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStart = useRef<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const previousOverflow = useRef("");
  function close() {
    if (closingRef.current || !dialog.current?.open) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.current.close();
      return;
    }
    closingRef.current = true;
    setClosing(true);
    // Fallback if an animation is interrupted or styles have not loaded.
    closeTimer.current = setTimeout(() => dialog.current?.close(), 260);
  }
  useEffect(() => {
    if (active === null) return;
    const element = dialog.current!;
    if (!element.open) {
      previousOverflow.current = document.body.style.overflow;
      element.showModal();
      document.body.style.overflow = "hidden";
    }
  }, [active]);
  useEffect(
    () => () => {
      document.body.style.overflow = previousOverflow.current;
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );
  function step(direction: number) {
    if (closingRef.current) return;
    setActive((index) =>
      index === null
        ? null
        : (index + direction + photos.length) % photos.length,
    );
  }
  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === "Tab") {
      const buttons =
        event.currentTarget.querySelectorAll<HTMLButtonElement>("button");
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      step(1);
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      step(-1);
    }
  }
  const photo = active === null ? null : photos[active];
  return (
    <div
      className="gallery"
      role="region"
      aria-roledescription="carousel"
      aria-label="Personal photography"
    >
      <div
        className="carousel-viewport"
        onTouchStart={(event) => {
          touchStart.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          const end = event.changedTouches[0]?.clientX;
          if (
            touchStart.current !== null &&
            end !== undefined &&
            Math.abs(touchStart.current - end) > 45
          ) {
            setSlide(
              (index) =>
                (index + (touchStart.current! > end ? 1 : -1) + photos.length) %
                photos.length,
            );
          }
          touchStart.current = null;
        }}
      >
        <div
          className="gallery-grid"
          style={{ transform: `translateX(-${slide * 100}%)` }}
        >
          {photos.map((photo, index) => (
            <div
              className="carousel-slide"
              key={photo.src}
              inert={slide !== index}
              aria-hidden={slide !== index}
            >
              <button
                className="photo-button"
                type="button"
                key={photo.src}
                aria-label={`Enlarge photograph ${index + 1}: ${photo.caption}. © Ojesvi Dogra · All rights reserved`}
                onClick={(event) => {
                  opener.current = event.currentTarget;
                  setActive(index);
                }}
              >
                <ProtectedImage
                  src={photo.thumb}
                  alt={photo.alt}
                  width="500"
                  height="360"
                  loading="lazy"
                />
                <span className="enlarge-indicator" aria-hidden="true">
                  ↗
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="carousel-controls">
        <button
          type="button"
          aria-label="Previous carousel image"
          onClick={() =>
            setSlide((index) => (index - 1 + photos.length) % photos.length)
          }
        >
          ←
        </button>
        <div
          className="carousel-dots"
          role="group"
          aria-label="Choose a photograph"
        >
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              aria-label={`Show photograph ${index + 1}: ${photo.caption}`}
              aria-pressed={slide === index}
              onClick={() => setSlide(index)}
            >
              <span />
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Next carousel image"
          onClick={() => setSlide((index) => (index + 1) % photos.length)}
        >
          →
        </button>
      </div>
      <p role="status" className="carousel-caption">
        {photos[slide]?.caption} · {slide + 1} / {photos.length}
      </p>
      <p className="muted small">
        Through my lens · Select a photograph to explore
      </p>
      <dialog
        ref={dialog}
        className={`lightbox${closing ? " is-closing" : ""}`}
        aria-label="Photography viewer"
        onCancel={(event) => {
          event.preventDefault();
          close();
        }}
        onClose={() => {
          if (closeTimer.current) clearTimeout(closeTimer.current);
          closingRef.current = false;
          setClosing(false);
          setActive(null);
          document.body.style.overflow = previousOverflow.current;
          opener.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
        onKeyDown={handleKeyDown}
      >
        <div
          className="lightbox-inner"
          onAnimationEnd={(event) => {
            if (event.target === event.currentTarget && closingRef.current)
              dialog.current?.close();
          }}
        >
          <button
            className="lightbox-close"
            type="button"
            onClick={close}
            aria-label="Close photography viewer"
            autoFocus
          >
            ×
          </button>
          {photo && (
            <>
              <ProtectedImage key={photo.src} src={photo.src} alt={photo.alt} />
              <div className="lightbox-footer">
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photograph"
                >
                  ←
                </button>
                <p aria-live="polite">
                  {photo.caption}{" "}
                  <span>
                    · {(active ?? 0) + 1} / {photos.length}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photograph"
                >
                  →
                </button>
              </div>
            </>
          )}
        </div>
      </dialog>
    </div>
  );
}
