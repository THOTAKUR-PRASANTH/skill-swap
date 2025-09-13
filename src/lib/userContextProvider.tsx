"use client";

import { createContext, useContext } from "react";

// ✅ Use a plain TypeScript type (serializable)
export type SafeUser = {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  imageUrl: string;
  phoneNumber: string | null;
  twoFactorEnabled: boolean;
} | null;

const UserContext = createContext<SafeUser>(null);

export function UserContextProvider({
  value,
  children,
}: {
  value: SafeUser;
  children: React.ReactNode;
}) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUserContext() {
  return useContext(UserContext);
}
