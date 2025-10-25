import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    const { token } = req.nextauth;
    const { pathname } = req.nextUrl;

    // Redirect authenticated users from auth pages (login, register) to the dashboard.
    // The `token` object exists if the user is signed in.
    if (token && (pathname.startsWith("/auth/sign-in") || pathname.startsWith("/auth/sign-up") )){
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    // Always return a response or call NextResponse.next()
    return NextResponse.next();
  },
  {
    callbacks: {
      // This callback is used to decide if the user is authorized to access a page.
      // It returns `true` if the user has a token (is logged in).
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/sign-in",
    },
  }
);

export const config = {
 matcher: ["/dashboard/:path*", "/profile/:path*"]

};