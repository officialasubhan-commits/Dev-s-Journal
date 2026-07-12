import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Missing token or password.' }, { status: 400 });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    
    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { token: hashedToken },
      include: { user: true }
    });

    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Invalid or expired reset token.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword, lockedUntil: null, failedLoginAttempts: 0 }
    });

    // Clean up used token
    await prisma.passwordResetToken.delete({ where: { id: resetRecord.id } });

    return NextResponse.json({ message: 'Password updated successfully.' }, { status: 200 });
  } catch (error: unknown) {
    console.error('Update Password Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
