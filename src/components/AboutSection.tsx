import React from 'react';
import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';
import { ContactButton } from './ContactButton';
import { Rocket, ShieldCheck, Cpu, Code2 } from 'lucide-react';

const MOON_ICON = "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png";
const OBJECT_3D_LEFT = "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png";
const LEGO_ICON = "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png";
const GROUP_3D_RIGHT = "https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png";

const ABOUT_TEXT = "At DigiWebNow, we specialize in bespoke custom web architecture, e-commerce storefronts, and high-performance digital experiences with over five years of hands-on engineering experience. Let's build something extraordinary!";

export const AboutSection: React.FC = () => {
  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="about" className="relative min-h-screen flex flex-col items-center justify-center px-5 sm:px-8 md:px-10 py-24 bg-[#0C0C0C] overflow-hidden">
      {/* 4 Corner Decorative 3D Images */}
      <FadeIn
        delay={0.1}
        duration={0.9}
        y={0}
        className="absolute top-8 left-8 w-24 sm:w-32 md:w-40 pointer-events-none select-none z-0"
      >
        <img
          src={MOON_ICON}
          alt=""
          className="w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)] transform hover:scale-105 transition-transform"
        />
      </FadeIn>

      <FadeIn
        delay={0.15}
        duration={0.9}
        y={0}
        className="absolute bottom-10 left-6 sm:left-12 w-28 sm:w-36 md:w-44 pointer-events-none select-none z-0"
      >
        <img
          src={OBJECT_3D_LEFT}
          alt=""
          className="w-full h-auto object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)] animate-pulse"
        />
      </FadeIn>

      <FadeIn
        delay={0.2}
        duration={0.9}
        y={0}
        className="absolute top-10 right-8 w-20 sm:w-28 md:w-36 pointer-events-none select-none z-0"
      >
        <img
          src={LEGO_ICON}
          alt=""
          className="w-full h-auto object-contain filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
        />
      </FadeIn>

      <FadeIn
        delay={0.25}
        duration={0.9}
        y={0}
        className="absolute bottom-12 right-6 sm:right-12 w-28 sm:w-36 md:w-48 pointer-events-none select-none z-0"
      >
        <img
          src={GROUP_3D_RIGHT}
          alt=""
          className="w-full h-auto object-contain filter drop-shadow-[0_20px_40px_rgba(0,0,0,0.6)]"
        />
      </FadeIn>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl text-center">
        {/* Heading */}
        <FadeIn delay={0} y={40}>
          <h2 className="hero-heading font-black uppercase leading-none tracking-tight text-[clamp(2.5rem,10vw,140px)]">
            ABOUT DIGIWEBNOW
          </h2>
        </FadeIn>

        {/* Animated Paragraph */}
        <div className="mt-8 sm:mt-12 md:mt-14 text-[clamp(1rem,1.8vw,1.3rem)]">
          <AnimatedText text={ABOUT_TEXT} />
        </div>

        {/* Credentials & Quality Criteria Grid */}
        <FadeIn delay={0.2} y={30} className="w-full mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00f2fe]/40 transition-all">
            <Rocket className="w-6 h-6 text-[#00f2fe] mb-2" />
            <div className="text-white font-bold text-sm">Custom Engineering</div>
            <div className="text-xs text-[#D7E2EA]/60">High-Performance Code</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00f2fe]/40 transition-all">
            <Cpu className="w-6 h-6 text-[#00f2fe] mb-2" />
            <div className="text-white font-bold text-sm">Full-Stack Cloud</div>
            <div className="text-xs text-[#D7E2EA]/60">Scalable Architecture</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00f2fe]/40 transition-all">
            <Code2 className="w-6 h-6 text-[#00f2fe] mb-2" />
            <div className="text-white font-bold text-sm">UI/UX Design</div>
            <div className="text-xs text-[#D7E2EA]/60">Figma & Design Systems</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#00f2fe]/40 transition-all">
            <ShieldCheck className="w-6 h-6 text-[#00f2fe] mb-2" />
            <div className="text-white font-bold text-sm">Enterprise Quality</div>
            <div className="text-xs text-[#D7E2EA]/60">Secure, Fast & SEO Ready</div>
          </div>
        </FadeIn>

        {/* Contact Button */}
        <div className="mt-12 sm:mt-16">
          <FadeIn delay={0.3} y={20}>
            <ContactButton onClick={scrollToContact} label="Connect With DigiWebNow" />
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
