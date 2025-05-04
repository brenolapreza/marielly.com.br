import { NextResponse, type NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import { env } from "@/env";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    if (token) {
      jwt.verify(token, env.JWT_SECRET);
    } else {
      throw new Error("Token is undefined");
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/protected-route/:path*"], // Add your protected routes here
};
