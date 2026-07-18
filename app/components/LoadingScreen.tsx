"use client";

import Image from "next/image";
import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";
import Logo from "../../public/image/لوجو الصفحة.png";

/** مركز الشعار تقريباً على الشاشة */
const CIRCLE_AT = "50% 42%";

const contentStagger: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.22 + index * 0.08,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

export default function LoadingScreen() {
  const reducedMotion = useReducedMotion();

  const circleTransition: Transition = reducedMotion
    ? { duration: 0.2 }
    : { duration: 0.9, ease: [0.4, 0, 0.2, 1] };

  return (
    <motion.div
      className="loading-overlay fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-white"
      role="status"
      aria-live="polite"
      aria-label="جاري التحميل"
      style={{ willChange: "clip-path" }}
      initial={
        reducedMotion
          ? { opacity: 0 }
          : { clipPath: `circle(0% at ${CIRCLE_AT})` }
      }
      animate={
        reducedMotion
          ? { opacity: 1 }
          : { clipPath: `circle(160% at ${CIRCLE_AT})` }
      }
      exit={
        reducedMotion
          ? { opacity: 0 }
          : { clipPath: `circle(0% at ${CIRCLE_AT})` }
      }
      transition={circleTransition}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="loading-glow loading-glow-red" />
        <div className="loading-glow loading-glow-green" />
      </div>

      <div className="relative flex flex-col items-center px-6 text-center">
        <motion.div
          className="relative mb-8 flex h-48 w-48 items-center justify-center sm:h-52 sm:w-52"
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, scale: 0.85 }}
          animate={reducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            aria-hidden
            className="loading-brand-ring absolute inset-0 rounded-full p-[5px]"
          >
            <div className="flex h-full w-full items-center justify-center rounded-full bg-white">
              <Image
                src={Logo}
                alt="شعار جمعية الخدمة العامة"
                width={168}
                height={168}
                priority
                className="loading-logo h-[88%] w-[88%] object-contain"
              />
            </div>
          </div>
        </motion.div>

        <div className="space-y-1.5">
          <motion.h2
            custom={0}
            variants={contentStagger}
            initial="hidden"
            animate="visible"
            className="text-xl font-bold text-[#d2151e] sm:text-2xl"
          >
            جمعية الخدمة العامة
          </motion.h2>
          <motion.p
            custom={1}
            variants={contentStagger}
            initial="hidden"
            animate="visible"
            className="text-sm font-medium tracking-wide text-[#0f2233] sm:text-base"
          >
            Public Aid Society
          </motion.p>
          <motion.p
            custom={2}
            variants={contentStagger}
            initial="hidden"
            animate="visible"
            className="pt-1 text-sm text-[#5b6b7a] sm:text-base"
          >
            رعاية صحية متكاملة برؤية إنسانية
          </motion.p>
        </div>

        <motion.div
          custom={3}
          variants={contentStagger}
          initial="hidden"
          animate="visible"
          className="mt-8 w-56 overflow-hidden rounded-full bg-[#e4edf2] sm:w-64"
        >
          <div className="loading-progress h-1 rounded-full" />
        </motion.div>
      </div>
    </motion.div>
  );
}
