import React from 'react';
import { ExternalLink } from 'lucide-react';

interface LiveProjectButtonProps {
  /** Live deployment URL. Rendered as a real anchor so the browser's normal
      link affordances (middle-click, open-in-new-tab, copy address) all work. */
  url?: string;
  label?: string;
  /** Supply only when the control should perform an action instead of navigate. */
  onClick?: () => void;
}

const BUTTON_CLASS =
  "px-6 py-2.5 sm:px-8 sm:py-3 rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest text-xs sm:text-sm hover:bg-[#00f2fe]/20 hover:border-[#00f2fe] hover:text-white transition-all duration-300 flex items-center gap-2 cursor-pointer shadow-lg";

export const LiveProjectButton: React.FC<LiveProjectButtonProps> = ({
  url,
  label = "Live Project",
  onClick,
}) => {
  const inner = (
    <>
      <span>{label}</span>
      <ExternalLink className="w-4 h-4 text-[#00f2fe]" aria-hidden="true" />
    </>
  );

  /* Action mode: only when a handler is explicitly provided. */
  if (onClick) {
    return (
      <button onClick={onClick} type="button" className={BUTTON_CLASS}>
        {inner}
      </button>
    );
  }

  /* Navigation mode (default). window.open was previously used here, which
     loses every native link affordance and can trip popup blockers. */
  return (
    <a
      href={url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className={BUTTON_CLASS}
      aria-label={`${label} (opens in a new tab)`}
    >
      {inner}
    </a>
  );
};
