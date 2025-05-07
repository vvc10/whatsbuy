"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MessageCircle, Star, Search, Leaf, Menu, ShoppingCart, ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

// Product Card Component for Preview
const PreviewProductCard = ({ product, darkMode }) => {
  return (
    <div
      className={`group rounded-xl border overflow-hidden transition-all hover:shadow-md ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}
    >
      <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-900">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <div className="absolute bottom-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity">
          <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100">
            <ShoppingCart className="h-4 w-4 mr-1" /> Add
          </Button>
          <Button size="sm" variant="outline" className="bg-white text-gray-900 hover:bg-gray-100">
            View
          </Button>
        </div>
      </div>
      <div className="p-4">
        <h3 className={`font-medium line-clamp-1 ${darkMode ? "text-white" : "text-gray-900"}`}>{product.name}</h3>
        <div className="flex items-center justify-between mt-1">
          <p className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>${product.price.toFixed(2)}</p>
          <div className="flex items-center">
            <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
            <span className={`text-xs ml-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{product.rating}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StorePreview({
  store,
  products,
  featuredProducts,
  categories,
  testimonials,
  whatsappChatLink,
}) {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div
      className={`flex min-h-full flex-col ${
        darkMode
          ? "bg-gradient-to-b from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-b from-gray-50 to-white text-gray-900"
      } transition-colors duration-300`}
      style={{ fontSize: "80%" }}
    >
      <main className="flex-1 container mx-auto max-w-6xl px-4 py-4">
        {/* Hero Banner */}
        {store.show_banner !== false && (
          <section className="mb-6">
            <div className="relative h-[200px] rounded-xl overflow-hidden bg-gray-900 dark:bg-gray-800">
              {store.banner_url ? (
                <Image
                  src={store.banner_url || "/placeholder.svg"}
                  alt={store.name}
                  fill
                  className="object-cover opacity-90"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-400" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

              <div className="absolute inset-0 flex items-end justify-end p-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex flex-row items-center gap-2"
                >
                  <Button variant="ghost" size="icon" className="rounded-full text-gray-300 hover:bg-gray-800/50">
                    <Search className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative rounded-full text-gray-300 hover:bg-gray-800/50"
                  >
                    <ShoppingBag className="h-4 w-4" />
                  </Button>

                  <Button variant="ghost" size="icon" className="rounded-full text-gray-300 hover:bg-gray-800/50">
                    <Menu className="h-4 w-4" />
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Store Profile */}
        <section className="mb-6">
          <div
            className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} rounded-xl shadow-sm border p-4`}
          >
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <Avatar className={`h-16 w-16 border-2 ${darkMode ? "border-gray-800" : "border-white"} shadow-md`}>
                {store.logo_url ? (
                  <AvatarImage src={store.logo_url || "/placeholder.svg"} alt={store.name} />
                ) : (
                  <AvatarFallback
                    className={`${darkMode ? "bg-green-900 text-green-300" : "bg-green-50 text-green-700"}`}
                  >
                    <Leaf className="h-6 w-6" />
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="flex-1 text-center sm:text-left">
                <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-1`}>{store.name}</h2>
                <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-2 text-sm max-w-2xl`}>
                  {store.description ||
                    "Welcome to our organic food store. We offer fresh, locally-sourced organic products."}
                </p>

                <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-0.5 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-amber-500" />
                      ))}
                    </div>
                    <span className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}>5.0</span>
                  </div>

                  <Badge
                    variant="outline"
                    className={`text-xs ${darkMode ? "text-gray-300 border-gray-600" : "text-gray-700 border-gray-300"}`}
                  >
                    Organic
                  </Badge>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {whatsappChatLink && (
                  <Button
                    size="sm"
                    className="bg-green-600 hover:bg-green-700 text-white rounded-full shadow-sm text-xs"
                  >
                    <MessageCircle className="mr-1 h-3 w-3" /> Chat
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Products Section */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>Our Products</h2>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-xs`}>
                {products.length} organic products available
              </p>
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-hide">
              <Button
                variant="default"
                size="sm"
                className="rounded-full bg-green-600 hover:bg-green-700 text-white text-xs py-1 h-7"
              >
                All
              </Button>

              {categories.slice(0, 3).map((category) => (
                <Button
                  key={category}
                  variant="outline"
                  size="sm"
                  className={`rounded-full whitespace-nowrap text-xs py-1 h-7 ${
                    darkMode ? "border-gray-600" : "border-gray-300"
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {products.slice(0, 4).map((product) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PreviewProductCard product={product} darkMode={darkMode} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Newsletter */}
        <section className="mb-6">
          <div
            className={`bg-gradient-to-r ${
              darkMode
                ? "from-green-900/20 to-emerald-900/20 border-gray-700"
                : "from-green-50 to-emerald-50 border-gray-200"
            } rounded-xl shadow-sm border p-4`}
          >
            <div className="max-w-3xl mx-auto text-center">
              <h2 className={`text-lg font-bold ${darkMode ? "text-white" : "text-gray-900"} mb-2`}>
                Join Our Newsletter
              </h2>
              <p className={`${darkMode ? "text-gray-300" : "text-gray-600"} mb-3 text-xs max-w-lg mx-auto`}>
                Subscribe to get updates on new organic products and exclusive offers
              </p>

              <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <Input
                  placeholder="Your email address"
                  className={`rounded-full ${
                    darkMode ? "border-gray-600 bg-gray-800 text-white" : "border-gray-300 bg-white"
                  } text-xs h-8`}
                />
                <Button className="rounded-full bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                  Subscribe
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className={`${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"} py-4`}>
        <div className="container mx-auto max-w-6xl px-4">
          <div className="max-w-3xl mx-auto pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-center gap-2">
            <p className={`${darkMode ? "text-gray-400" : "text-gray-600"} text-xs`}>
              © {new Date().getFullYear()} {store.name}. All rights reserved.
            </p>

            {store.show_powered_by !== false && (
              <p className={`${darkMode ? "text-gray-500" : "text-gray-500"} text-xs`}>
                Powered by{" "}
                <span className={`font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>WhatsBuy.in</span>
              </p>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
