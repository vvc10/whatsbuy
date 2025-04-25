"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

interface WhatsAppButtonProps {
  phoneNumber: string
  message: string
  className?: string
  children?: React.ReactNode
}

export default function WhatsAppButton({ phoneNumber, message, className, children }: WhatsAppButtonProps) {
  // Format phone number (remove any non-digit characters)
  const formattedPhone = phoneNumber.replace(/\D/g, "")

  // Encode message for URL
  const encodedMessage = encodeURIComponent(message)

  // Generate WhatsApp URL
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`

  return (
    <Button
      className={`bg-emerald-600 hover:bg-emerald-700 ${className}`}
      onClick={() => window.open(whatsappUrl, "_blank")}
    >
      {children || (
        <>
          <MessageCircle className="mr-2 h-4 w-4" />
          Chat on WhatsApp
        </>
      )}
    </Button>
  )
}
