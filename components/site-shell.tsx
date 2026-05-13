"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { Footer, Header } from "@/components/portfolio";

const pageVariants = {
  initial: {
    opacity: 0,
    y: 18,
    filter: "blur(8px)"
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)"
  },
  exit: {
    opacity: 0,
    y: -12,
    filter: "blur(6px)"
  }
};

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <>
      <Header />
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
          className="min-h-[calc(100vh-118px)]"
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Footer />
    </>
  );
}
