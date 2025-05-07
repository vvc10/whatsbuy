"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Trash2, Plus, Minus, ShoppingBag, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  cartItems: any[]
  setCartItems: (items: any[]) => void
  darkMode: boolean
  whatsappNumber?: string
  storeName?: string
}

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  setCartItems, 
  darkMode,
  whatsappNumber,
  storeName
}: CartDrawerProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const subtotal = cartItems.reduce((total, item) => total + (item.salePrice || item.price) * item.quantity, 0)
  const formattedSubtotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(subtotal)

  const generateWhatsAppMessage = () => {
    if (!whatsappNumber) return "#"
    
    const itemsList = cartItems.map(item => {
      const price = item.salePrice || item.price
      const total = price * item.quantity
      return `• ${item.name} (${item.quantity} x ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(price)}) = ${new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(total)}`
    }).join("\n")

    const message = `Hi ${storeName || 'there'}! I'd like to place an order:\n\n${itemsList}\n\n*Subtotal:* ${formattedSubtotal}\n\nPlease confirm availability and provide payment details.`

    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  }

  if (!mounted) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed top-0 right-0 h-full w-full sm:w-96 z-50 overflow-hidden",
              darkMode ? "dark" : ""
            )}
          >
            <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl border-l border-gray-200 dark:border-gray-800">
              {/* Header */}
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <h2 className="font-medium text-gray-900 dark:text-white">
                    Your Cart ({cartItems.reduce((total, item) => total + item.quantity, 0)})
                  </h2>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  onClick={onClose}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4 px-4">
                {cartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-4">
                    <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
                      <ShoppingBag className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Your cart is empty</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Looks like you haven't added any products to your cart yet.
                    </p>
                    <Button 
                      className="bg-green-600 hover:bg-green-700 text-white rounded-full" 
                      onClick={onClose}
                    >
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {cartItems.map((item) => {
                      const itemPrice = item.salePrice || item.price
                      const itemTotal = itemPrice * item.quantity
                      const formattedPrice = new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(itemPrice)
                      const formattedTotal = new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "USD",
                      }).format(itemTotal)

                      return (
                        <li key={item.id} className="py-4">
                          <div className="flex gap-4">
                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 dark:border-gray-700">
                              <Image
                                src={item.image || "/placeholder.svg?height=80&width=80"}
                                alt={item.name}
                                width={80}
                                height={80}
                                className="h-full w-full object-cover"
                              />
                            </div>
                            <div className="flex flex-1 flex-col">
                              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                <h3 className="line-clamp-2">{item.name}</h3>
                                <p className="ml-4">{formattedTotal}</p>
                              </div>
                              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{item.category}</p>
                              <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-full">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                  >
                                    <Minus className="h-3 w-3" />
                                    <span className="sr-only">Decrease quantity</span>
                                  </Button>
                                  <span className="w-8 text-center text-sm text-gray-500">{item.quantity}</span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                  >
                                    <Plus className="h-3 w-3" />
                                    <span className="sr-only">Increase quantity</span>
                                  </Button>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 rounded-full text-gray-500 dark:text-gray-400 hover:text-red-500"
                                  onClick={() => removeItem(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                  <span className="sr-only">Remove item</span>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </div>

              {/* Footer */}
              {cartItems.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white mb-4">
                    <p>Subtotal</p>
                    <p>{formattedSubtotal}</p>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    Shipping and taxes calculated at checkout.
                  </p>
                  <div className="flex flex-col gap-3">
                    <Button 
                      asChild
                      className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full"
                    >
                      <a 
                        href={generateWhatsAppMessage()} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={() => {
                          // Optionally clear cart after order
                          // clearCart()
                          // onClose()
                        }}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Order via WhatsApp
                      </a>
                    </Button>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        className="flex-1 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
                        onClick={clearCart}
                      >
                        Clear Cart
                      </Button>
                      <Button
                        variant="link"
                        className="flex-1 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-500"
                        onClick={onClose}
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}