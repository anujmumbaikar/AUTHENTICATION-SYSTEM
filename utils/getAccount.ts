import { db } from '@/lib/db'

export const getAccountByUseId = async (userId: string) => {
    try {
        const account = await db.account.findFirst({
            where:{ userId }
        })
        if(!account) {
            return null
        }
        return account
    } catch (error) {
        return null
    }
}