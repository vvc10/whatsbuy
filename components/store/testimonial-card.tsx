"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Star, Quote } from "lucide-react"
import { cn } from "@/lib/utils"

export default function TestimonialCard({ testimonial, isDarkMode = false }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "p-6 rounded-xl transition-all duration-300 hover:shadow-md border",
        isDarkMode
          ? "bg-gray-800 border-gray-700 hover:border-gray-600"
          : "bg-white border-[#e4dbc8] hover:border-[#d6c9a9]",
      )}
    >
      <div className="relative">
        <Quote
          className={cn("absolute -top-2 -left-2 h-8 w-8 opacity-20", isDarkMode ? "text-gray-500" : "text-[#5c8d67]")}
        />

        <div className="flex items-center gap-4 mb-6">
          <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-[#e4dbc8]">
            <Image
              src={testimonial.avatar || "/placeholder.svg?height=48&width=48"}
              alt={testimonial.name}
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className={cn("font-medium", isDarkMode ? "text-white" : "text-[#3a523f]")}>{testimonial.name}</p>
            <div className="flex text-[#d4a24e]">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-[#d4a24e]" />
              ))}
            </div>
          </div>
        </div>

        <p className={cn("leading-relaxed", isDarkMode ? "text-gray-300" : "text-[#5c8d67]")}>{testimonial.text}</p>
      </div>
    </motion.div>
  )
}
