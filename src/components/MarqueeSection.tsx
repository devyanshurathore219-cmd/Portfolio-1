import React, { useRef, useEffect } from 'react';

/*
  Website template showreel.

  To add a template: drop the .mp4 (or .webm) into public/assets/videos/
  and add its path to the list below. Everything else (row split, tiling,
  play/pause on scroll) adapts automatically to however many entries exist.

  Recording tips: 16:9 or wider, no audio track needed, keep each file
  under ~3 MB so the row stays smooth on mobile.
*/
const TEMPLATE_VIDEOS: string[] = [
  'assets/videos/template-01.mp4',
  'assets/videos/template-02.mp4',
  'assets/videos/template-03.mp4',
  'assets/videos/template-04.mp4',
  'assets/videos/template-05.mp4',
  'assets/videos/template-06.mp4',
];

// Tiles are 480px wide; a row needs enough of them to cover a wide screen
// plus the parallax travel, so short lists get repeated.
const MIN_TILES_PER_ROW = 12;

const fillRow = (sources: string[]): string[] => {
  if (sources.length === 0) return [];
  const reps = Math.max(3, Math.ceil(MIN_TILES_PER_ROW / sources.length));
  return Array.from(
    { length: reps * sources.length },
    (_, i) => sources[i % sources.length]
  );
};

const half = Math.ceil(TEMPLATE_VIDEOS.length / 2);
// With a single video both rows reuse it; with more, each row gets its own half.
const ROW1_SOURCES = TEMPLATE_VIDEOS.slice(0, half);
const ROW2_SOURCES =
  TEMPLATE_VIDEOS.length > half ? TEMPLATE_VIDEOS.slice(half) : TEMPLATE_VIDEOS;

const ROW1_TILES = fillRow(ROW1_SOURCES);
const ROW2_TILES = fillRow(ROW2_SOURCES);

/*
  A row can hold 30+ tiles, and decoding that many videos at once will stall
  the scroll. Each tile only plays while it is actually near the viewport
  (horizontally as well as vertically) and pauses the moment it leaves.
*/
const MarqueeVideo: React.FC<{ src: string }> = ({ src }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;

    // Fallback for environments without IntersectionObserver.
    if (typeof IntersectionObserver === 'undefined') {
      void el.play().catch(() => {});
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // play() rejects if the browser blocks it; muted playback is allowed,
          // but swallow the rejection so a blocked tile stays silent-failing.
          void el.play().catch(() => {});
        } else if (!el.paused) {
          el.pause();
        }
      },
      { rootMargin: '150px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  /*
    object-contain rather than cover: these are full-page recordings, so
    cropping the edges would slice through the very layout being shown off.
    Tiles are 16:9 and sit on a dark bg, so letterboxing on wider clips
    is effectively invisible.
  */
  return (
    <video
      ref={videoRef}
      src={src}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label="Website template preview"
      className="w-full h-full object-contain"
    />
  );
};

export const MarqueeSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  /*
    The parallax is written straight to the rows' style rather than held in
    React state.

    Keeping it in state meant every scroll event re-rendered this component, and
    this component renders 24 <video> tiles. That is a full reconciliation pass
    per scroll event — several per frame — and it was stalling the main thread
    badly enough to visibly stutter animations elsewhere on the page, including
    the team fan. The rows are the only thing that actually changes, so nothing
    is gained by routing it through React.

    translate3d rather than translateX so each row gets its own compositor
    layer and the transform never triggers layout.
  */
  useEffect(() => {
    const section = sectionRef.current;
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (!section || !row1 || !row2) return;

    let frame = 0;

    const apply = () => {
      frame = 0;
      /* getBoundingClientRect().top is already viewport-relative, so the old
         (scrollY - sectionTop + innerHeight) reduces to (innerHeight - top). */
      const offset = (window.innerHeight - section.getBoundingClientRect().top) * 0.3 - 200;
      row1.style.transform = `translate3d(${offset}px, 0, 0)`;
      row2.style.transform = `translate3d(${-offset}px, 0, 0)`;
    };

    /* Scroll can fire more than once per frame; coalescing to a single write
       per frame avoids repeating the same style recalculation. */
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(apply);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    apply();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    /*
      This black panel owns the section curve: it is pulled up by
      --section-curve and rounded on top, so the arc cuts down across the
      hero image behind it (the hero adds the same amount of height to sit
      under here). z-30 is needed because the hero's portrait cutout is z-20
      in the same stacking context and would otherwise paint over the arc.
    */
    <section
      ref={sectionRef}
      className="relative z-30 mt-[calc(var(--section-curve)_*_-1)] rounded-t-[var(--section-curve)] bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden"
    >
      <div className="flex flex-col gap-3">
        {/* Row 1: Moves RIGHT on scroll */}
        <div
          ref={row1Ref}
          className="flex gap-3 w-max"
          style={{ willChange: 'transform' }}
        >
          {ROW1_TILES.map((src, idx) => (
            <div
              key={`r1-${idx}`}
              className="w-[480px] h-[270px] flex-shrink-0 rounded-2xl overflow-hidden bg-neutral-900 border border-white/5"
            >
              <MarqueeVideo src={src} />
            </div>
          ))}
        </div>

        {/* Row 2: Moves LEFT on scroll */}
        <div
          ref={row2Ref}
          className="flex gap-3 w-max"
          style={{ willChange: 'transform' }}
        >
          {ROW2_TILES.map((src, idx) => (
            <div
              key={`r2-${idx}`}
              className="w-[480px] h-[270px] flex-shrink-0 rounded-2xl overflow-hidden bg-neutral-900 border border-white/5"
            >
              <MarqueeVideo src={src} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
