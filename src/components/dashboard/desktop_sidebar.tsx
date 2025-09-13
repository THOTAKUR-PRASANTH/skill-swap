"use client";
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
  PanelLeftClose,
  PanelLeftOpen
} from 'lucide-react';
import type { Dispatch, SetStateAction } from 'react';
import { useUserContext } from '@/lib/userContextProvider';
import Image from 'next/image';
import { useClerk } from '@clerk/nextjs';
import { cn } from '@/utils/functions/cn';

// --- MOBILE SIDEBAR (UNCHANGED) ---
function Sidebar({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useClerk();
  const user = useUserContext();
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Analytics', href: '/secure', icon: BarChart3 },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Notifications', href: '#', icon: Bell },
  ];

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-[99999] bg-black/50 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: 0 }}
        exit={{ x: "-100%" }}
        transition={{ type: "spring", stiffness: 400, damping: 40 }}
        className="fixed inset-y-0 left-0 z-[100000] flex w-72 flex-col bg-neutral-900/80 backdrop-blur-3xl rounded-r-3xl border-r border-neutral-700/60"
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-800/80">
          <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            SkillSwap
          </span>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-neutral-800 transition-colors">
            <X className="w-5 h-5 text-neutral-300" />
          </button>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          <LayoutGroup>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn("relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200", isActive ? "text-white" : "text-neutral-400 hover:bg-neutral-800 hover:text-white")}
                >
                  {isActive && (<motion.div layoutId="mobile-active-pill" className="absolute inset-0 bg-purple-600/20 rounded-xl" transition={{ type: 'spring', duration: 0.6 }} />)}
                  <item.icon className={cn("relative w-5 h-5", isActive ? "text-purple-300" : "text-neutral-500")} />
                  <span className="relative font-medium">{item.name}</span>
                </a>
              );
            })}
          </LayoutGroup>
        </nav>
        
        <div className="p-4 border-t border-neutral-800/80">
          <a href="/dashboard/settings" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 transition-colors group">
            <Image src={user?.imageUrl ?? ''} alt="Profile" width={40} height={40} className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-700" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-neutral-200 truncate">{user?.firstName}</p>
              <p className="text-xs text-neutral-400 truncate">View Profile</p>
            </div>
          </a>
          <button onClick={() => signOut(() => router.push("/"))} className="mt-2 w-full flex items-center gap-3 px-2 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors rounded-lg" role="menuitem">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>
    </>
  );
}


// --- DESKTOP SIDEBAR WITH INSTANT CONTENT LOADING ---
interface DesktopSidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: Dispatch<SetStateAction<boolean>>;
}
export default function DesktopSidebar({ sidebarOpen, setSidebarOpen }: DesktopSidebarProps){
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const user = useUserContext();
  const { signOut } = useClerk();
 
  const mainNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Analytics', href: '/secure', icon: BarChart3 },
    { name: 'Billing', href: '/dashboard/billing', icon: CreditCard },
    { name: 'Notifications', href: '#', icon: Bell },
  ];

  return(
    <div>
      <motion.div
        initial={false}
        animate={{ width: isCollapsed ? 80 : 256 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="hidden lg:flex lg:flex-col lg:sticky lg:top-0 h-screen bg-neutral-950/70 backdrop-blur-3xl border-r border-neutral-800"
      >
        <div className="flex h-14 items-center px-4 border-b border-neutral-800">
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-2 rounded-full hover:bg-neutral-800 transition-colors">
            <PanelLeftOpen className={`w-5 h-5 text-neutral-400 transition-transform duration-500 ease-in-out ${isCollapsed ? 'rotate-180' : ''}`} />
          </button>
          <AnimatePresence>{!isCollapsed && (<motion.span initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.1, ease: 'easeInOut' }} 
          className="ml-3 text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            SkillSwap</motion.span>)}
            </AnimatePresence>
        </div>
    
        <nav className="flex-1 px-3 py-4 space-y-1">
          <LayoutGroup>
            {mainNavigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  title={isCollapsed ? item.name : undefined}
                  className={cn("relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200", isCollapsed && "justify-center", isActive ? "text-white" : "text-neutral-400 hover:bg-neutral-800 hover:text-white")}
                >
                  {isActive && (<motion.div layoutId="desktop-active-pill" className="absolute inset-0 bg-purple-600/20 rounded-lg" transition={{ type: 'spring', duration: 0.6 }} />)}
                  <item.icon className={cn("relative w-5 h-5 flex-shrink-0", isActive ? "text-purple-300" : "text-neutral-500 group-hover:text-white")} />
                  {/* --- CHANGED: Removed motion.span for instant load --- */}
                  {!isCollapsed && (<span className="relative font-medium truncate">{item.name}</span>)}
                </a>
              );
            })}
          </LayoutGroup>
        </nav>
    
        <div className="px-3 py-4 border-t border-neutral-800">
           <a href="/dashboard/settings" className="flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 transition-colors group" title={isCollapsed ? 'Profile & Settings' : undefined}>
            <Image src={user?.imageUrl ?? ''} alt="Profile" width={40} height={40} className="w-9 h-9 rounded-full object-cover ring-2 ring-neutral-700 flex-shrink-0" />
            {/* --- CHANGED: Removed motion.div for instant load --- */}
            {!isCollapsed && (
              <div className="min-w-0">
                <p className="text-sm font-semibold text-neutral-200 truncate">{user?.firstName}</p>
                <p className="text-xs text-neutral-400 truncate">View Profile</p>
              </div>
            )}
          </a>
          <button onClick={() => signOut(() => router.push("/"))} className="mt-2 w-full flex items-center gap-3 p-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors rounded-lg" role="menuitem" title={isCollapsed ? 'Logout' : undefined}>
            <LogOut className="w-4 h-4 flex-shrink-0" />
            {/* --- CHANGED: Removed motion.span for instant load --- */}
            {!isCollapsed && (<span className="font-medium">Logout</span>)}
          </button>
        </div>
      </motion.div>
      
      <div className="lg:hidden">
        <AnimatePresence>
          {sidebarOpen && <Sidebar onClose={() => setSidebarOpen(false)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}