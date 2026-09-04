import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FadeIn } from './FadeIn';
import { ExternalLink, CheckCircle, Sparkles, ArrowRight } from 'lucide-react';

/*
  Master-detail showcase: the big panel is the detail view and the three cards
  below are the picker. Clicking a card promotes it into the panel and demotes
  whatever was there into the grid, so every project can be the featured one.

  Everything the panel renders comes from this array — there is no per-project
  markup left. To add a project, append an entry; to reorder the picker, move it.
*/

interface Shot {
  src: string;
  /** Caption on the thumbnail in the picker strip. */
  label: string;
}

interface Project {
  id: string;
  /** Follows the project, not its position, so promoting one does not renumber
      the others. */
  number: string;
  name: string;
  category: string;
  description: string;
  features: string[];
  url: string;
  /** Display form of `url` — the bare host, without the scheme. */
  urlLabel: string;
  alt: string;
  /*
    Screenshots for the detail panel. More than one turns on the thumbnail
    picker strip; a single shot hides it. All are shown in a 16:9 frame with
    object-top, so wider captures lose a little off the bottom rather than
    getting cropped through the middle.
  */
  shots: Shot[];
}

const PROJECTS: Project[] = [
  {
    id: 'realestate',
    number: '01',
    name: 'RealEstate Search & Property Platform',
    category: 'Search & Property Marketplace',
    description:
      'Advanced full-stack real estate search engine and property marketplace featuring AI query assistant, property type filtering, price range sliders, and verified property badges.',
    features: [
      'AI-Powered Natural Language Property Search',
      'Dynamic Price Slider & Location Filters',
      'Verified Property Verification Badges',
      'Responsive Mobile-First Property Grid',
    ],
    url: 'https://real-estate-tpm.onrender.com',
    urlLabel: 'real-estate-tpm.onrender.com',
    alt: 'RealEstate Search and Property Platform',
    shots: [
      { src: 'assets/images/realestate_1.png', label: 'Hero' },
      { src: 'assets/images/realestate_2.png', label: 'Browse' },
      { src: 'assets/images/realestate_3.png', label: 'About' },
    ],
  },
  {
    id: 'iyou',
    number: '02',
    name: 'iYOU Global',
    category: 'Corporate Web Platform',
    description:
      'An international corporate platform built for worldwide brand authority, intuitive UI navigation, and ultra-fast client-side responsive performance.',
    features: [
      'Custom Full-Stack Responsive Frontend',
      'Sub-Second Load Time Performance',
    ],
    url: 'https://iyouglobal.com/',
    urlLabel: 'iyouglobal.com',
    alt: 'iYOU Global Production Website',
    shots: [{ src: 'assets/images/iyouglobal.jpg', label: 'Home' }],
  },
  {
    id: 'gaur',
    number: '03',
    name: 'Gaur Furniture',
    category: 'E-Commerce & Storefront',
    description:
      'A luxury e-commerce catalog showcase featuring high-resolution furniture imagery, custom shopping navigation, and conversion-focused product flows.',
    features: [
      'Custom Product Catalog System',
      'Luxury Visual Branding & Layout',
    ],
    url: 'https://www.gaurfurniture.com/',
    urlLabel: 'www.gaurfurniture.com',
    alt: 'Gaur Furniture E-Commerce Website',
    shots: [{ src: 'assets/images/gaur_furniture.jpg', label: 'Home' }],
  },
  {
    id: 'lumiere',
    number: '04',
    name: 'Lumière Furniture',
    category: 'Luxury Furniture Store',
    description:
      'A curated luxury furniture storefront with a slide-driven editorial hero, collection browsing, filterable catalog routes, and interactive material hotspots on the design showcase.',
    features: [
      'Filterable Catalog with Category & Search Routing',
      'Cart, Wishlist & Account Flows',
      'Slide-Driven Editorial Hero Carousel',
      'Interactive Material Hotspots',
    ],
    url: 'https://e-commerce-furniture-1-bpdr.onrender.com/',
    urlLabel: 'e-commerce-furniture-1-bpdr.onrender.com',
    alt: 'Lumière Furniture Luxury E-Commerce Storefront',
    /* Captures from capture-lumiere.mjs. The hero is pinned to the "Autumn
       Edit" carousel cell so the shot is deterministic. */
    shots: [
      { src: 'assets/images/lumiere_furniture.jpg', label: 'Hero' },
      { src: 'assets/images/lumiere_collections.jpg', label: 'Collections' },
    ],
  },
];

export const FeaturedClientWebsites: React.FC = () => {
  const [selectedId, setSelectedId] = useState(PROJECTS[0].id);
  /* Which screenshot the detail panel is showing. Reset on every promotion,
     because shot 3 of one project is not shot 3 of the next. */
  const [shotIndex, setShotIndex] = useState(0);

  const selected = PROJECTS.find((p) => p.id === selectedId) ?? PROJECTS[0];
  const others = PROJECTS.filter((p) => p.id !== selected.id);
  /* Guard the index: a project promoted while a later shot was active would
     otherwise read past the end of its own, shorter, shots array. */
  const shot = selected.shots[Math.min(shotIndex, selected.shots.length - 1)];

  const promote = (id: string) => {
    setSelectedId(id);
    setShotIndex(0);
  };

  return (
    <section
      id="featured"
      className="py-24 px-6 md:px-10 bg-[#0A0C14] text-[#D7E2EA] border-t border-b border-white/5 relative z-10"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <FadeIn delay={0} y={30}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/30 text-[#00f2fe] text-xs font-bold uppercase tracking-widest mb-4">
              <Sparkles className="w-3.5 h-3.5" /> Production Portfolio Showcase
            </div>
            <h2 className="hero-heading font-black uppercase text-4xl sm:text-6xl md:text-7xl leading-tight">
              FEATURED PROJECTS
            </h2>
            <p className="text-[#D7E2EA]/70 max-w-2xl mx-auto mt-4 text-sm md:text-base font-light">
              Explore live production web applications designed, built, and launched by DigiWebNow.
            </p>
          </FadeIn>
        </div>

        {/*
          Detail panel. The FadeIn wrapper stays mounted so the panel's frame
          never replays its entrance; only the inner content is keyed on the
          selected id, which remounts it and fades the new project in.
        */}
        <FadeIn delay={0.1} y={40} className="mb-12">
          <div
            id="featured-detail"
            aria-live="polite"
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-900/90 to-neutral-950 border-2 border-[#00f2fe]/40 transition-all duration-500 shadow-2xl p-6 sm:p-8 md:p-10"
          >
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
            >
              {/* Left: screenshot viewer */}
              <div className="lg:col-span-7 flex flex-col gap-4">
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-xl bg-black">
                  <img
                    key={shot.src}
                    src={shot.src}
                    alt={`${selected.name} — ${shot.label}`}
                    className="w-full h-full object-cover object-top"
                  />
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute top-4 right-4 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-[#00f2fe] text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 hover:bg-[#00f2fe] hover:text-black transition-all"
                  >
                    <span>Live Demo</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Shot picker — only meaningful with more than one capture.
                    Columns follow the shot count so two thumbs fill the row
                    instead of leaving a third column empty. */}
                {selected.shots.length > 1 && (
                  <div
                    className="grid gap-3"
                    style={{
                      gridTemplateColumns: `repeat(${selected.shots.length}, minmax(0, 1fr))`,
                    }}
                  >
                    {selected.shots.map((s, i) => (
                      <button
                        key={s.src}
                        type="button"
                        onClick={() => setShotIndex(i)}
                        aria-label={`Show the ${s.label} screenshot`}
                        aria-pressed={s.src === shot.src}
                        className={`relative rounded-xl overflow-hidden border-2 transition-all h-20 focus-visible:outline-none focus-visible:border-[#00f2fe] ${
                          s.src === shot.src
                            ? 'border-[#00f2fe] scale-105'
                            : 'border-white/10 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={s.src}
                          alt=""
                          className="w-full h-full object-cover object-top"
                        />
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[10px] text-white font-mono">
                          {s.label}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: every detail the project has */}
              <div className="lg:col-span-5 flex flex-col justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#00f2fe]/20 text-[#00f2fe] font-mono font-bold text-xs uppercase tracking-widest">
                      Featured Project {selected.number}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 text-[11px] font-semibold text-white/80">
                      {selected.category}
                    </span>
                  </div>

                  <h3 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight mb-3">
                    {selected.name}
                  </h3>

                  <p className="text-sm text-[#D7E2EA]/80 leading-relaxed mb-6 font-light">
                    {selected.description}
                  </p>

                  <div className="space-y-2 mb-8">
                    {selected.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2 text-xs text-white/90"
                      >
                        <CheckCircle className="w-4 h-4 shrink-0 text-[#00f2fe]" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                {/*
                  Stacked rather than side-by-side: this column is only 5 of 12,
                  and a long host (Lumière's Render subdomain is 40 characters)
                  wrapped mid-word next to the button. On its own line it fits.
                */}
                <div className="pt-6 border-t border-white/10 flex flex-col gap-3 items-stretch">
                  <a
                    href={selected.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-3 rounded-full bg-[#00f2fe] text-black font-bold uppercase tracking-wider text-xs flex items-center justify-center gap-2 shadow-lg hover:scale-105 transition-transform"
                  >
                    <span>Open Live Web Application</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  <span className="text-xs text-[#D7E2EA]/50 font-mono text-center break-all">
                    {selected.urlLabel}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        </FadeIn>

        {/*
          Picker. Keyed by project id, so promoting one only mounts the card that
          was demoted — the two that stay put keep their DOM. `layout` slides
          them to their new column instead of letting them jump.

          These are buttons, not links: the live URL and the feature list now
          live in the panel, and an anchor nested inside a button would be
          invalid markup with unpredictable click behaviour.

          The scroll-triggered entrance belongs to the row, not to each card.
          Per-card whileInView looked equivalent but broke the swap: a demoted
          card mounts after the initial reveal has already run, and if the row
          happens to be outside the viewport at that moment its entrance never
          fires, leaving an empty column until the visitor scrolls back. Mount
          animations are unconditional, so they cannot strand a card at zero.
        */}
        <FadeIn delay={0.2} y={40}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {others.map((project) => (
              <motion.button
                key={project.id}
                type="button"
                layout
                onClick={() => promote(project.id)}
                aria-label={`Show details for ${project.name}`}
                aria-controls="featured-detail"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 text-left shadow-2xl transition-colors duration-500 hover:border-[#00f2fe]/50 focus-visible:border-[#00f2fe] focus-visible:outline-none"
              >
              <div className="relative aspect-video overflow-hidden border-b border-white/10">
                <img
                  src={project.shots[0].src}
                  alt={project.alt}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="flex items-center gap-2 rounded-full bg-[#00f2fe] px-6 py-3 text-xs font-bold uppercase tracking-wider text-black shadow-lg transition-transform group-hover:scale-105">
                    <span>Feature this project</span>
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </div>

              <div className="flex flex-grow flex-col justify-between p-5 sm:p-6 md:p-8">
                <div>
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#00f2fe]">
                      {project.number}) {project.category}
                    </span>
                    {/* nowrap: at three columns the badge is tight enough to
                        break onto two lines without it. */}
                    <span className="shrink-0 whitespace-nowrap rounded-full bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/80">
                      Live Production
                    </span>
                  </div>

                  <h3 className="mb-3 text-2xl font-black uppercase tracking-tight text-white sm:text-3xl">
                    {project.name}
                  </h3>

                  <p className="mb-6 text-sm font-light leading-relaxed text-[#D7E2EA]/70">
                    {project.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <span className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-[#00f2fe] group-hover:underline">
                    <span>View full details</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
              </motion.button>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
