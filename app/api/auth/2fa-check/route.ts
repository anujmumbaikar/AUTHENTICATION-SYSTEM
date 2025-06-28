import { db } from "@/lib/db";
import { sendTwoFactorTokenEmail } from "@/utils/sendVerificationEmail";
import { generateTwoFactorToken } from "@/utils/tokens";
import { getTwoFactorConfirmationByUserId } from "@/utils/two-factor-confirmation";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const {email,code} = await req.json();
        if(!email){
            return NextResponse.json({error:"Email is required"}, {status:400});
        }
        const existingUser = await db.user.findUnique({
            where: { email },
        });
        if(existingUser?.isTwoFactorEnabled && existingUser.email){
            if(code){
                const twoFactorToken = await generateTwoFactorToken(existingUser.email);
                if(!twoFactorToken) {
                    return NextResponse.json({error:"Failed to generate two-factor token"}, {status:500});
                }
                if(twoFactorToken.token !== code) {
                    return NextResponse.json({error:"Invalid two-factor token"}, {status:400});
                }
                const hasExpired = new Date(twoFactorToken.expires) < new Date();
                if(hasExpired) {
                    return NextResponse.json({error:"Two-factor token has expired"}, {status:400});
                }
                await db.twoFactorToken.delete({
                    where: { id: twoFactorToken.id },
                });
                const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
                if(existingConfirmation) {
                    await db.twoFactorConfirmation.delete({
                        where: { id: existingConfirmation.id },
                    });
                }

                await db.twoFactorConfirmation.create({
                    data: {
                        userId: existingUser.id,
                    },
                })
                return NextResponse.json({message:"Two-factor authentication successful"}, {status:200});
            } else {
                const twoFactorToken = await generateTwoFactorToken(existingUser.email)
                await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);
            }
        }
        return NextResponse.json({twoFactor:true, message:"Two-factor authentication check completed"}, {status:200});
    } catch (error) {
        return NextResponse.json({error:"Internal Server Error"}, {status:500});
    }
}