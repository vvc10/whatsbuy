"use client"

import { MessageCircle, ShoppingBag, Star, Search, Filter, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StoreShareButton from "@/components/store/store-share-button"
import StoreThemeProvider from "@/components/store/store-theme-provider"
import ProductCard from "@/components/store/product-card"
import FloatingWhatsAppButton from "@/components/store/floating-whatsapp-button"
import OrganicFoodStore from "@/components/store/themes/food-store"
import TechGadgetStore from "@/components/store/themes/tech-store"
import LuxuryFashionStore from "@/components/store/themes/fashion-store"
import ViewTracker from "@/components/store/view-tracker"
import DefaultStore from "@/components/store/themes/default-store"

export default function StoreClientComponent({
  store,
  products,
  featuredProducts,
  categories,
  testimonials,
  whatsappChatLink,
}: {
  store: any
  products: any[]
  featuredProducts: any[]
  categories: string[]
  testimonials: any[]
  whatsappChatLink: string | null
}) {
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
        <TechGadgetStore
          store={store}
          products={products}
          featuredProducts={featuredProducts}
          categories={categories}
          testimonials={testimonials}
          whatsappChatLink={whatsappChatLink}
        />
      ) : store.theme === "food" ? (
        <OrganicFoodStore
          store={store}
          products={products}
          featuredProducts={featuredProducts}
          categories={categories}
          testimonials={testimonials}
          whatsappChatLink={whatsappChatLink}
        />
      ) : store.theme === "fashion" ? (
        <LuxuryFashionStore
          store={store}
          products={products}
          featuredProducts={featuredProducts}
          categories={categories}
          testimonials={testimonials}
          whatsappChatLink={whatsappChatLink}
        />
      ) : (
        <DefaultStore
          store={store}
          products={products}
          featuredProducts={featuredProducts}
          categories={categories}
          testimonials={testimonials}
          whatsappChatLink={whatsappChatLink}
        />
      )}
    </StoreThemeProvider>
  )
}