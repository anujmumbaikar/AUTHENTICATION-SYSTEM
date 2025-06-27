import { db } from "@/lib/db";
import { sendPasswordResetEmail } from "@/utils/sendVerificationEmail";
import { generatePasswordResetToken } from "@/utils/tokens";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { email } = await request.json();
        const existingUser = await db.user.findUnique({
            where: { email },
        });
        if (!existingUser || !existingUser.email) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        const passwordResetToken = await generatePasswordResetToken(existingUser?.email);
        await sendPasswordResetEmail(
            existingUser.email,
            passwordResetToken.token
        );
        return NextResponse.json(
            { message: "Password reset email sent successfully" },
            { status: 200 }
        )
    } catch (error) {
        return NextResponse.json(
            { error: "An error occurred while processing your request" },
            { status: 500 }
        );
    }
}