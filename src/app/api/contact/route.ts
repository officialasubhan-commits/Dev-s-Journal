import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, message } = body;

    console.log("Contact API received request:", { name, email, message });

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    // Insert into database using Prisma
    const newContactMessage = await prisma.message.create({
      data: {
        name,
        email,
        message,
      },
    });

    console.log("Prisma create() result - Message saved with ID:", newContactMessage.id);

    // Refresh the admin inbox
    revalidatePath("/admin/messages");

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
      data: newContactMessage,
    });
  } catch (error) {
    console.error("Contact API Prisma Error:", error);
    return NextResponse.json(
      { error: "Failed to send message. Please try again later." },
      { status: 500 }
    );
  }
}
