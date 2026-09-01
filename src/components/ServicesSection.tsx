import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { FadeIn } from './FadeIn';

interface ServiceItem {
  number: string;
  name: string;
  description: string;
  /** Unique preview revealed next to the cursor while this row is hovered. */
  image: string;
}

const SERVICES: ServiceItem[] = [
  {
    number: "01",
    name: "3D Modeling",
    description: "Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.",
    image: "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif"
  },
  {
    number: "02",
    name: "Rendering",
    description: "High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.",
    image: "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif"
  },
  {
    number: "03",
    name: "Motion Design",
    description: "Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.",
    image: "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif"
  },
  {
    number: "04",
    name: "Branding",
    description: "Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.",
    image: "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif"
  },
  {
    number: "05",
    name: "Web Design",
    description: "Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.",
    image: "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif"
  }
];

export const ServicesSection: React.FC = () => {
  const listRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  /* Only run the cursor-follow on real pointing devices. On touch there is no
     hover state, so the preview would either never show or get stuck. */
  const [canHover, setCanHover] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setCanHover(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setCanHover(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  /* Raw pointer position, then a spring so the preview trails the cursor
     instead of feeling glued to it. */
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const x = useSpring(pointerX, { stiffness: 260, damping: 28, mass: 0.55 });
  const y = useSpring(pointerY, { stiffness: 260, damping: 28, mass: 0.55 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = listRef.current?.getBoundingClientRect();
    if (!rect) return;
    pointerX.set(e.clientX - rect.left);
    pointerY.set(e.clientY - rect.top);
  };

  const isActive = activeIndex !== null;

  return (
    <section
      id="services"
      className="bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[var(--section-curve)] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-0"
    >
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        {/* Heading */}
        <FadeIn delay={0} y={40}>
          <h2 className="font-black uppercase text-center text-[#0C0C0C] text-[clamp(3rem,12vw,160px)] leading-none tracking-tight mb-16 sm:mb-20 md:mb-28">
            Services
          </h2>
        </FadeIn>

        {/* Service Items List + cursor-following preview */}
        <div
          ref={listRef}
          onMouseMove={canHover ? handleMouseMove : undefined}
          onMouseLeave={() => setActiveIndex(null)}
          className="relative w-full flex flex-col divide-y divide-[rgba(12,12,12,0.15)] border-t border-b border-[rgba(12,12,12,0.15)]"
        >
          {SERVICES.map((service, index) => (
            <FadeIn key={service.number} delay={index * 0.1} y={30}>
              <div
                onMouseEnter={() => canHover && setActiveIndex(index)}
                className="group py-8 sm:py-10 md:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 md:gap-12"
              >
                {/* Number */}
                <div className="font-black text-[#0C0C0C] text-[clamp(3rem,10vw,140px)] leading-none flex-shrink-0 select-none">
                  {service.number}
                </div>

                {/* Name & Description Stacked Vertically */}
                <div className="flex flex-col gap-2 md:gap-3 flex-grow">
                  <h3 className="font-medium uppercase text-[#0C0C0C] text-[clamp(1rem,2.2vw,2.1rem)] tracking-wide">
                    {service.name}
                  </h3>
                  <p className="font-light text-[#0C0C0C] opacity-60 leading-relaxed max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)]">
                    {service.description}
                  </p>
                </div>
              </div>
            </FadeIn>
          ))}

          {/*
            Floating preview. Three nested elements each own exactly one
            transform concern: the outer one is positioned by the spring, the
            middle centres it on the cursor, the inner one scales/fades. Sharing
            an element would make Framer Motion's inline transform overwrite
            Tailwind's translate utilities.
          */}
          {canHover && (
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute left-0 top-0 z-20 hidden md:block"
              style={{ x, y }}
            >
              <div className="-translate-x-1/2 -translate-y-1/2">
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isActive ? 1 : 0,
                    scale: isActive ? 1 : 0.85,
                  }}
                  transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
                  className="relative w-[360px] h-[245px] lg:w-[420px] lg:h-[285px] overflow-hidden rounded-2xl bg-[#0C0C0C] shadow-2xl ring-1 ring-black/10"
                >
                  {/* All five stay mounted and cross-fade, so switching rows
                      never shows a half-loaded frame. */}
                  {SERVICES.map((service, index) => (
                    <motion.img
                      key={service.number}
                      src={service.image}
                      alt=""
                      loading="lazy"
                      initial={false}
                      animate={{ opacity: activeIndex === index ? 1 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
