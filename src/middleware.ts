import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

import { prisma } from '@/lib/prisma';

export default withAuth({
  pages: {
    signIn: '/login',
  },
});

export const config = {
  matcher: ['/boards/:path*', '/board/:path*', '/card/:path*'],
};
