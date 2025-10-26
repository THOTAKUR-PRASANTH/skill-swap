"use client";

import { useState, useRef, useEffect, use } from "react";
import { motion } from "framer-motion";
import { Bell, ChevronDown, Menu, Search } from "lucide-react";
import Image from "next/image";
import { cn } from "@/utils/functions/cn";
import DropdownCard from "../ui/dropdowncard";
import { SearchCommandMenu } from "@/components";
import { useSession } from "next-auth/react";

export default function DashboardNavbar({
  onToggleSidebar,
  isScrolled,
}: {
   onToggleSidebar: () => void;
  isScrolled: boolean;
}) {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);


  const profileMenuRef = useRef<HTMLDivElement>(null);
  const user = useSession().data?.user;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
 <header
    className={cn(
        "sticky top-0 pt-0.5 pb-1.5 inset-x-0 h-20 w-full z-40 flex items-center justify-between px-4 md:px-8 select-none transition-all duration-300",
        isScrolled
            ? "border-b border-neutral-800 bg-neutral-950/20 backdrop-blur-sm shadow-lg shadow-black/20"
            : "border-b border-transparent bg-neutral-950"
    )}
>


        {/* Left Section */}
        <div className="flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-full text-neutral-300 hover:bg-neutral-800"
          >
            <Menu className="w-6 h-6" />
          </motion.button>
        </div>
        <div className="flex items-center gap-2">
          
          <button
            onClick={() => setIsSearchMenuOpen(true)}
            className="group hidden md:flex relative items-center justify-center h-9 px-4 overflow-hidden rounded-full bg-neutral-950"
          >
            <div
              className="absolute inset-[-200%] animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#a855f7_45%,white_50%,#a855f7_55%,transparent_100%)]"
            />
            <div className="absolute inset-[1.5px] rounded-full bg-neutral-900 group-hover:bg-neutral-800/80 transition-colors duration-300"></div>
            <div className="relative z-10 text-sm text-neutral-300 group-hover:text-white transition-colors flex items-center gap-2">
              <Search className="w-4 h-4" />
              <span>Search...</span>
            </div>
          </button>

      
          <button
            onClick={() => setIsSearchMenuOpen(true)}
            className="group md:hidden flex relative items-center justify-center h-10 w-10 overflow-hidden rounded-full bg-neutral-950"
          >
            <div
              className="absolute inset-[-200%] animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#a855f7_45%,white_50%,#a855f7_55%,transparent_100%)]"
            />
            <div className="absolute inset-[1.5px] rounded-full bg-neutral-900 group-hover:bg-neutral-800/80 transition-colors duration-300"></div>
            <div className="relative z-10 text-neutral-300 group-hover:text-white transition-colors">
              <Search className="w-5 h-5" />
            </div>
          </button>

    
          <motion.button className="relative p-2.5 rounded-full text-neutral-300 hover:bg-neutral-800">
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full animate-ping opacity-30"></div>
            <Bell className="w-5 h-5" />
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold shadow-lg border-2 border-neutral-900"
            >
              3
            </motion.span>
          </motion.button>

          {/* Profile Dropdown */}
          <div className="relative" ref={profileMenuRef}>
            <motion.button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center gap-2 rounded-full hover:bg-neutral-800 transition-all duration-200 p-1"
            >
              <div className="relative flex-shrink-0">
                     <Image
                        src={user?.image || "/image.png"}
                        alt="Profile"
                        width={36}
                        height={36}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-neutral-700"
                      />

                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-neutral-900 rounded-full"></span>
              </div>
              <div className="hidden md:flex items-center gap-1 pr-2">
                <p className="text-sm font-medium text-neutral-200">{user?.name}</p>
                <ChevronDown
                  className={`w-4 h-4 text-neutral-500 transition-transform duration-300 ${
                    profileMenuOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </motion.button>
            <DropdownCard profileMenuOpen={profileMenuOpen} user={user} />
          </div>
        </div>
      </header>

      <SearchCommandMenu
        isOpen={isSearchMenuOpen}
        onClose={() => setIsSearchMenuOpen(false)}
      />

      {/* --- Self-contained animation styles --- */}
      <style jsx global>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 6s linear infinite;
        }
      `}</style>
    </>
  );
}

