import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/en/login', // We use en as default for auth redirects
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdminRoute = nextUrl.pathname.includes('/admin');
      
      if (isAdminRoute) {
        if (isLoggedIn) return true;
        return false; // Redirect to signIn
      }
      return true;
    },
  },
  providers: [], // Add providers in auth.ts
} satisfies NextAuthConfig;
