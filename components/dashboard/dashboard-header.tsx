"use client"

import Link from "next/link"
import { ShoppingBag, Settings, Bell, ExternalLink, Search, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState, useRef, useEffect } from "react"
import { Command, CommandInput, CommandList, CommandItem, CommandGroup, CommandEmpty } from "@/components/ui/command"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import icon from '@/app/assets/icons/icon.png'
import Image from "next/image"

interface DashboardHeaderProps {
  user: {
    id?: string
    email?: string | null
    user_metadata?: {
      full_name?: string
      avatar_url?: string
    }
  }
  store?: {
    id: string
    slug: string
    name: string
  } | null
}

const searchSuggestions = [
  { name: "Go to Dashboard", href: "/dashboard", icon: "" },
  { name: "Go to Products", href: "/dashboard/products", icon: "" },
  // { name: "Go to Analytics", href: "/dashboard/analytics", icon: "" },
  // { name: "Go to Appearance", href: "/dashboard/appearance", icon: "" },
  // { name: "Go to Settings", href: "/dashboard/settings", icon: "" },
  { name: "Add New Product", href: "/dashboard/add-product", icon: "" },
]

// Mock notifications data - replace with real data from your database
const mockNotifications = [
  // { id: "1", text: "Your store has 5 new orders", read: false, time: "2 mins ago" },
  // { id: "2", text: "New customer review received", read: false, time: "1 hour ago" },
  // { id: "3", text: "Inventory low for 'Summer T-Shirt'", read: true, time: "3 hours ago" },
  // { id: "4", text: "Your subscription will renew soon", read: true, time: "1 day ago" },
]

export default function DashboardHeader({ user, store }: DashboardHeaderProps) {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState(mockNotifications)
  const [unreadCount, setUnreadCount] = useState(mockNotifications.filter(n => !n.read).length)
  const searchRef = useRef<HTMLDivElement>(null)
  const notificationsRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      })
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
      toast({
        title: "Error",
        description: "There was an error signing out. Please try again.",
        variant: "destructive",
      })
    }
  }

  const displayName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"
  const initials = displayName.charAt(0).toUpperCase()

  const filteredSuggestions = searchQuery
    ? searchSuggestions.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    : searchSuggestions

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ))
    setUnreadCount(notifications.filter(n => !n.read && n.id !== id).length)
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        // Close notifications dropdown if needed
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 md:gap-4 border-b bg-white px-4 sm:h-16 sm:px-6 sm:pl-[18rem]">
      <Link href="/" className={`flex items-center gap-1 font-semibold`}>
        <Image className="h-8 w-8 md:hidden" src={icon} alt="WhatsBuy Logo" />
      </Link>

      <div className="relative flex-1 max-w-2xl mx-4" ref={searchRef}>
        <Button
          variant="outline"
          className="w-full justify-start text-muted-foreground"
          onClick={() => setSearchOpen(!searchOpen)}
        >
          <Search className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Search dashboard...</span>
        </Button>

        {searchOpen && (
          <div className="absolute top-10 left-0 md:w-full shadow-lg rounded-lg border bg-white z-50">
            {filteredSuggestions.length > 0 && !searchQuery && (
              <div className="p-2 border-b w-full">
                <h3 className="text-xs font-medium text-muted-foreground px-2 py-1">Quick searches</h3>
                <div className="space-y-1">
                  {filteredSuggestions.map((item) => (
                    <Button
                      key={item.href}
                      variant="ghost"
                      className="w-full justify-start text-left px-2 py-1.5 h-auto"
                      onClick={() => {
                        router.push(item.href)
                        setSearchOpen(false)
                      }}
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <Command className="border-none">
              <CommandInput
                placeholder="Search dashboard..."
                value={searchQuery}
                onValueChange={setSearchQuery}
                autoFocus
              />
              {searchQuery && (
                <CommandList>
                  {filteredSuggestions.length > 0 ? (
                    <CommandGroup>
                      {filteredSuggestions.map((item) => (
                        <CommandItem
                          key={item.href}
                          value={item.name}
                          onSelect={() => {
                            router.push(item.href)
                            setSearchOpen(false)
                            setSearchQuery("")
                          }}
                          className="cursor-pointer"
                        >
                          <span className="mr-2">{item.icon}</span>
                          {item.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  ) : (
                    <CommandEmpty>No results found</CommandEmpty>
                  )}
                </CommandList>
              )}
            </Command>
          </div>
        )}
      </div>

      {/* Right-side icons */}
      <div className="flex items-center gap-2">
        {store && (
          <Link href={`/store/${store.slug}`} target="_blank">
            <Button variant="ghost" size="sm" className="h-8 gap-1.5">
              <ExternalLink className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">View Store</span>
            </Button>
          </Link>
        )}

        {/* Notifications Dropdown */}
        <div className="relative" ref={notificationsRef}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 relative">
                <Bell className="h-4 w-4" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                    {unreadCount}
                  </span>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 p-0">
              <DropdownMenuLabel className="flex justify-between items-center px-4 py-3">
                <span>Notifications</span>
                {notifications.length > 0 && (
                  <Button
                    variant="link"
                    size="sm"
                    className="h-auto p-0 text-sm text-primary"
                    onClick={markAllAsRead}
                  >
                    Mark all as read
                  </Button>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className={`flex flex-col items-start gap-1 px-4 py-3 ${!notification.read ? 'bg-blue-50' : ''}`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between w-full">
                        <p className="text-sm">{notification.text}</p>
                        {!notification.read && (
                          <span className="h-2 w-2 rounded-full bg-blue-500"></span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No notifications yet
                  </div>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-center justify-center text-sm text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Help Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <HelpCircle className="h-4 w-4" />
              <span className="sr-only">Help</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => router.push('/helpcenter')}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Need Help?
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/documentation')}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Documentation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/contact-support')}>
              <span className="h-4 w-4 mr-2">✉️</span>
              Contact Support
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 gap-2 pl-2 pr-3">
              <Avatar className="h-6 w-6">
                {user?.user_metadata?.avatar_url && (
                  <AvatarImage src={user.user_metadata.avatar_url} />
                )}
                <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xs font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
              {/* <span className="hidden sm:inline text-sm font-medium">{displayName}</span> */}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/dashboard/profile')} className="px-2 py-1.5">
              <span className="mr-2">👤</span>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push('/dashboard/settings')} className="px-2 py-1.5">
              <span className="mr-2">⚙️</span>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="px-2 py-1.5 text-red-600 focus:text-red-600 focus:bg-red-50"
            >
              <span className="mr-2">🚪</span>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}