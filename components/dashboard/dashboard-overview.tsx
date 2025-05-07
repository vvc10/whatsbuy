"use client"

import { BarChart3, Eye, MessageCircle, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface DashboardOverviewProps {
  productCount: number
  orderCount: number
  storeViews: number
  storeId: string
}

export default function DashboardOverview({
  productCount,
  orderCount,
  storeViews: initialStoreViews,
  storeId
}: DashboardOverviewProps) {
  const [storeViews, setStoreViews] = useState(initialStoreViews)
  const [productViews, setProductViews] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    let storeChannel: any
    let productChannel: any

    const fetchProductViews = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('views')
          .eq('store_id', storeId)

        if (error) throw error

        const totalViews = data.reduce((sum, product) => sum + (product.views || 0), 0)
        setProductViews(totalViews)
      } catch (error) {
        console.error("Error fetching product views:", error)
        setProductViews(null)
      } finally {
        setLoading(false)
      }
    }

    const setupRealtime = async () => {
      try {
        // Store views channel
        storeChannel = supabase
          .channel(`store_views_${storeId}`)
          .on(
            'postgres_changes',
            {
              event: 'UPDATE',
              schema: 'public',
              table: 'stores',
              filter: `id=eq.${storeId}`
            },
            (payload) => {
              if (payload.new.store_views) {
                setStoreViews(payload.new.store_views)
              }
            }
          )
          .subscribe()

        // Product views channel
        productChannel = supabase
          .channel(`product_views_${storeId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'products',
              filter: `store_id=eq.${storeId}`
            },
            () => {
              fetchProductViews() // Refresh product views when any product changes
            }
          )
          .subscribe()

      } catch (error) {
        console.error("Error setting up realtime:", error)
      }
    }

    fetchProductViews()
    setupRealtime()

    return () => {
      if (storeChannel) supabase.removeChannel(storeChannel)
      if (productChannel) supabase.removeChannel(productChannel)
    }
  }, [storeId, supabase])

  const renderStatCard = (
    icon: React.ReactNode,
    title: string,
    value: number | string,
    description: string,
    isLoading: boolean
  ) => (
    <div className="rounded-lg border p-4 transition-all hover:shadow-md">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-gray-100 p-2 dark:bg-gray-800">
          {icon}
        </div>
        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</span>
      </div>
      {isLoading ? (
        <Skeleton className="mt-3 h-8 w-3/4" />
      ) : (
        <>
          <p className="mt-3 text-2xl font-bold">{value}</p>
          <p className="text-xs text-green-600 dark:text-green-400">{description}</p>
        </>
      )}
    </div>
  )

  return (
    <Card className="rounded-xl shadow-sm">
      <CardHeader className="p-6 pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl">Store Overview</CardTitle>
            <CardDescription className="mt-1">
              Key metrics and performance indicators
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 pt-0">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {renderStatCard(
            <ShoppingBag className="h-5 w-5 text-gray-700 dark:text-gray-300" />,
            "Total Products",
            productCount,
            "Manage your inventory",
            false
          )}


          {renderStatCard(
            <Eye className="h-5 w-5 text-gray-700 dark:text-gray-300" />,
            "Product Views",
            productViews !== null ? productViews : "N/A",
            "Total product impressions",
            loading
          )}

          {renderStatCard(
            <BarChart3 className="h-5 w-5 text-gray-700 dark:text-gray-300" />,
            "Store Views",
            storeViews,
            "Monitor your traffic",
            false
          )}

        </div>
      </CardContent>
    </Card>
  )
}