import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface NavTab {
  id: string;
  label: string;
  href: string;
  icon: (props: { active: boolean; className?: string }) => React.JSX.Element;
}

export const NAV_TABS: NavTab[] = [
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
    id: 'about',
    label: 'About',
    href: '#about',
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
    id: 'services',
    label: 'Services',
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
    label: 'Projects',
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
    id: 'contact',
    label: 'Contact',
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

  // Track hash changes & scroll position to accurately update active tab
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#/contact') {
        setActiveTab('contact');
      } else if (!window.location.hash || window.location.hash === '#top') {
        setActiveTab('top');
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.location.hash === '#/contact') return;

      const scrollPos = window.scrollY + 280;

      // Ordered as sections appear down the page
      const sectionOrder = [
        { id: 'top', elementId: 'top' },
        { id: 'about', elementId: 'about' },
        { id: 'services', elementId: 'services' },
        { id: 'projects', elementId: 'projects' },
      ];

      for (let i = sectionOrder.length - 1; i >= 0; i--) {
        const item = sectionOrder[i];
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
    e.preventDefault();
    e.stopPropagation();
    setActiveTab(tab.id);

    if (tab.id === 'contact') {
      if (onContactClick) {
        onContactClick();
      } else {
        window.location.hash = '#/contact';
      }
      return;
    }

    // If currently on a sub-route (e.g. #/contact or #/admin), reset hash to return to main portfolio
    if (window.location.hash.startsWith('#/')) {
      window.location.hash = '';
      setTimeout(() => {
        const targetId = tab.href.replace('#', '');
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
      return;
    }

    const targetId = tab.href.replace('#', '');
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Main floating menu"
      className={`fixed bottom-4 sm:bottom-auto sm:top-6 left-1/2 -translate-x-1/2 z-50 flex items-center justify-center pointer-events-auto max-w-[94vw] ${className}`}
    >
      <div className="flex items-center bg-white/95 backdrop-blur-2xl border border-white/60 p-1 sm:p-2 rounded-full shadow-[0_16px_45px_rgba(0,0,0,0.5),0_2px_8px_rgba(255,255,255,0.2)] transition-all">
        {NAV_TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={(e) => handleTabClick(tab, e)}
              className={`relative flex items-center justify-center rounded-full transition-all duration-300 focus:outline-none select-none ${
                isActive
                  ? 'bg-black text-white px-3 sm:px-5 py-1.5 sm:py-2.5 shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
                  : 'text-neutral-600 hover:text-black hover:bg-neutral-100/80 p-2 sm:p-3'
              }`}
              title={tab.label}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className="flex items-center gap-1.5 sm:gap-2.5">
                <Icon
                  active={isActive}
                  className={`w-3.5 h-3.5 sm:w-5 sm:h-5 transition-transform duration-200 ${
                    isActive ? 'text-white scale-105' : 'text-neutral-700'
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
