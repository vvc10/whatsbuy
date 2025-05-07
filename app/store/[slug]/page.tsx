import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import type { Metadata } from "next"
import StoreClientComponent from "./StoreClientComponent"

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
      // ... other testimonials
    ]

    const whatsappChatLink = store.whatsapp_number
      ? `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(
        (store.chat_message || `Hi ${store.name}, I'm interested in your products.`).replace(
          "[STORE_NAME]",
          store.name,
        ),
      )}`
      : null

    return (
      <StoreClientComponent
        store={store}
        products={products || []}
        featuredProducts={featuredProducts || []}
        categories={categories}
        testimonials={testimonials}
        whatsappChatLink={whatsappChatLink}
      />
    )
  } catch (error) {
    console.error("Store page error:", error)
    notFound()
  }
}