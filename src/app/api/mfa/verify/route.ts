// src/app/api/mfa/verify/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { token } = await request.json();
  if (!token) {
    return NextResponse.json({ error: 'Token is required.' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || !user.mfaSecret) {
    return NextResponse.json({ error: 'MFA secret not found.' }, { status: 400 });
  }

  const isValid = authenticator.check(token, user.mfaSecret);

  if (isValid) {
    await prisma.user.update({
      where: { id: user.id },
      data: { mfaEnabled: true },
    });
    return NextResponse.json({ message: 'MFA enabled successfully!' }, { status: 200 });
  } else {
    return NextResponse.json({ error: 'Invalid token.' }, { status: 400 });
  }
}