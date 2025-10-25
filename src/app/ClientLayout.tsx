"use client";

import { Providers } from "@/components";
import { Toaster } from "@/components/ui/sonner";
import { Session } from "next-auth";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { useLoader } from "@/app/context/LoaderContext";

const DynamicPreLoader = dynamic(() => import("@/components/SkillSwapLoader/preloader"), {
  ssr: false,
});

type Props = {
  children: React.ReactNode;
  session: Session | null;
};

export function ClientLayout({ children, session }: Props) {
  const { isInitialLoadFinished, setIsInitialLoadFinished } = useLoader();

  useEffect(() => {
    // If already finished, skip running again
    if (isInitialLoadFinished) return;

    let loadFinished = false;
    let minTimePassed = false;

    const hideLoader = () => {
      if (loadFinished && minTimePassed) {
        setIsInitialLoadFinished(true);
      }
    };

    const timer = setTimeout(() => {
      minTimePassed = true;
      hideLoader();
    }, 1500);

    const handleLoad = () => {
      loadFinished = true;
      hideLoader();
    };

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", handleLoad);
    };
  }, [isInitialLoadFinished, setIsInitialLoadFinished]);

  return (
    <>
      {!isInitialLoadFinished && <DynamicPreLoader />}
      <div style={{ display: !isInitialLoadFinished ? "none" : "block" }}>
        <Providers session={session}>
          <Toaster richColors theme="dark" position="top-right" />
          {children}
        </Providers>
      </div>
    </>
  );
}
