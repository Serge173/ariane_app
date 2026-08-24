import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { isAdmin, isClient } from "@/lib/auth";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const role = token?.role as string | undefined;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin")) {
      if (path === "/admin/connexion") {
        if (token && isAdmin(role)) {
          return NextResponse.redirect(new URL("/admin", req.url));
        }
        return NextResponse.next();
      }
      if (!isAdmin(role)) {
        return NextResponse.redirect(new URL("/mon-espace", req.url));
      }
    }

    if (path.startsWith("/mon-espace")) {
      if (isAdmin(role)) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
      if (!isClient(role) && role) {
        return NextResponse.redirect(new URL("/admin", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        if (path === "/admin/connexion") return true;
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/mon-espace/:path*"],
};
