import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { debug } from "console";

const isPublicRoute = createRouteMatcher(['/', '/api/webhook/clerk', '/sign-in(.*)', '/sign-up(.*)'])

export default clerkMiddleware((auth, request) => {
  if(!isPublicRoute(request)) {
    auth().protect();
  }
});

// export default clerkMiddleware()

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)", '/((?!api|_next|.*\\..*).*)'],
};