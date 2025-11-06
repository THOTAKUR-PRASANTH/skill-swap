// "use client";

// import { useEffect, useState } from "react";
// import {
//   collection,
//   query,
//   orderBy,
//   onSnapshot,
//   FirestoreError,
//   Timestamp,
// } from "firebase/firestore";
// import { db } from "@/lib/firebase";
// import { Message } from "@/types/chat";

// /**
//  * Custom hook to fetch and listen to messages in real-time for a specific chat room.
//  *
//  * @param roomId - The ID of the chat room to fetch messages for.
//  * @returns An object containing the array of messages, loading state, and any error.
//  */
// export function useMessages(roomId: string) {
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<FirestoreError | null>(null);

//   useEffect(() => {
//     if (!roomId) {
//       // If there's no roomId, don't do anything
//       setLoading(false);
//       return;
//     }

//     setLoading(true);

//     // Create a reference to the 'messages' sub-collection inside the chat room
//     const messagesCollectionRef = collection(
//       db,
//       "chatRooms",
//       roomId,
//       "messages"
//     );

//     // Create a query to get all messages, ordered by their timestamp
//     // 'asc' (ascending) means we get them from oldest to newest
//     const messagesQuery = query(
//       messagesCollectionRef,
//       orderBy("timestamp", "asc")
//     );

//     // Set up the real-time listener
//     const unsubscribe = onSnapshot(
//       messagesQuery,
//       (querySnapshot) => {
//         const newMessages: Message[] = [];
//         querySnapshot.forEach((doc) => {
//           newMessages.push({
//             id: doc.id,
//             ...doc.data(),
//           } as Message);
//         });

//         setMessages(newMessages);
//         setLoading(false);
//         setError(null);
//       },
//       (err) => {
//         // Handle errors (e.g., permissions)
//         console.error("Error fetching messages: ", err);
//         setError(err);
//         setLoading(false);
//       }
//     );

//     // Cleanup function:
//     // This will be called when the component unmounts,
//     // or if the 'roomId' changes, preventing memory leaks.
//     return () => unsubscribe();
//   }, [roomId]); // Re-run the effect if the roomId ever changes

//   return { messages, loading, error };
// }


"use client";

import { useEffect, useState, useRef } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  FirestoreError,
  Timestamp, // <-- 1. Import Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Message } from "@/types/chat";
import { useSession } from "next-auth/react";

const notificationSound =
  typeof window !== "undefined"
    ? new Audio("/notification.mp3")
    : undefined;

export function useMessages(roomId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const { data: session } = useSession();
  const isInitialLoad = useRef(true);

  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const messagesCollectionRef = collection(
      db,
      "chatRooms",
      roomId,
      "messages"
    );
    const messagesQuery = query(
      messagesCollectionRef,
      orderBy("timestamp", "asc")
    );

    const unsubscribe = onSnapshot(
      messagesQuery,
      (querySnapshot) => {
        const newMessages: Message[] = [];
        querySnapshot.forEach((doc) => {
          newMessages.push({
            id: doc.id,
            ...doc.data(),
          } as Message);
        });

        // --- Sound logic ---
        if (isInitialLoad.current) {
          isInitialLoad.current = false;
        } else if (session?.user?.id) {
          
          querySnapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              const addedMessage = change.doc.data() as Message;

              // Check 1: Is this message from someone else?
              const isNotMyMessage = addedMessage.senderId !== session.user.id;

              if (isNotMyMessage) {
                
                // --- 2. THIS IS YOUR NEW 3-SECOND RULE ---
                const messageTimestamp = (addedMessage.timestamp as Timestamp)?.toDate();
                
                if (messageTimestamp) {
                  const now = new Date();
                  const messageAgeInSeconds = (now.getTime() - messageTimestamp.getTime()) / 1000;

                  // Only play sound if the message is very new
                  if (messageAgeInSeconds < 3) {
                    notificationSound?.play().catch(e => console.error("Error playing sound:", e));
                  }
                } else {
                  // Fallback if timestamp is missing (plays sound)
                  notificationSound?.play().catch(e => console.error("Error playing sound:", e));
                }
                // --- End of new logic ---
              }
            }
          });
        }
        // --- End of sound logic ---

        setMessages(newMessages);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("Error fetching messages: ", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
      isInitialLoad.current = true;
    };
  }, [roomId, session?.user?.id]);

  return { messages, loading, error };
}