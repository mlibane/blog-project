import NextAuth, { DefaultSession, Account as NextAuthAccount } from 'next-auth'
import { JWT as NextAuthJWT } from 'next-auth/jwt'

declare module "next-auth" {
  interface Session {
    accessToken?: string
    error?: string
    user: {
      id: string
      role: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

  interface User {
    role: string
  }
  interface Session extends DefaultSession {
    accessToken?: string
    error?: string
    user: {
      id: string
    } & DefaultSession["user"]
  }
  interface Account extends NextAuthAccount {
    expires_at: number
  }
}

declare module 'next-auth/jwt' {
  interface JWT extends NextAuthJWT {
    accessToken?: string
    refreshToken?: string
    accessTokenExpires?: number
    error?: string
    user?: Session['user']
  }
}