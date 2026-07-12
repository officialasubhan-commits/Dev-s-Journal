import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import { generateSecret, generateURI } from 'otplib';
import qrcode from 'qrcode';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = generateSecret();
    const otpauth = generateURI({ issuer: 'BossJournal', label: session.user.email, secret });
    const qrCodeUrl = await qrcode.toDataURL(otpauth);

    // Save temporary secret to user, wait for verification before enabling
    await prisma.user.update({
      where: { email: session.user.email },
      data: { twoFactorSecret: secret }
    });

    return NextResponse.json({ secret, qrCodeUrl }, { status: 200 });
  } catch (error: unknown) {
    console.error('2FA Generation Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
