"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import ProductGrid from "@/components/dashboard/product-grid"
import { Button } from "@/components/ui/button"
import AddProductModal from "@/components/modals/AddProductModal"
import { useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { subscriptionLimits, SubscriptionPlan } from "@/types/suscriptionlimits"

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  is_active: boolean
  store_id: string
}

interface Store {
  id: string
  name: string
  slug: string
}

export default function ProductPage() {
  const supabase = createClient()
  const router = useRouter()
  const { toast } = useToast()
  const [products, setProducts] = useState<Product[]>([])
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>("free")
  const [productLimit, setProductLimit] = useState<number>(subscriptionLimits.free.productLimit)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)

      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()

        if (userError || !user) {
          router.push('/login')
          return
        }

        // Get user's profile to check subscription plan
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('subscription_plan')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError

        // Set subscription plan and product limit
        const plan = (profileData?.subscription_plan || "free") as SubscriptionPlan
        setSubscriptionPlan(plan)
        setProductLimit(subscriptionLimits[plan].productLimit)

        // Get user's store
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('id, name, slug')
          .eq('owner_id', user.id)
          .single()

        if (storeError || !storeData) {
          router.push('/onboarding')
          return
        }

        setStore(storeData)

        // Get products for this store
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('*')
          .eq('store_id', storeData.id)
          .order('created_at', { ascending: false })

        if (productsError) {
          throw productsError
        }

        setProducts(productsData as Product[])
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Failed to load products. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router, supabase])

  const handleAddProductClick = () => {
    if (products.length >= productLimit) {
      toast({
        title: "Product Limit Reached",
        description: `Your ${subscriptionPlan} plan allows only ${productLimit} products. Upgrade to add more.`,
        variant: "destructive",
      })
      return
    }
  }

  const isAddProductDisabled = products.length >= productLimit

  const getPlanDescription = () => {
    if (subscriptionPlan === "pro") {
      return "Pro plan (unlimited products)"
    }
    return `${subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)} plan (${products.length}/${productLimit} products)`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-20">
        <div className="relative h-6 w-6">
          <div className="absolute rounded-full h-full w-full border border-gray-300"></div>
          <div className="animate-spin absolute rounded-full h-full w-full border-t border-b border-l border-green-500 border-r-0 
                        left-[-1px] top-[-1px] overflow-hidden">
            <div className="absolute right-0 h-full w-1/2 bg-white"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-destructive">{error}</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center mx-auto px-4 w-full justify-between">
        <div className="flex flex-col">
          <h3 className="text-lg font-medium">Your Products</h3>
          <p className="mt-1 text-sm text-gray-500">
            {getPlanDescription()}
          </p>
        </div>
        <AddProductModal
          storeId={store?.id}
          disabled={isAddProductDisabled}
        >
        </AddProductModal>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="mb-4 rounded-full bg-emerald-100 p-3">
            <ShoppingBag className="h-6 w-6 text-emerald-600" />
          </div>
          <h3 className="text-lg font-medium">No products yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
          <Button
            className={`mt-4 bg-emerald-600 hover:bg-emerald-700 ${isAddProductDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={handleAddProductClick}
            disabled={isAddProductDisabled}
          >
            Add Product
          </Button>
        </div>
      )}
    </div>
  )
}