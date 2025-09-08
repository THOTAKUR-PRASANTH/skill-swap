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

const isPublicRoute = createRouteMatcher([
  "/auth/sign-in(.*)",   
  "/auth/sign-up(.*)",   
  "/",                   
]);

export default clerkMiddleware((auth, req) => {
  if (!isPublicRoute(req)) {
    // Protect everything else
    auth().protect();
  }
});

export const config = {
  matcher: [
    // Run middleware on all routes except static files and _next
    "/((?!.*\\..*|_next).*)",
    "/(api|trpc)(.*)",
  ],
};
