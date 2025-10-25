// src/app/api/notifications/subscribe/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const sub = await request.json();

    // Store the subscription in the database
    await prisma.pushSubscription.create({
      data: {
        userId: session.user.id,
        endpoint: sub.endpoint,
        p256dh: sub.keys.p256dh,
        auth: sub.keys.auth,
      },
    });

    return NextResponse.json({ message: 'Subscription saved.' }, { status: 201 });
  } catch (error) {
    console.error('SUBSCRIBE_ERROR', error);
    return NextResponse.json({ error: 'Failed to save subscription.' }, { status: 500 });
  }
}