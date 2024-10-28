import { clerkClient, clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/search(.*)',
  '/meal-plan(.*)',
  '/articles(.*)',
]);

const isAdminRoute = createRouteMatcher([
  '/admin(.*)'
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = auth();

  if (isProtectedRoute(req)) {
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
  }

  if (isAdminRoute(req)) {
    if(!userId){
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }

    const user = await clerkClient.users.getUser(userId);

    const role = user.publicMetadata.role || user.privateMetadata.role;

    if (role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
});
export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};