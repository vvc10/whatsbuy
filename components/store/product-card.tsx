"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Eye, Share2, PhoneCall, Star } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

type StoreType = 'food' | 'tech' | 'fashion' | 'default'

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    original_price?: number
    images?: string[]
    is_new?: boolean
    discount_percentage?: number
    category?: string
    features?: string[]
    rating?: number
  }
  store: {
    slug: string
    whatsapp_number?: string
    type?: StoreType
  }
  storeType: StoreType
  featured?: boolean
}

export default function ProductCard({ product, store, storeType, featured = false }: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [quickViewOpen, setQuickViewOpen] = useState(false)

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setQuickViewOpen(true)
  }

  const buyLink = `https://wa.me/${store.whatsapp_number}?text=Hi! I'm interested in ${encodeURIComponent(product.name)} priced at ₹${product.price}. Can I order it?`

  // Store type specific styling
  const cardStyles = {
    default: {
      card: "bg-white border border-gray-200",
      button: "bg-emerald-600 hover:bg-emerald-700 text-white",
      text: "text-gray-900",
      secondaryText: "text-gray-600",
      badge: "bg-emerald-600 text-white",
      accent: "bg-emerald-100 text-emerald-800"
    },
    fashion: {
      card: "bg-white border border-gray-100 shadow-sm",
      button: "bg-black hover:bg-gray-800 text-white",
      text: "text-gray-900",
      secondaryText: "text-gray-500",
      badge: "bg-pink-500 text-white",
      accent: "bg-pink-100 text-pink-800"
    },
    tech: {
      card: "bg-gray-50 border border-gray-200",
      button: "bg-blue-600 hover:bg-blue-700 text-white",
      text: "text-gray-800",
      secondaryText: "text-gray-500",
      badge: "bg-blue-500 text-white",
      accent: "bg-blue-100 text-blue-800"
    },
    food: {
      card: "bg-white border border-green-100",
      button: "bg-green-500 hover:bg-green-600 text-white",
      text: "text-gray-800",
      secondaryText: "text-gray-600",
      badge: "bg-green-500 text-white",
      accent: "bg-green-100 text-orange-800"
    }
  }

  return (
    <>
      <div
        className={cn(
          "group relative overflow-hidden transition-all duration-300 rounded-lg",
          cardStyles[storeType].card,
          featured && "ring-1 ring-gray-300"
        )}
      >
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={product.images?.[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className={`h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm ${isLiked ? "text-red-500 hover:text-red-600" : ""}`}
              onClick={handleLikeToggle}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {featured && (
              <Badge className={cn(cardStyles[storeType].badge)}>
                Featured
              </Badge>
            )}
            {product.is_new && (
              <Badge className={cn(cardStyles[storeType].accent)}>
                New
              </Badge>
            )}
            {product.discount_percentage && (
              <Badge className="bg-red-500 text-white">
                -{product.discount_percentage}%
              </Badge>
            )}
          </div>

          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <Button
              size="sm"
              className={cn(
                "z-20 rounded-full",
                cardStyles[storeType].button
              )}
              onClick={handleQuickView}
            >
              <Eye className="mr-2 h-4 w-4" />
              Quick View
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            {product.category && (
              <Badge variant="outline" className={cn(
                "text-xs font-medium uppercase tracking-wider",
                cardStyles[storeType].accent
              )}>
                {product.category}
              </Badge>
            )}
            {product.rating && (
              <div className="flex items-center text-xs">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                {product.rating.toFixed(1)}
              </div>
            )}
          </div>

          <Link href={`/store/${store.slug}/product/${product.id}`} className="block">
            <h3 className={cn(
              "font-medium text-base mb-1 line-clamp-1",
              cardStyles[storeType].text
            )}>
              {product.name}
            </h3>
            <p className={cn(
              "text-xs line-clamp-2 mb-2",
              cardStyles[storeType].secondaryText
            )}>
              {product.description}
            </p>
          </Link>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <div>
                <span className={cn(
                  "font-semibold",
                  cardStyles[storeType].text
                )}>
                  ₹{product.price}
                </span>
                {product.original_price && (
                  <span className={cn(
                    "text-xs line-through ml-2",
                    cardStyles[storeType].secondaryText
                  )}>
                    ₹{product.original_price}
                  </span>
                )}
              </div>
              {storeType === 'food' && product.discount_percentage && (
                <Badge className="bg-green-100 text-green-800 text-xs">
                  Save {product.discount_percentage}%
                </Badge>
              )}
            </div>
            <Button
              size="sm"
              className={cn(
                "rounded-full w-full",
                cardStyles[storeType].button
              )}
              asChild
            >
              <Link href={buyLink} target="_blank" onClick={(e) => e.stopPropagation()}>
                <PhoneCall className="mr-2 h-4 w-4" />
                {storeType === 'food' ? 'Order Now' : 
                 storeType === 'tech' ? 'Inquire Now' : 'Buy Now'}
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Quick View Dialog */}
      <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className={cn(cardStyles[storeType].text)}>
              {product.name}
            </DialogTitle>
            <DialogDescription className={cn(cardStyles[storeType].secondaryText)}>
              {product.description}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 sm:grid-cols-2 py-4">
            <div className="aspect-square relative bg-gray-100 rounded-md overflow-hidden">
              <Image
                src={product.images?.[0] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className={cn(
                    "text-2xl font-bold",
                    cardStyles[storeType].text
                  )}>
                    ₹{product.price}
                  </p>
                  {product.original_price && (
                    <p className={cn(
                      "text-sm line-through",
                      cardStyles[storeType].secondaryText
                    )}>
                      ₹{product.original_price}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="outline"
                    className={isLiked ? "text-red-500" : ""}
                    onClick={() => setIsLiked(!isLiked)}
                  >
                    <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500" : ""}`} />
                  </Button>
                  <Button size="icon" variant="outline">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div>
                  <h4 className={cn(
                    "text-sm font-medium mb-1",
                    cardStyles[storeType].text
                  )}>
                    Description
                  </h4>
                  <p className={cn(
                    "text-sm",
                    cardStyles[storeType].secondaryText
                  )}>
                    {product.description || "No description available for this product."}
                  </p>
                </div>

                {product.features && (
                  <div>
                    <h4 className={cn(
                      "text-sm font-medium mb-1",
                      cardStyles[storeType].text
                    )}>
                      Features
                    </h4>
                    <ul className={cn(
                      "text-sm list-disc pl-5 space-y-1",
                      cardStyles[storeType].secondaryText
                    )}>
                      {product.features.map((feature, index) => (
                        <li key={index}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6">
                <Button className={cn(
                  "w-full",
                  cardStyles[storeType].button
                )} asChild>
                  <Link href={buyLink} target="_blank">
                    <PhoneCall className="mr-2 h-4 w-4" /> 
                    {storeType === 'food' ? 'Order on WhatsApp' : 
                     storeType === 'tech' ? 'Inquire on WhatsApp' : 'Buy on WhatsApp'}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}