import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import AnalyticsClient from "./analytics-client"

export default async function AnalyticsPage() {
  const supabase = createServerComponentClient({ cookies })

  // Fetch store analytics data from Supabase
  const { data: storeData, error } = await supabase
    .from("stores")
    .select("store_views, total_visits, conversion_rate")
    .single()

  if (error) {
    console.error("Error fetching store data:", error)
  }

  // Default values in case of error
  const analyticsData = {
    storeViews: storeData?.store_views || 0,
    totalVisits: storeData?.total_visits || 0,
    conversionRate: storeData?.conversion_rate || 0,
  }

  return <AnalyticsClient analyticsData={analyticsData} />
}
