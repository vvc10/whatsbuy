"use client"

import { useState, useEffect } from "react"
import { Globe } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { type Locale, locales, defaultLocale } from "@/lib/i18n"

export default function LanguageSelector() {
  const [currentLocale, setCurrentLocale] = useState<Locale>(defaultLocale)

  // Load saved locale from localStorage on component mount
  useEffect(() => {
    const savedLocale = localStorage.getItem("locale") as Locale
    if (savedLocale && Object.keys(locales).includes(savedLocale)) {
      setCurrentLocale(savedLocale)
    }
  }, [])

  const handleLanguageChange = (locale: Locale) => {
    setCurrentLocale(locale)
    localStorage.setItem("locale", locale)
    // In a real app, you would update the app's locale context here
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-1 bg-white">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">{locales[currentLocale].split(" ")[0]}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.entries(locales).map(([code, name]) => (
          <DropdownMenuItem key={code} onClick={() => handleLanguageChange(code as Locale)} className="cursor-pointer">
            {name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
