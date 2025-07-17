import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";

// 2. Specify protected and public routes

const protectedRoutes = ["/", "/dashboard"];

const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
    let response: NextResponse<unknown> = NextResponse.next();

    const path = req.nextUrl.pathname;

    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    const cookie = (await cookies()).get("token")?.value;

    //  if (isProtectedRoute && !cookie) {
    //   response = NextResponse.redirect(new URL("/login", req.nextUrl));
    //  }

    if (isPublicRoute && cookie && !req.nextUrl.pathname.startsWith("/")) {
        response = NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return response;
}

// Routes Middleware should not run on
export const config = {
    matcher: ["/", "/((?!_next|_vercel|.*\\..*).*)"],
};
