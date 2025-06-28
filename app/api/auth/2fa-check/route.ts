// app/api/auth/2fa-check/route.ts
import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail } from "@/utils/sendVerificationEmail";
import { generateTwoFactorToken } from "@/utils/tokens";
import { getTwoFactorConfirmationByUserId } from "@/utils/two-factor-confirmation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();
        
        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        const existingUser = await db.user.findUnique({
            where: { email },
        });

        if (!existingUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // If user doesn't have 2FA enabled, return early
        if (!existingUser.isTwoFactorEnabled) {
            return NextResponse.json({ twoFactor: false, message: "Two-factor authentication not enabled" }, { status: 200 });
        }

        // If no code provided, send 2FA token
        if (!code) {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email!);
            if (!twoFactorToken) {
                return NextResponse.json({ error: "Failed to generate two-factor token" }, { status: 500 });
            }
            
            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
            return NextResponse.json({ twoFactor: true, message: "Two-factor code sent to email" }, { status: 200 });
        }

        // If code provided, verify it
        const twoFactorToken = await db.twoFactorToken.findFirst({
            where: { email: existingUser.email! },
        });

        if (!twoFactorToken) {
            return NextResponse.json({ error: "Two-factor token not found" }, { status: 400 });
        }

        if (twoFactorToken.token !== code) {
            return NextResponse.json({ error: "Invalid two-factor code" }, { status: 400 });
        }

        const hasExpired = new Date(twoFactorToken.expires) < new Date();
        if (hasExpired) {
            return NextResponse.json({ error: "Two-factor code has expired" }, { status: 400 });
        }

        // Delete the used token
        await db.twoFactorToken.delete({
            where: { id: twoFactorToken.id },
        });

        // Handle confirmation
        const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
        if (existingConfirmation) {
            await db.twoFactorConfirmation.delete({
                where: { id: existingConfirmation.id },
            });
        }

        await db.twoFactorConfirmation.create({
            data: {
                userId: existingUser.id,
            },
        });

        return NextResponse.json({ message: "Two-factor authentication successful" }, { status: 200 });

    } catch (error) {
        console.error("2FA Check Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}