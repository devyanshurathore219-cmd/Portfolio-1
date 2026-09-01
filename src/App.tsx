import React, { useEffect, useRef, useState } from 'react';
import { EditorialHero } from './components/EditorialHero';
import { TeamSection } from './components/TeamSection';
import { MarqueeSection } from './components/MarqueeSection';
import { FeaturedClientWebsites } from './components/FeaturedClientWebsites';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { ProjectsSection } from './components/ProjectsSection';
import { ContactButton } from './components/ContactButton';
import { ContactPage } from './components/ContactPage';
import { AdminPortal } from './components/AdminPortal';
import { FadeIn } from './components/FadeIn';
import { Mail, Phone, Instagram, ArrowUpRight, Lock } from 'lucide-react';

/*
  Hash routing for static hosting:
  #/contact -> Contact Page
  #/admin, #/owner -> Private Owner/Admin Leads & Excel Portal
*/
const readRoute = () =>
  window.location.hash.startsWith('#/') ? window.location.hash.slice(2) : '';

export const App: React.FC = () => {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const portfolioScroll = useRef(0);

  const openContact = () => {
    portfolioScroll.current = window.scrollY;
    window.location.hash = '#/contact';
  };

  const closePage = () => {
    window.location.hash = '';
  };

  useEffect(() => {
    if (route === '' && portfolioScroll.current > 0) {
      window.scrollTo(0, portfolioScroll.current);
    }
  }, [route]);

  if (route === 'contact') {
    return <ContactPage onBack={closePage} />;
  }

  if (route === 'admin' || route === 'owner') {
    return <AdminPortal onBack={closePage} />;
  }

  return (
    <div className="bg-[#0C0C0C] text-[#D7E2EA] font-kanit min-h-screen overflow-x-clip selection:bg-white selection:text-black">
      <main>
        <EditorialHero />
        <MarqueeSection />
        <FeaturedClientWebsites />
        <AboutSection />
        <TeamSection />
        <ServicesSection />
        <ProjectsSection />
      </main>

      {/* Footer / Contact Anchor Section */}
      <footer id="contact" className="bg-[#0C0C0C] border-t border-[#D7E2EA]/10 px-6 md:px-10 py-20 text-center flex flex-col items-center justify-center gap-10">
        <FadeIn delay={0.1} y={20}>
          <div className="inline-block text-xs font-mono font-bold text-[#00f2fe] uppercase tracking-widest px-4 py-1.5 rounded-full bg-[#00f2fe]/10 border border-[#00f2fe]/30 mb-4">
            Initiate Project
          </div>
          <h3 className="hero-heading font-black uppercase text-[clamp(2rem,6vw,5rem)] leading-none tracking-tight">
            LET&apos;S BUILD YOUR CUSTOM WEBSITE
          </h3>
        </FadeIn>
        
        <FadeIn delay={0.2} y={20}>
          <p className="text-[#D7E2EA]/70 max-w-lg text-sm md:text-base font-light uppercase tracking-wide">
            DigiWebNow team is available for new custom web projects and e-commerce developments.
          </p>
        </FadeIn>

        {/* Direct Contact Methods Row */}
        <FadeIn delay={0.25} y={20} className="flex flex-wrap justify-center gap-6">
          <a
            href="mailto:infodigiwebnow@gmail.com"
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00f2fe] text-xs sm:text-sm font-semibold text-white transition-all"
          >
            <Mail className="w-4 h-4 text-[#00f2fe]" />
            <span>infodigiwebnow@gmail.com</span>
          </a>

          <a
            href="tel:817-869-9658"
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00f2fe] text-xs sm:text-sm font-semibold text-white transition-all"
          >
            <Phone className="w-4 h-4 text-[#00f2fe]" />
            <span>817-869-9658 / 9870324454</span>
          </a>

          <a
            href="https://instagram.com/officialdigiwebnow"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00f2fe] text-xs sm:text-sm font-semibold text-white transition-all"
          >
            <Instagram className="w-4 h-4 text-[#00f2fe]" />
            <span>@officialdigiwebnow</span>
          </a>
        </FadeIn>

        <FadeIn delay={0.3} y={20} className="flex flex-wrap items-center justify-center gap-4">
          <ContactButton label="Send Project Inquiry" onClick={openContact} />

          <button
            type="button"
            onClick={openContact}
            className="flex items-center gap-2 rounded-full border border-[#D7E2EA]/25 bg-white/5 px-8 py-3 text-xs font-medium uppercase tracking-widest text-[#D7E2EA] transition-colors hover:border-[#00f2fe] hover:text-white focus-visible:border-[#00f2fe] focus-visible:outline-none sm:px-10 sm:py-3.5 sm:text-sm md:px-12 md:py-4 md:text-base"
          >
            <span>Contact</span>
            <ArrowUpRight className="h-4 w-4 text-[#00f2fe]" />
          </button>
        </FadeIn>

        <div className="mt-10 pt-8 border-t border-[#D7E2EA]/10 w-full max-w-6xl flex flex-col sm:flex-row items-center justify-between text-xs text-[#D7E2EA]/50 uppercase tracking-widest gap-4">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} DigiWebNow &bull; Custom Web Engineering.</span>
            {/* Subtle owner access icon */}
            <a
              href="#/admin"
              className="text-white/10 hover:text-[#00f2fe] p-1 transition-colors"
              title="Owner Hub"
            >
              <Lock className="h-3 w-3" />
            </a>
          </div>

          <div className="flex flex-wrap gap-6">
            <a href="https://iyouglobal.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">iYOU Global</a>
            <a href="https://www.gaurfurniture.com/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Gaur Furniture</a>
            <a href="#about" className="hover:text-white transition-colors">About</a>
            <a href="#services" className="hover:text-white transition-colors">Services</a>
            <a href="#/contact" className="hover:text-[#00f2fe] transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
