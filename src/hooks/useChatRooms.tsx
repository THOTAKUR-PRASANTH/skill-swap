"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  Query,
  DocumentData,
  orderBy,
} from "firebase/firestore";
import { ChatRoom } from "@/types/chat";
import { usePathname, useRouter } from "next/navigation";
// NEW: We are using 'sonner' again
import { toast } from "sonner";
// NEW: We need Image, motion, and the icon again
import Image from "next/image";
import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

const notificationSound =
  typeof window !== "undefined" ? new Audio("/notification.mp3") : undefined;

export const useChatRooms = () => {
  const { data: session } = useSession();
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const pathname = usePathname();
  // NEW: Add 'useRouter' back
  const router = useRouter();
  const isInitialLoad = useRef(true);

  // NEW: Remove 'useNotification'
  // const { addNotification } = useNotification();

  useEffect(() => {
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }

    const userId = session.user.id;
    setLoading(true);

    const chatRoomsQuery: Query<DocumentData> = query(
      collection(db, "chatRooms"),
      where("participants", "array-contains", userId),
      orderBy("lastMessage.timestamp", "desc")
    );

    const unsubscribe = onSnapshot(
      chatRoomsQuery,
      (querySnapshot) => {
        const rooms: ChatRoom[] = [];

        querySnapshot.docChanges().forEach((change) => {
          if (change.type === "modified") {
            const roomData = change.doc.data() as ChatRoom;
            const roomId = change.doc.id;
            const lastMessage = roomData.lastMessage;

            const isNewMessage =
              !!lastMessage &&
              Array.isArray(lastMessage.seenBy) &&
              !lastMessage.seenBy.includes(userId) &&
              lastMessage.senderId !== userId;

            const isNotOnChatPage = pathname !== `/chat/${roomId}`;

            if (!isInitialLoad.current && isNewMessage && isNotOnChatPage) {
              const sender = roomData.participantInfo?.find(
                (p) => p.userId === lastMessage?.senderId
              );

              const senderName = sender?.name || "Someone";
              const senderImageUrl = sender?.avatar;

              notificationSound?.play().catch(() => {});

              // NEW: Add 'isMobile' check back
              const isMobile =
                typeof window !== "undefined" && window.innerWidth < 640;

              // --- THIS IS THE NEW, SMOOTH 'sonner' LOGIC ---
              toast.custom(
                (t) => (
                  <motion.div
                    // NEW: We ONLY animate 'opacity' and 'scale' (the "zoom").
                    // 'sonner' will handle the 'y' (vertical) animation.
                    // This prevents the lag and fighting.
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    onClick={() => {
                      router.push(`/chat/${roomId}`);
                      toast.dismiss(t.id);
                    }}
                    // This is your custom card style
                    className={`relative flex flex-row items-center gap-2 
                    w-[90vw] max-w-sm mx-auto
                    rounded-3xl p-2 
                    border border-gray-200 dark:border-indigo-400/20 
                    bg-white/80 dark:bg-gradient-to-br dark:from-gray-900/80 dark:via-gray-800/80 dark:to-gray-900/80 
                    shadow-lg backdrop-blur-xl cursor-pointer 
                    hover:scale-[1.02] transition-all duration-200 
                    text-gray-900 dark:text-white 
                    font-sans select-none`}
                  >
                    {/* Avatar (Core) */}
                    <div className="relative flex-shrink-0 w-10 h-10 mx-0">
                      <Image
                        src={
                          senderImageUrl ||
                          "https://cdn-icons-png.flaticon.com/512/1077/1077012.png"
                        }
                        alt={`${senderName}'s avatar`}
                        fill
                        className="object-cover rounded-full border border-gray-300 dark:border-white/20 shadow-sm"
                      />
                      <span
                        className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-2.5 h-2.5 rounded-full 
                        border border-white dark:border-gray-900"
                      />
                    </div>

                    {/* Message */}
                    <div className="flex-1 flex flex-col items-start min-w-0 text-left">
                      <h3 className="flex items-center gap-1.5 text-[13px] sm:text-sm font-medium truncate w-full">
                        <span className="truncate">{senderName}</span>
                        <span className="flex-shrink-0 text-xs font-normal text-gray-500 dark:text-gray-400">
                          • now
                        </span>
                      </h3>
                      <p className="text-[11px] sm:text-xs text-gray-600 dark:text-gray-300 truncate w-full">
                        {lastMessage?.text}
                      </p>
                    </div>

                    {/* Chevron Button */}
                    <div className="flex-shrink-0 px-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200/70 dark:bg-gray-700/70">
                        <FiChevronDown className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                      </div>
                    </div>

                    {/* Subtle border pulse */}
                    <motion.div
                      className="absolute inset-0 rounded-3xl border border-indigo-300/10 dark:border-indigo-400/10 pointer-events-none"
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                  </motion.div>
                ),
                {
                  // --- THIS IS THE FIX FOR THE "TWO-LAYER" BORDER ---
                  // We force the 'sonner' wrapper to be invisible
                  // and match the card's rounded shape.
                  classNames: {
                    toast:
                      "w-auto p-0 border-none bg-transparent shadow-none rounded-3xl",
                  },
                  duration: 3000,
                  position: isMobile ? "top-center" : "top-right",
                }
              );
            }
          }
        });

        querySnapshot.forEach((doc) => {
          rooms.push({
            id: doc.id,
            ...doc.data(),
          } as ChatRoom);
        });

        setChatRooms(rooms);
        setLoading(false);
        setError(null);
        isInitialLoad.current = false;
      },
      (err) => {
        console.log("Error fetching chat rooms: ", err);
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [session, pathname, router]); // NEW: Add 'router' to dependencies

  return { chatRooms, loading, error };
};

