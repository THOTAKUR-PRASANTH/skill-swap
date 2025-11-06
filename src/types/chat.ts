import { FieldValue, Timestamp } from "firebase/firestore";

/**
 * Represents a single message inside the `messages` sub-collection.
 */
export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Timestamp | FieldValue; // Use Timestamp for reading, FieldValue for writing
}

/**
 * Represents the stored info for a participant in the `participantInfo` array.
 */
export interface ParticipantInfo {
  userId: string;
  name: string | null;
  avatar: string | null;
}

/**
 * Represents the `lastMessage` object stored on a `ChatRoom` document.
 */
export interface LastMessage {
  text: string;
  senderId: string;
  timestamp: Timestamp | FieldValue;
  seenBy: string[]; // Array of user IDs who have seen this message
}

/**
 * Represents a single `ChatRoom` document in the `chatRooms` collection.
 */
export interface ChatRoom {
  id: string; // The document ID (e.g., "userA_userB")
  participants: string[];
  participantInfo: ParticipantInfo[];
  lastMessage: LastMessage | null; // Can be null if no messages are sent yet
}

/**
 * Represents a single Message document in the 'messages' sub-collection.
 */
export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string | Timestamp; // Serialized string OR Firestore Timestamp
  
  // --- ADDED THIS FIELD ---
  // Tracks who has seen this specific message
  seenBy: string[]; 
}


/**
 * Defines the user status object stored in Realtime Database.
 */
export interface UserPresence {
  isOnline: boolean;
  lastSeen: number; // This is a Firebase Server Timestamp
}