// // file: DashboardShell.tsx
// "use client";

// import { ReactNode, useState } from "react";
// import DashboardNavbar from './dashboard-navbar';
// import DesktopSidebar from './desktop_sidebar';

// interface DashboardShellProps {
//   children: ReactNode;
// }

// export default function DashboardShell({ children }: DashboardShellProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   return (
//     <>
//       <div className="fixed inset-0 flex text-slate-700 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">

//         <DesktopSidebar
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//         />
        
       
//         <div className="bg-white flex-1 flex flex-col min-w-0 overflow-x-hidden overflow-y-auto">
//           <DashboardNavbar onOpenSidebar={() => setSidebarOpen(true)} />
//           <main className="flex-1"> 
//             {children}
//           </main>
//         </div>
//       </div>
//     </>
//   );
// }


// file: DashboardShell.tsx
"use client";

import { ReactNode, useState, useEffect, useRef } from "react"; 
import DashboardNavbar from './dashboard-navbar'; 
import DesktopSidebar from './desktop_sidebar';

interface DashboardShellProps {
  children: ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const handleScroll = () => {
      if (container) {
        setIsScrolled(container.scrollTop > 0);
      }
    };
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    // CHANGE THIS: Swapped the light gradient for a professional dark theme background.
    // This dark background is what fixes the "white blink" bug.
    <div className="fixed inset-0 flex bg-neutral-950 text-white">
      <DesktopSidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
      />
      
      {/* CHANGE THIS: The scrolling content area now has a dark background too. */}
      <div ref={scrollContainerRef} className="flex-1 flex flex-col min-w-0 overflow-x-hidden overflow-y-auto bg-neutral-900">
        
        <DashboardNavbar onOpenSidebar={() => setSidebarOpen(true)} isScrolled={isScrolled} />
        
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  );
}