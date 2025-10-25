// src/app/api/auth/forgot-password/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { sendEmail } from '@/lib/email';
import { Ratelimit } from '@upstash/ratelimit'; // 👈 IMPORT RATELIMIT
import { Redis } from '@upstash/redis'; // 👈 IMPORT REDIS

const prisma = new PrismaClient();

// 👇 --- NEW RATELIMITER SETUP --- 👇
// Create a new ratelimiter, that allows 1 request per 60 seconds
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(1, "60 s"),
  analytics: true,
  /**
   * Optional prefix for the keys used in redis. This is useful if you want to share a redis
   * instance with other applications and want to avoid key collisions. The default prefix is
   * "@upstash/ratelimit"
   */ 
  prefix: "@upstash/ratelimit",
});


export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    // 👇 --- APPLYING THE RATE LIMIT --- 👇
    // Use the user's email as the unique identifier for rate limiting
    const identifier = email;
    const { success } = await ratelimit.limit(identifier);

    // If the success flag is false, it means the user has sent too many requests
    if (!success) {
      return NextResponse.json({ error: 'Too many requests. Please wait a minute before trying again.' }, { status: 429 });
    }
    // 👆 --- END OF RATE LIMIT LOGIC --- 👆


    const user = await prisma.user.findUnique({ where: { email } });

    if (user && user.hashedPassword) {
      const resetToken = uuidv4();
      const expires = new Date(new Date().getTime() + 3600 * 1000); // 1 hour expiry

      await prisma.verificationToken.create({
        data: { identifier: email, token: resetToken, expires },
      });

      const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

      await sendEmail({
        to: email,
        subject: 'Reset your password',
        html: `<p>Hi ${user.name},</p><p>Click the link below to reset your password:</p><a href="${resetLink}">Reset Password</a>`,
      });
    }
    
    return NextResponse.json({ message: 'If your account exists, a password reset link has been sent.' }, { status: 200 });

  } catch (error) {
    console.error('FORGOT_PASSWORD_ERROR', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}