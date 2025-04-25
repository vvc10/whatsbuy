"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ShoppingBag, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth/auth-provider"

export default function OnboardingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading: authLoading } = useAuth()
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [storeData, setStoreData] = useState({
    storeName: "",
    storeDescription: "",
    storeSlug: "",
    phoneNumber: "",
    category: "",
    theme: "default", // Default theme
  })
  const supabase = createClient()

  // Check if user already has a store
  useEffect(() => {
    const checkStore = async () => {
      if (!user) return

      const { data, error } = await supabase.from("stores").select("*").eq("owner_id", user.id).single()

      if (data && !error) {
        // User already has a store, redirect to dashboard
        router.push("/dashboard")
      }
    }

    if (user && !authLoading) {
      checkStore()
    }
  }, [user, authLoading, router, supabase])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setStoreData((prev) => ({ ...prev, [name]: value }))
  }

  // Generate slug from store name
  useEffect(() => {
    if (storeData.storeName && !storeData.storeSlug) {
      const slug = storeData.storeName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
      setStoreData((prev) => ({ ...prev, storeSlug: slug }))
    }
  }, [storeData.storeName, storeData.storeSlug])

  async function handleNext() {
    if (step === 1) {
      if (!storeData.storeName || !storeData.storeDescription) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }
      setStep(2)
    } else if (step === 2) {
      if (!storeData.storeSlug || !storeData.phoneNumber) {
        toast({
          title: "Missing information",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      // Check if slug is already taken
      const { data: slugCheck, error: slugError } = await supabase
        .from("stores")
        .select("slug")
        .eq("slug", storeData.storeSlug)
        .single()

      if (slugCheck) {
        toast({
          title: "Slug already taken",
          description: "Please choose a different store URL.",
          variant: "destructive",
        })
        return
      }

      setStep(3)
    } else if (step === 3) {
      setIsLoading(true)
      try {
        if (!user) {
          throw new Error("User not authenticated")
        }

        // Create store in database
        const { data, error } = await supabase
          .from("stores")
          .insert({
            owner_id: user.id,
            name: storeData.storeName,
            slug: storeData.storeSlug,
            description: storeData.storeDescription,
            whatsapp_number: storeData.phoneNumber,
            category: storeData.category || "general",
            theme: storeData.theme || "default",
            primary_color: "#059669",  
          })
          .select()
          .single()

        if (error) {
          throw error
        }

        // Create profile if it doesn't exist
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .upsert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || "",
            phone_number: storeData.phoneNumber,
            onboarding: true,
            created_at: new Date().toISOString(),  // Explicit creation timestamp
            updated_at: new Date().toISOString()  // Explicit update timestamp
          })
          .select()
          .single()

        if (profileError) {
          throw profileError
        }

        toast({
          title: "Store created",
          description: "Your store has been created successfully.",
        })

        router.push("/dashboard")
        router.refresh()

      } catch (error: any) {
        toast({
          title: "Error creating store",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
  }

  function handleBack() {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    router.push("/login")
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ShoppingBag className="h-5 w-5 text-emerald-600" />
          <span className="text-emerald-600">WhatsBuy.in</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md space-y-8">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Set up your store</h1>
            <p className="text-gray-500">Let&apos;s get your WhatsApp store ready in a few simple steps</p>
          </div>

          <div className="relative">
            <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200"></div>
            <div className="relative flex justify-between">
              <div className="flex flex-col items-center">
                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    step >= 1 ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-300 bg-white"
                  }`}
                >
                  {step > 1 ? <Check className="h-4 w-4" /> : 1}
                </div>
                <span className="mt-2 text-xs">Store Info</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    step >= 2 ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-300 bg-white"
                  }`}
                >
                  {step > 2 ? <Check className="h-4 w-4" /> : 2}
                </div>
                <span className="mt-2 text-xs">Contact</span>
              </div>
              <div className="flex flex-col items-center">
                <div
                  className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    step >= 3 ? "border-emerald-600 bg-emerald-600 text-white" : "border-gray-300 bg-white"
                  }`}
                >
                  3
                </div>
                <span className="mt-2 text-xs">Finish</span>
              </div>
            </div>
          </div>

          <div className="mt-8 space-y-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeName">Store Name</Label>
                  <Input
                    id="storeName"
                    name="storeName"
                    placeholder="e.g., Sharma Sarees"
                    value={storeData.storeName}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="storeDescription">Store Description</Label>
                  <Textarea
                    id="storeDescription"
                    name="storeDescription"
                    placeholder="Tell customers about your store"
                    value={storeData.storeDescription}
                    onChange={handleChange}
                    required
                    rows={4}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Store Category</Label>
                  <select
                    id="category"
                    name="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={storeData.category}
                    onChange={handleChange}
                  >
                    <option value="">Select a category</option>
                    <option value="clothing">Clothing & Apparel</option>
                    <option value="electronics">Electronics</option>
                    <option value="home">Home & Kitchen</option>
                    <option value="beauty">Beauty & Personal Care</option>
                    <option value="food">Food & Groceries</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Store Theme</Label>
                  <select
                    id="theme"
                    name="theme"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={storeData.theme}
                    onChange={handleChange}
                  >
                    <option value="default">Default Theme</option>
                    <option value="grocery">Grocery Store</option>
                    <option value="fashion">Fashion Store</option>
                    <option value="electronics">Electronics Store</option>
                    <option value="minimal">Minimal Store</option>
                    <option value="elegant">Elegant Store</option>
                  </select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="storeSlug">Store URL</Label>
                  <div className="flex items-center">
                    <span className="rounded-l-md border border-r-0 bg-gray-100 px-3 py-2 text-sm text-gray-500">
                      whatsbuy.in/store/
                    </span>
                    <Input
                      id="storeSlug"
                      name="storeSlug"
                      className="rounded-l-none"
                      placeholder="your-store-name"
                      value={storeData.storeSlug}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <p className="text-xs text-gray-500">This will be your store&apos;s web address</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber">WhatsApp Number</Label>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    placeholder="e.g., 9876543210"
                    value={storeData.phoneNumber}
                    onChange={handleChange}
                    required
                  />
                  <p className="text-xs text-gray-500">Customers will send orders to this WhatsApp number</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="rounded-lg border bg-white p-4">
                  <h3 className="font-medium">Store Details</h3>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Store Name:</span>
                      <span className="font-medium">{storeData.storeName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Store URL:</span>
                      <span className="font-medium">whatsbuy.in/store/{storeData.storeSlug}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">WhatsApp Number:</span>
                      <span className="font-medium">{storeData.phoneNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <span className="font-medium">{storeData.category || "General"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Theme:</span>
                      <span className="font-medium">{storeData.theme}</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg border bg-emerald-50 p-4">
                  <h3 className="font-medium text-emerald-800">You&apos;re all set!</h3>
                  <p className="mt-2 text-sm text-emerald-700">
                    Your WhatsApp store is ready. Start adding products to begin selling.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between">
              {step > 1 ? (
                <Button variant="outline" onClick={handleBack} disabled={isLoading}>
                  Back
                </Button>
              ) : (
                <div></div>
              )}
              <Button onClick={handleNext} className="bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    {step === 3 ? "Create Store" : "Continue"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
