import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdmin, isClient } from "@/lib/roles";

async function readToken(req: NextRequest) {
  return getToken({ req, secret: process.env.NEXTAUTH_SECRET });
}

function signInUrl(req: NextRequest, path: string) {
  const target = path.startsWith("/admin") ? "/admin/connexion" : "/connexion";
  const url = new URL(target, req.url);
  url.searchParams.set("callbackUrl", req.nextUrl.pathname + req.nextUrl.search);
  return url;
}

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin/admin/")) {
    const fixed = path.replace(/^\/admin\/admin/, "/admin");
    return NextResponse.redirect(new URL(fixed, req.url));
  }

  if (path === "/admin/connexion") {
    const token = await readToken(req);
    if (token && isAdmin(token.role as string | undefined)) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }
    return NextResponse.next();
  }

  const token = await readToken(req);
  if (!token) {
    return NextResponse.redirect(signInUrl(req, path));
  }

  const role = token.role as string | undefined;

  if (path.startsWith("/admin")) {
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
}

export const config = {
  matcher: ["/admin/:path*", "/mon-espace/:path*"],
};
