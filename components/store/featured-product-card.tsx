"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Heart, ShoppingCart, Eye, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default function FeaturedProductCard({ product, store, isDarkMode = false, onAddToCart, onQuickView }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "group relative rounded-2xl overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl",
        isDarkMode ? "bg-gray-900 border border-gray-800" : "bg-white border border-[#e4dbc8]",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.images[0]  || "/placeholder.svg?height=300&width=400"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300",
            isHovered ? "opacity-100" : "",
          )}
        ></div>

        {/* Quick Actions */}
        <div
          className={cn(
            "absolute bottom-4 left-0 right-0 flex justify-center gap-2 transition-all duration-300 transform",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0",
          )}
        >
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full bg-white/90 text-gray-900 hover:bg-white"
            onClick={onQuickView}
          >
            <Eye className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="h-10 w-10 rounded-full bg-white/90 text-gray-900 hover:bg-white"
            onClick={() => setIsLiked(!isLiked)}
          >
            <Heart className={cn("h-5 w-5", isLiked ? "fill-red-500 text-red-500" : "")} />
          </Button>
          <Button
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full",
              isDarkMode ? "bg-green-600 hover:bg-green-700 text-white" : "bg-[#5c8d67] hover:bg-[#3a523f] text-white",
            )}
            onClick={onAddToCart}
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.is_new && <Badge className="bg-[#d4a24e] hover:bg-[#c08e3a] text-white border-0">New</Badge>}
          {product.discount_percentage > 0 && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white border-0">-{product.discount_percentage}%</Badge>
          )}
          {product.is_organic && (
            <Badge
              className={cn(
                "border-0",
                isDarkMode
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-[#5c8d67] hover:bg-[#3a523f] text-white",
              )}
            >
              Organic
            </Badge>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1 text-[#d4a24e]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={cn("h-4 w-4", i < product.rating ? "fill-[#d4a24e]" : "text-gray-300")} />
            ))}
            <span className={cn("text-xs ml-1", isDarkMode ? "text-gray-400" : "text-gray-500")}>
              ({product.reviews_count || 0})
            </span>
          </div>

          {/* {product.in_stock ? (
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-normal",
                isDarkMode
                  ? "border-green-800 bg-green-900/30 text-green-500"
                  : "border-green-200 bg-green-50 text-green-700",
              )}
            >
              In Stock
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-normal",
                isDarkMode ? "border-red-800 bg-red-900/30 text-red-500" : "border-red-200 bg-red-50 text-red-700",
              )}
            >
              Out of Stock
            </Badge>
          )} */}
        </div>

        <Link href={`/store/${store.slug}/product/${product.id}`}>
          <h3 className={cn("font-medium text-lg mb-1 hover:underline", isDarkMode ? "text-white" : "text-[#3a523f]")}>
            {product.name}
          </h3>
        </Link>

        <p className={cn("text-sm line-clamp-2 mb-3", isDarkMode ? "text-gray-400" : "text-[#5c8d67]")}>
          {product.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {product.discount_percentage > 0 ? (
              <>
                <span className={cn("font-bold text-xl", isDarkMode ? "text-white" : "text-[#3a523f]")}>
                  ${(product.price * (1 - product.discount_percentage / 100)).toFixed(2)}
                </span>
                <span className={cn("text-sm line-through", isDarkMode ? "text-gray-500" : "text-gray-500")}>
                  ${product.price.toFixed(2)}
                </span>
              </>
            ) : (
              <span className={cn("font-bold text-xl", isDarkMode ? "text-white" : "text-[#3a523f]")}>
                ${product.price.toFixed(2)}
              </span>
            )}
          </div>

          <Button
            size="sm"
            className={cn(
              "rounded-full",
              isDarkMode ? "bg-green-600 hover:bg-green-700 text-white" : "bg-[#5c8d67] hover:bg-[#3a523f] text-white",
            )}
            onClick={onAddToCart}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
