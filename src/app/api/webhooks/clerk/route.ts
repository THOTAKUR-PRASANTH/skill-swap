import { prisma } from "@/lib/prisma";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET!;
  const payload = await req.text();
  const headerPayload = headers();

  const svix_id = headerPayload.get("svix-id")!;
  const svix_timestamp = headerPayload.get("svix-timestamp")!;
  const svix_signature = headerPayload.get("svix-signature")!;

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: any;

  try {
    evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    });
  } catch (err) {
    console.error("❌ Webhook signature failed", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const eventType = evt.type;

  if (eventType === "user.created" || eventType === "user.updated") {
    const user = evt.data;

    // Default to Clerk image
    let profileImage = user.profile_image_url;

    // If Clerk’s image is default OR null, prefer social provider image
    if (
      !profileImage ||
      profileImage.includes("clerk.accounts.dev") ||
      profileImage.includes("clerk.com/avatars")
    ) {
      // Check Google or GitHub or any provider
      const socialAccount = user.external_accounts?.find(
        (acc: any) =>
          acc.provider === "google" ||
          acc.provider === "github"
      );

      if (socialAccount?.picture) {
        profileImage = socialAccount.picture;
      }
    }

    await prisma.user.upsert({
      where: { clerkId: user.id },
      update: {
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email_addresses[0]?.email_address,
        phoneNumber: user.phone_numbers[0]?.phone_number,
        profileImageUrl: profileImage,
        twoFactorEnabled: user.two_factor_enabled,
        passwordEnabled: user.password_enabled,
      },
      create: {
        clerkId: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email_addresses[0]?.email_address,
        phoneNumber: user.phone_numbers[0]?.phone_number,
        profileImageUrl: profileImage,
        twoFactorEnabled: user.two_factor_enabled,
        passwordEnabled: user.password_enabled,
      },
    });
  }

  if (eventType === "user.deleted") {
    const user = evt.data;

    try {
      await prisma.user.delete({
        where: { clerkId: user.id },
      });
      console.log(`✅ User ${user.id} deleted from DB`);
    } catch (err) {
      console.warn(`⚠ Tried to delete user ${user.id} but not found in DB`);
    }
  }

  return NextResponse.json({ status: "success" });
}
