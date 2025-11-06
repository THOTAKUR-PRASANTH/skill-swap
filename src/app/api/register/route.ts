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

// 👇 --- ADDED YOUR LIST OF ICONS HERE --- 👇
const profileIcons = [
  'https://ik.imagekit.io/jt0unlio3s/smiling_face_with_heart-eyes_3d.png?updatedAt=1761984706574',
  'https://ik.imagekit.io/jt0unlio3s/54-smiling-face-with-smiling-eyes-3d-emoji.png?updatedAt=1761984706571',
  'https://ik.imagekit.io/jt0unlio3s/star-struck_3d.png?updatedAt=1761984706530',
  'https://ik.imagekit.io/jt0unlio3s/winking_face_3d.png?updatedAt=1761984706513',
  'https://ik.imagekit.io/jt0unlio3s/62-slightly-smiling-face-3d-emoji.png?updatedAt=1761984706479',
  'https://ik.imagekit.io/jt0unlio3s/beaming_face_with_smiling_eyes_3d.png?updatedAt=1761984706448',
  'https://ik.imagekit.io/jt0unlio3s/cat_with_tears_of_joy_3d.png?updatedAt=1761984706424',
  'https://ik.imagekit.io/jt0unlio3s/smiling_face_with_smiling_eyes_3d.png?updatedAt=1761984706397',
  'https://ik.imagekit.io/jt0unlio3s/winking_face_with_tongue_3d.png?updatedAt=1761984706379',
  'https://ik.imagekit.io/jt0unlio3s/57-hugging-face-3d-emoji.png?updatedAt=1761984706386',
  'https://ik.imagekit.io/jt0unlio3s/11-smiling-face-with-sunglasses-3d-emoji.png?updatedAt=1761984706377',
  'https://ik.imagekit.io/jt0unlio3s/50-smiling-face-with-hearts-3d-emoji.png?updatedAt=1761984706327',
  'https://ik.imagekit.io/jt0unlio3s/nerd_face_3d.png?updatedAt=1761984706212',
  'https://ik.imagekit.io/jt0unlio3s/smiling_face_with_hearts_3d.png?updatedAt=1761984706096',
  'https://ik.imagekit.io/jt0unlio3s/17-winking-face-with-tongue-3d-emoji.png?updatedAt=1761984705776',
  'https://ik.imagekit.io/jt0unlio3s/usericon.svg?updatedAt=1756536633173'
];
// 👆 --- END OF ICON LIST --- 👆

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

    // 👇 --- PICK A RANDOM ICON --- 👇
    const randomIndex = Math.floor(Math.random() * profileIcons.length);
    const randomProfileIcon = profileIcons[randomIndex];
    // 👆 --- END OF RANDOM ICON LOGIC --- 👆

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
        image: randomProfileIcon, // 👇 --- ASSIGN THE RANDOM ICON HERE --- 👇
      },
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