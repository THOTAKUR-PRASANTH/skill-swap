// src/app/api/auth/reset-password/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

const prisma = new PrismaClient();

const resetPasswordSchema = z.object({
  token: z.string().uuid(),
  password: z.string().min(6, 'Password must be at least 6 characters long.'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = resetPasswordSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { token, password } = validation.data;

    const resetToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!resetToken) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 400 });
    }

    const hasExpired = new Date() > new Date(resetToken.expires);
    if (hasExpired) {
      return NextResponse.json({ error: 'Token has expired.' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: resetToken.identifier },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: { hashedPassword },
    });

    // Invalidate the token after use
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({ message: 'Password has been reset successfully.' }, { status: 200 });

  } catch (error) {
    console.error('RESET_PASSWORD_ERROR', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}