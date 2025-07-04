import { UserRole } from '@prisma/client'
import * as z from 'zod'

export const settingsSchema = z.object({
    name:z.optional(z.string()),
    isTwoFactorEnabled:z.optional(z.boolean()),
    role:z.enum([UserRole.ADMIN, UserRole.USER]),
    email:z.optional(z.string().email()),
    password:z.optional(z.string().min(6)),
    newPassword:z.optional(z.string().min(6))
}).refine((data)=>{
    if(data.password && !data.newPassword){
        return false
    }
    if(!data.password && data.newPassword){
        return false
    }
    return true
},{
    message: 'Both password and new password must be provided together or not at all',
    path: ['password', 'newPassword']
})

export const NewPasswordSchema = z.object({
    password:z.string().min(6, {
        message: 'Password must be at least 6 characters long'
    }),
})

export const ResetSchema = z.object({
    email:z.string().email({
        message: 'Invalid email address'
    }),
})

export const LoginSchema = z.object({
    email:z.string().email({
        message: 'Invalid email address'
    }),
    password:z.string({
        message: 'Password is required'
    }),
    code:z.optional(z.string())
})

export const RegisterSchema = z.object({
    email:z.string().email({
        message: 'Invalid email address'
    }),
    password: z.string().min(6, {
        message: 'Password must be at least 6 characters long'
    }),
    name: z.string().min(1, {
        message: 'Name is required'
    }),
})
