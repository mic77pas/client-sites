"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

export default function PageLoader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black"
        >
          <motion.div
            animate={{ scale: 1, rotate: 360 }}
            transition={{
              duration: 1.2,
              ease: "anticipate",
              repeat: Infinity,
            }}
          >
            <Image
              src="/kf.png"
              alt="K&F Logo"
              width={120}
              height={120}
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
