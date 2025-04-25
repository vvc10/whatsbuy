"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface ThemeContextType {
  theme: string
  primaryColor: string
  activeCategory: string | null
  setActiveCategory: (category: string | null) => void
  categoryFont?: string
  categoryButtonStyle?: string
  categoryCardShadow?: string
  categoryBorderStyle?: string
  categoryTransition?: string
  headerShadow?: string
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "default",
  primaryColor: "#059669",
  activeCategory: null,
  setActiveCategory: () => {},
  categoryFont: undefined,
  categoryButtonStyle: undefined,
  categoryCardShadow: undefined,
  categoryBorderStyle: undefined,
  categoryTransition: undefined,
  headerShadow: undefined,
})

export const useStoreTheme = () => useContext(ThemeContext)

interface StoreThemeProviderProps {
  children: ReactNode
  theme: string
  primaryColor: string
  categoryFont?: string
  categoryButtonStyle?: string
  categoryCardShadow?: string
  categoryBorderStyle?: string
  categoryTransition?: string
  headerShadow?: string
}

export default function StoreThemeProvider({
  children,
  theme,
  primaryColor,
  categoryFont,
  categoryButtonStyle,
  categoryCardShadow,
  categoryBorderStyle,
  categoryTransition,
  headerShadow,
}: StoreThemeProviderProps) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [mountedTheme, setMountedTheme] = useState(theme)

  // Update mounted theme when prop changes
  useEffect(() => {
    setMountedTheme(theme)
  }, [theme])

  // Define category-specific styles with a minimalist approach
  const getCategoryStyles = (category: string | null) => {
    if (!category || category === "all") return {}

    switch (category.toLowerCase()) {
      case "electronics":
        return {
          "--category-accent": "210, 90%, 50%", // Vibrant blue
          "--category-bg": "210, 30%, 98%",
          "--category-card-radius": "0.5rem",
          "--category-card-shadow": "0 2px 10px rgba(0, 30, 60, 0.04)",
          "--category-font": "'SF Pro Display', system-ui, sans-serif",
          "--category-spacing": "1.5rem",
          "--category-transition": "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "--category-card-hover": "translateY(-4px)",
          "--category-border-style": "1px solid rgba(0, 0, 0, 0.05)",
          "--category-button-style": "0.25rem",
        }
      case "clothing":
      case "fashion":
      case "apparel":
        return {
          "--category-accent": "340, 82%, 52%", // Refined pink
          "--category-bg": "340, 20%, 99%",
          "--category-card-radius": "0rem", // Sharp edges for fashion
          "--category-card-shadow": "none",
          "--category-font": "'Playfair Display', serif",
          "--category-spacing": "2rem",
          "--category-transition": "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "--category-card-hover": "scale(1.02)",
          "--category-border-style": "1px solid rgba(0, 0, 0, 0.08)",
          "--category-button-style": "0rem",
        }
      case "home":
      case "furniture":
      case "decor":
        return {
          "--category-accent": "35, 80%, 55%", // Warm orange
          "--category-bg": "35, 20%, 99%",
          "--category-card-radius": "0.75rem",
          "--category-card-shadow": "0 2px 8px rgba(50, 30, 0, 0.04)",
          "--category-font": "'Cardo', serif",
          "--category-spacing": "1.75rem",
          "--category-transition": "all 0.25s ease-out",
          "--category-card-hover": "translateY(-2px)",
          "--category-border-style": "1px solid rgba(120, 80, 0, 0.06)",
          "--category-button-style": "0.5rem",
        }
      case "beauty":
      case "cosmetics":
        return {
          "--category-accent": "320, 80%, 60%", // Soft pink
          "--category-bg": "320, 20%, 99%",
          "--category-card-radius": "1rem",
          "--category-card-shadow": "0 4px 12px rgba(100, 0, 50, 0.03)",
          "--category-font": "'Cormorant Garamond', serif",
          "--category-spacing": "1.5rem",
          "--category-transition": "all 0.3s ease",
          "--category-card-hover": "scale(1.01)",
          "--category-border-style": "1px solid rgba(180, 100, 140, 0.06)",
          "--category-button-style": "1rem",
        }
      case "food":
      case "grocery":
        return {
          "--category-accent": "120, 90%, 35%", // Fresh green
          "--category-bg": "120, 20%, 99%",
          "--category-card-radius": "0.5rem",
          "--category-card-shadow": "0 2px 8px rgba(0, 50, 0, 0.03)",
          "--category-font": "'Nunito', sans-serif",
          "--category-spacing": "1.25rem",
          "--category-transition": "all 0.2s ease-in-out",
          "--category-card-hover": "translateY(-3px)",
          "--category-border-style": "1px solid rgba(0, 100, 0, 0.05)",
          "--category-button-style": "0.5rem",
        }
      case "books":
      case "stationery":
        return {
          "--category-accent": "200, 70%, 50%", // Scholarly blue
          "--category-bg": "200, 20%, 99%",
          "--category-card-radius": "0.25rem",
          "--category-card-shadow": "0 1px 5px rgba(0, 40, 80, 0.04)",
          "--category-font": "'Merriweather', serif",
          "--category-spacing": "1.5rem",
          "--category-transition": "all 0.2s ease",
          "--category-card-hover": "translateY(-2px)",
          "--category-border-style": "1px solid rgba(0, 60, 120, 0.06)",
          "--category-button-style": "0.25rem",
        }
      case "sports":
      case "fitness":
        return {
          "--category-accent": "210, 100%, 50%", // Energetic blue
          "--category-bg": "210, 20%, 99%",
          "--category-card-radius": "0.5rem",
          "--category-card-shadow": "0 3px 10px rgba(0, 40, 100, 0.05)",
          "--category-font": "'Montserrat', sans-serif",
          "--category-spacing": "1.5rem",
          "--category-transition": "all 0.15s ease-in-out",
          "--category-card-hover": "translateY(-4px)",
          "--category-border-style": "1px solid rgba(0, 80, 180, 0.06)",
          "--category-button-style": "0.5rem",
        }
      case "accessories":
        return {
          "--category-accent": "280, 80%, 50%", // Purple
          "--category-bg": "280, 20%, 99%",
          "--category-card-radius": "0.75rem",
          "--category-card-shadow": "0 2px 8px rgba(60, 0, 80, 0.04)",
          "--category-font": "'DM Sans', sans-serif",
          "--category-spacing": "1.5rem",
          "--category-transition": "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
          "--category-card-hover": "scale(1.02)",
          "--category-border-style": "1px solid rgba(100, 0, 150, 0.05)",
          "--category-button-style": "0.75rem",
        }
      default:
        return {
          "--category-accent": "0, 0%, 0%", // Default black
          "--category-bg": "0, 0%, 100%",
          "--category-card-radius": "0.5rem",
          "--category-card-shadow": "0 1px 3px rgba(0, 0, 0, 0.05)",
          "--category-font": "inherit",
          "--category-spacing": "1.5rem",
          "--category-transition": "all 0.2s ease",
          "--category-card-hover": "translateY(-2px)",
          "--category-border-style": "1px solid rgba(0, 0, 0, 0.05)",
          "--category-button-style": "0.5rem",
        }
    }
  }

  // Define theme-specific styles with a minimalist approach
  const getThemeStyles = () => {
    switch (mountedTheme) {
      case "grocery":
        return {
          "--primary": "120, 90%, 35%", // Fresh green
          "--primary-foreground": "0, 0%, 100%",
          "--background": "0, 0%, 100%",
          "--card-bg": "0, 0%, 100%",
          "--font-family": "'Nunito', sans-serif",
          "--border-radius": "0.5rem",
          "--header-shadow": "0 1px 2px rgba(0, 0, 0, 0.03)",
          "--card-shadow": "0 2px 8px rgba(0, 0, 0, 0.03)",
          "--transition-speed": "0.2s",
          "--spacing-unit": "1.25rem",
          "--text-primary": "0, 0%, 10%",
          "--text-secondary": "0, 0%, 40%",
          "--border-color": "0, 0%, 90%",
          "--hover-effect": "translateY(-2px)",
        }
      case "fashion":
        return {
          "--primary": "340, 82%, 52%", // Refined pink
          "--primary-foreground": "0, 0%, 100%",
          "--background": "0, 0%, 100%",
          "--card-bg": "0, 0%, 100%",
          "--font-family": "'Playfair Display', serif",
          "--border-radius": "0rem", // Sharp edges for fashion
          "--header-shadow": "none",
          "--card-shadow": "none",
          "--transition-speed": "0.3s",
          "--spacing-unit": "2rem",
          "--text-primary": "0, 0%, 5%",
          "--text-secondary": "0, 0%, 35%",
          "--border-color": "0, 0%, 85%",
          "--hover-effect": "scale(1.02)",
        }
      case "electronics":
        return {
          "--primary": "210, 90%, 50%", // Vibrant blue
          "--primary-foreground": "0, 0%, 100%",
          "--background": "0, 0%, 100%",
          "--card-bg": "0, 0%, 100%",
          "--font-family": "'SF Pro Display', system-ui, sans-serif",
          "--border-radius": "0.5rem",
          "--header-shadow": "0 1px 2px rgba(0, 0, 0, 0.04)",
          "--card-shadow": "0 2px 10px rgba(0, 0, 0, 0.04)",
          "--transition-speed": "0.15s",
          "--spacing-unit": "1.5rem",
          "--text-primary": "0, 0%, 10%",
          "--text-secondary": "0, 0%, 45%",
          "--border-color": "0, 0%, 92%",
          "--hover-effect": "translateY(-4px)",
        }
      case "minimal":
        return {
          "--primary": "0, 0%, 20%", // Dark gray
          "--primary-foreground": "0, 0%, 100%",
          "--background": "0, 0%, 100%",
          "--card-bg": "0, 0%, 100%",
          "--font-family": "'Inter', sans-serif",
          "--border-radius": "0.25rem",
          "--header-shadow": "0 1px 2px rgba(0, 0, 0, 0.02)",
          "--card-shadow": "0 1px 3px rgba(0, 0, 0, 0.03)",
          "--transition-speed": "0.2s",
          "--spacing-unit": "1.5rem",
          "--text-primary": "0, 0%, 10%",
          "--text-secondary": "0, 0%, 50%",
          "--border-color": "0, 0%, 92%",
          "--hover-effect": "translateY(-2px)",
        }
      case "elegant":
        return {
          "--primary": "25, 90%, 50%", // Rich orange
          "--primary-foreground": "0, 0%, 100%",
          "--background": "0, 0%, 100%",
          "--card-bg": "0, 0%, 100%",
          "--font-family": "'Cormorant Garamond', serif",
          "--border-radius": "0.375rem",
          "--header-shadow": "0 1px 2px rgba(0, 0, 0, 0.03)",
          "--card-shadow": "0 2px 8px rgba(0, 0, 0, 0.03)",
          "--transition-speed": "0.3s",
          "--spacing-unit": "1.75rem",
          "--text-primary": "0, 0%, 8%",
          "--text-secondary": "0, 0%, 40%",
          "--border-color": "0, 0%, 90%",
          "--hover-effect": "scale(1.01)",
        }
      default:
        // Convert hex to HSL
        const r = Number.parseInt(primaryColor.slice(1, 3), 16) / 255
        const g = Number.parseInt(primaryColor.slice(3, 5), 16) / 255
        const b = Number.parseInt(primaryColor.slice(5, 7), 16) / 255
        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        let h = 0
        let s = 0
        const l = (max + min) / 2

        if (max !== min) {
          const d = max - min
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
          switch (max) {
            case r:
              h = (g - b) / d + (g < b ? 6 : 0)
              break
            case g:
              h = (b - r) / d + 2
              break
            case b:
              h = (r - g) / d + 4
              break
          }
          h /= 6
        }

        const hsl = `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`

        return {
          "--primary": hsl,
          "--primary-foreground": "0, 0%, 100%",
          "--background": "0, 0%, 100%",
          "--card-bg": "0, 0%, 100%",
          "--font-family": "'Inter', sans-serif",
          "--border-radius": "0.5rem",
          "--header-shadow": "0 1px 2px rgba(0, 0, 0, 0.03)",
          "--card-shadow": "0 1px 3px rgba(0, 0, 0, 0.04)",
          "--transition-speed": "0.2s",
          "--spacing-unit": "1.5rem",
          "--text-primary": "0, 0%, 10%",
          "--text-secondary": "0, 0%, 45%",
          "--border-color": "0, 0%, 92%",
          "--hover-effect": "translateY(-2px)",
        }
    }
  }

  const themeStyles = getThemeStyles()
  const categoryStyles = getCategoryStyles(activeCategory)

  return (
    <ThemeContext.Provider
      value={{
        theme: mountedTheme,
        primaryColor,
        activeCategory,
        setActiveCategory,
        categoryFont,
        categoryButtonStyle,
        categoryCardShadow,
        categoryBorderStyle,
        categoryTransition,
        headerShadow,
      }}
    >
      <div
        style={
          {
            // Base theme styles
            "--primary": themeStyles["--primary"],
            "--primary-foreground": themeStyles["--primary-foreground"],
            "--background": themeStyles["--background"],
            "--card-bg": themeStyles["--card-bg"],
            "--font-family": themeStyles["--font-family"],
            "--border-radius": themeStyles["--border-radius"],
            "--header-shadow": headerShadow || themeStyles["--header-shadow"],
            "--card-shadow": themeStyles["--card-shadow"],
            "--transition-speed": themeStyles["--transition-speed"],
            "--spacing-unit": themeStyles["--spacing-unit"],
            "--text-primary": themeStyles["--text-primary"],
            "--text-secondary": themeStyles["--text-secondary"],
            "--border-color": themeStyles["--border-color"],
            "--hover-effect": themeStyles["--hover-effect"],

            // Category-specific styles (will override theme styles if present)
            "--category-accent": categoryStyles["--category-accent"] || themeStyles["--primary"],
            "--category-bg": categoryStyles["--category-bg"] || themeStyles["--background"],
            "--category-card-radius": categoryStyles["--category-card-radius"] || themeStyles["--border-radius"],
            "--category-card-shadow":
              categoryCardShadow || categoryStyles["--category-card-shadow"] || themeStyles["--card-shadow"],
            "--category-font": categoryFont || categoryStyles["--category-font"] || themeStyles["--font-family"],
            "--category-spacing": categoryStyles["--category-spacing"] || themeStyles["--spacing-unit"],
            "--category-transition":
              categoryTransition ||
              categoryStyles["--category-transition"] ||
              `all ${themeStyles["--transition-speed"]} ease`,
            "--category-card-hover": categoryStyles["--category-card-hover"] || themeStyles["--hover-effect"],
            "--category-border-style":
              categoryBorderStyle ||
              categoryStyles["--category-border-style"] ||
              `1px solid hsl(${themeStyles["--border-color"]})`,
            "--category-button-style":
              categoryButtonStyle || categoryStyles["--category-button-style"] || themeStyles["--border-radius"],
          } as React.CSSProperties
        }
        className="font-sans transition-colors duration-300 ease-in-out"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  )
}
