"use client";

import React, { useEffect, useReducer, useState } from "react";
import { useChatRooms } from "@/hooks/useChatRooms";
import { useSession } from "next-auth/react";
import { ParticipantInfo, ChatRoom } from "@/types/chat";
import { UserSearch } from "@/components/UserSearch";
import { useRouter } from "next/navigation";
import { MessageCircle, AlertCircle } from "lucide-react";
import Image from "next/image";
import { useUserPresence } from "@/hooks/useUserPresence";
import FuturisticLoader from "@/components/SkillSwapLoader/FuturisticLoader";

const formatLastSeen = (timestamp: number) => {
  const now = new Date();
  const last = new Date(timestamp);
  const diff = Math.floor((now.getTime() - last.getTime()) / 1000);

  if (diff < 60) return "active just now";

  const mins = Math.floor(diff / 60);

  if (mins < 2) return "active just now";
  if (mins < 60) return `active ${mins} mins ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `active ${hours} hours ago`;

  const days = Math.floor(hours / 24);
  if (days === 1) return "active yesterday";
  if (days < 7) return `active ${days} days ago`;

  return `active on ${last.toLocaleDateString()}`;
};

// ✅ One row in chat list
function ChatListItem({
  room,
  currentUserId,
  onOpen,
}: {
  room: ChatRoom;
  currentUserId: string;
  onOpen: (id: string) => void;
}) {
  const other: ParticipantInfo | undefined = room.participantInfo.find(
    (p) => p.userId !== currentUserId
  );

  // force refresh every 15 seconds (like ChatHeader)
  const [, forceRender] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const interval = setInterval(forceRender, 15000);
    return () => clearInterval(interval);
  }, []);

  // Presence retrieval
  const { presence, loading } = useUserPresence(other ? other.userId : null);

  if (!other) return null;

  const isOnline = !!presence?.isOnline;
  const lastSeen = presence?.lastSeen;
  const hasSeen = room.lastMessage?.seenBy?.includes(currentUserId) ?? true;

  return (
    <div
      key={room.id}
      onClick={() => onOpen(room.id)}
      className={`flex items-center px-5 py-3 cursor-pointer transition-all duration-200
        ${!hasSeen ? "bg-[#111]/60 hover:bg-[#222]/80" : "hover:bg-[#111]/80"}
      `}
    >
      <div className="relative">
        <Image
          src={
            other.avatar ||
            `https://api.dicebear.com/8.x/initials/svg?seed=${other.name}`
          }
          alt={other.name || "User"}
          width={48}
          height={48}
          className="rounded-full border border-[#1F1F1F] object-cover"
        />
        {isOnline && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse" />
        )}
      </div>

      <div className="flex-1 ml-4 min-w-0">
        <h3
          className={`font-semibold text-[15px] truncate ${
            !hasSeen ? "text-white" : "text-gray-200"
          }`}
        >
          {other.name || "User"}
        </h3>

        <p
          className={`text-xs truncate mt-[1px] ${
            isOnline ? "text-green-400 font-medium" : "text-gray-300 italic"
          }`}
        >
          {loading
            ? "..."
            : isOnline
            ? "active now"
            : lastSeen
            ? formatLastSeen(lastSeen)
            : "offline"}
        </p>

        <p
          className={`text-sm truncate mt-[2px] ${
            !hasSeen ? "text-gray-200" : "text-gray-400"
          }`}
        >
          {room.lastMessage
            ? `${
                room.lastMessage.senderId === currentUserId ? "You: " : ""
              }${room.lastMessage.text}`
            : "Start a conversation"}
        </p>
      </div>
    </div>
  );
}

export default function ChatList() {
  const { data: session } = useSession();
  const { chatRooms, loading, error } = useChatRooms();
  const currentUserId = session?.user?.id || "";
  const router = useRouter();

  const [pageLoading, setPageLoading] = useState(false);

  const openRoom = (id: string) => {
    setPageLoading(true);
    setTimeout(() => {
      router.push(`/chat/${id}`);
    }, 400);
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black space-y-3">
        <FuturisticLoader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-black space-y-3">
        <AlertCircle className="w-8 h-8 text-red-400" />
        <p className="text-red-400 font-semibold">Error loading chats</p>
        <p className="text-sm text-gray-400">{error.message}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all text-sm font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!chatRooms || chatRooms.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black space-y-6">
        <MessageCircle className="w-10 h-10 text-gray-300" />

        <div className="text-center space-y-2">
          <h3 className="text-xl font-bold text-gray-100">
            No conversations yet
          </h3>
          <p className="text-gray-400">
            Search users and start chatting!
          </p>
        </div>

        <div className="w-full max-w-md">
          <UserSearch />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-black overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-[#1A1A1A] bg-black/90 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white mb-3">Messages</h2>
        <UserSearch />
      </div>

      {/* Page Loading Overlay */}
      {pageLoading && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <FuturisticLoader />
        </div>
      )}

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-[#222] scrollbar-track-transparent">
        <div className="divide-y divide-[#1A1A1A]">
          {chatRooms.map((room) => (
            <ChatListItem
              key={room.id}
              room={room}
              currentUserId={currentUserId}
              onOpen={openRoom}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
