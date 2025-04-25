// app/dashboard/page.tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerClient } from "@/lib/supabase/server"
import DashboardOverview from "@/components/dashboard/dashboard-overview"
import ProductGrid from "@/components/dashboard/product-grid"
import AddProductModal from "@/components/modals/AddProductModal"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  try {
    const supabase = createServerClient()

    // Fetch user data
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      redirect("/login")
    }

    // Fetch store data including store_views
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

    return (
      <div className="space-y-6">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-2">
            {/* Preview Store Button */}
            <Link href={`/store/${store.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                Preview Store
              </Button>
            </Link>

            {/* Add Product Button */}
            <AddProductModal />
          </div>
        </div>

        {/* Dashboard Overview */}
        <DashboardOverview
          productCount={products?.length || 0}
          orderCount={orders?.length || 0}
          storeViews={store.store_views || 0} // Now dynamic from database
          storeId={store.id} // Pass storeId for realtime updates
        />

        {/* Products Section */}
        <ProductGrid products={products || []} />
      </div>
    )
  } catch (error) {
    console.error("Dashboard page error:", error)
    redirect("/login")
  }
}