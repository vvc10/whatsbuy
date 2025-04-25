// components/dashboard/dashboard-overview.tsx
"use client"

import { BarChart3, MessageCircle, ShoppingBag } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"

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
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    let channel: any

    const setupRealtime = async () => {
      try {
        channel = supabase
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
      } catch (error) {
        console.error("Error setting up realtime:", error)
      }
    }

    setupRealtime()

    return () => {
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [storeId, supabase])

  return (
    <Card>
      <CardHeader className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Store Overview</CardTitle>
            <CardDescription>View your store performance</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Total Products</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{productCount}</p>
            <p className="text-xs text-green-600">Manage your inventory</p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">WhatsApp Orders</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{orderCount}</p>
            <p className="text-xs text-green-600">Track your sales</p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Store Views</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{storeViews}</p>
            <p className="text-xs text-green-600">Monitor your traffic</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}