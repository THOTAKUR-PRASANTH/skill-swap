// src/app/api/verify-email/route.ts
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json({ error: 'Token is required.' }, { status: 400 });
    }

    // 1. Find the token in the database
    const verificationToken = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!verificationToken) {
      return NextResponse.json({ error: 'Invalid token.' }, { status: 400 });
    }

    // 2. Check if the token has expired
    const hasExpired = new Date() > new Date(verificationToken.expires);
    if (hasExpired) {
      return NextResponse.json({ error: 'Token has expired.' }, { status: 400 });
    }

    // 3. Find the user associated with the token
    const user = await prisma.user.findUnique({
      where: { email: verificationToken.identifier },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    // 4. Update the user to mark their email as verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
      },
    });

    // 5. Delete the token so it can't be used again
    await prisma.verificationToken.delete({
      where: { token },
    });

    return NextResponse.json({ message: 'Email successfully verified!' }, { status: 200 });

  } catch (error) {
    console.error('VERIFICATION_ERROR', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}