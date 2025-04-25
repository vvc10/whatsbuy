"use client"

import { useState } from "react"
import Link from "next/link"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface FloatingWhatsAppButtonProps {
  whatsappNumber: string
  storeName: string
  whatsappChatLink: string
}

export default function FloatingWhatsAppButton({ whatsappNumber, storeName, whatsappChatLink }: FloatingWhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
  }
 
  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg z-50"
        >
          {isOpen ? <X className="h-6 w-6 text-white" /> : <MessageCircle className="h-6 w-6 text-white" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent side="top" align="end" className="w-80 p-0 border-none shadow-xl">
        <div className="bg-green-500 text-white p-4 rounded-t-lg">
          <h3 className="font-bold text-lg">Chat with {storeName}</h3>
          <p className="text-sm opacity-90">We typically reply within minutes</p>
        </div>
        <div className="p-4 bg-white rounded-b-lg">
          <p className="text-sm text-gray-600 mb-4">
            Hi there! 👋 How can we help you today? Click the button below to start a conversation.
          </p>
          <Button className="w-full bg-green-500 hover:bg-green-600" asChild>
            <Link href={whatsappChatLink} target="_blank">
              <MessageCircle className="mr-2 h-4 w-4" />
              Start Chat
            </Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
