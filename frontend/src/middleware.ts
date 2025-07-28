// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export const config = {
  
  matcher: [
  
    "/login",
    "/register",

    
    "/my-cards",
    "/create-card",
    "/approve",
    "/manage-users",
  ],
};

export function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const refreshToken = cookies.get("refreshToken")?.value;


  if (refreshToken) {
 
    if (nextUrl.pathname === "/login" || nextUrl.pathname === "/register") {
      return NextResponse.redirect(new URL("/", req.url));
    }
   
    return NextResponse.next();
  }

 
  if (
    nextUrl.pathname === "/my-cards" ||
    nextUrl.pathname === "/create-card" ||
    nextUrl.pathname === "/approve" ||
    nextUrl.pathname === "/manage-users"
  ) {

    return NextResponse.redirect(new URL("/login", req.url));
  }

 
  return NextResponse.next();
}
