// import { clerkMiddleware } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";

// export default clerkMiddleware((auth, req) => {
//     const url = req.nextUrl.pathname;

//     const { userId } = auth();

//     // Protect /dashboard and sub-routes
//     if (!userId && url.startsWith("/dashboard")) {
//         return NextResponse.redirect(new URL("/auth/sign-in", req.url));
//     }

//     // Redirect authenticated users away from auth routes
//     if (userId && (url.startsWith("/auth/sign-in") || url.startsWith("/auth/sign-up"))) {
//         return NextResponse.redirect(new URL("/dashboard", req.url));
//     }
// });

// export const config = {
//     matcher: [
//         "/((?!.*\\..*|_next).*)",
//         "/(api|trpc)(.*)",
//         "/dashboard(.*)",
//         "/",
//         "/auth/sign-in(.*)",
//         "/auth/sign-up(.*)",
//     ],
// };



import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/auth/sign-in(.*)",
  "/auth/sign-up(.*)",
  "/", // public home page
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    const { userId } = auth();
    if (!userId) {
      // User is not signed in → redirect to your custom page
      const signInUrl = new URL("/auth/sign-in", req.url);
      signInUrl.searchParams.set("redirect_url", req.nextUrl.pathname);
      return NextResponse.redirect(signInUrl);
    }
  }

  // If public route or user is signed in → continue
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!.*\\..*|_next).*)", // run on all non-static routes
    "/(api|trpc)(.*)",
  ],
};


