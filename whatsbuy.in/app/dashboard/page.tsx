import { redirect } from "next/navigation"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })

  // Check if user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/login")
  }

  // Get user profile to check onboarding status
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", session.user.id)
    .single()

  // If profile doesn't exist or onboarding is not completed, redirect to onboarding
  if (profileError || !profile || !profile.onboarding) {
    redirect("/onboarding")
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Welcome to your Dashboard</h1>
      <p className="mb-4">You've successfully logged in and completed onboarding!</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Your Services</h2>
          <p className="text-gray-600 mb-4">Manage your WhatsApp services</p>
          <Button asChild>
            <Link href="/dashboard/services">View Services</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Analytics</h2>
          <p className="text-gray-600 mb-4">Track your service performance</p>
          <Button asChild>
            <Link href="/dashboard/analytics">View Analytics</Link>
          </Button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Settings</h2>
          <p className="text-gray-600 mb-4">Manage your account settings</p>
          <Button asChild>
            <Link href="/dashboard/settings">View Settings</Link>
          </Button>
        </div>
      </div>

      <form action="/auth/signout" method="post" className="mt-8">
        <Button variant="outline" type="submit">
          Sign Out
        </Button>
      </form>
    </div>
  )
}
