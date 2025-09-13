"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Search, Home, BarChart3, Bell, CreditCard, MessageSquareQuote, // CORRECTED: Was MessageSquareQuoteIcon
  PlusCircle, FolderKanban, Settings, LogOut, User, Sparkles,
  Users, FileText, LifeBuoy, Palette, Shield, CreditCard as CreditCardIcon, Repeat, BookOpen
} from 'lucide-react';

// Expanded and colorful search data
const searchData = [
  {
    category: "Navigation",
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: Home, color: 'text-sky-400' },
      { name: 'My Projects', href: '#', icon: FolderKanban, color: 'text-amber-400' },
      { name: 'Team Members', href: '#', icon: Users, color: 'text-teal-400' },
      { name: 'Analytics', href: '/secure', icon: BarChart3, color: 'text-rose-400' },
    ]
  },
  {
    category: "Actions",
    items: [
      { name: 'Start a New Swap', href: '#', icon: PlusCircle, color: 'text-emerald-400' },
      { name: 'Write a Review', href: '#', icon: FileText, color: 'text-indigo-400' },
      { name: 'Suggest a Feature', href: '#', icon: Sparkles, color: 'text-yellow-400' },
      { name: 'Contact Support', href: '#', icon: MessageSquareQuote, color: 'text-blue-400' },
      
      // NEW items for Skill Swap app
      { name: 'Browse Skills', href: '/skills', icon: Search, color: 'text-purple-400' },
      { name: 'My Swaps', href: '/my-swaps', icon: Repeat, color: 'text-green-400' },
      { name: 'Learning Progress', href: '/progress', icon: BookOpen, color: 'text-orange-400' },
    ]
  },
  {
    category: "Settings",
    items: [
      { name: 'Manage Profile', href: '#', icon: User, color: 'text-lime-400' },
      { name: 'Appearance', href: '#', icon: Palette, color: 'text-pink-400' },
      { name: 'Security', href: '#', icon: Shield, color: 'text-red-400' },
      { name: 'Billing', href: '/dashboard/profile', icon: CreditCard, color: 'text-cyan-400' },
    ]
  }
];


type SearchItem = { name: string; href: string; icon: React.ElementType; color: string; };

type SearchCommandMenuProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function SearchCommandMenu({ isOpen, onClose }: SearchCommandMenuProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const filteredData = query
    ? searchData.map(category => ({
        ...category,
        items: category.items.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
      })).filter(category => category.items.length > 0)
    : searchData;
  
  const filteredFlatItems = filteredData.flatMap(category => category.items);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      setActiveIndex((prev) => (prev + 1) % filteredFlatItems.length);
    } else if (event.key === 'ArrowUp') {
      setActiveIndex((prev) => (prev - 1 + filteredFlatItems.length) % filteredFlatItems.length);
    } else if (event.key === 'Enter') {
      const activeItem = filteredFlatItems[activeIndex];
      if (activeItem) window.location.href = activeItem.href;
    } else if (event.key === 'Escape') {
      onClose();
    }
  }, [activeIndex, filteredFlatItems, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, handleKeyDown]);

  useEffect(() => setActiveIndex(0), [query]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center pt-12 md:pt-20"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="relative w-full max-w-xl md:max-w-4xl"
            >
              <div className="relative overflow-hidden rounded-2xl bg-neutral-950/80 backdrop-blur-2xl border border-neutral-800 shadow-2xl">
                <div className="absolute inset-[-200%] animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#a855f7_45%,white_50%,#a855f7_55%,transparent_100%)]" />
                <div className="absolute inset-[1.5px] bg-neutral-900 rounded-[15px]"></div>
                
                <div className="relative z-10">
                  <div className="p-4 border-b border-neutral-800">
                    <div className="relative overflow-hidden rounded-full bg-neutral-950">
                      <div className="absolute inset-[-200%] animate-spin-slow bg-[conic-gradient(from_90deg_at_50%_50%,transparent_0%,#a855f7_45%,white_50%,#a855f7_55%,transparent_100%)]" />
                      <div className="absolute inset-[1.5px] bg-neutral-900 rounded-full"></div>
                      <div className="relative z-10 flex items-center gap-3 px-4">
                        <Search className="w-5 h-5 text-neutral-500 flex-shrink-0" />
                        <input
                          type="text"
                          placeholder="Type a command or search..."
                          value={query}
                          onChange={(e) => setQuery(e.target.value)}
                          autoFocus
                          className="w-full h-12 bg-transparent text-lg text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <motion.div className="max-h-[60vh] overflow-y-auto p-4">
                    <LayoutGroup>
                      {filteredData.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {filteredData.map((category) => (
                            <div key={category.category} className="space-y-1">
                              <h3 className="px-3 py-1 text-xs font-semibold text-neutral-500">{category.category}</h3>
                              {category.items.map(item => {
                                const Icon = item.icon;
                                const itemIndex = filteredFlatItems.findIndex(i => i.name === item.name);
                                const isActive = activeIndex === itemIndex;
                                return (
                                  <motion.a
                                    key={item.name}
                                    href={item.href}
                                    onMouseMove={() => setActiveIndex(itemIndex)}
                                    className="relative flex items-center gap-3 p-2.5 rounded-lg text-neutral-300"
                                  >
                                    {isActive && (
                                      <motion.div
                                        layoutId="highlight"
                                        className="absolute inset-0 bg-purple-500/10 rounded-lg"
                                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                      />
                                    )}
                                    <Icon className={`relative w-5 h-5 [text-shadow:0_0_12px_var(--glow-color)] ${isActive ? 'text-white' : item.color}`} style={{'--glow-color': isActive ? 'rgba(255,255,255,0.5)' : 'transparent'} as React.CSSProperties} />
                                    <span className={`relative text-sm ${isActive ? 'text-white' : ''}`}>{item.name}</span>
                                  </motion.a>
                                );
                              })}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="p-8 text-center text-neutral-500">No results found.</p>
                      )}
                    </LayoutGroup>
                  </motion.div>
                  
                  <div className="p-2 border-t border-neutral-800 text-xs text-neutral-500 flex items-center justify-between">
                    <span>Use <kbd className="font-sans mx-1 p-1 bg-neutral-800 rounded">↑</kbd><kbd className="font-sans p-1 bg-neutral-800 rounded">↓</kbd> to navigate</span>
                    <span><kbd className="font-sans mx-1 p-1 bg-neutral-800 rounded">↵</kbd> to select</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </>
  );
}

