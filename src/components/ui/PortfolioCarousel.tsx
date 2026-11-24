import { useRef, useState } from 'react';
import type { PortfolioMedia } from '../../data';

export default function PortfolioCarousel({ slides, title, mediaClass }: {
  slides: PortfolioMedia[];
  title: string;
  mediaClass: string;
}) {
  const [index, setIndex] = useState(0);
  const touch = useRef<{ x: number; y: number } | null>(null);
  const slide = slides[index];
  if (!slide) return null;

  function step(offset: number) {
    setIndex(current => Math.max(0, Math.min(slides.length - 1, current + offset)));
  }

  return (
    <div className="relative h-full w-full touch-pan-y" aria-label={`Media ${title}`}
      onTouchStart={event => {
        const point = event.touches[0];
        touch.current = point && event.touches.length === 1 ? { x: point.clientX, y: point.clientY } : null;
      }}
      onTouchCancel={() => { touch.current = null; }}
      onTouchEnd={event => {
        const start = touch.current;
        touch.current = null;
        if (!start || slides.length < 2) return;
        const point = event.changedTouches[0];
        if (!point) return;
        const distance = point.clientX - start.x;
        if (Math.abs(distance) > 40 && Math.abs(distance) > Math.abs(point.clientY - start.y)) {
          step(distance < 0 ? 1 : -1);
        }
      }}>
      {slide.type === 'video'
        ? <video key={slide.url} src={slide.url} className={mediaClass} controls autoPlay muted loop playsInline />
        : <img src={slide.url} alt={title} className={mediaClass} />}
      {slides.length > 1 && (
        <div className="absolute top-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-3 rounded-full bg-black/80 px-2 text-white">
          <button type="button" aria-label="Media sebelumnya" className="size-11 disabled:opacity-40" disabled={index === 0} onClick={() => step(-1)}>←</button>
          <span aria-live="polite" className="whitespace-nowrap">{index + 1} / {slides.length}</span>
          <button type="button" aria-label="Media berikutnya" className="size-11 disabled:opacity-40" disabled={index === slides.length - 1} onClick={() => step(1)}>→</button>
        </div>
      )}
    </div>
  );
}
