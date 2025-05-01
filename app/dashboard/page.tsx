// app/dashboard/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createServerClient } from "@/lib/supabase/server"
import DashboardOverview from "@/components/dashboard/dashboard-overview"
import ProductGrid from "@/components/dashboard/product-grid"
import AddProductModal from "@/components/modals/AddProductModal"
import { redirect } from "next/navigation"
import { subscriptionLimits, SubscriptionPlan } from "@/types/suscriptionlimits"

export default async function DashboardPage() {
  try {
    const supabase = createServerClient()

    // Fetch user data
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect("/login")
    }

    // Fetch user profile to get subscription plan
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("subscription_plan")
      .eq("id", user.id)
      .single()

    if (profileError) throw profileError

    const subscriptionPlan = (profile?.subscription_plan || "free") as SubscriptionPlan
    const productLimit = subscriptionLimits[subscriptionPlan].productLimit

    // Fetch store data
    const { data: store, error: storeError } = await supabase
      .from("stores")
      .select("*")
      .eq("owner_id", user.id)
      .single()

    if (storeError || !store) {
      redirect("/dashboard/onboarding")
    }

    // Fetch products
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .order("created_at", { ascending: false })

    // Fetch orders
    const { data: orders } = await supabase
      .from("orders")
      .select("*")
      .eq("store_id", store.id)
      .order("created_at", { ascending: false })

    const isAddProductDisabled = products ? products.length >= productLimit : false

    return (
      <div className="space-y-6 mx-auto w-[100vw] md:w-auto p-4">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            <Link className="hidden md:visible" href={`/store/${store.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                Preview Store
              </Button>
            </Link>

            <AddProductModal 
              disabled={isAddProductDisabled}
              subscriptionPlan={subscriptionPlan}
              currentProductCount={products?.length || 0}
              productLimit={productLimit}
              storeId={store.id}
            />
          </div>
        </div>

        <DashboardOverview
          productCount={products?.length || 0}
          orderCount={orders?.length || 0}
          storeViews={store.store_views || 0}
          storeId={store.id}
          subscriptionPlan={subscriptionPlan}
        />

        <ProductGrid products={products || []} />
      </div>
    )
  } catch (error) {
    console.error("Dashboard page error:", error)
    redirect("/login")
  }
}