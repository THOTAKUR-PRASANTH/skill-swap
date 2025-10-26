"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Home, 
  CreditCard, 
  BarChart3,
  Bell,
  X,
  LogOut,
  PanelLeftOpen
} from 'lucide-react';

import Image from 'next/image';
import { useSession , signOut } from 'next-auth/react';
import { cn } from '@/utils/functions/cn';
import { useSidebar } from "@/app/context/SidebarContext";




function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const user = useSession().data?.user;
  const { sidebarOpen, toggleSidebar, closeSidebar } = useSidebar();

  const navigation = [
   { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Analytics", href: "/secure", icon: BarChart3 },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Notifications", href: "#", icon: Bell },
    // simulate more items to show scroll
    { name: "Reports", href: "#", icon: BarChart3 },
    { name: "Projects", href: "#", icon: Home },
    { name: "Support", href: "#", icon: Bell },
    { name: "Settings", href: "#", icon: CreditCard },

    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Analytics", href: "/secure", icon: BarChart3 },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Notifications", href: "#", icon: Bell },
    // simulate more items to show scroll
    { name: "Reports", href: "#", icon: BarChart3 },
    { name: "Projects", href: "#", icon: Home },
    { name: "Support", href: "#", icon: Bell },
    { name: "Settings", href: "#", icon: CreditCard },
  ];

  if (!sidebarOpen) return null; 

  return (
    <>
      {/* Overlay (click to close) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-md"
        onClick={closeSidebar}
      />

      {/* Sidebar Panel */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className="fixed inset-y-0 left-0 z-[100000] flex w-72 flex-col bg-neutral-900/90 backdrop-blur-3xl rounded-r-3xl border-r border-neutral-700/60 shadow-2xl"
        onClick={(e) => e.stopPropagation()} // ✅ prevents accidental close
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-800/80">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            SkillSwap
          </span>
          <button
            onClick={closeSidebar}
            className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5 text-neutral-300" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <LayoutGroup>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200",
                    isActive
                      ? "text-white"
                      : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="mobile-active-pill"
                      className="absolute inset-0 bg-purple-600/20 rounded-xl"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  <item.icon
                    className={cn(
                      "relative w-5 h-5",
                      isActive ? "text-purple-300" : "text-neutral-500"
                    )}
                  />
                  <span className="relative font-medium">{item.name}</span>
                </Link>
              );
            })}
          </LayoutGroup>
        </nav>

        <div className="p-4 border-t border-neutral-800/80">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 transition-colors group"
          >

         
             <Image
              src={user?.image || "/image.png"}
              alt="Profile"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-700"
            />
           

            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-200 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-neutral-400 truncate">View Profile</p>
            </div>
          </Link>

          <button
            onClick={() => {
              signOut();
              router.push("/");
              closeSidebar();
            }}
            className="mt-2 w-full flex items-center gap-3 px-2 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors rounded-lg"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}


interface DesktopSidebarProps {
  sidebarOpen: boolean;
}

export default function DesktopSidebar({ sidebarOpen }: DesktopSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const user = useSession().data?.user;
  const mainNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Analytics", href: "/secure", icon: BarChart3 },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Notifications", href: "#", icon: Bell },
    // simulate more items to show scroll
    { name: "Reports", href: "#", icon: BarChart3 },
    { name: "Projects", href: "#", icon: Home },
    { name: "Support", href: "#", icon: Bell },
    { name: "Settings", href: "#", icon: CreditCard },

    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Analytics", href: "/secure", icon: BarChart3 },
    { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
    { name: "Notifications", href: "#", icon: Bell },
    // simulate more items to show scroll
    { name: "Reports", href: "#", icon: BarChart3 },
    { name: "Projects", href: "#", icon: Home },
    { name: "Support", href: "#", icon: Bell },
    { name: "Settings", href: "#", icon: CreditCard },
  ];

  

  return (
    <div>
      {/* --- DESKTOP SIDEBAR --- */}
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:flex lg:flex-col lg:sticky lg:top-0 h-screen bg-neutral-950/70 backdrop-blur-3xl border-r border-neutral-800 overflow-hidden"
      >
        {/* --- Header --- */}
        <div className="flex h-14 items-center px-4 border-b border-neutral-800 flex-shrink-0">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-full hover:bg-neutral-800 transition-colors"
          >
            <PanelLeftOpen
              className={`w-5 h-5 text-neutral-400 transition-transform duration-500 ease-in-out ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.1, ease: "easeInOut" }}
                className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent"
              >
                SkillSwap
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* --- Scrollable Navigation --- */}
        <nav
          className="flex-1 px-3 py-4 space-y-1 overflow-y-auto hide-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <LayoutGroup>
            {mainNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  title={isCollapsed ? item.name : undefined}
                  className={cn(
                    "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200",
                    isCollapsed && "justify-center",
                    isActive
                      ? "text-white"
                      : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="desktop-active-pill"
                      className="absolute inset-0 bg-purple-600/20 rounded-lg"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  <item.icon
                    className={cn(
                      "relative w-5 h-5 flex-shrink-0",
                      isActive ? "text-purple-300" : "text-neutral-500 group-hover:text-white"
                    )}
                  />
                  {!isCollapsed && (
                    <span className="relative font-medium truncate">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </LayoutGroup>
        </nav>

        {/* --- Footer --- */}
        <div className="px-3 py-4 border-t border-neutral-800 flex-shrink-0">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 transition-colors group"
            title={isCollapsed ? "Profile & Settings" : undefined}
          >
          
             <Image
              src={user?.image ?? "/image.png"}
              alt="Profile"
              width={40}
              height={40}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-neutral-700 flex-shrink-0"
            />
           
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-200 truncate">{user?.name}</p>
                <p className="text-xs text-neutral-400 truncate">View Profile</p>
              </div>
            )}
          </Link>

          <button
            onClick={() => {
              signOut();
              router.push("/");
            }}
            className="mt-2 w-full flex items-center gap-3 p-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors rounded-lg"
            role="menuitem"
            title={isCollapsed ? "Logout" : undefined}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </motion.div>

      {/* --- MOBILE SIDEBAR --- */}
      <div className="lg:hidden">
        <AnimatePresence>{sidebarOpen && <Sidebar />}</AnimatePresence>
      </div>

      {/* --- Hidden Scrollbar CSS --- */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}
