import { db } from "@/lib/db";
import { getPasswordResetTokenByToken } from "@/utils/password-reset-token";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
export async function POST(request: Request) {
    try {
        const {token, password} = await request.json();
        if(!token || !password) {
            return NextResponse.json(
                { error: "Token and password are required" },
                { status: 400 }
            );
        }
        const existingToken = await getPasswordResetTokenByToken(token);
        if(!existingToken) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 400 }
            );
        }
        const hasExpired = new Date(existingToken.expires) < new Date();
        if(hasExpired) {
            return NextResponse.json(
                { error: "Token has expired" },
                { status: 400 }
            );
        }
        const existingUser = await db.user.findUnique({
            where: { email: existingToken.email },
        });
        if (!existingUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.user.update({
            where: { email: existingToken.email },
            data: { password: hashedPassword },
        });
        await db.passwordResetToken.delete({
            where: { id: existingToken.id },
        });
        return NextResponse.json(
            { message: "Password reset successfully" },
            { status: 200 }
        );
    } catch (error) {
        return NextResponse.json(
            { error: "An error occurred while resetting the password" },
            { status: 500 }
        );
        
    }
}