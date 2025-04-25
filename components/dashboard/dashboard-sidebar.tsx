"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  ShoppingBag,
  MessageCircle,
  BarChart3,
  Settings,
  Plus,
  Home,
  Users,
  CreditCard,
  PaintBucket,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Zap,
  Crown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import icon from "@/app/assets/icons/icon.png"
import { cn } from "@/lib/utils"

interface DashboardSidebarProps {
  store?: {
    id: string
    slug: string
    name: string
    logo_url?: string | null
  } | null
}

export default function DashboardSidebar({ store }: DashboardSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

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

  return (
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
            <Image className={`${collapsed ? "w-10 h-10" : "w-8 h-8"}`} src={icon} />
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

        {/* Navigation - Now at the top */}
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

        {/* Your Plan Section at the bottom */}
        <div className={cn("mt-auto px-2 pt-4 border-t", collapsed ? "hidden" : "")}>
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-500">YOUR PLAN</span>
              <span className="text-xs font-medium text-emerald-600">Free</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">5 of 20 products used</p>
          </div>

          <Button
            variant="outline"
            className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
          >
            <Crown className="mr-2 h-4 w-4" />
            Upgrade Plan
          </Button>
        </div>

        {/* Add Product Button */}
        <div className="px-2">
          <Link href="/dashboard/add-product">
            <Button
              className={cn(
                "w-full bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm",
                collapsed ? "p-2" : ""
              )}
            >
              <Plus className={cn(collapsed ? "mx-auto" : "mr-2", "h-5 w-5")} />
              {!collapsed && "Add Product"}
            </Button>
          </Link>
        </div>
      </div>
    </aside>
  )
}