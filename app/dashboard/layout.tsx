import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase/server";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";
import DashboardHeader from "@/components/dashboard/dashboard-header";
import { cookies } from "next/headers";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const supabase = createServerClient(cookieStore);
   try {
    // Get session - properly awaited
    const { data: { session }, error: authError } = await supabase.auth.getSession();

    if (authError || !session) {
      console.log("No session found - redirecting to login");
      return redirect("/login");
    }

    // Get store info - properly awaited
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("*")
      .eq("owner_id", session.user.id)
      .maybeSingle();

    if (storeError) {
      console.error("Error fetching store:", storeError);
      throw storeError;
    }

    // Get current path from cookies - properly awaited
    const currentPath = cookieStore.get("x-invoke-path")?.value || "";

    // Handle onboarding redirect logic
    if (!store && !currentPath.startsWith("/onboarding")) {
      console.log("No store found - redirecting to onboarding");
      return redirect("/onboarding");
    }

    // If user has store but is trying to access onboarding, redirect to dashboard
    if (store && currentPath.startsWith("/onboarding")) {
      return redirect("/dashboard");
    }

    // Render dashboard layout
    return (
      <div className="flex min-h-screen flex-col bg-gray-50">
        <DashboardHeader  user={session.user} store={store} />
        <div className="flex flex-1 md:pt-6">
          <DashboardSidebar store={store} />
          <main className="flex-1 overflow-auto transition-[padding] duration-300 pt-2 pb-6 md:px-4 sm:px-6 
            pl-[0rem] md:pl-[17rem] sm:pl-[18rem]"> 
            {children}
          </main>
        </div>
      </div>
    );

  } catch (error) {
    console.error("Dashboard layout error:", error);
    return redirect("/login");
  }
}