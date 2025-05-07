"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NewsletterForm({ isDarkMode = false }) {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // In a real implementation, you would send the email to your backend
    setIsSubmitted(true)
  }

  return (
    <div className="max-w-md mx-auto">
      {isSubmitted ? (
        <div className={cn("rounded-lg p-4 text-center", isDarkMode ? "bg-green-900/30" : "bg-green-50")}>
          <p className={cn("font-medium", isDarkMode ? "text-green-400" : "text-green-700")}>
            Thank you for subscribing!
          </p>
          <p className={cn("text-sm mt-1", isDarkMode ? "text-green-500/70" : "text-green-600")}>
            We've sent a confirmation email to your inbox.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <Input
            type="email"
            placeholder="Your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={cn(
              "rounded-full h-12",
              isDarkMode
                ? "bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-400 focus-visible:ring-[#d4a24e]"
                : "bg-white/10 border-transparent text-white placeholder:text-white/60 focus-visible:ring-[#d4a24e]",
            )}
          />
          <Button
            type="submit"
            className="bg-[#d4a24e] hover:bg-[#c08e3a] text-white rounded-full h-12 px-8 font-medium"
          >
            Subscribe
          </Button>
        </form>
      )}
    </div>
  )
}
