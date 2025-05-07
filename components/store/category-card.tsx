"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Leaf } from "lucide-react"
import { cn } from "@/lib/utils"

export default function CategoryCard({ category, storeSlug, isDarkMode = false }) {
  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.3 }}>
      <Link href={`/store/${storeSlug}?category=${encodeURIComponent(category)}`} className="group block">
        <div
          className={cn(
            "aspect-square rounded-xl flex items-center justify-center overflow-hidden transition-all duration-300 hover:shadow-md border",
            isDarkMode
              ? "bg-gray-800 border-gray-700 hover:border-gray-600"
              : "bg-white border-[#e4dbc8] hover:border-[#d6c9a9]",
          )}
        >
          <div className="text-center p-4">
            <div
              className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300",
                isDarkMode ? "bg-gray-700 group-hover:bg-gray-600" : "bg-[#e4dbc8] group-hover:bg-[#d6c9a9]",
              )}
            >
              <CategoryIcon category={category} isDarkMode={isDarkMode} />
            </div>
            <h3 className={cn("font-medium", isDarkMode ? "text-white" : "text-[#3a523f]")}>{category}</h3>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// Helper component for category icons
function CategoryIcon({ category, isDarkMode = false }) {
  const iconColor = isDarkMode ? "text-green-500" : "text-[#5c8d67]"
  const accentColor = isDarkMode ? "text-yellow-500" : "text-[#d4a24e]"

  switch (category.toLowerCase()) {
    case "fruits":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={accentColor}
        >
          <path d="M17.5 6.5c.5 0 .9.4.9.9 0 2.5-2.4 4.5-5.4 4.5-2.5 0-4.6-1.5-5.2-3.5" />
          <path d="M14.5 4.5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
          <path d="M7 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2" />
          <path d="M14.5 14c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
        </svg>
      )
    case "vegetables":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconColor}
        >
          <path d="M2 22s10-4 20-4V4s-10 4-20 4Z" />
        </svg>
      )
    case "dairy":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconColor}
        >
          <path d="M8 2h8" />
          <path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2" />
        </svg>
      )
    case "bakery":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={accentColor}
        >
          <path d="M6 12h.01" />
          <path d="M2 8h20" />
          <path d="M2 20h20" />
          <path d="M2 14h.01" />
          <path d="M18 14h.01" />
          <path d="M10 14h.01" />
          <path d="M14 14h.01" />
          <path d="M6 18h.01" />
          <path d="M18 18h.01" />
          <path d="M10 18h.01" />
          <path d="M14 18h.01" />
          <path d="M20 4v.01" />
          <path d="M16 4v.01" />
          <path d="M12 4v.01" />
          <path d="M8 4v.01" />
          <path d="M4 4v.01" />
        </svg>
      )
    case "snacks":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={accentColor}
        >
          <path d="M12 2a9.96 9.96 0 0 0-7.071 2.929A9.96 9.96 0 0 0 2 12c0 5.523 4.477 10 10 10a9.96 9.96 0 0 0 7.071-2.929A9.96 9.96 0 0 0 22 12c0-5.523-4.477-10-10-10Z" />
          <path d="M12 6v12" />
          <path d="M6 12h12" />
        </svg>
      )
    case "beverages":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={iconColor}
        >
          <path d="M8 2h8" />
          <path d="M12 6v12" />
          <path d="M4 14c0 2.5 2 4 4 4" />
          <path d="M16 14c0 2.5 2 4 4 4" />
          <path d="M4 14v-3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
        </svg>
      )
    default:
      return <Leaf className={cn("h-6 w-6", iconColor)} />
  }
}
