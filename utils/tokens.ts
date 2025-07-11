import { db } from '@/lib/db';
import {v4 as uuidv4} from 'uuid';
import { getVerificationTokenByEmail } from './verification-token';
import { getPasswordResetTokenByEmail } from './password-reset-token';
import crypto from 'crypto';
import { getTwoFactorTokenByEmail } from './two-factor-token';
import { get } from 'http';

export const generateTwoFactorToken = async(email:string) => {
    const token = crypto.randomInt(100000, 999999).toString();
    const expires = new Date(new Date().getTime() + 10*60*100);

    const existingToken = await getTwoFactorTokenByEmail(email);
    if(existingToken){
        await db.twoFactorToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }
    const twoFactorToken = await db.twoFactorToken.create({
        data: {
            email,
            token,
            expires
        }
    });
    return twoFactorToken;
}

export const generatePasswordResetToken = async(email:string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600*1000);

    const existingToken = await getPasswordResetTokenByEmail(email);
    if(existingToken){
        await db.passwordResetToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }
    const passwordResetToken = await db.passwordResetToken.create({
        data: {
            email,
            token,
            expires
        }
    })
    return passwordResetToken;
}

export const generateVerificationToken = async(email:string) => {
    const token = uuidv4();
    const expires = new Date(new Date().getTime() + 3600*1000);


    const existingToken = await getVerificationTokenByEmail(email);
    if(existingToken){
        await db.verificationToken.delete({
            where: {
                id: existingToken.id
            }
        })
    }
    const verificationToken = await db.verificationToken.create({
        data: {
            email,
            token,
            expires
        }
    })
    return verificationToken;
}