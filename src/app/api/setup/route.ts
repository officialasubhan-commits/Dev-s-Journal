import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
  try {
    const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
    if (adminCount > 0) {
      return NextResponse.json({ error: 'Setup wizard is disabled. Administrator already exists.' }, { status: 403 });
    }

    const { name, username, email, password, biography } = await req.json();

    if (!email || !password || !username) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const adminUser = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: hashedPassword,
        biography,
        role: "ADMIN",
        emailVerified: new Date(),
      },
    });

    // Create a real welcome notification for the admin
    await prisma.notification.create({
      data: {
        userId: adminUser.id,
        type: "SYSTEM",
        title: "Welcome to your Digital Home!",
        message: "Your administrator account has been successfully set up. You can now configure your portfolio, write journal entries, and manage settings.",
        link: "/admin/dashboard",
      },
    });

    return NextResponse.json(
      { message: "Administrator account created successfully", user: { id: adminUser.id, email: adminUser.email } }, { status: 201 });
  } catch (error: unknown) {
    console.error('Setup Error:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
