'use client';

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

export default function PreLoader() {

   const DynamicPlayer = dynamic(
      () => import("@lottiefiles/react-lottie-player").then(mod => mod.Player),
      { ssr: false }
    );
    
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-transparent text-gray-200 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <DynamicPlayer autoplay loop src="/animations/loader.json" style={{ width: "100%", maxWidth: "300px", height: "auto" }} />
      </motion.div>

      <motion.p
        className="mt-6 text-center text-lg sm:text-xl md:text-2xl font-sans tracking-wide bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-pink-400 to-purple-500"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        SkillSwap is preparing your experience...
      </motion.p>
    </div>
  );
}
                   