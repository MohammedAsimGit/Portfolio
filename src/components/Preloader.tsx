"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Preloader() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ 
            y: "-100dvh",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] } 
          }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0F172A]"
        >
          <div className="flex flex-col items-center">
            {/* Styled MA Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, rotate: -10 }}
              animate={{ 
                scale: 1, 
                opacity: 1,
                rotate: 0,
                transition: { duration: 0.8, ease: "easeOut" } 
              }}
              className="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 text-3xl font-extrabold text-white shadow-[0_0_50px_rgba(59,130,246,0.3)]"
            >
              MA
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 rounded-2xl border-2 border-blue-400/30"
              />
            </motion.div>
            
            {/* Progress Bar Container */}
            <div className="mt-8 w-32 h-[3px] bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ left: "-100%" }}
                animate={{ left: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut", repeat: 0 }}
                className="relative h-full bg-gradient-to-r from-blue-500 to-purple-500 w-full"
              />
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              transition={{ delay: 0.4 }}
              className="mt-4 text-xs font-mono tracking-widest text-slate-400 uppercase"
            >
              Mohammed Asim
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
