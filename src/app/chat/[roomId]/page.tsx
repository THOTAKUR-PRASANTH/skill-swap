import { db } from "@/lib/firebase"; // <-- Use ADMIN db for server-side fetch
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { redirect } from "next/navigation";
import { ChatRoom, ParticipantInfo } from "@/types/chat";
import { MessageInput } from "@/components/firebaseclient/MessageInput";
import { MessageList } from "@/components/firebaseclient/MessageList ";
import { ChatHeader } from "@/components/firebaseclient/ChatHeader";

interface ChatPageProps {
  params: {
    roomId: string;
  };
}

/**
 * Fetches the chat room data from Firestore on the server.
 * This also serves as a security check.
 */
async function getChatRoomData(
  roomId: string,
  currentUserId: string
): Promise<ChatRoom | null> {
  try {
    const chatRoomRef = doc(db, "chatRooms", roomId);
    const chatRoomSnap = await getDoc(chatRoomRef);

    if (!chatRoomSnap.exists()) {
      console.warn("Chat room not found.");
      return null;
    }

    const roomData = chatRoomSnap.data() as Omit<ChatRoom, "id">;

    // Security Check: Is the current user actually a participant?
    if (!roomData.participants.includes(currentUserId)) {
      console.warn("User is not a participant of this room.");
      return null;
    }

    const serializableRoomData: ChatRoom = {
      id: chatRoomSnap.id,
      ...roomData,
      lastMessage: roomData.lastMessage
        ? {
            ...roomData.lastMessage,
            // Convert timestamp to a simple string (handle Timestamp or other types safely)
            timestamp:
              roomData.lastMessage.timestamp &&
              (roomData.lastMessage.timestamp instanceof Timestamp ||
                typeof (roomData.lastMessage.timestamp as any)?.toDate === "function")
                ? (roomData.lastMessage.timestamp as any).toDate().toISOString()
                : typeof roomData.lastMessage.timestamp === "number"
                ? new Date(roomData.lastMessage.timestamp).toISOString()
                : new Date().toISOString(),
          }
        : {
            // Provide a default empty object
            text: "Chat started",
            senderId: "",
            timestamp: new Date(0).toISOString(),
            seenBy: [],
          },
      participantInfo: roomData.participantInfo || [],
      participants: roomData.participants || [],
    };

    return serializableRoomData; // <-- Return the simple, safe object
  } catch (error) {
    console.error("Error fetching chat room data:", error);
    return null;
  }
}
/**
 * The main page for a single 1-to-1 chat.
 */
export default async function ChatPage({ params }: ChatPageProps) {
  const { roomId } = params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login"); // Not logged in
  }

  const currentUserId = session.user.id;
  const roomData = await getChatRoomData(roomId, currentUserId);

  if (!roomData) {
    redirect("/dashboard"); // Room doesn't exist or user not part of it
  }

  // Get the *other* user's info for the header
  const otherParticipant = roomData.participantInfo.find(
    (p) => p.userId !== currentUserId
  );

  return (
    <div className="flex flex-col h-screen bg-black-50 pb-3 pt-12">


   
        <ChatHeader otherUser={otherParticipant}/>
    

      {/* MessageList Component (We will build this next)
        This component will be responsible for fetching and showing messages
        using the `useMessages` hook.
      */}
        
         <MessageList roomId={roomId} currentUserId={currentUserId} /> 
      

      {/* Message Input Component */}
      <MessageInput roomId={roomId} />
    </div>

  );
}
