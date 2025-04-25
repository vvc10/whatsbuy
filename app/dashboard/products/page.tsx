"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import ProductGrid from "@/components/dashboard/product-grid"
import { Button } from "@/components/ui/button"
import AddProductModal from "@/components/modals/AddProductModal"
import { useRouter } from "next/navigation"
import { ShoppingBag } from "lucide-react"

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
  const [products, setProducts] = useState<Product[]>([])
  const [store, setStore] = useState<Store | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {/* {store?.name ? `${store.name} Products` : 'Your Products'} */}
          Your Products
        </h1>
        <AddProductModal storeId={store?.id} />
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
          <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700" asChild>
            <a href="/dashboard/add-product">Add Product</a>
          </Button>
        </div>
      )}
    </div>
  )
}