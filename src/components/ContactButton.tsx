import React from 'react';
import { motion } from 'framer-motion';

interface ContactButtonProps {
  label?: string;
  onClick?: () => void;
  className?: string;
  /* Explicit, and defaulting to "button": a bare <button> is type="submit",
     which would make this component silently submit any form it is dropped
     into. The contact form opts in with type="submit". */
  type?: 'button' | 'submit';
}

export const ContactButton: React.FC<ContactButtonProps> = ({
  label = "Contact Me",
  onClick,
  className = "",
  type = "button",
}) => {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onClick={onClick}
      style={{
        background: 'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        boxShadow: '0px 4px 4px rgba(181, 1, 167, 0.25), inset 4px 4px 12px #7721B1',
        outline: '2px solid white',
        outlineOffset: '-3px',
      }}
      className={`rounded-full text-white font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base transition-opacity duration-200 cursor-pointer ${className}`}
    >
      {label}
    </motion.button>
  );
};
