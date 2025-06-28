import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail, sendVerificationEmail } from "@/utils/sendVerificationEmail";
import { generateTwoFactorToken, generateVerificationToken } from "@/utils/tokens";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (existingUser.emailVerified) {
      return NextResponse.json({ message: "Email already verified" }, { status: 200 });
    }
    
    try {
      const { token } = await generateVerificationToken(email);
      await sendVerificationEmail(email, token);
      return NextResponse.json({ message: "Verification email sent" }, { status: 200 });
    } catch (err) {
      console.error("Email send failed:", err);
      return NextResponse.json({ error: "Failed to send verification email" }, { status: 500 });
    }

  } catch (error) {
    console.error("Server error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
