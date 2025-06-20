import { db } from '@/lib/db'
import { comparePasswords } from '@/utils/compare'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'Missing credentials' }, { status: 400 })
  }

  const user = await db.user.findUnique({ where: { email } })

  if (!user || !user.password) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
  }

  const isValid = await comparePasswords(password, user.password)

  if (!isValid) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 })
  }

  return NextResponse.json({ message: 'Login successful', user })
}
