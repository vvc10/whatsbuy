"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check, ShoppingBag, Smartphone, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<"storefront" | "dashboard" | "whatsapp">("storefront")
  
  // Auto rotate tabs
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTab(current => {
        if (current === "storefront") return "dashboard"
        if (current === "dashboard") return "whatsapp"
        return "storefront"
      })
    }, 5000)
    
    return () => clearInterval(interval)
  }, [])

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <section className="relative pt-24 pb-16 md:pt-32 md:pb-24 lg:pt-36 lg:pb-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-emerald-50 via-background to-background dark:from-emerald-950/20 dark:via-background dark:to-background"></div>
      <div className="absolute top-0 right-0 -z-10 w-[300px] h-[300px] bg-emerald-100/50 dark:bg-emerald-900/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 -z-10 w-[250px] h-[250px] bg-amber-100/30 dark:bg-amber-900/10 rounded-full blur-3xl"></div>

      <div className="container px-4 md:px-6 mx-auto">
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div 
            className="flex flex-col justify-center space-y-6"
            initial="hidden"
            animate="visible"
            variants={staggerChildren}
          >
            <motion.div variants={fadeInUp} className="inline-flex">
              <Badge variant="outline" className="px-4 py-1 border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/50 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-full">
                <ShoppingBag className="mr-1 h-3.5 w-3.5" />
                Sell on WhatsApp in minutes
              </Badge>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="space-y-3">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                Turn Your WhatsApp Into a <span className="text-emerald-600 dark:text-emerald-500 relative">
                  Powerful Store
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-emerald-600/30 dark:bg-emerald-500/30 rounded-full"></span>
                </span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-[600px]">
                Create your own WhatsApp-powered storefront in minutes. No website needed, no technical skills required.
              </p>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-3">
              <Link href="/signup">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white">
                  Start Selling Free 
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg" className="border-2">
                  See Demo
                </Button>
              </Link>
            </motion.div>
            
            <motion.div variants={fadeInUp} className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6">
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-background/50 backdrop-blur-sm">
                <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">No coding needed</p>
                  <p className="text-xs text-muted-foreground">Ready in minutes</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-background/50 backdrop-blur-sm">
                <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Smartphone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Works on mobile</p>
                  <p className="text-xs text-muted-foreground">Fully responsive</p>
                </div>
              </div>
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-background/50 backdrop-blur-sm">
                <div className="h-9 w-9 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium">Free to start</p>
                  <p className="text-xs text-muted-foreground">No credit card</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="flex items-center justify-center lg:justify-end"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="relative w-full max-w-[540px]">
              {/* Decorative pattern */}
              <div className="absolute -right-6 -bottom-6 w-64 h-64 bg-[radial-gradient(#10b98140_1px,transparent_1px)] [background-size:16px_16px] -z-10"></div>
              <div className="absolute -left-6 -top-6 w-64 h-64 bg-[radial-gradient(#f59e0b40_1px,transparent_1px)] [background-size:16px_16px] -z-10"></div>
              
              <div className="overflow-hidden rounded-xl border bg-background/90 backdrop-blur-sm shadow-xl">
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab("storefront")}
                    className={cn(
                      "flex-1 px-4 py-3 text-sm font-medium relative transition-colors",
                      activeTab === "storefront" 
                        ? "text-emerald-600 dark:text-emerald-500" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Storefront
                    {activeTab === "storefront" && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-500"
                        layoutId="activeTabIndicator"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={cn(
                      "flex-1 px-4 py-3 text-sm font-medium relative transition-colors",
                      activeTab === "dashboard" 
                        ? "text-emerald-600 dark:text-emerald-500" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    Dashboard
                    {activeTab === "dashboard" && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-500"
                        layoutId="activeTabIndicator"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("whatsapp")}
                    className={cn(
                      "flex-1 px-4 py-3 text-sm font-medium relative transition-colors",
                      activeTab === "whatsapp" 
                        ? "text-emerald-600 dark:text-emerald-500" 
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    WhatsApp
                    {activeTab === "whatsapp" && (
                      <motion.div 
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-500"
                        layoutId="activeTabIndicator"
                      />
                    )}
                  </button>
                </div>
                
                <div className="p-5">
                  {activeTab === "storefront" && (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      key="storefront"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center">
                            <span className="text-emerald-600 dark:text-emerald-300 font-bold">S</span>
                          </div>
                          <div>
                            <h3 className="text-base font-semibold">Sharma Sarees</h3>
                            <p className="text-xs text-muted-foreground">Premium Saree Collection</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="bg-emerald-50/50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800">
                          Online
                        </Badge>
                      </div>
                      
                      <div className="relative overflow-hidden rounded-lg">
                        <div className="aspect-[21/9] bg-gradient-to-r from-emerald-100 to-emerald-50 dark:from-emerald-900/30 dark:to-emerald-800/10 rounded-lg flex items-center justify-center">
                          <p className="text-emerald-600 dark:text-emerald-300 font-medium">Featured Collection</p>
                        </div>
                        <div className="absolute bottom-3 right-3">
                          <Badge className="bg-white/90 dark:bg-black/80 text-emerald-600 dark:text-emerald-400 backdrop-blur-sm hover:bg-white dark:hover:bg-black/90">
                            New Arrivals
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((item) => (
                          <div key={item} className="space-y-2 group">
                            <div className="aspect-square rounded-lg bg-slate-100 dark:bg-slate-800 relative overflow-hidden">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <p className="text-xs text-muted-foreground">Saree {item}</p>
                              </div>
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button size="sm" variant="secondary" className="text-xs">Quick View</Button>
                              </div>
                            </div>
                            <div>
                              <h4 className="text-sm font-medium truncate">Silk Saree {item}</h4>
                              <div className="flex justify-between items-center">
                                <p className="text-sm font-bold">₹{1999 + item * 500}</p>
                                <Badge variant="outline" className="text-xs">New</Badge>
                              </div>
                            </div>
                            <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white">
                              Buy on WhatsApp
                            </Button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "dashboard" && (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      key="dashboard"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Store Dashboard</h3>
                        <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white">
                          Add Product
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                        <div className="rounded-lg border p-3 text-center hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                          <p className="text-2xl font-bold">24</p>
                          <p className="text-xs text-muted-foreground">Products</p>
                          <div className="mt-1 h-1 w-full bg-emerald-100 dark:bg-emerald-950 rounded-full overflow-hidden">
                            <div className="h-full w-1/3 bg-emerald-500 dark:bg-emerald-600 rounded-full"></div>
                          </div>
                        </div>
                        <div className="rounded-lg border p-3 text-center hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                          <p className="text-2xl font-bold">156</p>
                          <p className="text-xs text-muted-foreground">Views</p>
                          <div className="mt-1 h-1 w-full bg-emerald-100 dark:bg-emerald-950 rounded-full overflow-hidden">
                            <div className="h-full w-3/4 bg-emerald-500 dark:bg-emerald-600 rounded-full"></div>
                          </div>
                        </div>
                        <div className="rounded-lg border p-3 text-center hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                          <p className="text-2xl font-bold">18</p>
                          <p className="text-xs text-muted-foreground">Orders</p>
                          <div className="mt-1 h-1 w-full bg-emerald-100 dark:bg-emerald-950 rounded-full overflow-hidden">
                            <div className="h-full w-1/2 bg-emerald-500 dark:bg-emerald-600 rounded-full"></div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium">Recent Orders</h4>
                          <Button variant="ghost" size="sm" className="text-xs h-7 px-2">View All</Button>
                        </div>
                        <div className="space-y-2">
                          {[1, 2, 3].map((order) => (
                            <div 
                              key={order} 
                              className="flex items-center justify-between rounded-lg border p-3 hover:border-emerald-200 dark:hover:border-emerald-800 transition-all hover:shadow-sm"
                            >
                              <div>
                                <p className="text-sm font-medium">Order #{order}</p>
                                <p className="text-xs text-muted-foreground">2 items • ₹{1499 * order}</p>
                              </div>
                              <Badge className={order === 1 ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 hover:bg-amber-200 dark:hover:bg-amber-900/40" : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/40"}>
                                {order === 1 ? "Pending" : "Completed"}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs">
                            MS
                          </div>
                          <span className="text-sm">Sharma Store</span>
                        </div>
                        <Button variant="ghost" size="sm">
                          Settings
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "whatsapp" && (
                    <motion.div 
                      className="space-y-4"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      key="whatsapp"
                    >
                      <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/20 rounded-lg p-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-10 w-10 rounded-full bg-emerald-100 dark:bg-emerald-800 flex items-center justify-center">
                            <span className="text-emerald-600 dark:text-emerald-300 font-bold">W</span>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold">WhatsApp Order</h3>
                            <p className="text-xs text-muted-foreground">Auto-generated message</p>
                          </div>
                        </div>
                        <div className="mt-3 rounded-lg bg-white dark:bg-gray-900 p-4 text-sm shadow-sm">
                          <div className="space-y-1.5">
                            <p>Hello! I would like to order:</p>
                            <div className="pl-2 border-l-2 border-emerald-300 dark:border-emerald-700 space-y-1">
                              <p className="font-medium">1x Silk Saree (Blue) - ₹2499</p>
                              <p className="font-medium">1x Cotton Saree (Red) - ₹1999</p>
                            </div>
                            <div className="pt-2">
                              <div className="flex justify-between text-sm">
                                <span>Subtotal:</span>
                                <span>₹4498</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span>Delivery:</span>
                                <span>₹100</span>
                              </div>
                              <div className="flex justify-between font-medium pt-1 border-t mt-1">
                                <span>Total:</span>
                                <span>₹4598</span>
                              </div>
                            </div>
                            <div className="pt-2 space-y-1">
                              <p className="text-sm"><span className="font-medium">Delivery Address:</span> 123 Main St, Jaipur</p>
                              <p className="text-sm"><span className="font-medium">Payment:</span> Cash on Delivery</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white">
                          Accept Order
                        </Button>
                        <Button variant="outline">
                          Ask Questions
                        </Button>
                      </div>
                      
                      <div className="pt-2">
                        <div className="flex items-center gap-2 p-3 rounded-lg border">
                          <div className="h-7 w-7 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-300">
                            <span className="text-xs">!</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Responding within 15 minutes increases your conversion rate by 50%
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}