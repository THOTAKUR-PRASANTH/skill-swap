
// "use client";

// import { ReactNode, useState, useEffect, useRef } from "react"; 
// import DashboardNavbar from './dashboard-navbar'; 
// import DesktopSidebar from './desktop_sidebar';

// interface DashboardShellProps {
//   children: ReactNode;
// }

// export default function DashboardShell({ children }: DashboardShellProps) {
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [isScrolled, setIsScrolled] = useState(false);
//   const scrollContainerRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const container = scrollContainerRef.current;
//     const handleScroll = () => {
//       if (container) {
//         setIsScrolled(container.scrollTop > 0);
//       }
//     };
//     container?.addEventListener('scroll', handleScroll);
//     return () => container?.removeEventListener('scroll', handleScroll);
//   }, []);

//   return (
//     // CHANGE THIS: Swapped the light gradient for a professional dark theme background.
//     // This dark background is what fixes the "white blink" bug.
//     <div className="fixed inset-0 flex bg-neutral-950 text-white">
//       <DesktopSidebar 
//         sidebarOpen={sidebarOpen} 
//         setSidebarOpen={setSidebarOpen} 
//       />
      
//       {/* CHANGE THIS: The scrolling content area now has a dark background too. */}
//       <div ref={scrollContainerRef} className="flex-1 flex flex-col min-w-0 overflow-x-hidden overflow-y-auto bg-neutral-900">
        
//         <DashboardNavbar onOpenSidebar={() => setSidebarOpen(true)} isScrolled={isScrolled} />
        
//         <main className="flex-1">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// }






"use client";
import { ReactNode, useState, useEffect, useRef } from "react";
import DashboardNavbar from "./dashboard-navbar";
import DesktopSidebar from "./desktop_sidebar";
import { useSidebar } from "@/app/context/SidebarContext";

interface DashboardShellProps {
  children: ReactNode;
}

export default function DashboardShell({ children }: DashboardShellProps) {
  const { sidebarOpen, toggleSidebar } = useSidebar(); // 👈 using global context
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    const handleScroll = () => {
      if (container) {
        setIsScrolled(container.scrollTop > 0);
      }
    };
    container?.addEventListener("scroll", handleScroll);
    return () => container?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed inset-0 flex bg-neutral-950 text-white">
      <DesktopSidebar sidebarOpen={sidebarOpen} /> {/* controlled globally */}

      <div
        ref={scrollContainerRef}
        className="flex-1 flex flex-col min-w-0 overflow-x-hidden overflow-y-auto bg-neutral-900"
      >
        {/* toggleSidebar will open/close the sidebar */}
        <DashboardNavbar onToggleSidebar={toggleSidebar} isScrolled={isScrolled} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
