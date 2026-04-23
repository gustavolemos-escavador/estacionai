"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

const variants: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-10% 0px -10% 0px" }}
      variants={{
        hidden: { ...variants.hidden, y },
        visible: {
          ...variants.visible,
          transition: {
            duration: 0.7,
            ease: [0.22, 1, 0.36, 1],
            delay,
          },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
