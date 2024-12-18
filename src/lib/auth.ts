/* eslint-disable @typescript-eslint/no-explicit-any */
import { getServerSession, NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import { PrismaAdapter } from '@auth/prisma-adapter';

import { prisma } from './prisma';

declare module 'next-auth' {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      // If the url is a relative URL, prefix the base url
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      // If it's an absolute URL but on same site, allow it
      else if (new URL(url).origin === baseUrl) return url;
      // Otherwise, return to the homepage
      return baseUrl;
    },
  },
  pages: {
    signIn: '/login',
  },
};

export const getAuthSession = () => getServerSession(authOptions);
