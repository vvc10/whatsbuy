"use client"

import { cn } from "@/lib/utils"

interface CategoryButtonProps {
  category: string
  isActive: boolean
  onClick: () => void
  darkMode: boolean
}

export default function CategoryButton({ category, isActive, onClick, darkMode }: CategoryButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
        isActive
          ? "bg-green-600 text-white"
          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700",
      )}
    >
      {category}
    </button>
  )
}
