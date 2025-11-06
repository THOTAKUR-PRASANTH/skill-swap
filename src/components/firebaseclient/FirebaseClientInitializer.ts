"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { auth, rtdb } from "@/lib/firebase"; // Our client firebase config
import { signInWithCustomToken, signOut, onAuthStateChanged, User } from "firebase/auth";
import  setUserOnline  from "@/hooks/useUserPresence"; // Reuse the presence function
import {
  ref,
  set,
  onDisconnect,
  serverTimestamp,
  DatabaseReference,
  onValue, // <-- Import the 'onValue' listener
} from "firebase/database";

export function FirebaseClientInitializer() {
  const { data: session, status } = useSession();
  const [firebaseUser, setFirebaseUser] = useState(auth.currentUser);
  const userStatusRef = useRef<DatabaseReference | null>(null);

  // --- HOOK 1: Listens for Firebase auth changes ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("Auth state changed. User:", user?.uid || "null");
      setUserOnline(user?.uid || "");
      setFirebaseUser(user);
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  // --- HOOK 2: Syncs NextAuth session TO Firebase auth ---
  useEffect(() => {
    if (status === "authenticated") {
      const firebaseToken = (session as any).firebaseToken;
      if (firebaseToken && !firebaseUser) {
        console.log("Sync: Signing in to Firebase...");
        signInWithCustomToken(auth, firebaseToken)
          .then((userCredential) => {
            console.log(
              "Sync: Firebase sign-in successful.",
              userCredential.user.uid
            );
          })
          .catch((error) => {
            console.error("Sync: Firebase custom token sign-in error:", error);
          });
      }
    } else if (status === "unauthenticated") {
      if (firebaseUser) {
        console.log("Sync: Signing out of Firebase...");
        signOut(auth);
      }
    }
  }, [status, session, firebaseUser]);

  // --- HOOK 3: Manages Realtime Database Presence (BULLETPROOF VERSION) ---
  useEffect(() => {
    let unsubscribeConnected: () => void = () => {}; // Empty unsubscribe function

    if (firebaseUser) {
      // --- User is logged IN ---
      console.log("Presence: User is online.", firebaseUser.uid);
      // 1. Get references
      userStatusRef.current = ref(rtdb, `/status/${firebaseUser.uid}`);
      const connectedRef = ref(rtdb, ".info/connected");

      // 2. Start listening to the connection state
      unsubscribeConnected = onValue(connectedRef, (snapshot) => {
        if (snapshot.val() === true) {
          // --- We are now connected to RTDB ---
          console.log("Presence: RTDB connection established.");

          const userStatus = { isOnline: true, lastSeen: serverTimestamp() };
          const userStatusOffline = {
            isOnline: false,
            lastSeen: Date.now(),
          };

          // 3. Set the 'onDisconnect' hook (what happens when they vanish)
          onDisconnect(userStatusRef.current!)
            .set(userStatusOffline)
            .then(() => {
              // 4. Now, set their current status to 'online'
              set(userStatusRef.current!, userStatus);
              console.log("Presence: Set to ONLINE.");
            })
            .catch((err) => {
              console.error("Presence: Failed to set onDisconnect hook.", err);
            });
        }
      });
    }

    // --- Cleanup function for this effect ---
    return () => {
      // This runs when the user logs out (firebaseUser becomes null)
      unsubscribeConnected(); // Detach the .info/connected listener

      if (userStatusRef.current) {
        console.log("Presence: Cleaning up. Set to OFFLINE.");
        // Manually set to offline on logout
        set(userStatusRef.current, {
          isOnline: false,
          lastSeen: serverTimestamp(),
        });
        userStatusRef.current = null;
      }
    };
  }, [firebaseUser]); // This hook depends *only* on the firebaseUser state

  // This component doesn't render anything
  return null;
}

