"use client";

import { createContext, useContext, useState, Dispatch, SetStateAction } from "react";

interface LoaderContextType {
  isInitialLoadFinished: boolean;
  setIsInitialLoadFinished: Dispatch<SetStateAction<boolean>>;
}

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export function LoaderProvider({ children }: { children: React.ReactNode }) {
  const [isInitialLoadFinished, setIsInitialLoadFinished] = useState(false);
  return (
    <LoaderContext.Provider value={{ isInitialLoadFinished, setIsInitialLoadFinished }}>
      {children}
    </LoaderContext.Provider>
  );
}

export function useLoader() {
  const context = useContext(LoaderContext);
  if (context === undefined) {
    throw new Error("useLoader must be used within a LoaderProvider");
  }
  return context;
}
