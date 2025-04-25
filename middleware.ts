import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Define routes
    const isAuthRoute = [
      "/login",
      "/register",
      "/forgot-password",
      "/reset-password",
    ].some(path => request.nextUrl.pathname.startsWith(path));
    
    const isPublicRoute = [
      "/",
      "/about",
      "/contact",
      "/terms",
      "/privacy",
    ].some(path => request.nextUrl.pathname === path);
    
    const isOnboardingRoute = request.nextUrl.pathname.startsWith("/onboarding");
    const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");

    // Redirect authenticated users away from auth pages to dashboard
    if (user && isAuthRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect authenticated users to dashboard when accessing public routes
    if (user && isPublicRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Redirect unauthenticated users away from protected routes
    if (!user && (isDashboardRoute || isOnboardingRoute)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // For authenticated users accessing dashboard routes
    if (user && isDashboardRoute) {
      // Check if user has completed onboarding
      const { data: store, error } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      // If no store found, redirect to onboarding
      if (error || !store) {
        return NextResponse.redirect(new URL("/onboarding", request.url));
      }
    }

    // For authenticated users accessing any other non-public, non-auth route
    if (user && !isPublicRoute && !isAuthRoute && !isDashboardRoute && !isOnboardingRoute) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

  } catch (error) {
    console.error("Middleware error:", error);
    // If there's an auth error in protected routes, redirect to login
    if (request.nextUrl.pathname.startsWith("/dashboard") || 
        request.nextUrl.pathname.startsWith("/onboarding")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/onboarding",
    "/dashboard/:path*",
    "/about",
    "/contact",
    "/terms",
    "/privacy",
    // Add any other routes you want to handle
  ],
};