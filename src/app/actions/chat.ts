"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  adminDb,
  adminRtdb,
  admin, // We need the main 'admin' export
} from "@/lib/firebaseAdmin";

import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client"; // Import your singleton prisma client
import { webPush } from "@/lib/webPush";
import { ParticipantInfo } from "@/types/chat";
const prisma = new PrismaClient();  
/**
 * Creates a unique chat room ID for two users, sorted alphabetically.
 */
function createChatRoomId(uid1: string, uid2: string): string {
  if (uid1 < uid2) {
    return `${uid1}_${uid2}`;
  } else {
    return `${uid2}_${uid1}`;
  }
}

/**
 * Helper to get user info from CockroachDB.
 */
async function getUserFromCockroachDB(
  userId: string
): Promise<ParticipantInfo | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, image: true },
  });

  if (!user) return null;
  return {
    userId: user.id,
    name: user.name || "SkillSwap User",
    avatar: user.image || null,
  };
}

/**
 * Creates a new 1-to-1 chat room in Firestore if one doesn't already exist.
 */
export async function createOrGetChatRoom(otherUserId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("User is not authenticated.");
  const currentUserId = session.user.id;
  if (currentUserId === otherUserId)
    throw new Error("Cannot create a chat room with yourself.");

  const roomId = createChatRoomId(currentUserId, otherUserId);

  try {
    // --- Use namespaced syntax ---
    const chatRoomRef = adminDb.collection("chatRooms").doc(roomId);
    const chatRoomSnap = await chatRoomRef.get();
    // --- End of fix ---

    if (!chatRoomSnap.exists) {
      const [currentUser, otherUser] = await Promise.all([
        getUserFromCockroachDB(currentUserId),
        getUserFromCockroachDB(otherUserId),
      ]);

      if (!currentUser || !otherUser) {
        throw new Error("One or both users not found in the database.");
      }

      const defaultLastMessage = {
        text: "Chat created",
        senderId: currentUserId,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        seenBy: [currentUserId],
      };

      // --- Use namespaced syntax ---
      await chatRoomRef.set({
        participants: [currentUserId, otherUserId],
        participantInfo: [currentUser, otherUser],
        lastMessage: defaultLastMessage,
      });
      // --- End of fix ---
    }
  } catch (error) {
    console.error("Error in createOrGetChatRoom:", error);
    throw new Error("Failed to create or get chat room.");
  }

  redirect(`/chat/${roomId}`);
}

/**
 * Sends a new message to a chat room.
 */
export async function sendMessage(roomId: string, messageText: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("User is not authenticated.");

  const currentUserId = session.user.id;
  const text = messageText.trim();
  if (!text) throw new Error("Message cannot be empty.");

  try {
    // --- Use namespaced syntax ---
    const chatRoomRef = adminDb.collection("chatRooms").doc(roomId);
    const newMessageRef = chatRoomRef.collection("messages").doc();
    // --- End of fix ---

    const newMessageData = {
      id: newMessageRef.id,
      senderId: currentUserId,
      text: text,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      seenBy: [currentUserId], // Added this field
    };

    const newLastMessageData = {
      text: text,
      senderId: currentUserId,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      seenBy: [currentUserId],
    };

    // --- Use namespaced syntax ---
    await adminDb.runTransaction(async (transaction) => {
      // --- End of fix ---
      const chatRoomSnap = await transaction.get(chatRoomRef);
      if (!chatRoomSnap.exists) throw new Error("Chat room does not exist.");

      const participants = chatRoomSnap.data()!.participants as string[];
      if (!participants.includes(currentUserId)) {
        throw new Error("User is not a participant of this chat room.");
      }
      transaction.set(newMessageRef, newMessageData);
      transaction.update(chatRoomRef, { lastMessage: newLastMessageData });
    });

    // Send notification *after* transaction is successful
    await sendNotificationToOfflineUser(roomId, currentUserId, text);

    revalidatePath(`/dashboard`);
    revalidatePath(`/chat/${roomId}`);
    return { success: true };
  } catch (error) {
    console.error("Error sending message:", error);
    return { success: false, error: "Failed to send message." };
  }
}

/**
 * Marks a list of messages as "seen" by the current user.
 */
export async function markMessagesAsSeen(roomId: string, messageIds: string[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return { error: "Unauthorized" };
  const currentUserId = session.user.id;

  if (!messageIds || messageIds.length === 0) return { success: true };

  try {
    // --- Use namespaced syntax ---
    const chatRoomRef = adminDb.collection("chatRooms").doc(roomId);
    const batch = adminDb.batch();
    // --- End of fix ---

    messageIds.forEach((messageId) => {
      // --- Use namespaced syntax ---
      const messageRef = chatRoomRef.collection("messages").doc(messageId);
      batch.update(messageRef, {
        seenBy: admin.firestore.FieldValue.arrayUnion(currentUserId),
      });
      // --- End of fix ---
    });

    batch.update(chatRoomRef, {
      // --- Use namespaced syntax ---
      "lastMessage.seenBy": admin.firestore.FieldValue.arrayUnion(currentUserId),
      // --- End of fix ---
    });

    await batch.commit();
    return { success: true };
  } catch (error) {
    console.error("Error marking messages as seen:", error);
    return { error: "Failed to update seen status." };
  }
}

/**
 * Sends a push notification to a user IF they are offline.
 */
async function sendNotificationToOfflineUser(
  roomId: string,
  currentUserId: string,
  messageText: string
) {
  try {
    const sender = await getUserFromCockroachDB(currentUserId);
    const senderName = sender?.name || "New Message";

    // --- Use namespaced syntax ---
    const roomRef = adminDb.collection("chatRooms").doc(roomId);
    const roomSnap = await roomRef.get();
    // --- End of fix ---
    if (!roomSnap.exists) return;
    const roomData = roomSnap.data()!;
    const recipientId = roomData.participants.find(
      (id: string) => id !== currentUserId
    );
    if (!recipientId) return;

    // Check if the recipient is OFFLINE
    const presenceRef = adminRtdb.ref(`/status/${recipientId}`); // <-- Use adminRtdb
    const presenceSnap = await presenceRef.once("value");
    const recipientStatus = presenceSnap.val();

    if (recipientStatus && recipientStatus.isOnline === false) {
      console.log(`User ${recipientId} is offline. Sending notification...`);

      const pushSubscriptions = await prisma.pushSubscription.findMany({
        where: { userId: recipientId },
      });

      if (pushSubscriptions.length === 0) {
        console.log(`User ${recipientId} has no push subscriptions.`);
        return;
      }

      const payload = JSON.stringify({
        title: senderName,
        body: messageText,
        icon: sender?.avatar || "/logo.png",
        data: { url: `/chat/${roomId}` },
      });

      for (const sub of pushSubscriptions) {
        const subscription = {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth }, // Typos are fixed here
        };
        try {
          await webPush.sendNotification(subscription, payload);
        } catch (err: unknown) {
          console.error("Error sending push notification:", err);
          const statusCode = (err as { statusCode?: number })?.statusCode;
          if (statusCode === 410) {
            // Subscription is no longer valid, delete it
            await prisma.pushSubscription.delete({
              where: { id: sub.id },
            });
          }
        }
      }
    } else {
      console.log(`User ${recipientId} is online. No notification sent.`);
    }
  } catch (error) {
    console.error("Error in sendNotificationToOfflineUser:", error);
  }
}
