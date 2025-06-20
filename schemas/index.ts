import * as z from 'zod'

export const LoginSchema = z.object({
    email:z.string().email({
        message: 'Invalid email address'
    }),
    password:z.string({
        message: 'Password is required'
    })
})