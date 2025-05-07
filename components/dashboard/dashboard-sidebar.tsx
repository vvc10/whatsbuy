"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import {
  ShoppingBag,
  BarChart3,
  Settings,
  Plus,
  Home,
  PaintBucket,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import icon from "@/app/assets/icons/icon.png"
import { cn } from "@/lib/utils"
import { PricingModal } from "../modals/PricingModal"
import { subscriptionLimits, SubscriptionPlan } from "@/types/suscriptionlimits"
import { createClient } from "@/lib/supabase/client"

interface DashboardSidebarProps {
  store?: {
    id: string
    slug: string
    name: string
    logo_url?: string | null
  } | null
}

export default function DashboardSidebar({ 
  store,
}: DashboardSidebarProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [collapsed, setCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isPricingModalOpen, setPricingModalOpen] = useState(false)
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>("free")
  const [productCount, setProductCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let subscription: any = null;

    const fetchData = async () => {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setLoading(false)
          return
        }

        // Fetch subscription plan
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('subscription_plan')
          .eq('id', user.id)
          .single()

        if (profileError) throw profileError

        if (profile?.subscription_plan) {
          setSubscriptionPlan(profile.subscription_plan as SubscriptionPlan)
        }

        // Fetch initial product count if store exists
        if (store?.id) {
          await fetchProductCount(store.id)

          // Set up real-time subscription for products
          subscription = supabase
            .channel('products_changes')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: 'products',
                filter: `store_id=eq.${store.id}`
              },
              async () => {
                await fetchProductCount(store.id)
              }
            )
            .subscribe()
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchProductCount = async (storeId: string) => {
      try {
        const { count, error } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .eq('store_id', storeId)

        if (error) throw error

        setProductCount(count || 0)
      } catch (error) {
        console.error('Error fetching product count:', error)
      }
    }

    // Check if the user came from the pricing page
    if (searchParams.get("from") === "pricing") {
      setPricingModalOpen(true)
    }

    fetchData()

    // Clean up subscription on unmount
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription)
      }
    }
  }, [searchParams, supabase, store?.id])

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: Home,
    },
    {
      name: "Products",
      href: "/dashboard/products",
      icon: ShoppingBag,
    },
    {
      name: "Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    {
      name: "Appearance",
      href: "/dashboard/appearance",
      icon: PaintBucket,
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
    },
  ]

  // Get the product limit based on the subscription plan
  const productLimit = subscriptionLimits[subscriptionPlan].productLimit
  const usagePercentage = Math.min(
    Math.round((productCount / productLimit) * 100),
    100
  )

  const shouldShowUpgrade = ["free", "starter"].includes(subscriptionPlan)

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden border-r bg-white transition-all duration-300 ease-in-out sm:block",
          "fixed h-screen top-0 left-0 z-40",
          collapsed ? "w-20" : "w-64",
          isHovered && !collapsed && "shadow-lg"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex h-full flex-col gap-4 p-4 overflow-y-auto">
          {/* Collapse Button at the top */}
          <div className={`flex ${collapsed ? "flex-col" : "flex-row items-center justify-between"}`}>
            <Link href="/" className={`flex ${collapsed ? "flex-col" : "flex-row"} items-center gap-1 font-semibold`}>
              <Image className={`${collapsed ? "w-10 h-10" : "w-8 h-8"}`} src={icon} alt="WhatsBuy Logo" />
              <span className={`text-emerald-600 ${collapsed ? "hidden" : "visible"}`}>WhatsBuy.in</span>
            </Link>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-500 hover:bg-gray-100 p-2"
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Store Info */}
          <div className="flex items-center gap-2 px-2 py-3">
            {store && (
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="flex-shrink-0 h-9 w-9 rounded-lg bg-emerald-50 flex items-center justify-center overflow-hidden border border-emerald-100">
                  {store.logo_url ? (
                    <Image
                      src={store.logo_url}
                      alt={store.name}
                      width={36}
                      height={36}
                      className="rounded-lg object-cover w-full h-full"
                      priority
                    />
                  ) : (
                    <span className="text-sm font-medium text-emerald-600">
                      {store.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                {!collapsed && (
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-medium truncate">{store.name}</span>
                    <span className="text-xs text-gray-500 truncate">
                      whatsbuy.in/{store.slug}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* View Store Button */}
          {store && !collapsed && (
            <Link href={`/store/${store.slug}`} target="_blank" className="px-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                View Store
              </Button>
            </Link>
          )}

          {/* Navigation */}
          <nav className="grid gap-1 px-2 pt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  pathname === item.href
                    ? "bg-emerald-50 text-emerald-600 shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  collapsed ? "justify-center" : ""
                )}
              >
                <item.icon
                  className={cn(
                    "h-5 w-5 flex-shrink-0",
                    pathname === item.href ? "text-emerald-500" : "text-gray-400"
                  )}
                />
                {!collapsed && <span className="truncate">{item.name}</span>}
              </Link>
            ))}
          </nav>

          {/* Your Plan Section */}
          <div className={cn("mt-auto px-2 pt-4 border-t", collapsed ? "hidden" : "")}>
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-500">YOUR PLAN</span>
                {loading ? (
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                ) : (
                  <span className="text-xs font-medium text-emerald-600">
                    {subscriptionPlan.charAt(0).toUpperCase() + subscriptionPlan.slice(1)}
                  </span>
                )}
              </div>
              {loading ? (
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="h-2 rounded-full bg-gray-200 animate-pulse" style={{ width: '50%' }}></div>
                </div>
              ) : (
                <>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div 
                      className={cn(
                        "h-2 rounded-full",
                        usagePercentage >= 100 ? "bg-red-500" : "bg-emerald-500"
                      )} 
                      style={{ width: `${usagePercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {productCount}/{productLimit === Infinity ? "∞" : productLimit} products used
                    {usagePercentage >= 80 && (
                      <span className="text-red-500 ml-1">
                        {usagePercentage >= 100 ? " - Limit reached!" : " - Almost full!"}
                      </span>
                    )}
                  </p>
                </>
              )}
            </div>

            {loading ? (
              <div className="h-10 w-full bg-gray-200 rounded-lg animate-pulse"></div>
            ) : shouldShowUpgrade ? (
              <PricingModal 
                isOpen={isPricingModalOpen}
                currentPlan={subscriptionPlan} 
                onClose={() => setPricingModalOpen(false)}
                trigger={
                  <Button
                    variant="outline"
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <Crown className="mr-2 h-4 w-4" />
                      <span>Upgrade to {subscriptionPlan === "free" ? "Starter" : "Pro"}</span>
                    </div>
                  </Button>
                }
              />
            ) : (
              <div className="flex items-center justify-center gap-2 p-2 rounded-lg bg-emerald-50 text-emerald-600">
                <Crown className="h-4 w-4" />
                <span className="text-sm font-medium">
                  {subscriptionPlan === "starter" ? "Starter Plan" : "Pro Plan"}
                </span>
              </div>
            )}
          </div>

          {/* Add Product Button */}
          <div className="px-2">
            <Link href="/dashboard/add-product">
              <Button
                className={cn(
                  "w-full bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm",
                  collapsed ? "p-2" : "",
                  (productCount >= productLimit || loading) ? "opacity-50 cursor-not-allowed" : ""
                )}
                disabled={productCount >= productLimit || loading}
              >
                {loading ? (
                  <span className={cn(collapsed ? "mx-auto" : "")}>...</span>
                ) : (
                  <>
                    <Plus className={cn(collapsed ? "mx-auto" : "mr-2", "h-5 w-5")} />
                    {!collapsed && "Add Product"}
                  </>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg sm:hidden">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-2 w-full h-full",
                pathname === item.href
                  ? "text-emerald-600 bg-emerald-50"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span className="text-xs mt-1">{item.name.split(' ')[0]}</span>
            </Link>
          ))}
        </div>
      </nav>

      <style jsx global>{`
        body {
          padding-bottom: 4rem;
        }
        @media (min-width: 640px) {
          body {
            padding-bottom: 0;
          }
        }
      `}</style>
    </>
  )
}