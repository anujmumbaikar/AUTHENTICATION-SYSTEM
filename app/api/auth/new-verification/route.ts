import { db } from "@/lib/db";
import { getVerificationTokenByToken } from "@/utils/verification-token";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    try {
        const {token} = await request.json();

        const existingToken = await getVerificationTokenByToken(token);
        if(!existingToken){
            return NextResponse.json({
                error: "Invalid or expired verification token."
            }, { status: 400 });
        }
        const hasExpired = new Date(existingToken.expires) < new Date();
        if(hasExpired){
            return NextResponse.json({
                error: "Verification token has expired."
            }, { status: 400 });
        }
        const existingUser = await db.user.findUnique({
            where: {
                email: existingToken.email,
            }
        });
        if(!existingUser){
            return NextResponse.json({
                error: "User not found."
            }, { status: 404 });
        }
        await db.user.update({
            where:{id:existingUser.id},
            data:{
                emailVerified:new Date(),
                email:existingToken.email
            }
        })
        await db.verificationToken.delete({
            where: {
                id: existingToken.id,
            },
        });
        return NextResponse.json({
            message: "Email verified successfully."
        }, { status: 200 });
    } catch (error) {
        return NextResponse.json({
            error: "An error occurred while processing your request."
        }, { status: 500 });
    }
}
