"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface FloatingWhatsAppButtonProps {
  whatsappNumber: string
  storeName: string
  whatsappChatLink: string
  darkMode: boolean
}

export default function FloatingWhatsAppButton({
  whatsappNumber,
  storeName,
  whatsappChatLink,
  darkMode,
}: FloatingWhatsAppButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            className={cn(
              "mb-4 p-4 rounded-2xl shadow-lg max-w-xs w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
              darkMode ? "dark" : "",
            )}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium text-gray-900 dark:text-white">Chat with Us</h3>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 rounded-full text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 -mt-1 -mr-1"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Hi there! 👋 Have a question about our organic products? Chat with us on WhatsApp for quick assistance.
            </p>
            <Link href={whatsappChatLink} target="_blank">
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-full">Start Chat</Button>
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="icon"
        className="h-14 w-14 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        <span className="sr-only">WhatsApp Chat</span>
      </Button>
    </div>
  )
}
