import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  pages: {
    signIn: '/login',
    verifyRequest: '/login?verify=1',
    error: '/login',
  },
  session: { strategy: 'jwt' },
  providers: [],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      if (nextUrl.pathname.startsWith('/dashboard')) {
        return !!auth?.user
      }
      return true
    },
  },
} satisfies NextAuthConfig
