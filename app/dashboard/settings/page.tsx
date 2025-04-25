"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Upload, Check } from "lucide-react"
import Image from "next/image"

const CATEGORIES = [
  { id: "clothing", name: "Clothing & Apparel" },
  { id: "electronics", name: "Electronics" },
  { id: "home", name: "Home & Kitchen" },
  { id: "beauty", name: "Beauty & Personal Care" },
  { id: "food", name: "Food & Groceries" },
  { id: "other", name: "Other" },
]

export default function SettingsPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("store")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)
  const [hasPaymentSettings, setHasPaymentSettings] = useState(false)
  const [hasWhatsappBusiness, setHasWhatsappBusiness] = useState(false)

  const [storeData, setStoreData] = useState({
    id: "",
    name: "",
    slug: "",
    description: "",
    logo_url: "",
    banner_url: "",
    whatsapp_number: "",
    category: "other",
    welcome_message: "Thank you for your interest in our products! How can I help you today?",
    order_template:
      "Hello! I would like to order:\n\n[PRODUCT_NAME] - ₹[PRODUCT_PRICE]\n\nDelivery Address: [CUSTOMER_ADDRESS]\n\nPayment Method: [PAYMENT_METHOD]",
    auto_reply: true,
    show_logo: true,
    show_banner: true,
    payment_settings: false,
    whatsapp_business: false,
  })

  // Fetch store data
  useEffect(() => {
    async function fetchStoreData() {
      try {
        // Get current user
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push("/auth/login")
          return
        }

        // Get store data
        const { data: store, error } = await supabase.from("stores").select("*").eq("owner_id", user.id).single()

        if (error) {
          throw error
        }

        if (store) {
          setStoreData({
            ...storeData,
            ...store,
            // Set defaults for fields that might not exist in the database
            welcome_message: store.welcome_message || storeData.welcome_message,
            order_template: store.order_template || storeData.order_template,
            auto_reply: store.auto_reply !== undefined ? store.auto_reply : storeData.auto_reply,
            show_logo: store.show_logo !== undefined ? store.show_logo : storeData.show_logo,
            show_banner: store.show_banner !== undefined ? store.show_banner : storeData.show_banner,
          })
          setHasPaymentSettings(store.payment_settings || false)
          setHasWhatsappBusiness(store.whatsapp_business || false)
        }
      } catch (error) {
        console.error("Error fetching store data:", error)
        toast({
          title: "Error loading store data",
          description: "Please try again later.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStoreData()
  }, [supabase, router, toast])

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setStoreData((prev) => ({ ...prev, [name]: value }))
  }

  // Handle switch changes
  const handleSwitchChange = (name: string, checked: boolean) => {
    setStoreData((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle file upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "banner") => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      if (type === "logo") {
        setUploadingLogo(true)
      } else {
        setUploadingBanner(true)
      }

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      // Create a unique file name
      const fileExt = file.name.split(".").pop()
      const fileName = `${type}_${user.id}_${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `store_assets/${fileName}`

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage.from("store-assets").upload(filePath, file)

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage.from("store-assets").getPublicUrl(filePath)

      // Update state with new URL
      if (type === "logo") {
        setStoreData((prev) => ({ ...prev, logo_url: urlData.publicUrl }))
      } else {
        setStoreData((prev) => ({ ...prev, banner_url: urlData.publicUrl }))
      }

      toast({
        title: `${type === "logo" ? "Logo" : "Banner"} uploaded`,
        description: "Your image has been uploaded successfully.",
      })
    } catch (error) {
      console.error(`Error uploading ${type}:`, error)
      toast({
        title: `Error uploading ${type}`,
        description: "Please try again with a smaller image.",
        variant: "destructive",
      })
    } finally {
      if (type === "logo") {
        setUploadingLogo(false)
      } else {
        setUploadingBanner(false)
      }
    }
  }

  // Save all changes
  const handleSave = async () => {
    setSaving(true)

    try {
      // Validate slug uniqueness if it was changed
      if (storeData.slug) {
        const { data: existingStore, error: slugCheckError } = await supabase
          .from("stores")
          .select("id")
          .eq("slug", storeData.slug)
          .neq("id", storeData.id)
          .single()

        if (existingStore) {
          toast({
            title: "Store URL already taken",
            description: "Please choose a different URL for your store.",
            variant: "destructive",
          })
          setSaving(false)
          return
        }
      }

      // Update store in database
      const { error } = await supabase
        .from("stores")
        .update({
          name: storeData.name,
          slug: storeData.slug,
          description: storeData.description,
          logo_url: storeData.logo_url,
          banner_url: storeData.banner_url,
          whatsapp_number: storeData.whatsapp_number,
          category: storeData.category,
          welcome_message: storeData.welcome_message,
          order_template: storeData.order_template,
          auto_reply: storeData.auto_reply,
          show_logo: storeData.show_logo,
          show_banner: storeData.show_banner,
          updated_at: new Date().toISOString(),
        })
        .eq("id", storeData.id)

      if (error) throw error

      toast({
        title: "Changes saved",
        duration: 2000,
        className: "bg-emerald-500 text-white",
      })

      // Refresh the page to show updated data
      router.refresh()
    } catch (error) {
      console.error("Error saving store data:", error)
      toast({
        title: "Error saving settings",
        description: "Please try again later.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="store">Store</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="store" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Information</CardTitle>
              <CardDescription>Manage your store details and basic information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Store Name</Label>
                  <Input id="name" name="name" value={storeData.name} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Store URL</Label>
                  <div className="flex items-center">
                    <span className="rounded-l-md border border-r-0 bg-gray-100 px-3 py-2 text-sm text-gray-500">
                      whatsbuy.in/
                    </span>
                    <Input
                      id="slug"
                      name="slug"
                      className="rounded-l-none"
                      value={storeData.slug}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Store Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={storeData.description || ""}
                  onChange={handleChange}
                  placeholder="Describe your store to customers"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Store Category</Label>
                <select
                  id="category"
                  name="category"
                  value={storeData.category}
                  onChange={handleChange}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">WhatsApp Number</Label>
                <Input
                  id="whatsapp_number"
                  name="whatsapp_number"
                  value={storeData.whatsapp_number || ""}
                  onChange={handleChange}
                  placeholder="e.g., 919876543210 (include country code without +)"
                />
                <p className="text-xs text-gray-500">
                  Enter your WhatsApp number with country code (e.g., 919876543210 for India)
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700" disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="whatsapp" className="space-y-4">
          {hasWhatsappBusiness ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>WhatsApp Integration</CardTitle>
                  <CardDescription>Configure your WhatsApp business settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp_number">WhatsApp Business Number</Label>
                    <Input
                      id="whatsapp_number"
                      name="whatsapp_number"
                      value={storeData.whatsapp_number || ""}
                      onChange={handleChange}
                      placeholder="e.g., 919876543210 (include country code without +)"
                    />
                    <p className="text-xs text-gray-500">
                      This is the number customers will message when they place an order
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="welcome_message">Welcome Message</Label>
                    <Textarea
                      id="welcome_message"
                      name="welcome_message"
                      rows={4}
                      value={storeData.welcome_message || ""}
                      onChange={handleChange}
                      placeholder="Enter a welcome message for customers"
                    />
                    <p className="text-xs text-gray-500">
                      This message will be pre-filled when customers click the "Chat on WhatsApp" button
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="order_template">Order Message Template</Label>
                    <Textarea
                      id="order_template"
                      name="order_template"
                      rows={4}
                      value={storeData.order_template || ""}
                      onChange={handleChange}
                      placeholder="Enter a template for order messages"
                    />
                    <p className="text-xs text-gray-500">
                      Use placeholders like [PRODUCT_NAME], [PRODUCT_PRICE], etc. which will be automatically filled
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="auto_reply"
                      checked={storeData.auto_reply}
                      onCheckedChange={(checked) => handleSwitchChange("auto_reply", checked)}
                    />
                    <Label htmlFor="auto_reply">Enable auto-replies</Label>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                  <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700" disabled={saving}>
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>WhatsApp Business</CardTitle>
                <CardDescription>Upgrade to access WhatsApp Business features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-dashed p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">WhatsApp Business API</h3>
                      <p className="text-sm text-gray-500">
                        Upgrade your plan to setup WhatsApp Business integration for advanced features
                      </p>
                    </div>
                    <Button variant="outline">Upgrade to setup WhatsApp Business</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          {hasPaymentSettings ? (
            <Card>
              <CardHeader>
                <CardTitle>Payment Methods</CardTitle>
                <CardDescription>Configure how you receive payments from customers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="cod" defaultChecked />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="razorpay" />
                      <Label htmlFor="razorpay">Razorpay</Label>
                    </div>
                    <Button variant="outline" size="sm">
                      Connect
                    </Button>
                  </div>
                  <div className="rounded-lg border border-dashed p-4">
                    <p className="text-sm text-gray-500">
                      Connect your Razorpay account to accept online payments directly through WhatsApp
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Switch id="upi" />
                      <Label htmlFor="upi">UPI Direct</Label>
                    </div>
                    <Button variant="outline" size="sm">
                      Setup
                    </Button>
                  </div>
                  <div className="rounded-lg border border-dashed p-4">
                    <p className="text-sm text-gray-500">
                      Accept UPI payments directly to your UPI ID (Google Pay, PhonePe, Paytm, etc.)
                    </p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className="bg-emerald-600 hover:bg-emerald-700">Save Payment Settings</Button>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Payment Settings</CardTitle>
                <CardDescription>Upgrade to access payment features</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-dashed p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Payment Integration</h3>
                      <p className="text-sm text-gray-500">
                        Upgrade your plan to setup payment methods and accept online payments
                      </p>
                    </div>
                    <Button variant="outline">Upgrade to setup Payments</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}