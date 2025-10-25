"use client";

import React from "react";
import Link from 'next/link';
import {
  Settings,
  LogOut,
  Star,
  Crown,
  ShieldCheck,
  MessageSquare,
  ChevronRight,
  Shield,
  Sparkles as SparklesIcon, // Using the actual icon
  CreditCard,               // Icon for Subscription
  LifeBuoy,                 // Icon for Help
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from 'next-auth/react';
import { useRouter } from "next/navigation";

// --- Reusable Glowing Sparkle using the Sparkles Icon ---
const Sparkle = ({
  size = "w-4 h-4",
  color = "#FFFFFF",
  duration = 2.5,
  delay = 0,
  position,
}: {
  size?: string;
  color?: string;
  duration?: number;
  delay?: number;
  position: { top?: string; left?: string; right?: string; bottom?: string };
}) => (
  <motion.div
    style={{
      position: "absolute",
      ...position,
    }}
    animate={{
      scale: [0.8, 1.2, 0.8],
      opacity: [0, 1, 0],
      filter: [
        `drop-shadow(0 0 4px ${color}90)`, // Suffix for opacity
        `drop-shadow(0 0 10px ${color}90)`,
        `drop-shadow(0 0 4px ${color}90)`,
      ],
    }}
    transition={{
      repeat: Infinity,
      duration: duration,
      delay: delay,
      ease: "easeInOut",
    }}
  >
    <SparklesIcon className={size} style={{ color }} />
  </motion.div>
);

// --- Animated Border Component ---
const AnimatedBorder = () => (
  <div className="absolute top-1/2 left-1/2 w-[calc(100%+2px)] h-[calc(100%+2px)] -z-10 transform -translate-x-1/2 -translate-y-1/2">
    <motion.div
      animate={{ rotate: "360deg" }}
      transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
      className="absolute top-1/2 left-0 w-[200%] h-40 origin-left"
      style={{
        backgroundImage:
          "linear-gradient(0deg, transparent 0%, #a855f7 40%, #a855f7 60%, transparent 100%)",
      }}
    />
  </div>
);

// --- Premium Glowing Stars ---
const StarRating = ({ rating }: { rating: number }) => {
  const totalStars = 5;
  const fullStars = Math.floor(rating);
  const decimalPart = rating - fullStars;

  return (
    <div className="flex items-center gap-1">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        if (starValue <= fullStars) {
          return (
            <motion.div
              key={index}
              animate={{
                filter: [
                  "drop-shadow(0 0 2px #fbbf24)",
                  "drop-shadow(0 0 8px #fbbf24)",
                  "drop-shadow(0 0 2px #fbbf24)",
                ],
              }}
              transition={{
                repeat: Infinity,
                duration: 3,
                ease: "easeInOut",
                delay: index * 0.2,
              }}
            >
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
            </motion.div>
          );
        } else if (starValue === fullStars + 1 && decimalPart > 0) {
          const clipPercentage = decimalPart * 100;
          return (
            <div key={index} className="relative w-5 h-5">
              <Star className="absolute w-5 h-5 text-slate-600 fill-slate-500" />
              <motion.div
                animate={{
                  filter: [
                    "drop-shadow(0 0 2px #fbbf24)",
                    "drop-shadow(0 0 8px #fbbf24)",
                    "drop-shadow(0 0 2px #fbbf24)",
                  ],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 3,
                  ease: "easeInOut",
                  delay: index * 0.2,
                }}
                style={{ clipPath: `inset(0 ${100 - clipPercentage}% 0 0)` }}
                className="absolute top-0 left-0 h-full overflow-hidden"
              >
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </motion.div>
            </div>
          );
        } else {
          return (
            <Star
              key={index}
              className="w-5 h-5 text-slate-600 fill-slate-500"
            />
          );
        }
      })}
    </div>
  );
};

export default function DropdownCard(props: {
  profileMenuOpen: boolean;
  user: any;
}) {
  const router = useRouter();
  const { profileMenuOpen, user } = props;

  const safeUser = user;

  const backendData = {
    rating: 4.7,
    reviews: 1842,
  };

  const cardBackgroundStyle = {
    backgroundColor: "hsl(240, 15%, 9%)",
    backgroundImage: `
      radial-gradient(at 88% 40%, hsl(240, 15%, 9%) 0px, transparent 85%),
      radial-gradient(at 49% 30%, hsl(240, 15%, 9%) 0px, transparent 85%),
      radial-gradient(at 14% 26%, hsl(240, 15%, 9%) 0px, transparent 85%),
      radial-gradient(at 0% 64%, hsl(263, 93%, 56%) 0px, transparent 85%),
      radial-gradient(at 41% 94%, hsl(284, 100%, 84%) 0px, transparent 85%),
      radial-gradient(at 100% 99%, hsl(306, 100%, 57%) 0px, transparent 85%)
    `,
    boxShadow: "0px -16px 24px 0px rgba(255, 255, 255, 0.1) inset",
  };

  return (
    <AnimatePresence>
      {profileMenuOpen && (
        <div
          className="absolute right-0 mt-3 w-[21em] rounded-2xl overflow-hidden font-sans"
          style={cardBackgroundStyle}
        >
          <AnimatedBorder />

          {/* Sparkles Container */}
          <div className="absolute inset-0 z-10 pointer-events-none">
            <Sparkle
              position={{ top: "1.2rem", right: "1.5rem" }}
              duration={2}
              size="w-5 h-5"
            />
            <Sparkle
              position={{ top: "60%", left: "1rem" }}
              duration={3}
              delay={0.5}
              size="w-6 h-6"
              color="#d8b4fe"
            />
            <Sparkle
              position={{ bottom: "3.5rem", right: "30%" }}
              duration={2.5}
              delay={1}
              size="w-4 h-4"
            />
          </div>

          {/* Content */}
          <div className="relative z-20 p-5 text-white">
            <div className="flex items-center gap-4">
              <div className="p-1 rounded-full bg-gradient-to-br from-purple-500 to-pink-500">
                <div className="p-2 rounded-full bg-neutral-900">
                  <Crown className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
              <div>
                <p className="text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 uppercase tracking-wider">
                  Free Member
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <ShieldCheck className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-green-300">Verified</span>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h2 className="text-xl font-bold text-neutral-50">
                {safeUser.firstName + " " + safeUser.lastName}
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                {safeUser.email}
              </p>
            </div>

            <hr className="my-4 border-neutral-800" />

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <StarRating rating={backendData.rating} />
                <span className="font-bold text-neutral-200">
                  {backendData.rating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <MessageSquare className="w-4 h-4" />
                <span>{backendData.reviews.toLocaleString()} Reviews</span>
              </div>
            </div>

            {/* Menu Actions */}
            <div className="mt-5 space-y-1">
              <Link
                href="/dashboard/settings"
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5 text-neutral-400" />
                  <p className="font-medium text-neutral-200">
                    Profile & Settings
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </Link>

              {/* NEW CONTENT TO LENGTHEN CARD */}
              <Link
                href="/dashboard/billing"
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-neutral-400" />
                  <p className="font-medium text-neutral-200">
                    Manage Subscription
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </Link>
              <Link
                href="/support"
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LifeBuoy className="w-5 h-5 text-neutral-400" />
                  <p className="font-medium text-neutral-200">Help & Support</p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </Link>

              {/* SIGN OUT (USUALLY LAST) */}
              <div
                onClick={() => {
                  signOut();
                  router.push("/");
                }}
                className="flex items-center justify-between w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-red-500" />
                  <p className="font-medium text-neutral-200">Sign Out</p>
                </div>
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-4 pt-3 border-t border-neutral-800 text-xs text-neutral-400">
              <Shield className="w-4 h-4 text-green-500" />
              <span>Advanced Protection Enabled</span>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}