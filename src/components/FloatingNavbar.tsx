import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface NavTab {
  id: string;
  label: string;
  href: string;
  icon: (props: { active: boolean; className?: string }) => React.JSX.Element;
}

const NAV_TABS: NavTab[] = [
  {
    id: 'top',
    label: 'Home',
    href: '#top',
    icon: ({ active, className = 'w-5 h-5' }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10.5 12 3l9 7.5V20a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z" />
        <path d="M12 15h.01" />
      </svg>
    ),
  },
  {
    id: 'services',
    label: 'Category',
    href: '#services',
    icon: ({ active, className = 'w-5 h-5' }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="6.5" height="6.5" x="3.5" y="3.5" rx="1.8" />
        <rect width="6.5" height="6.5" x="14" y="3.5" rx="1.8" />
        <rect width="6.5" height="6.5" x="14" y="14" rx="1.8" />
        <rect width="6.5" height="6.5" x="3.5" y="14" rx="1.8" />
      </svg>
    ),
  },
  {
    id: 'projects',
    label: 'Cart',
    href: '#projects',
    icon: ({ active, className = 'w-5 h-5' }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3 3 7v13a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-3-4Z" />
        <path d="M3 7h18" />
        <path d="M16 11a4 4 0 0 1-8 0" />
      </svg>
    ),
  },
  {
    id: 'team',
    label: 'Save',
    href: '#team',
    icon: ({ active, className = 'w-5 h-5' }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m19 21-7-4.5L5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
      </svg>
    ),
  },
  {
    id: 'contact',
    label: 'Profile',
    href: '#/contact',
    icon: ({ active, className = 'w-5 h-5' }) => (
      <svg
        className={className}
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="7.5" r="4" />
        <path d="M20 21a8 8 0 0 0-16 0" />
      </svg>
    ),
  },
];

interface FloatingNavbarProps {
  onContactClick?: () => void;
  className?: string;
}

export const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  onContactClick,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState('top');

  // Sync active tab with user scroll position across sections
  useEffect(() => {
    const handleScroll = () => {
      if (window.location.hash === '#/contact') {
        setActiveTab('contact');
        return;
      }

      const scrollPos = window.scrollY + 260;

      // Section mapping
      const sectionMap = [
        { id: 'top', elementId: 'top' },
        { id: 'services', elementId: 'services' },
        { id: 'projects', elementId: 'projects' },
        { id: 'team', elementId: 'team' },
        { id: 'contact', elementId: 'contact' },
      ];

      for (let i = sectionMap.length - 1; i >= 0; i--) {
        const item = sectionMap[i];
        const el = document.getElementById(item.elementId);
        if (el && scrollPos >= el.offsetTop) {
          setActiveTab(item.id);
          return;
        }
      }

      if (window.scrollY < 120) {
        setActiveTab('top');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTabClick = (tab: NavTab, e: React.MouseEvent) => {
    setActiveTab(tab.id);

    if (tab.id === 'contact') {
      if (onContactClick) {
        e.preventDefault();
        onContactClick();
        return;
      }
      window.location.hash = '#/contact';
      return;
    }

    if (tab.href.startsWith('#')) {
      const targetId = tab.href.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav
      aria-label="Main floating menu"
      className={`fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-auto ${className}`}
    >
      <div className="flex items-center bg-black/95 backdrop-blur-2xl border border-white/[0.12] p-1.5 sm:p-2 rounded-full shadow-[0_16px_40px_rgba(0,0,0,0.8),0_0_1px_1px_rgba(255,255,255,0.05)] transition-all">
        {NAV_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={(e) => handleTabClick(tab, e)}
              className={`relative flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none select-none ${
                isActive
                  ? 'bg-[#222224] text-white px-4 sm:px-5 py-2 sm:py-2.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]'
                  : 'text-white/70 hover:text-white hover:bg-white/[0.08] p-2.5 sm:p-3'
              }`}
              title={tab.label}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-2 sm:gap-2.5">
                <Icon
                  active={isActive}
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                    isActive ? 'text-white scale-105' : 'text-white/80'
                  }`}
                />
                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0, scale: 0.9 }}
                      animate={{ opacity: 1, width: 'auto', scale: 1 }}
                      exit={{ opacity: 0, width: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      className="overflow-hidden whitespace-nowrap text-xs sm:text-sm font-semibold tracking-wide text-white"
                    >
                      {tab.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
