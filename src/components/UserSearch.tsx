"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createOrGetChatRoom } from "@/app/actions/chat";

// A type for the user data we expect from our API
type UserSearchResult = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
};

/**
 * A client-side component that provides a UI for searching users
 * and starting new chat rooms with them.
 */
export function UserSearch() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // useTransition is used for pending states on Server Actions
  const [isPending, startTransition] = useTransition();

  /**
   * Handles fetching search results from our API route
   */
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim().length < 2) {
      setResults([]);
      setMessage("Please enter at least 2 characters.");
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch(
        `/api/chatapis/?term=${encodeURIComponent(searchTerm)}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }
      const data: UserSearchResult[] = await response.json();
      setResults(data);
      if (data.length === 0) {
        setMessage("No users found.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred during search.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles the 'Start Chat' button click.
   * Calls the Server Action and then navigates to the chat room.
   */
  const handleStartChat = async (otherUserId: string) => {
    startTransition(async () => {
      try {
        // createOrGetChatRoom may be typed as void; assert the expected shape and handle missing values
        const result = (await createOrGetChatRoom(otherUserId)) as
          | { roomId: string }
          | string
          | null
          | undefined;
        const roomId = typeof result === "string" ? result : result?.roomId;
        if (!roomId) {
          throw new Error("No roomId returned from server action.");
        }
        
        // On success, redirect to the new chat room page
        // We will build this page in the next step
        router.push(`/chat/${roomId}`);

      } catch (error) {
        console.error("Failed to start chat:", error);
        setMessage("Failed to start chat. Please try again.");
      }
    });
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name or email..."
          className="flex-grow rounded-md border border-gray-300 px-3 py-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "..." : "Search"}
        </button>
      </form>

      {message && <p className="mt-2 text-sm text-gray-500">{message}</p>}

      <div className="mt-4 max-h-60 overflow-y-auto">
        <ul className="divide-y divide-gray-200">
          {results.map((user) => (
            <li key={user.id} className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <img
                  src={user.image || `https://placehold.co/40x40/EBF4FF/76A9FA?text=${user.name?.[0] || 'U'}`}
                  alt={user.name || "User"}
                  className="h-10 w-10 rounded-full"
                />
                <div>
                  <p className="font-medium text-gray-900">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => handleStartChat(user.id)}
                disabled={isPending}
                className="rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {isPending ? "Starting..." : "Start Chat"}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

