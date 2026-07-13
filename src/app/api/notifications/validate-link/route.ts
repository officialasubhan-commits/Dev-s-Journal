import { NextResponse } from "next/server";
import { validateLink } from "@/lib/linkValidator";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const link = searchParams.get("link");

    if (!link) {
      return NextResponse.json({ valid: true });
    }

    const isValid = await validateLink(link);
    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error("Failed to validate link:", error);
    return NextResponse.json({ valid: false, error: "Validation error" });
  }
}
