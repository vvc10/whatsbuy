"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth/auth-provider"
import { PaintBucket, Upload, Check, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

const THEMES = [
  { id: "default", name: "Default" },
  { id: "modern", name: "Modern" },
  { id: "classic", name: "Classic" },
]

const COLORS = [
  { id: "#059669", name: "Green" },
  { id: "#3b82f6", name: "Blue" },
  { id: "#8b5cf6", name: "Purple" },
  { id: "#ef4444", name: "Red" },
  { id: "#f59e0b", name: "Orange" },
]

const HOMEPAGE_SECTIONS = [
  "Store Banner",
  "Featured Products",
  "Categories",
  "New Arrivals",
  "Testimonials",
  "About Store",
]

const FOOTER_LINKS = [
  "About Us",
  "Contact",
  "Privacy Policy",
  "Terms of Service",
  "Shipping & Returns",
]

export default function AppearancePage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("themes")
  const [isLoading, setIsLoading] = useState(false)
  const [uploadingLogo, setUploadingLogo] = useState(false)
  const [uploadingBanner, setUploadingBanner] = useState(false)

  const supabase = createClient()

  const [storeData, setStoreData] = useState({
    id: "",
    slug: "",
    name: "",
    logo_url: "",
    banner_url: "",
    theme: "default",
    primary_color: "#059669",
    show_logo: true,
    show_banner: true,
    homepage_sections: HOMEPAGE_SECTIONS.reduce((acc, section) => {
      acc[section.toLowerCase().replace(/\s+/g, '_')] = true
      return acc
    }, {} as Record<string, boolean>),
    footer_links: FOOTER_LINKS.reduce((acc, link) => {
      acc[link.toLowerCase().replace(/\s+/g, '_')] = true
      return acc
    }, {} as Record<string, boolean>),
    show_powered_by: true,
    show_social_icons: true,
    show_share_buttons: true,
    premium_branding: false,
  })

  useEffect(() => {
    const fetchStoreData = async () => {
      if (!user) return
      setIsLoading(true)

      try {
        const { data, error } = await supabase.from("stores").select("*").eq("owner_id", user.id).single()

        if (error) throw error

        if (data) {
          setStoreData({
            id: data.id,
            slug: data.slug,
            name: data.name,
            logo_url: data.logo_url || "",
            banner_url: data.banner_url || "",
            theme: data.theme || "default",
            primary_color: data.primary_color || "#059669",
            show_logo: data.show_logo !== undefined ? data.show_logo : true,
            show_banner: data.show_banner !== undefined ? data.show_banner : true,
            homepage_sections: data.homepage_sections || HOMEPAGE_SECTIONS.reduce((acc, section) => {
              acc[section.toLowerCase().replace(/\s+/g, '_')] = true
              return acc
            }, {} as Record<string, boolean>),
            footer_links: data.footer_links || FOOTER_LINKS.reduce((acc, link) => {
              acc[link.toLowerCase().replace(/\s+/g, '_')] = true
              return acc
            }, {} as Record<string, boolean>),
            show_powered_by: data.show_powered_by !== undefined ? data.show_powered_by : true,
            show_social_icons: data.show_social_icons !== undefined ? data.show_social_icons : true,
            show_share_buttons: data.show_share_buttons !== undefined ? data.show_share_buttons : true,
            premium_branding: data.premium_branding || false,
          })
        }
      } catch (error: any) {
        toast({
          title: "Error fetching store data",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchStoreData()
  }, [user, supabase, toast])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "banner") => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      if (type === "logo") {
        setUploadingLogo(true)
      } else {
        setUploadingBanner(true)
      }

      if (!user) throw new Error("User not authenticated")

      const fileExt = file.name.split(".").pop()
      const fileName = `${type}_${user.id}_${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `store_assets/${fileName}`

      const { error: uploadError } = await supabase.storage.from("store-assets").upload(filePath, file)
      if (uploadError) throw uploadError

      const { data: urlData } = supabase.storage.from("store-assets").getPublicUrl(filePath)

      if (type === "logo") {
        setStoreData(prev => ({ ...prev, logo_url: urlData.publicUrl }))
      } else {
        setStoreData(prev => ({ ...prev, banner_url: urlData.publicUrl }))
      }

      toast({
        title: `${type === "logo" ? "Logo" : "Banner"} uploaded`,
        description: "Your image has been uploaded successfully.",
      })
    } catch (error: any) {
      toast({
        title: `Error uploading ${type}`,
        description: error.message || "Please try again with a smaller image.",
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

  const handleThemeSelect = (theme: string) => {
    setStoreData(prev => ({ ...prev, theme }))
  }

  const handleColorSelect = (color: string) => {
    setStoreData(prev => ({ ...prev, primary_color: color }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setStoreData(prev => ({ ...prev, [name]: checked }))
  }

  const handleSectionToggle = (section: string, checked: boolean) => {
    const sectionKey = section.toLowerCase().replace(/\s+/g, '_')
    setStoreData(prev => ({
      ...prev,
      homepage_sections: {
        ...prev.homepage_sections,
        [sectionKey]: checked
      }
    }))
  }

  const handleFooterLinkToggle = (link: string, checked: boolean) => {
    const linkKey = link.toLowerCase().replace(/\s+/g, '_')
    setStoreData(prev => ({
      ...prev,
      footer_links: {
        ...prev.footer_links,
        [linkKey]: checked
      }
    }))
  }

  const handleSave = async () => {
    if (!user || !storeData.id) return

    setIsLoading(true)

    try {
      const { error } = await supabase
        .from("stores")
        .update({
          theme: storeData.theme,
          primary_color: storeData.primary_color,
          logo_url: storeData.logo_url,
          banner_url: storeData.banner_url,
          show_logo: storeData.show_logo,
          show_banner: storeData.show_banner,
          homepage_sections: storeData.homepage_sections,
          footer_links: storeData.footer_links,
          show_powered_by: storeData.show_powered_by,
          show_social_icons: storeData.show_social_icons,
          show_share_buttons: storeData.show_share_buttons,
          updated_at: new Date().toISOString(),
        })
        .eq("id", storeData.id)

      if (error) throw error

      toast({
        title: "Appearance updated",
        description: "Your store appearance has been updated successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error updating appearance",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Store Appearance</h1>
        <div className="flex items-center gap-2">
          {storeData.slug && (
            <Link href={`/store/${storeData.slug}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="mr-2 h-4 w-4" />
                Preview Store
              </Button>
            </Link>
          )}
          <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="themes">Themes</TabsTrigger>
          <TabsTrigger value="colors">Colors & Branding</TabsTrigger>
          <TabsTrigger value="layout">Layout & Elements</TabsTrigger>
        </TabsList>

        <TabsContent value="themes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Theme</CardTitle>
              <CardDescription>Choose a theme for your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {THEMES.map((theme) => (
                  <div
                    key={theme.id}
                    className={`cursor-pointer overflow-hidden rounded-lg border transition-all hover:shadow-md ${storeData.theme === theme.id ? "border-2 border-emerald-600 ring-2 ring-emerald-600/20" : ""
                      }`}
                    onClick={() => handleThemeSelect(theme.id)}
                  >
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                      <div
                        className="h-full w-full"
                        style={{
                          backgroundColor: theme.id === "default" ? "#f3f4f6" :
                            theme.id === "modern" ? "#ffffff" : "#f9fafb"
                        }}
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-lg font-medium">{theme.name}</span>
                        </div>
                      </div>
                      {storeData.theme === theme.id && (
                        <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-white">
                          <Check className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium">{theme.name}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="colors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Color Scheme</CardTitle>
              <CardDescription>Choose colors for your store</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex flex-wrap gap-4">
                  {COLORS.map((color) => (
                    <div
                      key={color.id}
                      className={`relative h-10 w-10 cursor-pointer rounded-full ${storeData.primary_color === color.id ? "ring-2 ring-offset-2 ring-gray-950" : ""
                        }`}
                      style={{ backgroundColor: color.id }}
                      onClick={() => handleColorSelect(color.id)}
                      title={color.name}
                    >
                      {storeData.primary_color === color.id && <Check className="h-5 w-5 text-white" />}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Logo & Branding</CardTitle>
              <CardDescription>Upload your store logo and branding assets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Store Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-lg border bg-gray-50">
                    {storeData.logo_url ? (
                      <Image
                        src={storeData.logo_url}
                        alt="Store logo"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <PaintBucket className="h-8 w-8" />
                      </div>
                    )}
                  </div>



                  <div>
                    <Label htmlFor="logo-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 rounded-md border bg-gray-50 px-3 py-2 hover:bg-gray-100">
                        <Upload className="h-4 w-4" />
                        <span>{uploadingLogo ? "Uploading..." : "Upload Logo"}</span>
                      </div>
                      <input
                        id="logo-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "logo")}
                        disabled={uploadingLogo}
                      />
                    </Label>
                    <p className="mt-1 text-xs text-gray-500">Recommended: 500x500px, JPG or PNG</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="show_logo"
                    checked={storeData.show_logo}
                    onCheckedChange={(checked) => handleSwitchChange("show_logo", checked)}
                  />
                  <Label htmlFor="show_logo">Show logo on store</Label>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Store Banner</Label>
                <div className="flex flex-col gap-4">
                  <div className="relative h-32 w-full overflow-hidden rounded-lg border bg-gray-50">
                    {storeData.banner_url ? (
                      <Image
                        src={storeData.banner_url}
                        alt="Store banner"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <PaintBucket className="h-8 w-8" />
                      </div>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="banner-upload" className="cursor-pointer">
                      <div className="flex items-center gap-2 rounded-md border bg-gray-50 px-3 py-2 hover:bg-gray-100">
                        <Upload className="h-4 w-4" />
                        <span>{uploadingBanner ? "Uploading..." : "Upload Banner"}</span>
                      </div>
                      <input
                        id="banner-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, "banner")}
                        disabled={uploadingBanner}
                      />
                    </Label>
                    <p className="mt-1 text-xs text-gray-500">Recommended: 1200x300px, JPG or PNG</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 pt-2">
                  <Switch
                    id="show_banner"
                    checked={storeData.show_banner}
                    onCheckedChange={(checked) => handleSwitchChange("show_banner", checked)}
                  />
                  <Label htmlFor="show_banner">Show banner on store</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="layout" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Store Layout</CardTitle>
              <CardDescription>Configure your store layout and sections</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Homepage Sections</Label>
                <div className="space-y-2">
                  {HOMEPAGE_SECTIONS.map((section) => {
                    const sectionKey = section.toLowerCase().replace(/\s+/g, '_')
                    return (
                      <div key={section} className="flex items-center justify-between rounded-md border p-3">
                        <span>{section}</span>
                        <Switch
                          checked={storeData.homepage_sections[sectionKey] !== false}
                          onCheckedChange={(checked) => handleSectionToggle(section, checked)}
                        />
                      </div>
                    )
                  })}
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <span>Share button</span>
                    <Switch
                      id="show_share_buttons"
                      checked={storeData.show_share_buttons}
                      onCheckedChange={(checked) => handleSwitchChange("show_share_buttons", checked)}

                    />
                  </div>
                </div>

              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Footer & Additional Elements</CardTitle>
              <CardDescription>Configure footer and other store elements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Footer Links</Label>
                <div className="space-y-2">
                  {FOOTER_LINKS.map((link) => {
                    const linkKey = link.toLowerCase().replace(/\s+/g, '_')
                    return (
                      <div key={link} className="flex items-center justify-between rounded-md border p-3">
                        <span>{link}</span>
                        <Switch
                          checked={storeData.footer_links[linkKey] !== false}
                          onCheckedChange={(checked) => handleFooterLinkToggle(link, checked)}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
              <div className="space-y-4 pt-4">
                <Label>Branding Options</Label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <Label htmlFor="show_powered_by">Show "Powered by WhatsBuy.in" badge</Label>
                      {!storeData.premium_branding && (
                        <p className="text-xs text-gray-500">Upgrade to premium to customize</p>
                      )}
                    </div>
                    <Switch
                      id="show_powered_by"
                      checked={storeData.show_powered_by}
                      onCheckedChange={(checked) => handleSwitchChange("show_powered_by", checked)}
                      disabled={!storeData.premium_branding}
                    />
                  </div>
                  <div className="flex items-center justify-between rounded-md border p-3">
                    <div>
                      <Label htmlFor="show_social_icons">Show social media icons</Label>
                      {!storeData.premium_branding && (
                        <p className="text-xs text-gray-500">Upgrade to premium to customize</p>
                      )}
                    </div>
                    <Switch
                      id="show_social_icons"
                      checked={storeData.show_social_icons}
                      onCheckedChange={(checked) => handleSwitchChange("show_social_icons", checked)}
                      disabled={!storeData.premium_branding}
                    />
                  </div>

                </div>

              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}