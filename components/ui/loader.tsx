"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#EECE84]/20 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white/50 backdrop-blur-xl rounded-[12px] p-10 shadow-2xl"
        style={{
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <div className="relative flex flex-col items-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.5,
              ease: "easeOut",
            }}
            className="mb-8"
          >
            <Loader2 className="h-14 w-14 animate-spin" />
          </motion.div>
          
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              delay: 0.3,
              duration: 0.5,
              ease: "easeOut",
            }}
            className="text-center"
          >
            <h2 className="text-xl font-semibold mb-2">Loading</h2>
            <div className="flex space-x-1 justify-center items-center">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  ease: "easeInOut",
                  repeatDelay: 0.2,
                }}
                className="w-2 h-2 rounded-full bg-black"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  ease: "easeInOut",
                  delay: 0.2,
                  repeatDelay: 0.2,
                }}
                className="w-2 h-2 rounded-full bg-black"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.8,
                  ease: "easeInOut",
                  delay: 0.4,
                  repeatDelay: 0.2,
                }}
                className="w-2 h-2 rounded-full bg-black"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.5,
              duration: 0.5,
              ease: "easeOut",
            }}
            className="mt-8 text-sm"
          >
            Please wait while we set things up for you.
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};