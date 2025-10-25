// src/app/api/notifications/send/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import webpush from 'web-push';

const prisma = new PrismaClient();

// Configure web-push with your VAPID keys
webpush.setVapidDetails(
  `mailto:${process.env.EMAIL_FROM}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { userId: session.user.id },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json({ message: 'No subscriptions to send to.' }, { status: 200 });
    }

    const payload = JSON.stringify({
      title: 'Hello from SkillSwap!',
      body: 'This is a test notification.',
    });

    // Send a notification to each subscription
    for (const sub of subscriptions) {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: { p256dh: sub.p256dh, auth: sub.auth },
      };
      await webpush.sendNotification(pushSubscription, payload).catch(async (error: unknown) => {
        // If a subscription is expired or invalid, the push service returns a 410 status code.
        if (
          typeof error === 'object' &&
          error !== null &&
          'statusCode' in error &&
          (error as { statusCode: number }).statusCode === 410
        ) {
          // Clean up the invalid subscription from our database
          await prisma.pushSubscription.delete({ where: { id: sub.id } });
        } else {
          console.error('Failed to send notification:', error);
        }
      });
    }

    return NextResponse.json({ message: `${subscriptions.length} notifications sent.` }, { status: 200 });
  } catch (error) {
    console.error('SEND_NOTIFICATION_ERROR', error);
    return NextResponse.json({ error: 'Failed to send notifications.' }, { status: 500 });
  }
}