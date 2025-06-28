import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail } from "@/utils/sendVerificationEmail";
import { generateTwoFactorToken } from "@/utils/tokens";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const {email} = await req.json();
        if(!email){
            return NextResponse.json({error:"Email is required"}, {status:400});
        }
        const existingUser = await db.user.findUnique({
            where: { email },
        });
        if(existingUser?.isTwoFactorEnabled && existingUser.email){
            const twoFactorToken = await generateTwoFactorToken(existingUser.email)
            await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
        }
        return {twoFactor:true, message:"Two factor token sent to email"};
    } catch (error) {
        return NextResponse.json({error:"Internal Server Error"}, {status:500});
    }
}