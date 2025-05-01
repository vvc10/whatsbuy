import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { MessageCircle, ShoppingBag, Star, Search, Filter, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerClient } from "@/lib/supabase/server"
import StoreShareButton from "@/components/store/store-share-button"
import StoreThemeProvider from "@/components/store/store-theme-provider"
import ProductCard from "@/components/store/product-card"
import FloatingWhatsAppButton from "@/components/store/floating-whatsapp-button"
import OrganicFoodStore from "@/components/store/themes/food-store"
import TechGadgetStore from "@/components/store/themes/tech-store"
import LuxuryFashionStore from "@/components/store/themes/fashion-store"
import type { Metadata } from "next"
import ViewTracker from "@/components/store/view-tracker"
import DefaultStore from "@/components/store/themes/default-store"

interface StorePageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  try {
    const supabase = createServerClient()
    const { data: store } = await supabase.from("stores").select("name, description").eq("slug", params.slug).single()

    if (!store) return { title: "Store Not Found" }

    return {
      title: `${store.name} | WhatsBuy.in`,
      description: store.description || `Shop at ${store.name} - Powered by WhatsBuy.in`,
      openGraph: {
        title: `${store.name} | WhatsBuy.in`,
        description: store.description || `Shop at ${store.name} - Powered by WhatsBuy.in`,
        type: "website",
      },
    }
  } catch (error) {
    return { title: "Online Store | WhatsBuy.in" }
  }
}

export default async function StorePage({ params }: StorePageProps) {
  try {
    const supabase = createServerClient()

    // Fetch store details with all settings
    const { data: store, error } = await supabase.from("stores").select("*").eq("slug", params.slug).single()

    if (error || !store) notFound()

    // Fetch store's active products
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    // Fetch featured products (top 3 products)
    const { data: featuredProducts } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .eq("is_active", true)
      .limit(3)
      .order("created_at", { ascending: false })

    // Get unique categories from products
    const categories = products ? [...new Set(products.map((product) => product.category).filter(Boolean))] : []

    // Get testimonials (placeholder for now)
    const testimonials = [
      {
        id: 1,
        name: "Priya Sharma",
        avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
        rating: 5,
        text: "Amazing products and super fast delivery! Will definitely shop again.",
      },
      {
        id: 2,
        name: "Rahul Patel",
        avatar: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
        rating: 4,
        text: "Great quality and reasonable prices. The WhatsApp ordering process was very convenient.",
      },
      {
        id: 3,
        name: "Ananya Singh",
        avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
        rating: 5,
        text: "Excellent customer service! They were very responsive on WhatsApp.",
      },
    ]

    const whatsappChatLink = store.whatsapp_number
      ? `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(
        (store.chat_message || `Hi ${store.name}, I'm interested in your products.`).replace(
          "[STORE_NAME]",
          store.name,
        ),
      )}`
      : null

    const storeData = {
      store,
      products,
      featuredProducts,
      categories,
      testimonials,
      whatsappChatLink,
    }

    return (
      <StoreThemeProvider
        theme={store.theme || "default"}
        primaryColor={store.primary_color || "#059669"}
        categoryFont={store.category_font}
        categoryButtonStyle={store.category_button_style}
        categoryCardShadow={store.category_card_shadow}
        categoryBorderStyle={store.category_border_style}
        categoryTransition={store.category_transition}
        headerShadow={store.header_shadow}
      >
        <ViewTracker storeId={store.id} />
        {store.theme === "tech" ? (
          <TechGadgetStore {...storeData} />
        ) : store.theme === "food" ? (
          <OrganicFoodStore {...storeData} />
        ) : store.theme === "fashion" ? (
          <LuxuryFashionStore {...storeData} />
        ) : (
          <DefaultStore {...storeData} />
        )}
      </StoreThemeProvider>
    )
  } catch (error) {
    console.error("Store page error:", error)
    notFound()
  }
}