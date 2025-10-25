// src/app/api/register/route.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid'; // For generating a unique token
import { sendEmail } from '@/lib/email'; // Our email helper

const prisma = new PrismaClient();

const userSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters long" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = userSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.format() }, { status: 400 });
    }

    const { name, email, password } = validation.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: { name, email, hashedPassword },
    });

    // 👇 --- NEW VERIFICATION LOGIC STARTS HERE --- 👇

    // 1. Generate a verification token
    const verificationToken = uuidv4();
    const expires = new Date(new Date().getTime() + 3600 * 1000); // Expires in 1 hour

    // 2. Store the token in the database
    await prisma.verificationToken.create({
      data: {
        identifier: newUser.email!,
        token: verificationToken,
        expires,
      },
    });

    // 3. Create the verification link
    const verificationLink = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

    // 4. Send the verification email
    await sendEmail({
      to: newUser.email!,
      subject: 'Verify your email address',
      html: `<p>Hi ${newUser.name},</p><p>Please click the link below to verify your email address:</p><a href="${verificationLink}">Verify Email</a>`,
    });
    
    // 👆 --- NEW VERIFICATION LOGIC ENDS HERE --- 👆

    const { hashedPassword: _, ...userWithoutPassword } = newUser;
    return NextResponse.json(userWithoutPassword, { status: 201 });

  } catch (error) {
    console.error('REGISTRATION_ERROR', error);
    return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
  }
}