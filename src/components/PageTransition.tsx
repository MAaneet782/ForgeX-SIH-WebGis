import { motion } from "framer-motion";
import React from "react";

interface PageTransitionProps {
  children: React.ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="h-full w-full" // Ensure it takes full space for consistent transitions
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;