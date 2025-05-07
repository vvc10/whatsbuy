"use client"

import Link from "next/link"
import { MessageCircle, Instagram, Facebook, Twitter } from "lucide-react"
import { cn } from "@/lib/utils"

export default function MobileNav({ store, categories, whatsappChatLink, isDarkMode = false }) {
  return (
    <div className="mt-6 space-y-6">
      <div>
        <h3 className={cn("text-sm font-medium mb-3", isDarkMode ? "text-gray-300" : "text-[#3a523f]")}>Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={`/store/${store.slug}?category=${encodeURIComponent(category)}`}
              className={cn(
                "block py-2 transition-colors",
                isDarkMode ? "text-gray-400 hover:text-white" : "text-[#5c8d67] hover:text-[#3a523f]",
              )}
            >
              {category}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h3 className={cn("text-sm font-medium mb-3", isDarkMode ? "text-gray-300" : "text-[#3a523f]")}>Quick Links</h3>
        <div className="space-y-2">
          {store.footer_links?.about_us !== false && (
            <Link
              href={`/store/${store.slug}/about`}
              className={cn(
                "block py-2 transition-colors",
                isDarkMode ? "text-gray-400 hover:text-white" : "text-[#5c8d67] hover:text-[#3a523f]",
              )}
            >
              About Us
            </Link>
          )}
          {store.footer_links?.contact !== false && (
            <Link
              href={`/store/${store.slug}/contact`}
              className={cn(
                "block py-2 transition-colors",
                isDarkMode ? "text-gray-400 hover:text-white" : "text-[#5c8d67] hover:text-[#3a523f]",
              )}
            >
              Contact
            </Link>
          )}
          {whatsappChatLink && (
            <Link
              href={whatsappChatLink}
              target="_blank"
              className={cn(
                "block py-2 transition-colors",
                isDarkMode ? "text-gray-400 hover:text-white" : "text-[#5c8d67] hover:text-[#3a523f]",
              )}
            >
              <MessageCircle className="h-4 w-4 inline-block mr-2" />
              Chat with Us
            </Link>
          )}
        </div>
      </div>
      {store.show_social_icons !== false && (
        <div className={cn("pt-6 border-t", isDarkMode ? "border-gray-800" : "border-[#e4dbc8]")}>
          <div className="flex gap-4">
            <Link
              href="https://instagram.com"
              target="_blank"
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center",
                isDarkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "bg-[#e4dbc8] text-[#5c8d67] hover:bg-[#d6c9a9]",
              )}
            >
              <Instagram className="h-5 w-5" />
            </Link>
            <Link
              href="https://facebook.com"
              target="_blank"
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center",
                isDarkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "bg-[#e4dbc8] text-[#5c8d67] hover:bg-[#d6c9a9]",
              )}
            >
              <Facebook className="h-5 w-5" />
            </Link>
            <Link
              href="https://twitter.com"
              target="_blank"
              className={cn(
                "h-10 w-10 rounded-full flex items-center justify-center",
                isDarkMode
                  ? "bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white"
                  : "bg-[#e4dbc8] text-[#5c8d67] hover:bg-[#d6c9a9]",
              )}
            >
              <Twitter className="h-5 w-5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
