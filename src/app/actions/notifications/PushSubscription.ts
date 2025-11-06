"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
// Assuming your Prisma client is exported from 'lib/prisma'
// If your file is elsewhere, you'll need to update this path.
import { PrismaClient } from "@prisma/client";

/**
 * Represents the structure of a PushSubscription object
 * received from the browser's PushManager.
 */
interface PushSubscriptionObject {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Server action to save a new push notification subscription
 * to the database, linked to the currently logged-in user.
 */
const prisma = new PrismaClient();
export async function savePushSubscription(
  subscription: PushSubscriptionObject
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Unauthorized. User not logged in." };
  }
  const userId = session.user.id;

  if (!subscription || !subscription.endpoint) {
    return { error: "Invalid subscription object provided." };
  }

  try {
    // Check if this endpoint already exists to avoid duplicates
    const existingSubscription = await prisma.pushSubscription.findUnique({
      where: { endpoint: subscription.endpoint },
    });

    if (existingSubscription) {
      // It exists, but is it for the right user?
      if (existingSubscription.userId === userId) {
        console.log("Push subscription already exists for this user.");
        return { success: true, message: "Subscription already exists." };
      } else {
        // This is rare, but if the endpoint is somehow linked to another user,
        // we should probably update its ownership.
        await prisma.pushSubscription.update({
          where: { endpoint: subscription.endpoint },
          data: { userId },
        });
        console.log("Push subscription updated with new user.");
        return { success: true, message: "Subscription ownership updated." };
      }
    }

    // Create the new subscription in the CockroachDB table
    await prisma.pushSubscription.create({
      data: {
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userId: userId, // Link it to the user
      },
    });

    console.log("New push subscription saved for user:", userId);
    return { success: true, message: "Subscription saved successfully." };
  } catch (error) {
    console.error("Error saving push subscription:", error);
    return { error: "Failed to save push subscription." };
  }
}

/**
 * Server action to remove a specific push notification subscription.
 * This is useful if a subscription becomes invalid or the user logs out.
 */
export async function deletePushSubscription(endpoint: string) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return { error: "Unauthorized. User not logged in." };
  }
  const userId = session.user.id;

  try {
    // We only delete the subscription if it belongs to the current user
    await prisma.pushSubscription.deleteMany({
      where: {
        endpoint: endpoint,
        userId: userId, // Security check
      },
    });

    console.log("Push subscription deleted:", endpoint);
    return { success: true, message: "Subscription deleted." };
  } catch (error) {
    console.error("Error deleting push subscription:", error);
    return { error: "Failed to delete push subscription." };
  }
}

