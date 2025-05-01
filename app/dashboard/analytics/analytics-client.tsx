"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart, PieChart } from "@/components/dashboard/charts"
import { LockIcon } from "lucide-react"

interface AnalyticsData {
  storeViews: number
  totalVisits: number
  conversionRate: number
}

export default function AnalyticsClient({ analyticsData }: { analyticsData: AnalyticsData }) {
  const [dateRange, setDateRange] = useState<"7days" | "30days" | "90days">("30days")

  // Calculate percentage change (placeholder values)
  const storeViewsChange = "+15.2%"
  const totalVisitsChange = "+8.7%"
  const conversionRateChange = "-0.5%"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex items-center gap-2">
          <Tabs value={dateRange} onValueChange={(value) => setDateRange(value as any)}>
            <TabsList>
              <TabsTrigger value="7days">7 days</TabsTrigger>
              <TabsTrigger value="30days">30 days</TabsTrigger>
              <TabsTrigger value="90days">90 days</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button variant="outline" size="sm">
            Export
          </Button>
        </div>
      </div>

      {/* Top cards with real data from Supabase */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Store Views</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.storeViews.toLocaleString()}</div>
            <p className={`text-xs ${storeViewsChange.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
              {storeViewsChange} from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.totalVisits.toLocaleString()}</div>
            <p className={`text-xs ${totalVisitsChange.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
              {totalVisitsChange} from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData.conversionRate}%</div>
            <p className={`text-xs ${conversionRateChange.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
              {conversionRateChange} from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Blurred premium content section */}
      <div className="relative mt-10">
        {/* Upgrade CTA overlay */}
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-black/5 backdrop-blur-md">
          <div className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-white/80 p-8 shadow-lg dark:bg-gray-800/80">
              <div className="mb-4 rounded-full bg-emerald-100 p-3">
                      <LockIcon className="h-6 w-6 text-emerald-600" />
                    </div>
            <h3 className="text-xl font-bold">Upgrade to Pro</h3>
            <p className="max-w-md text-center text-gray-500">
              Get access to full analytics including clicks, retention, and more detailed insights
            </p>
            <Button className="mt-2 bg-green-800 hover:bg-green-700">Upgrade Now</Button>
          </div>
        </div>

        {/* Hidden Your data - this will be blurred */}
        <div aria-hidden="true" className="pointer-events-none select-none">
          {/* Your datas - these are not the real data */}
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your data</CardTitle>
                <CardDescription>This is Your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <LineChart />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your data</CardTitle>
                <CardDescription>This is Your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <PieChart />
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Your data</CardTitle>
              <CardDescription>This is Your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChart />
              </div>
            </CardContent>
          </Card>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your data</CardTitle>
                <CardDescription>This is Your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item}>
                      <div className="flex items-center justify-between">
                        <div className="h-4 w-24 rounded bg-gray-200"></div>
                        <div className="h-4 w-12 rounded bg-gray-200"></div>
                      </div>
                      <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                        <div className="h-2 w-1/2 rounded-full bg-gray-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Your data</CardTitle>
                <CardDescription>This is Your data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex h-[200px] items-center justify-center">
                  <div className="h-40 w-40 rounded-full bg-gray-200"></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
