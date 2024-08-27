// app/api/auth/signup/route.ts

import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import prisma from '@/lib/prisma'
import { isValidUsername, isUsernameTaken } from '@/lib/validation'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, password } = body

  if (!name || !email || !password) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  // Validate username
  if (!isValidUsername(name)) {
    return NextResponse.json(
      { error: 'Invalid username. Use 3-20 characters, letters, numbers, underscores, or hyphens.' },
      { status: 400 }
    )
  }

  // Check if username is taken
  if (await isUsernameTaken(name, prisma)) {
    return NextResponse.json({ error: 'Username is already taken.' }, { status: 400 })
  }

  const existingUser = await prisma.user.findUnique({
    where: { email }
  })

  if (existingUser) {
    return NextResponse.json({ error: 'Email already exists' }, { status: 400 })
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    }
  })

  return NextResponse.json({ message: 'User created successfully' }, { status: 201 })
}