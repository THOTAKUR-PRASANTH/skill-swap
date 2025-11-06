"use client";

import { useUserPresence } from "@/hooks/useUserPresence";
import { ParticipantInfo } from "@/types/chat";
import { ArrowLeft, Phone, Video } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import React, { useEffect, useReducer } from "react";

interface ChatHeaderProps {
  otherUser: ParticipantInfo | null;
}

export function ChatHeader({ otherUser }: ChatHeaderProps) {
  const router = useRouter();
  const { presence, loading } = useUserPresence(otherUser?.userId || null);
  const [imgSrc, setImgSrc] = React.useState(
    otherUser?.avatar ||
      `https://api.dicebear.com/8.x/initials/svg?seed=${otherUser?.name}`
  );

  // re-render UI every 15 seconds to update "x mins ago"
  const [, forceRender] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    const interval = setInterval(forceRender, 15000);
    return () => clearInterval(interval);
  }, []);

  if (!otherUser) return null;

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

  const getStatusText = () => {
    if (loading) return "...";
    if (presence?.isOnline) return "active now";
    if (presence?.lastSeen) return formatLastSeen(presence.lastSeen);
    return "offline";
  };

  return (
    <div
      className="
        fixed top-0 left-0 right-0 w-full z-50
        flex items-center justify-between px-1 md:px-1 py-2
        border-b border-neutral-800
        bg-neutral-950/30 backdrop-blur-md shadow-lg shadow-black/30 select-none
        transition-all duration-300
        font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Ubuntu,'Helvetica Neue',sans-serif]
      "
    >
      {/* Left section */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {/* hidden on mobile */}
        <button
          onClick={() => router.back()}
          className="
            hidden md:flex
            p-1.5 rounded-full hover:bg-white/10
            transition-all duration-200 hover:scale-105 flex-shrink-0
          "
        >
          <ArrowLeft size={16} className="text-white" />
        </button>

        <div className="relative flex-shrink-0">
          <Image
            src={imgSrc}
            alt={otherUser.name || "User Avatar"}
            width={48}
            height={48}
            className="rounded-full object-cover border border-white/10"
            onError={() => {
              setImgSrc(
                `https://api.dicebear.com/8.x/initials/svg?seed=${otherUser.name}`
              );
            }}
          />
          {presence?.isOnline && (
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-black animate-pulse" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h6 className="font-medium text-sm text-white truncate">
            {otherUser.name || "User"}
          </h6>
          <p
            className={`text-xs lowercase transition-all duration-300 ${
              presence?.isOnline ? "text-green-400" : "text-gray-400"
            }`}
          >
            {getStatusText()}
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        <button className="p-2.5 rounded-full hover:bg-white/10 transition-all duration-200 hover:scale-110 group">
          <Phone size={18} className="text-white group-hover:text-blue-400 transition-colors" />
        </button>
        <button className="p-2.5 rounded-full hover:bg-white/10 transition-all duration-200 hover:scale-110 group">
          <Video size={18} className="text-white group-hover:text-blue-400 transition-colors" />
        </button>
      </div>
    </div>
  );
}
