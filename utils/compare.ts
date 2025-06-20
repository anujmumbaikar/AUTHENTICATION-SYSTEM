// compare.ts
import bcrypt from 'bcrypt'

export const comparePasswords = async (input: string, hashed: string) => {
  return bcrypt.compare(input, hashed)
}
