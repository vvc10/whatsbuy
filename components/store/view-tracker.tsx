// components/store/view-tracker.tsx
"use client"

import { useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { usePathname } from "next/navigation"

export default function ViewTracker({ storeId }: { storeId: string }) {
  const supabase = createClient()
  const pathname = usePathname()

  useEffect(() => {
    const trackView = async () => {
      // Only track if this is a store page
      if (!pathname.startsWith("/store/")) return

      try {
        // Get current views count
        const { data: storeData } = await supabase
          .from("stores")
          .select("store_views")
          .eq("id", storeId)
          .single()

        const currentViews = storeData?.store_views || 0

        // Update views count
        await supabase
          .from("stores")
          .update({ store_views: currentViews + 1 })
          .eq("id", storeId)
      } catch (error) {
        console.error("Error tracking store view:", error)
      }
    }

    trackView()
  }, [storeId, pathname, supabase])

  return null
}