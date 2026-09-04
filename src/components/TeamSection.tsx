import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { Magnet } from './Magnet';
import { Globe, ArrowUpRight } from 'lucide-react';

const DEVYANSHU_PORTRAIT = "/assets/images/devyanshu_founder_hd.jpg";

interface Teammate {
  name: string;
  role: string;
  detail: string;
  /** Portrait, rendered exactly like the founder's photo. */
  image: string;
  /** Shown behind the photo, so a failed/missing image still reads as a card. */
  initials: string;
  gradient: string;
  /** -1 fans left, +1 fans right. */
  dir: -1 | 1;
  /** How far out: a share of the founder card's width, so the small cards
      actually clear it instead of hiding behind it. */
  spread: number;
  rotate: number;
}

/*
  TODO (content): placeholder teammates so the reveal can be reviewed.
  Swap in real names/roles, and replace `image` with your own files — drop them
  in public/assets/images/ and reference them the way the founder portrait above
  does ("/assets/images/your-file.jpg"). The current URLs are stand-in faces
  from pravatar.cc, so nothing here is a real DigiWebNow teammate yet.

  Order only affects stacking now that the whole hand opens at once: left/right
  alternates so the fan stays balanced.
*/
const TEAM: Teammate[] = [
  {
    name: "",
    role: "AI Engineer",
    detail: "LLMs • PyTorch • Neural Nets",
    image: "/assets/images/team_ai_engineer.jpg",
    initials: "AS",
    gradient: "from-[#00f2fe] to-[#0072ff]",
    dir: -1, spread: 0.64, rotate: -8,
  },
  {
    name: "",
    role: "Backend Engineer",
    detail: "Node.js • APIs • Databases",
    image: "/assets/images/team_backend_engineer.jpg",
    initials: "RV",
    gradient: "from-[#BE4C00] to-[#B600A8]",
    dir: 1, spread: 0.64, rotate: 8,
  },
  {
    name: "",
    role: "Cybersecurity Specialist",
    detail: "Auth • Pentesting • Security",
    image: "/assets/images/team_cybersecurity.jpg",
    initials: "VS",
    gradient: "from-[#7928CA] to-[#0070F3]",
    dir: -1, spread: 1.02, rotate: -15,
  },
  {
    name: "",
    role: " Frontend UI & UX Designer",
    detail: "React • Tailwind • UI/UX",
    image: "/assets/images/team_frontend_ui.jpg",
    initials: "AG",
    gradient: "from-[#FF0080] to-[#7928CA]",
    dir: 1, spread: 1.02, rotate: 15,
  },
];

/*
  The fan is driven off how much of the card cluster is on screen, not the
  section. The section is min-h-screen and can grow past the viewport, and once
  it does its intersection ratio can never reach a high threshold — a tall
  section would simply never open. The cluster is a few hundred pixels, so its
  ratio is always meaningful.

  Two thresholds, not one: it opens once the cluster is mostly visible and only
  folds again after it has largely left. The gap between them is what stops a
  small scroll nudge near the boundary from toggling the fan repeatedly, and it
  works the same whether you arrive scrolling down or leave scrolling up.
*/
const OPEN_RATIO = 0.6;
const CLOSE_RATIO = 0.25;

/*
  ---------- Looping headline band ----------
  Cells per half of the marquee track. The track only wraps seamlessly while one
  half is at least as wide as the viewport, and a half is this many cells. At
  11vw a cell measures roughly 0.6x the viewport, so three clears the bar with
  enough margin left over that the fallback font (before Kanit loads) is still
  wide enough.
*/
const BAND_REPEATS = 3;

/* The trailing gap belongs to the cell, so the space either side of every
   separator is identical — including across the loop seam. */
const BAND_HALF = (
  <>
    {Array.from({ length: BAND_REPEATS }, (_, i) => (
      <span key={i} className="pr-[3vw]">
        DIGIWEBNOW &bull;
      </span>
    ))}
  </>
);

/** Breathing room kept between the outermost card and the viewport edge. */
const EDGE_GUTTER = 14;

/** How far the two rows separate once the fan has to be squeezed inward. */
const SQUEEZE_ROW_SPLIT = 150;

/*
  Squeezed layouts also drop the whole fan slightly, which keeps the top strip of
  the founder card — and the Meet/Hide control sitting in it — clear of the
  raised near row. Contributes nothing at full width.
*/
const SQUEEZE_FAN_DROP = 45;

export const TeamSection: React.FC = () => {
  /*
    One flag, because the whole team arrives together. Scrolling the section into
    view is what sets it — there is no control to press. The observer that drives
    it is set up below, once sectionRef exists.
  */
  const [open, setOpen] = useState(false);

  /*
    Opening is automatic now, so the animation is not something the visitor
    chose. Under prefers-reduced-motion the cards are placed in their fanned
    positions with no travel rather than sliding out (WCAG 2.3.3).
  */
  const reduceMotion = useReducedMotion();

  /* Placeholder portraits are remote, so a dead URL must not leave a broken
     image icon in the middle of the fan: fall back to the initials tile. */
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  /* Phones only have ~60px either side of the founder card, so the fan is
     tightened slightly there. The section clips overflow-x, so no scrollbar. */
  const [fan, setFan] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const apply = () => setFan(mq.matches ? 1 : 0.85);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  /*
    Three measurements drive the fan: the founder card's width (offsets are a
    share of it, because it is up to 2.7x wider than a teammate card and would
    otherwise swallow them), the section's width (nothing may be opened past the
    viewport edge — the section clips overflow, so an over-wide fan simply
    disappears), and a teammate card's own width. Taken in a layout effect
    rather than an effect because the fan can open as soon as the section
    scrolls in, and measuring a frame late would fan the cards from stale
    offsets.
  */
  const sectionRef = useRef<HTMLElement>(null);
  const clusterRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ clusterW: 0, sectionW: 0, cardW: 0, cardH: 0 });

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const cluster = clusterRef.current;
    const card = cardRef.current;
    if (!section || !cluster || !card) return;

    /* offsetWidth, not getBoundingClientRect: the cards are rotated, and a
       bounding box would report the inflated diagonal instead of the width. */
    const measure = () =>
      setBox({
        clusterW: cluster.offsetWidth,
        sectionW: section.clientWidth,
        cardW: card.offsetWidth,
        cardH: card.offsetHeight,
      });

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(section);
    ro.observe(cluster);
    ro.observe(card);
    return () => ro.disconnect();
  }, []);

  /*
    Scroll position is the trigger. Two thresholds give the flag hysteresis: it
    opens once OPEN_RATIO of the section is showing, and only folds back after
    the section has left the viewport completely. Without that gap a single
    boundary would let a small scroll nudge toggle the fan repeatedly.

    Folding on exit rather than latching open is deliberate — it means the reveal
    replays every time the section is scrolled back to, which is what makes it
    read as part of arriving at the section.
  */
  useEffect(() => {
    const cluster = clusterRef.current;
    if (!cluster) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio >= OPEN_RATIO) setOpen(true);
        else if (entry.intersectionRatio <= CLOSE_RATIO) setOpen(false);
      },
      { threshold: [0, CLOSE_RATIO, OPEN_RATIO] }
    );

    io.observe(cluster);
    return () => io.disconnect();
  }, []);

  /*
    A tilted card is wider than the card itself, so the room it needs is the
    half-width of its rotated bounding box — using cardW/2 here let the 15deg
    cards hang over the edge by ~12px.
  */
  const rotatedHalfWidth = (rotate: number) => {
    const rad = (Math.abs(rotate) * Math.PI) / 180;
    return (box.cardW * Math.cos(rad) + box.cardH * Math.sin(rad)) / 2;
  };

  /*
    Every card compares the offset it wants against the offset that still keeps
    it fully on screen; the tightest of those ratios scales the whole fan. One
    shared scale keeps the proportions instead of clamping cards individually,
    which would collapse the near and far pair onto the same spot.
  */
  const fanScale = Math.min(
    1,
    ...TEAM.map((mate) => {
      const desired = mate.spread * box.clusterW * fan;
      if (desired <= 0) return 1;
      const allowed = box.sectionW / 2 - rotatedHalfWidth(mate.rotate) - EDGE_GUTTER;
      return Math.max(0, allowed) / desired;
    })
  );
  const squeeze = 1 - fanScale;

  const offsetX = (mate: Teammate) =>
    mate.dir * mate.spread * box.clusterW * fan * fanScale;

  /*
    Squeezing the fan inward makes the cards overlap each other, so the same
    amount of squeeze pushes the near pair up and the far pair down into two
    readable rows. At full width this contributes nothing.
  */
  const offsetY = (mate: Teammate) => {
    const row = mate.spread > 0.8 ? 1 : -1;
    return (
      Math.abs(mate.rotate) * 2.2 +
      row * squeeze * SQUEEZE_ROW_SPLIT +
      squeeze * SQUEEZE_FAN_DROP
    );
  };

  return (
    <section
      ref={sectionRef}
      id="team"
      className="relative min-h-screen flex flex-col justify-between overflow-x-clip bg-[#0C0C0C] py-8 sm:py-10"
    >
      {/* Headline — a continuously looping band of the section title */}
      <div className="w-full overflow-hidden z-0 my-auto py-4 sm:py-8">
        <FadeIn delay={0.15} y={40} className="w-full text-center">
          <h2 className="sr-only">Our Team</h2>
          <div
            className="marquee hero-heading flex w-max whitespace-nowrap font-black uppercase tracking-tight leading-none text-[11vw] select-none"
            aria-hidden="true"
          >
            {BAND_HALF}
            {BAND_HALF}
          </div>

          <p className="text-[#00f2fe] font-mono uppercase tracking-[0.3em] text-xs sm:text-sm md:text-base mt-2">
            Founder @ DigiWebNow &bull; Custom Web Architecture
          </p>
        </FadeIn>
      </div>

      {/* ---------- MOBILE / TABLET LAYOUT (< md) ---------- */}
      <div className="block md:hidden w-full px-4 my-6 z-10">
        {/* Mobile Founder Card */}
        <FadeIn delay={0.2} y={20} className="max-w-[280px] sm:max-w-[320px] mx-auto">
          <div className="relative w-full rounded-3xl overflow-hidden border border-[#00f2fe]/40 shadow-2xl bg-neutral-900/90 text-left">
            <img
              src={DEVYANSHU_PORTRAIT}
              alt="DigiWebNow - Lead Web Architect"
              className="w-full h-[320px] sm:h-[380px] object-cover object-top select-none"
            />
            <div className="absolute bottom-3 left-3 right-3 bg-black/85 p-2.5 rounded-2xl border border-white/10 flex items-center justify-between backdrop-blur-md">
              <div>
                <div className="text-white font-bold text-xs sm:text-sm">DigiWebNow &bull;</div>
                <div className="text-[10px] sm:text-xs text-[#00f2fe]">Lead Full-Stack Architect</div>
              </div>
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-[#00f2fe]" />
            </div>
          </div>
        </FadeIn>

        {/* Mobile Core Team Grid */}
        <div className="mt-8 max-w-sm sm:max-w-md mx-auto">
          <div className="text-center mb-3">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-[#00f2fe]/90 bg-[#00f2fe]/10 px-3 py-1 rounded-full border border-[#00f2fe]/20">
              Core Engineering Team
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5">
            {TEAM.map((mate, i) => {
              const showPhoto = !!mate.image && !brokenImages[mate.name];
              return (
                <FadeIn key={mate.role} delay={0.25 + i * 0.1} y={15}>
                  <div className="rounded-2xl overflow-hidden border border-[#00f2fe]/25 bg-neutral-900/95 shadow-lg">
                    <div className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-br ${mate.gradient}`}>
                      <span className="absolute inset-0 flex items-center justify-center font-black text-white/90 text-2xl select-none">
                        {mate.initials}
                      </span>

                      {showPhoto && (
                        <img
                          src={mate.image}
                          alt={mate.role}
                          loading="lazy"
                          decoding="async"
                          onError={() =>
                            setBrokenImages((broken) => ({ ...broken, [mate.name]: true }))
                          }
                          className="absolute inset-0 h-full w-full object-cover object-top"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      <div className="absolute inset-x-1.5 bottom-1.5 rounded-xl border border-white/10 bg-black/85 px-2 py-1.5 text-left backdrop-blur-xs">
                        <div className="text-[10px] font-bold text-[#00f2fe] leading-tight">
                          {mate.role}
                        </div>
                        <div className="text-[8.5px] text-white/60 mt-0.5 leading-tight line-clamp-1">
                          {mate.detail}
                        </div>
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </div>

      {/* ---------- DESKTOP CARD CLUSTER (>= md) ---------- */}
      <div
        ref={clusterRef}
        id="team-fan"
        className="hidden md:block absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-[400px] lg:w-[460px]"
      >
        {TEAM.map((mate, i) => {
          const showPhoto = !!mate.image && !brokenImages[mate.name];

          return (
            <motion.div
              key={mate.role}
              ref={i === 0 ? cardRef : undefined}
              aria-hidden={!open}
              className="absolute left-1/2 top-1/2 w-[160px] lg:w-[170px] -ml-[80px] lg:-ml-[85px] -mt-[107px] lg:-mt-[113px]"
              initial={false}
              animate={{
                x: open ? offsetX(mate) : 0,
                y: open ? offsetY(mate) : 0,
                rotate: open ? mate.rotate : 0,
                opacity: open ? 1 : 0,
                scale: open ? 1 : 0.85,
              }}
              transition={{
                duration: reduceMotion ? 0 : 0.6,
                delay: reduceMotion ? 0 : (open ? i : TEAM.length - 1 - i) * 0.05,
                ease: [0.22, 1, 0.36, 1],
              }}
              style={{
                pointerEvents: open ? 'auto' : 'none',
                zIndex: open ? 30 + i : 0,
                willChange: 'transform, opacity',
              }}
            >
              <div className="rounded-3xl overflow-hidden border border-[#00f2fe]/25 bg-neutral-900/95 shadow-xl">
                <div
                  className={`relative aspect-[3/4] overflow-hidden bg-gradient-to-br ${mate.gradient}`}
                >
                  <span className="absolute inset-0 flex items-center justify-center font-black text-white/90 text-[clamp(1.75rem,4vw,2.75rem)] select-none">
                    {mate.initials}
                  </span>

                  {showPhoto && (
                    <img
                      src={mate.image}
                      alt={mate.role}
                      loading="lazy"
                      decoding="async"
                      onError={() =>
                        setBrokenImages((broken) => ({ ...broken, [mate.name]: true }))
                      }
                      className="absolute inset-0 h-full w-full object-cover object-top"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-2 bottom-2 rounded-xl border border-white/10 bg-black/85 px-2.5 py-2 text-left">
                    <div className="text-xs font-bold text-white leading-tight">
                      {mate.name || 'DigiWebNow'}
                    </div>
                    <div className="text-[10px] text-[#00f2fe] mt-0.5">
                      {mate.role}
                    </div>
                    <div className="text-[9px] text-white/50 mt-1 leading-tight">
                      {mate.detail}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}

        {/* Desktop Founder card with Magnet */}
        <FadeIn delay={0.6} y={30}>
          <Magnet
            padding={150}
            strength={3}
            activeTransition="transform 0.3s ease-out"
            inactiveTransition="transform 0.6s ease-in-out"
          >
            <div className="relative w-full rounded-3xl overflow-hidden border border-[#00f2fe]/30 shadow-2xl bg-neutral-900/90 text-left">
              <img
                src={DEVYANSHU_PORTRAIT}
                alt="DigiWebNow - Lead Web Architect"
                className="w-full h-[460px] lg:h-[500px] object-cover object-top select-none"
              />

              <div className="absolute bottom-4 left-4 right-4 bg-black/85 p-3 rounded-2xl border border-white/10 flex items-center justify-between backdrop-blur-md">
                <div>
                  <div className="text-white font-bold text-sm">DigiWebNow &bull;</div>
                  <div className="text-xs text-[#00f2fe]"> Lead Full-Stack Architect</div>
                </div>
                <Globe className="w-5 h-5 text-[#00f2fe]" />
              </div>
            </div>
          </Magnet>
        </FadeIn>
      </div>

      {/* Bottom bar with generous mobile padding to clear floating navbar */}
      <div className="w-full px-6 md:px-10 pb-28 sm:pb-8 md:pb-10 flex flex-col sm:flex-row justify-between items-center sm:items-end gap-4 z-20">
        <FadeIn delay={0.35} y={20}>
          <p className="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug text-xs sm:text-sm max-w-[280px] text-center sm:text-left">
            Building custom websites tailored for market dominance &bull; Featured: iYOU Global & Gaur Furniture
          </p>
        </FadeIn>

        <FadeIn delay={0.5} y={20} className="flex gap-3">
          <a
            href="https://iyouglobal.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#00f2fe] text-xs font-semibold uppercase tracking-wider text-[#D7E2EA] hover:text-white transition-all"
          >
            <span>1) iYOU Global</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#00f2fe]" />
          </a>
          <a
            href="https://www.gaurfurniture.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#00f2fe] text-xs font-semibold uppercase tracking-wider text-[#D7E2EA] hover:text-white transition-all"
          >
            <span>2) Gaur Furniture</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-[#00f2fe]" />
          </a>
        </FadeIn>
      </div>
    </section>
  );
};
