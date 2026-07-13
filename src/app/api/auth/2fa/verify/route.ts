import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import prisma from '@/lib/prisma';
import { verify } from 'otplib';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { token } = await req.json();

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user || !user.twoFactorSecret) {
      return NextResponse.json({ error: 'No 2FA secret found' }, { status: 400 });
    }

    const isValid = await verify({ token, secret: user.twoFactorSecret });

    if (isValid) {
      await prisma.user.update({
        where: { email: session.user.email },
        data: { twoFactorEnabled: true }
      });
      return NextResponse.json({ message: '2FA successfully enabled.' }, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Invalid authenticator code.' }, { status: 400 });
    }
  } catch (error: unknown) {
    console.error('2FA Verification Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
