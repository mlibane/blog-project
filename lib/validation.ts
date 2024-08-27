// lib/validation.ts

import { PrismaClient } from '@prisma/client'

export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/
  return usernameRegex.test(username)
}

export async function isUsernameTaken(username: string, prisma: PrismaClient): Promise<boolean> {
  const existingUser = await prisma.user.findFirst({
    where: {
      name: {
        equals: username,
        mode: 'insensitive',
      },
    },
  })
  return !!existingUser
}