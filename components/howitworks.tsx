"use client"

import { ShoppingBag, Link as LinkIcon, Share2 } from "lucide-react"
import { useEffect } from "react"

export function HowItWorks() {
  // Add animation styles dynamically
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      @keyframes shimmer {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }
    `
    document.head.appendChild(style)
    return () => document.head.removeChild(style)
  }, [])

  return (
    <div className="relative mt-16 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Animated connecting line */}
      <div className="absolute top-16 left-[16.666%] right-[16.666%] h-0.5 bg-gradient-to-r from-emerald-200 via-emerald-400 to-emerald-200 dark:from-emerald-800 dark:via-emerald-700 dark:to-emerald-800 hidden md:block overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/90 to-transparent animate-[shimmer_2s_infinite]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 relative">
        {[
          {
            step: 1,
            title: "Upload Products",
            description: "Add photos, prices, and descriptions of your products using just your phone",
            icon: <ShoppingBag className="h-5 w-5" />,
            delay: 0.1
          },
          {
            step: 2,
            title: "Get Your Store Link",
            description: "Receive your custom store URL (yourstore.whatsbuy.in) instantly",
            icon: <LinkIcon className="h-5 w-5" />,
            delay: 0.3
          },
          {
            step: 3,
            title: "Share & Sell",
            description: "Share your store link on WhatsApp, Instagram, Facebook and start receiving orders",
            icon: <Share2 className="h-5 w-5" />,
            delay: 0.5
          },
        ].map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center space-y-4 rounded-xl border bg-white dark:bg-gray-900 p-6 text-center transition-all hover:shadow-lg hover:-translate-y-1 relative group overflow-hidden"
            style={{
              animation: `fadeInUp 0.5s ease-out ${item.delay}s forwards`,
              opacity: 0
            }}
          >
            {/* Gradient border effect */}
            <div className="absolute inset-0 rounded-xl p-px bg-gradient-to-br from-emerald-400/30 via-emerald-600/20 to-green-400/30 dark:from-emerald-600/30 dark:via-emerald-800/20 dark:to-green-600/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Step indicator */}
            <span className="absolute -top-3 left-0 right-0 text-xs font-medium text-gray-500 dark:text-gray-400">
              Step {item.step}
            </span>
            
            {/* Animated icon container */}
            <div className="relative group-hover:[&>div]:opacity-100">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-900/80 dark:text-emerald-400 ring-8 ring-white dark:ring-gray-900 z-10 transition-transform duration-300 group-hover:scale-110">
                {item.icon}
              </div>
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 dark:from-emerald-600 dark:to-green-600 opacity-70 blur-md group-hover:opacity-90 transition-all duration-500" />
            </div>
            
            {/* Content */}
            <h3 className="text-xl font-bold bg-gradient-to-br from-gray-900 to-emerald-600 bg-clip-text text-transparent dark:from-emerald-100 dark:to-emerald-400">
              {item.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              {item.description}
            </p>
            
            {/* Step number decoration */}
            <div className="absolute -bottom-4 -right-4 text-[80px] font-bold text-emerald-50 dark:text-emerald-900/30 z-0 select-none">
              {item.step}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}