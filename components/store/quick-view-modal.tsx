"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ShoppingCart, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface QuickViewModalProps {
  store: {
    name: string
    whatsapp_number?: string
    primary_color?: string
  }
  product: any
  isOpen: boolean
  onClose: () => void
  onAddToCart: () => void
  darkMode: boolean
  primaryColor?: string // Added for consistent branding
}

export default function QuickViewModal({ 
  store,
  product, 
  isOpen, 
  onClose, 
  onAddToCart, 
  darkMode,
  primaryColor = "#10B981" // Default to emerald green
}: QuickViewModalProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(product?.price || 0)

  const formattedSalePrice = product?.salePrice
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(product.salePrice)
    : null

  if (!mounted || !product) return null


  const whatsappMessage = `Hi ${store.name}, I'd like to order:\n\n*${product.name}*\n${formattedSalePrice || formattedPrice}\n\nPlease confirm availability.`
  const whatsappLink = `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className={cn(
                "relative rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden",
                darkMode 
                  ? "bg-gray-900 border border-gray-800" 
                  : "bg-white border border-gray-200"
              )}
            >
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "absolute top-3 right-3 z-10 h-8 w-8 rounded-full shadow-sm",
                  darkMode 
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white"
                    : "bg-white/90 hover:bg-white text-gray-500 hover:text-gray-700"
                )}
                onClick={onClose}
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-800">
                  <Image
                    src={product.images[0] || "/placeholder.svg?height=500&width=500"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className={cn(
                  "p-6 overflow-y-auto max-h-[90vh] md:max-h-[600px]",
                  darkMode ? "text-gray-200" : "text-gray-800"
                )}>
                  <div className={cn(
                    "text-sm mb-2",
                    darkMode ? "text-gray-400" : "text-gray-500"
                  )}>
                    {product.category}
                  </div>
                  
                  <h2 className={cn(
                    "text-2xl font-bold mb-3",
                    darkMode ? "text-white" : "text-gray-900"
                  )}>
                    {product.name}
                  </h2>


                  <div className="flex items-center gap-3 mb-6">
                    {product.salePrice ? (
                      <>
                        <span 
                          className="text-2xl font-bold"
                          style={{ color: primaryColor }}
                        >
                          {formattedSalePrice}
                        </span>
                        <span className={cn(
                          "text-lg line-through",
                          darkMode ? "text-gray-500" : "text-gray-400"
                        )}>
                          {formattedPrice}
                        </span>
                      </>
                    ) : (
                      <span 
                        className="text-2xl font-bold"
                        style={{ color: primaryColor }}
                      >
                        {formattedPrice}
                      </span>
                    )}
                  </div>

                  <div className={cn(
                    "prose-sm mb-6",
                    darkMode 
                      ? "prose-invert text-gray-300" 
                      : "text-gray-700"
                  )}>
                    <p>
                      {product.description ||
                        "This premium organic product is sourced from sustainable farms and carefully selected to ensure the highest quality. Perfect for health-conscious individuals who appreciate natural, chemical-free foods."}
                    </p>
                   
                  </div>

                  <div className="flex flex-col sm:flex-col gap-3">
                    <Button
                      className="w-full rounded-full"
                      variant={darkMode ? "secondary" : "outline"}
                      onClick={() => {
                        onAddToCart()
                        onClose()
                      }}
                    >
                      <ShoppingCart className="mr-2 h-4 w-4" /> 
                      Add to Cart
                    </Button>
                    
                    {store.whatsapp_number && (
                      <Button
                       
                        style={{ backgroundColor: primaryColor }}
                        className="w-full rounded-full"
                      >
                        <Link href={whatsappLink} className="flex flex-row gap-2">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Order via WhatsApp
                        </Link>
                        
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}