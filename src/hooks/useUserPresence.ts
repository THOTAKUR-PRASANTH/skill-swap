"use client";

import { useState, useEffect } from "react";
import { rtdb } from "@/lib/firebase"; // Import the Realtime Database service
import { ref, onValue ,onDisconnect, update} from "firebase/database";
import { UserPresence } from "@/types/chat"; // Import our new type

/**
 * Custom hook to get the real-time presence status of a user.
 * @param userId  The ID of the user to watch.
 */
export function useUserPresence(userId: string |null) {
  const [presence, setPresence] = useState<UserPresence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // We only run this if we have a valid userId
    if (!userId) {
      setLoading(false);
      return;
    }

    // Define the path to the user's status in RTDB
    const userStatusRef = ref(rtdb, `/status/${userId}`);

    // 'onValue' is the real-time listener for RTDB
    const unsubscribe = onValue(
      userStatusRef,
      (snapshot) => {
        if (snapshot.exists()) {
          // We found a status, set it in our state
          setPresence(snapshot.val() as UserPresence);
        } else {
          // No status found for this user (they've never logged in)
          setPresence(null);
        }
        setLoading(false);
      },
      (error) => {
        console.error(`Error fetching presence for ${userId}:`, error);
        setPresence(null);
        setLoading(false);
      }
    );

    // Cleanup function: Detach the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, [userId]); // Re-run the hook if the userId changes

  return { presence, loading };
}

export default function setUserOnline(userId: string) {
  const userStatusRef = ref(rtdb, `/status/${userId}`);

  update(userStatusRef, {
    isOnline: true,
    lastSeen: Date.now(),
  });

  onDisconnect(userStatusRef).update({
    isOnline: false,
    lastSeen: Date.now(), // <— This fixes your problem
  });
}