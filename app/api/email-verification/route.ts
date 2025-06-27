import { db } from "@/lib/db";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import { generateVerificationToken } from "@/utils/tokens";
import { NextResponse } from "next/server";
export async function POST(req: Request) {
    try {
        const {email} = await req.json();
        if(!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }
        const existingUser = await db.user.findUnique({
            where: {
                email
            }
        });
        if(!existingUser || !existingUser.email || !existingUser.password) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        if(!existingUser.emailVerified) {
            try {
            const { token } = await generateVerificationToken(email);
            await sendVerificationEmail(email, token);
          } catch (err) {
            console.error("Failed to send verification email", err);
          }
        }
        return NextResponse.json({ message: "Verification email sent" }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}