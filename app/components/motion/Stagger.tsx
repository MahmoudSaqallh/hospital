"use client";

import { motion, type Variants } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

const groupVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

type GroupProps = {
  children: ReactNode;
  className?: string;
  /** Prefer animate (default) so async-loaded cards never stay invisible */
  mode?: "animate" | "inView";
  once?: boolean;
};

/** Container that staggers the reveal of its <StaggerItem> children. */
export function StaggerGroup({
  children,
  className,
  mode = "animate",
  once = true,
}: GroupProps) {
  if (mode === "inView") {
    return (
      <motion.div
        className={className}
        variants={groupVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount: 0.05, margin: "0px 0px -40px 0px" }}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      variants={groupVariants}
      initial="hidden"
      animate="show"
    >
      {children}
    </motion.div>
  );
}

type ItemProps = {
  children: ReactNode;
  className?: string;
};

/** Individual staggered item. Also lifts slightly on hover. */
export function StaggerItem({ children, className }: ItemProps) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}
