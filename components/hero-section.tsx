"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function HeroSection() {
  const [activeTab, setActiveTab] = useState<"storefront" | "dashboard" | "whatsapp">("storefront")

  return (
    <section className="py-12 md:py-24 lg:py-32 xl:py-36">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_600px] lg:gap-12 xl:grid-cols-[1fr_700px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Turn Your WhatsApp Into a <span className="text-emerald-600">Powerful Store</span>
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Create your own WhatsApp-powered storefront in minutes. No website needed, no technical skills required.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/signup">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                  Start Selling Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="outline" size="lg">
                  See Demo
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>No coding needed</span>
              </div>
              <div className="flex items-center space-x-1">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center space-x-1">
                <Check className="h-4 w-4 text-emerald-600" />
                <span>Works on mobile</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-[500px] overflow-hidden rounded-xl border bg-white shadow-xl">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab("storefront")}
                  className={`flex-1 px-4 py-2 text-sm font-medium ${
                    activeTab === "storefront" ? "border-b-2 border-emerald-600 text-emerald-600" : "text-gray-500"
                  }`}
                >
                  Storefront
                </button>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`flex-1 px-4 py-2 text-sm font-medium ${
                    activeTab === "dashboard" ? "border-b-2 border-emerald-600 text-emerald-600" : "text-gray-500"
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab("whatsapp")}
                  className={`flex-1 px-4 py-2 text-sm font-medium ${
                    activeTab === "whatsapp" ? "border-b-2 border-emerald-600 text-emerald-600" : "text-gray-500"
                  }`}
                >
                  WhatsApp
                </button>
              </div>
              <div className="p-4">
                {activeTab === "storefront" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-emerald-600 font-bold">S</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">Sharma Sarees</h3>
                          <p className="text-xs text-gray-500">Premium Saree Collection</p>
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[1, 2, 3, 4].map((item) => (
                        <div key={item} className="space-y-2">
                          <div className="aspect-square rounded-lg bg-gray-100 relative overflow-hidden">
                            <Image
                              src={`/placeholder.svg?height=200&width=200&text=Saree+${item}`}
                              alt={`Product ${item}`}
                              width={200}
                              height={200}
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="text-sm font-medium">Silk Saree {item}</h4>
                            <p className="text-sm font-bold">₹{1999 + item * 500}</p>
                          </div>
                          <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700">
                            Buy on WhatsApp
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "dashboard" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Your Dashboard</h3>
                      <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        Add Product
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-2xl font-bold">24</p>
                        <p className="text-xs text-gray-500">Products</p>
                      </div>
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-2xl font-bold">156</p>
                        <p className="text-xs text-gray-500">Views</p>
                      </div>
                      <div className="rounded-lg border p-3 text-center">
                        <p className="text-2xl font-bold">18</p>
                        <p className="text-xs text-gray-500">Orders</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Recent Orders</h4>
                      <div className="space-y-2">
                        {[1, 2, 3].map((order) => (
                          <div key={order} className="flex items-center justify-between rounded-lg border p-2">
                            <div>
                              <p className="text-sm font-medium">Order #{order}</p>
                              <p className="text-xs text-gray-500">2 items • ₹{1499 * order}</p>
                            </div>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "whatsapp" && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <div className="flex items-center space-x-2">
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <span className="text-emerald-600 font-bold">W</span>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold">WhatsApp Order</h3>
                          <p className="text-xs text-gray-500">Auto-generated message</p>
                        </div>
                      </div>
                      <div className="mt-3 rounded-lg bg-white p-3 text-sm">
                        <p>Hello! I would like to order:</p>
                        <p className="font-medium mt-2">1x Silk Saree (Blue) - ₹2499</p>
                        <p className="font-medium">1x Cotton Saree (Red) - ₹1999</p>
                        <p className="mt-2">Total: ₹4498</p>
                        <p className="mt-2">Delivery Address: 123 Main St, Jaipur</p>
                        <p className="mt-2">Payment: Cash on Delivery</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                        Accept Order
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        Ask Questions
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
