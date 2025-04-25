"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { BarChart, LineChart, PieChart } from "@/components/dashboard/charts"

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState<"7days" | "30days" | "90days">("30days")

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

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹24,780</div>
            <p className="text-xs text-green-600">+12.5% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-green-600">+8.2% from last period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Conversion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3.2%</div>
            <p className="text-xs text-red-600">-0.5% from last period</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Over Time</CardTitle>
            <CardDescription>Daily revenue for the selected period</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <LineChart />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
            <CardDescription>Distribution of order statuses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <PieChart />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Best selling products by revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <BarChart />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your customers are coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { source: "WhatsApp Share", percentage: 45, value: 1245 },
                { source: "Instagram Bio", percentage: 25, value: 689 },
                { source: "Facebook Page", percentage: 15, value: 413 },
                { source: "Direct Link", percentage: 10, value: 275 },
                { source: "Other", percentage: 5, value: 138 },
              ].map((item) => (
                <div key={item.source}>
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-medium">{item.source}</div>
                    <div className="text-sm text-gray-500">{item.percentage}%</div>
                  </div>
                  <div className="mt-1 h-2 w-full rounded-full bg-gray-100">
                    <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${item.percentage}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Customer Retention</CardTitle>
            <CardDescription>New vs returning customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[200px] items-center justify-center">
              <div className="relative h-40 w-40">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-500">Total</div>
                    <div className="text-2xl font-bold">842</div>
                  </div>
                </div>
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="20" />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray="251.2"
                    strokeDashoffset="62.8"
                    transform="rotate(-90 50 50)"
                  />
                </svg>
              </div>
              <div className="ml-8 space-y-4">
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-emerald-600"></div>
                  <div className="text-sm">
                    <div className="font-medium">New Customers</div>
                    <div className="text-gray-500">75% (631)</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-2 h-3 w-3 rounded-full bg-gray-200"></div>
                  <div className="text-sm">
                    <div className="font-medium">Returning Customers</div>
                    <div className="text-gray-500">25% (211)</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
