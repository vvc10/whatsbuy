"use client"

import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  enableSystem?: boolean
  disableTransitionOnChange?: boolean
  attribute?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "system",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
  enableSystem = true,
  disableTransitionOnChange = true,
  attribute = "data-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system" && enableSystem) {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      root.classList.add(systemTheme)
      root.style.colorScheme = systemTheme
      root.setAttribute(attribute, systemTheme)
    } else {
      root.classList.add(theme)
      root.style.colorScheme = theme
      root.setAttribute(attribute, theme)
    }

    return () => {
      root.classList.remove(theme, "light", "dark")
      root.style.colorScheme = ""
      root.removeAttribute(attribute)
    }
  }, [theme, enableSystem, attribute])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      if (disableTransitionOnChange) {
        document.documentElement.classList.add("[&_*]:!transition-none")
        setTimeout(() => document.documentElement.classList.remove("[&_*]:!transition-none"), 0)
      }
      setTheme(theme)
      localStorage.setItem(storageKey, theme)
    },
  }

  return (
    <ThemeProviderContext.Provider value={value} {...props}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}