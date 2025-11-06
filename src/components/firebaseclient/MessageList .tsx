"use client";

import { useEffect, useRef, useTransition } from "react";
import { useMessages } from "@/hooks/useMessages";
import { Message } from "@/types/chat";
import { markMessagesAsSeen } from "@/app/actions/chat";
import { toast } from "sonner";
import { Check, CheckCheck } from "lucide-react";
import { MessageSkeleton } from "./MessageSkeleton";

interface MessageListProps {
  roomId: string;
  currentUserId: string;
}

export function MessageList({ roomId, currentUserId }: MessageListProps) {
  const { messages, loading, error } = useMessages(roomId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Mark unseen messages as "seen"
  useEffect(() => {
    if (messages.length > 0) {
      const unreadIds = messages
        .filter(
          (msg) =>
            msg.senderId !== currentUserId &&
            !(msg.seenBy || []).includes(currentUserId)
        )
        .map((msg) => msg.id);

      if (unreadIds.length > 0) {
        startTransition(async () => {
          const result = await markMessagesAsSeen(roomId, unreadIds);
          if (result?.error) toast.error(result.error);
        });
      }
    }
  }, [messages, roomId, currentUserId]);

  const renderMessageTicks = (message: Message) => {
    if (message.senderId !== currentUserId) return null;

    const seenByOthers = (message.seenBy || []).some(
      (id) => id !== currentUserId
    );

    return seenByOthers ? (
      <CheckCheck size={18} className="text-blue-600 text-opacity-100" />
    ) : (
      <Check size={18} className="text-gray-900" />
    );
  };

  // Group messages by calendar day
  const groupMessagesByDate = (messages: Message[]) => {
    const groups: { [date: string]: Message[] } = {};
    messages.forEach((msg) => {
      const date = new Date((msg.timestamp as any).seconds * 1000).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
    });
    return groups;
  };

  // ✅ Skeleton while loading
  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto bg-black scrollbar-thin scrollbar-thumb-[#222] scrollbar-track-transparent">
        <MessageSkeleton />
      </div>
    );
  }

  // Error state
  if (error)
    return (
      <div className="flex-1 flex justify-center items-center bg-black text-gray-300 p-6 text-center">
        <div>
          <div className="text-5xl mb-2">⚠️</div>
          <p className="font-light text-lg">Error loading messages</p>
          <p className="text-gray-500 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );

  const grouped = groupMessagesByDate(messages);

  return (
    <div
      className="flex flex-col justify-end h-full w-full relative bg-black overflow-hidden"
      style={{
        fontFamily:
          "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell",
      }}
    >
      {/* Background accents */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-black to-neutral-950" />
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-white/8 via-transparent to-transparent rounded-full blur-3xl animate-blob" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-white/5 via-transparent to-transparent rounded-full blur-3xl animate-blob animation-delay-2000" />
      </div>

      {/* Scrollable message container */}
      <div className="flex-1 overflow-y-auto relative z-10 px-4 sm:px-5 md:px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {Object.keys(grouped).length === 0 ? (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <div className="text-6xl opacity-20 mb-4">💬</div>
              <p className="text-gray-400">No messages yet</p>
              <p className="text-gray-600 text-sm">Say hello 👋</p>
            </div>
          </div>
        ) : (
          Object.keys(grouped).map((date: string, index: number) => (
            <div
              key={date}
              className="animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Date divider */}
              <div className="flex justify-center my-2">
                <span className="text-xs text-gray-400 bg-neutral-900/60 px-3 py-1 rounded-full">
                  {date}
                </span>
              </div>

              <div className="space-y-2">
                {grouped[date].map((message, i) => {
                  const isCurrentUser = message.senderId === currentUserId;

                  return (
                    <div
                      key={message.id}
                      className={`flex w-full ${
                        isCurrentUser ? "justify-end" : "justify-start"
                      } animate-slideIn`}
                      style={{ animationDelay: `${i * 0.03}s` }}
                    >
                      <div
                        className={`max-w-[80%] sm:max-w-[65%] md:max-w-[55%] lg:max-w-[50%]
                          px-3 py-1.5 text-sm rounded-2xl break-words shadow-md flex gap-1 items-end
                          ${
                            isCurrentUser
                              ? "bg-white/95 text-black rounded-br-sm"
                              : "bg-neutral-800/85 text-gray-100 rounded-bl-sm"
                          }`}
                      >
                        {/* Message */}
                        <p className="font-light flex-1 mr-3">{message.text}</p>

                        {/* Time + ticks */}
                        <div className="flex items-center gap-1 flex-shrink-0 text-[9px] whitespace-nowrap opacity-70">
                          {new Date(
                            (message.timestamp as any).seconds * 1000
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {renderMessageTicks(message)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent pointer-events-none z-20" />
    </div>
  );
}
