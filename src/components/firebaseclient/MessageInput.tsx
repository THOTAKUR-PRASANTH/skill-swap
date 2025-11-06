"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { sendMessage } from "@/app/actions/chat";
import { toast } from "sonner";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { Smile, SendHorizontal, Paperclip, X, Image, FileText } from "lucide-react";

interface MessageInputProps {
  roomId: string;
}

export function MessageInput({ roomId }: MessageInputProps) {
  const [messageText, setMessageText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showEmoji, setShowEmoji] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-grow height
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }, [messageText]);

  // Close emoji picker on outside click
  useEffect(() => {
    const clickHandler = (e: MouseEvent) => {
      if (
        emojiRef.current &&
        !emojiRef.current.contains(e.target as Node) &&
        (e.target as HTMLElement).id !== "emoji-btn"
      ) {
        setShowEmoji(false);
      }
    };
    document.addEventListener("mousedown", clickHandler);
    return () => document.removeEventListener("mousedown", clickHandler);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = messageText.trim();
    if (!text && !file) return;

    const pendingFile = file;
    setMessageText("");
    setFile(null);

    startTransition(async () => {
      try {
        const result = await sendMessage(roomId, text, pendingFile);

        if (result?.error) {
          toast.error(result.error);
          setMessageText(text);
        }
      } catch (err) {
        toast.error("Error sending message");
        setMessageText(text);
      }
    });
  };

  const onEmojiClick = (emojiData: any) => {
    setMessageText((prev) => prev + emojiData.emoji);
    textareaRef.current?.focus();
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const isImage = file?.type.startsWith("image/");
  const hasContent = messageText.trim() || file;

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full px-4 py-3 border-t border-neutral-800/50 bg-black relative safe-bottom"
    >
      {/* Emoji Picker - Premium & Responsive */}
      {showEmoji && (
        <div
          ref={emojiRef}
          className="absolute bottom-16 left-2 right-2 sm:left-4 sm:right-auto z-[999] rounded-2xl shadow-2xl bg-neutral-950/95 backdrop-blur-xl border border-neutral-800/50 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-300"
          style={{
            boxShadow: '0 20px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
          }}
        >
          <EmojiPicker
            theme={Theme.DARK}
            onEmojiClick={onEmojiClick}
            autoFocusSearch={false}
            width={typeof window !== 'undefined' && window.innerWidth < 640 ? window.innerWidth - 16 : 350}
            height={typeof window !== 'undefined' && window.innerWidth < 640 ? 320 : 420}
            searchPlaceHolder="Search emoji..."
            previewConfig={{
              showPreview: false
            }}
            skinTonesDisabled={false}
            lazyLoadEmojis={true}
          />
        </div>
      )}

      {/* File Preview - Compact */}
      {file && (
        <div className="mb-2 flex items-center gap-2 px-3 py-1.5 bg-neutral-900/50 rounded-lg border border-neutral-800/50 w-fit">
          {isImage ? (
            <Image className="text-blue-400" size={14} />
          ) : (
            <FileText className="text-blue-400" size={14} />
          )}
          <span className="text-xs text-neutral-400 max-w-[180px] truncate">
            {file.name}
          </span>
          <button
            type="button"
            onClick={removeFile}
            className="p-0.5 rounded hover:bg-neutral-800 transition-colors"
          >
            <X size={12} className="text-neutral-500" />
          </button>
        </div>
      )}

      {/* Sleek Input Container */}
      <div
        className={`
          flex items-center gap-2 px-3 py-1.5 rounded-full
          bg-neutral-900/80 backdrop-blur-sm
          border transition-all duration-200
          ${isFocused ? "border-neutral-700 bg-neutral-900" : "border-neutral-800/50"}
        `}
      >
        {/* Action Buttons - Minimal */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-1.5 rounded-full hover:bg-neutral-800 active:scale-95 transition-all"
          title="Attach"
        >
          <Paperclip className="text-neutral-500 hover:text-neutral-300" size={18} />
        </button>

        <button
          id="emoji-btn"
          type="button"
          onClick={() => setShowEmoji((v) => !v)}
          className="p-1.5 rounded-full hover:bg-neutral-800 active:scale-95 transition-all"
          title="Emoji"
        >
          <Smile 
            className={showEmoji ? "text-yellow-400" : "text-neutral-500 hover:text-neutral-300"} 
            size={18} 
          />
        </button>

        {/* Textarea - Compact */}
        <textarea
          ref={textareaRef}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Message..."
          rows={1}
          className="
            flex-1 resize-none overflow-hidden
            px-2 py-1.5 bg-transparent text-white text-sm
            focus:outline-none placeholder:text-neutral-600
            max-h-[100px] scrollbar-none
          "
          disabled={isPending}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />

        {/* Send Button - Minimal & Premium */}
        <button
          type="submit"
          disabled={isPending || !hasContent}
          className={`
            p-2 rounded-full transition-all duration-200
            active:scale-95
            ${hasContent && !isPending
              ? "bg-blue-600 hover:bg-blue-500"
              : "bg-neutral-800 opacity-50 cursor-not-allowed"
            }
          `}
        >
          <SendHorizontal 
            size={16} 
            className="text-white"
          />
        </button>
      </div>

      {/* Hidden file input */}
      <input
        type="file"
        hidden
        ref={fileInputRef}
        accept="image/*,video/*,.pdf,.doc,.docx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
    </form>
  );
}