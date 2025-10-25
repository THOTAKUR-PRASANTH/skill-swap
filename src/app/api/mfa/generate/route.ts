// src/app/api/mfa/generate/route.ts
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import { authenticator } from 'otplib';
import qrcode from 'qrcode';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id || !session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id }});
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  // Generate a unique secret for the user if they don't have one
  const secret = user.mfaSecret || authenticator.generateSecret();
  const userEmail = session.user.email;
  const appName = 'SkillSwap'; // Your app's name

  // Generate the key URI for the authenticator app
  const otpauth = authenticator.keyuri(userEmail, appName, secret);

  // Save the secret to the user's record
  await prisma.user.update({
    where: { id: session.user.id },
    data: { mfaSecret: secret },
  });

  // Generate a QR code image from the key URI
  const qrCodeDataUrl = await qrcode.toDataURL(otpauth);

  return NextResponse.json({ qrCodeDataUrl, secret });
}