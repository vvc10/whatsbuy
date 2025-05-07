"use client"

import { useState } from "react"
import { Share2, Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface StoreShareButtonProps {
  storeSlug: string
  storeName: string
  darkMode: boolean
}

export default function StoreShareButton({ storeSlug, storeName, darkMode }: StoreShareButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = () => {
    const url = `${window.location.origin}/store/${storeSlug}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/store/${storeSlug}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: storeName,
          text: `Check out ${storeName} on WhatsBuy.in`,
          url,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {
      handleCopyLink()
    }
  }

  return (
    <>
      {navigator.share ? (
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full text-gray-200"
          onClick={handleShare}
          aria-label="Share"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Share"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className={cn(darkMode ? "dark" : "")}>
            <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer gap-2">
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-green-600" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  <span>Copy link</span>
                </>
              )}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </>
  )
}
