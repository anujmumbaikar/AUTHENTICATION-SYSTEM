import { db } from '@/lib/db'
import { hashPassword } from '@/utils/hashing'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, password } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const existingUser = await db.user.findUnique({ where: { email } })
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 409 })
  }

  const hashed = await hashPassword(password)

  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashed
    }
  })

  return NextResponse.json({ message: 'User registered', user })
}
