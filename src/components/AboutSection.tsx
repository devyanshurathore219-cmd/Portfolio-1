import React from 'react';
import { FadeIn } from './FadeIn';
import { AnimatedText } from './AnimatedText';
import { ContactButton } from './ContactButton';
import { GraduationCap, Award, Cpu, Code2 } from 'lucide-react';

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
        x={-80}
        y={0}
        className="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] z-0 pointer-events-none opacity-60"
      >
        <img
          src={MOON_ICON}
          alt="3D Moon Icon"
          className="floaty w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain drop-shadow-xl"
          style={{
            '--float-duration': '6.5s',
            '--float-delay': '0.2s',
            '--float-distance': '16px',
            '--float-tilt': '3deg',
          } as React.CSSProperties}
        />
      </FadeIn>

      <FadeIn
        delay={0.25}
        duration={0.9}
        x={-80}
        y={0}
        className="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] z-0 pointer-events-none opacity-60"
      >
        <img
          src={OBJECT_3D_LEFT}
          alt="3D Shape Object"
          className="floaty w-[100px] sm:w-[140px] md:w-[180px] h-auto object-contain drop-shadow-xl"
          style={{
            '--float-duration': '8s',
            '--float-delay': '0.8s',
            '--float-distance': '12px',
            '--float-tilt': '-4deg',
          } as React.CSSProperties}
        />
      </FadeIn>

      <FadeIn
        delay={0.15}
        duration={0.9}
        x={80}
        y={0}
        className="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] z-0 pointer-events-none opacity-60"
      >
        <img
          src={LEGO_ICON}
          alt="3D Lego Icon"
          className="floaty w-[120px] sm:w-[160px] md:w-[210px] h-auto object-contain drop-shadow-xl"
          style={{
            '--float-duration': '7.2s',
            '--float-delay': '0.4s',
            '--float-distance': '14px',
            '--float-tilt': '-3deg',
          } as React.CSSProperties}
        />
      </FadeIn>

      <FadeIn
        delay={0.3}
        duration={0.9}
        x={80}
        y={0}
        className="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] z-0 pointer-events-none opacity-60"
      >
        <img
          src={GROUP_3D_RIGHT}
          alt="3D Group Object"
          className="floaty w-[130px] sm:w-[170px] md:w-[220px] h-auto object-contain drop-shadow-xl"
          style={{
            '--float-duration': '9s',
            '--float-delay': '1.2s',
            '--float-distance': '18px',
            '--float-tilt': '4deg',
          } as React.CSSProperties}
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

        {/* Credentials Grid */}
        <FadeIn delay={0.2} y={30} className="w-full mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <GraduationCap className="w-6 h-6 text-[#00f2fe] mb-2" />
            <div className="text-white font-bold text-sm">BCA Graduate</div>
            <div className="text-xs text-[#D7E2EA]/60">MERI Institute</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <Award className="w-6 h-6 text-[#00f2fe] mb-2" />
            <div className="text-white font-bold text-sm">DCA Certification</div>
            <div className="text-xs text-[#D7E2EA]/60">Computer Applications</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <Cpu className="w-6 h-6 text-[#00f2fe] mb-2" />
            <div className="text-white font-bold text-sm">Web Architecture</div>
            <div className="text-xs text-[#D7E2EA]/60">Full-Stack Custom Code</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <Code2 className="w-6 h-6 text-[#00f2fe] mb-2" />
            <div className="text-white font-bold text-sm">Adobe Photoshop</div>
            <div className="text-xs text-[#D7E2EA]/60">UI/UX & Graphics</div>
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
