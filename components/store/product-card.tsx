"use client"

import { Eye, Heart, ShoppingCart, MessageCircle, ZoomIn } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image?: string
    images?: string[]
    category: string
    isNew?: boolean
    isSale?: boolean
    salePrice?: number
    views?: number
  }
  onAddToCart: () => void
  onQuickView: () => void
  whatsappNumber?: string
  storeName?: string
  primaryColor?: string
  store?: string
}

export default function ProductCard({
  store,
  product,
  onAddToCart,
  onQuickView,
  whatsappNumber,
  storeName,

}: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const primaryColor = store?.primary_color || "#059669"
  // Format prices
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product.price)

  const formattedSalePrice = product.salePrice
    ? new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(product.salePrice)
    : null

  // WhatsApp message template
  const whatsappMessage = `Hi ${storeName}, I'd like to order:\n\n*${product.name}*\n${formattedSalePrice || formattedPrice}\n\nPlease confirm availability.`
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <TooltipProvider>
      <div
        className={cn(
          "group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md",
          "border-gray-800 bg-gray-900" // Dark mode colors
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Product Badges */}
        <div className="absolute top-3 left-3 z-10 flex gap-2">
          {product.isNew && (
            <Badge
              className="px-2 py-1 text-xs"
              style={{ backgroundColor: primaryColor }}
            >
              New
            </Badge>
          )}
          {product.isSale && (
            <Badge variant="destructive" className="px-2 py-1 text-xs">
              Sale
            </Badge>
          )}
        </div>

        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images?.[0] || product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className={cn(
              "object-cover transition-all duration-500",
              isHovered ? "scale-105 opacity-90" : "scale-100 opacity-100"
            )}
          />

          {/* Favorite Button */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              setIsFavorite(!isFavorite)
            }}
            className={cn(
              "absolute top-3 right-3 z-10 p-2 rounded-full transition-colors",
              isFavorite
                ? `bg-[${primaryColor}] text-white hover:bg-[${primaryColor}]`
                : "bg-gray-800/90 text-gray-300 hover:bg-gray-700/90"
            )}
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-all",
                isFavorite ? "fill-current scale-110" : "scale-100"
              )}
            />
          </button>

          {/* Quick View Button (shown on hover) */}
          <div
            className={cn(
              "absolute inset-0 bg-black/60 flex items-center justify-center gap-2 transition-opacity",
              isHovered ? "opacity-100" : "opacity-0"
            )}
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-white/20 text-white hover:bg-white/30"
                  onClick={(e) => {
                    e.stopPropagation()
                    onQuickView()
                  }}
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Quick View</TooltipContent>
            </Tooltip>
          </div>



        </div>

        {/* Product Info */}
        <div className="p-4">
          <span className="text-xs text-gray-400 mb-1 block">
            {product.category}
          </span>
          <h3 className="font-medium text-white mb-2 line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-2 mb-4">
            {product.salePrice ? (
              <>
                <span
                  className="font-bold"
                  style={{ color: primaryColor }}
                >
                  {formattedSalePrice}
                </span>
                <span className="text-sm text-gray-400 line-through">
                  {formattedPrice}
                </span>
              </>
            ) : (
              <span
                className="font-bold"
                style={{ color: primaryColor }}
              >
                {formattedPrice}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-row items-center justify-between">
            {/* WhatsApp Order Button */}
            {whatsappNumber && (
              <Button

                style={{ backgroundColor: primaryColor }}
                className="mt-2 w-full flex items-center justify-center gap-2 text-sm"
                asChild
              >
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  Order on WhatsApp
                </a>
              </Button>
            )}
            <Button
              onClick={onAddToCart}
              className="flex items-center justify-center gap-1 text-sm"
              style={{ backgroundColor: "transparent" }}
            >
              <ShoppingCart className="h-4 w-4" />

            </Button>
          </div>


        </div>
      </div>
    </TooltipProvider>
  )
}