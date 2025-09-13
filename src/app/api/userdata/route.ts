// app/api/user/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

// Simple in-memory cache
const userCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 10 * 1000; // 10 seconds

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check cache first
    const cached = userCache.get(userId);
    const now = Date.now();
    if (cached && now - cached.timestamp < CACHE_TTL) {
      return NextResponse.json(cached.data);
    }

    // Fetch user from DB
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        phoneNumber: true,
        profileImageUrl: true,
        twoFactorEnabled: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Store in cache
    userCache.set(userId, { data: user, timestamp: now });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
