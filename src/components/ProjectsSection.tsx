import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { LiveProjectButton } from './LiveProjectButton';

interface ProjectData {
  number: string;
  name: string;
  category: string;
  liveUrl: string;
  col1Image1: string;
  col1Image2: string;
  col2Image: string;
}

const PROJECTS: ProjectData[] = [
  {
    number: "01",
    name: "RealEstate Platform",
    category: "Full-Stack Real Estate Search & Property Discovery",
    /*
      The live app is a client-routed SPA with no catch-all rewrite on Render, so
      a direct GET of /about answers 404 "Not Found" and only resolves via
      in-app navigation. Linking the root keeps the button reliable; point it at
      /about once a rewrite rule is in place.
    */
    liveUrl: "https://real-estate-tpm.onrender.com/",
    /* Captured from the live deployment; slot order matches each frame's aspect
       ratio so object-cover crops as little as possible. */
    col1Image1: "/assets/images/realestate_3.png",
    col1Image2: "/assets/images/realestate_home.jpg",
    col2Image: "/assets/images/realestate_properties.jpg",
  },
  {
    number: "02",
    name: "iYOU Global",
    category: "International Enterprise Platform",
    liveUrl: "https://iyouglobal.com/",
    col1Image1: "/assets/images/iyouglobal.jpg",
    col1Image2: "/assets/images/iyouglobal-2.png",
    col2Image: "/assets/images/iyouglobal-3.png",
  },
  {
    number: "03",
    name: "Gaur Furniture",
    category: "Luxury E-Commerce & Interior Store",
    liveUrl: "https://www.gaurfurniture.com/",
    /*
      Captured at each slot's aspect ratio (2.00 / 1.37 / 1.13) so the frames
      fill with almost nothing cropped — this card previously reused one
      1600x900 screenshot in all three slots, which both letterboxed the taller
      frames and made the repetition obvious. Wix drives its section reveals
      from inline styles that settle back to ~20% opacity under automation, so
      the capture force-settles them before shooting; see capture-gaur.mjs.
    */
    col1Image1: "/assets/images/gaur_portfolio.jpg",
    col1Image2: "/assets/images/gaur_process.jpg",
    col2Image: "/assets/images/gaur_hero.jpg",
  },
  {
    number: "04",
    name: "DigiWebNow Agency",
    category: "Creative Agency & Digital Marketing Platform",
    /* Single page with anchor sections (#home, #about, #portfolio, #services,
       #blog), so the root and /index.html both answer 200 — no rewrite needed. */
    liveUrl: "https://digital-markiting-beta.vercel.app/",
    /*
      Captured from the live deployment at each slot's aspect ratio (2.00 / 1.37
      / 1.13) so object-cover crops almost nothing. The hero rotates through
      Web / Graphic / Digital on a timer; the capture is pinned to the WEB
      variant deliberately rather than whichever frame happened to be up.
    */
    col1Image1: "/assets/images/digiwebnow_agency_blog.jpg",
    col1Image2: "/assets/images/digiwebnow_agency_about.jpg",
    col2Image: "/assets/images/digiwebnow_agency_hero.jpg",
  },
  
  {
    number: "05",
    name: "Lumière Furniture",
    category: "Luxury Furniture E-Commerce & Product Catalog",
    /*
      Same Render SPA situation as the RealEstate app: there is no catch-all
      rewrite, so a direct GET of /products or /about answers 404 and those
      routes only resolve through in-app navigation. Root it is.
    */
    liveUrl: "https://e-commerce-furniture-1-bpdr.onrender.com/",
    /*
      Captured at each slot's aspect ratio (2.00 / 1.37 / 1.13) so object-cover
      crops almost nothing. The hero is a Flickity carousel, so the capture
      pins cell 1 ("The Autumn Edit") by clicking its page dot rather than
      taking whichever slide happened to be up — see capture-lumiere.mjs.
    */
    col1Image1: "/assets/images/lumiere_collections.jpg",
    col1Image2: "/assets/images/lumiere_heritage.jpg",
    col2Image: "/assets/images/lumiere_hero.jpg",
  },
  {
    number: "06",
    name: "EMBER Fine Dining",
    category: "Luxury Restaurant & Reservation Experience",
    /* Anchor-section single page (#top, #signatures, #chef, #menu, #reserve,
       #gallery, #events); the root answers 200, so no rewrite needed. */
    liveUrl: "https://dining-ember.vercel.app/",
    /*
      Captured at each slot's aspect ratio (2.00 / 1.37 / 1.13) so object-cover
      crops almost nothing. Every photo on the site is loading="lazy" and the
      chef portrait is revealed by a clip-path animation driven from a
      module-scoped Lenis instance that never publishes scroll updates under
      automation — see capture-ember.mjs for how the capture settles it.
    */
    col1Image1: "/assets/images/ember_signatures.jpg",
    col1Image2: "/assets/images/ember_chef.jpg",
    col2Image: "/assets/images/ember_hero.jpg",
  },
];

interface CardProps {
  project: ProjectData;
  index: number;
  totalCards: number;
}

const ProjectCard: React.FC<CardProps> = ({ project, index, totalCards }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'start start'],
  });

  const targetScale = 1 - (totalCards - 1 - index) * 0.03;
  const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);

  return (
    <div
      ref={containerRef}
      className="h-[85vh] sticky top-24 md:top-32 flex items-center justify-center"
      style={{ top: `calc(6rem + ${index * 28}px)` }}
    >
      <motion.div
        style={{ scale }}
        className="w-full h-full rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden shadow-2xl"
      >
        {/* Top Row */}
        <div className="flex items-center justify-between gap-4 border-b border-[#D7E2EA]/20 pb-4 md:pb-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <span className="font-black text-[#D7E2EA] text-[clamp(2rem,6vw,4.5rem)] leading-none">
              {project.number}
            </span>
            <div className="flex flex-col">
              <span className="text-[#00f2fe] uppercase tracking-widest text-xs sm:text-sm font-semibold">
                {project.category}
              </span>
              <h3 className="text-[#D7E2EA] font-medium uppercase text-base sm:text-xl md:text-2xl tracking-wide">
                {project.name}
              </h3>
            </div>
          </div>

          <LiveProjectButton url={project.liveUrl} label="Live Project" />
        </div>

        {/*
          Bottom Row: 2-Column Image Grid.

          object-cover with object-top, which is the pairing that matters here.

          Plain object-cover anchors to the centre, so a wide screenshot in the
          tall right-hand frame showed a horizontal band sliced out of the middle
          of the page — unrecognisable. object-contain fixed the slicing but left
          the mismatched shots sitting in up to 49% empty letterbox.

          Anchoring to the top instead fills every frame and keeps the part of a
          website that identifies it: the header and hero. Cards whose captures
          were taken at the slot ratios lose only 3-9% off the bottom, which is
          invisible; the one card still using wide screenshots (02, iYOU) shows
          its page top rather than a mid-page band. Same reasoning as the
          thumbnails in FeaturedClientWebsites.
        */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mt-4 flex-grow overflow-hidden">
          {/* Left Column (40% width -> col-span-5) */}
          <div className="md:col-span-5 flex flex-col gap-4 h-full">
            <div className="rounded-[30px] sm:rounded-[40px] overflow-hidden border border-[#D7E2EA]/20 h-[clamp(130px,16vw,230px)] flex-shrink-0">
              <img
                src={project.col1Image1}
                alt={`${project.name} preview 1`}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="rounded-[30px] sm:rounded-[40px] overflow-hidden border border-[#D7E2EA]/20 h-[clamp(160px,22vw,340px)] flex-grow">
              <img
                src={project.col1Image2}
                alt={`${project.name} preview 2`}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Column (60% width -> col-span-7) */}
          <div className="md:col-span-7 h-full">
            <div className="rounded-[30px] sm:rounded-[40px] overflow-hidden border border-[#D7E2EA]/20 h-full">
              <img
                src={project.col2Image}
                alt={`${project.name} preview main`}
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export const ProjectsSection: React.FC = () => {
  return (
    <section
      id="projects"
      className="bg-[#0C0C0C] text-[#D7E2EA] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 relative z-10 px-5 sm:px-8 md:px-10 py-20 pb-32"
    >
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        {/* Heading */}
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase text-center text-[clamp(3rem,12vw,160px)] leading-none tracking-tight mb-16 sm:mb-20 md:mb-28">
            Projects
          </h2>
        </FadeIn>

        {/* Sticky Stacking Cards Container */}
        <div className="w-full flex flex-col gap-12 sm:gap-16">
          {PROJECTS.map((project, index) => (
            <ProjectCard
              key={project.number}
              project={project}
              index={index}
              totalCards={PROJECTS.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
