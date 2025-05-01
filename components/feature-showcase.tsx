"use client"

import { useRef } from "react"
import { useInView } from "framer-motion"
import {
  BarChart3,
  ImageIcon,
  MessageCircle,
  PaintBucket,
  ShoppingBag,
  Smartphone,
  CreditCard,
  Share2,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

const features = [
  {
    icon: ImageIcon,
    title: "Easy Product Upload",
    description: "Add products with photos, prices, and descriptions in seconds using just your phone",
  },
  {
    icon: ShoppingBag,
    title: "Instant Catalog",
    description: "Get your own storefront URL (yourstore.whatsbuy.in) that works on all devices",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Ordering",
    description: "Customers can order with one click through pre-filled WhatsApp messages",
  },
  {
    icon: BarChart3,
    title: "Order Dashboard",
    description: "Track all your orders, messages, and customer interactions in one place",
  },
  {
    icon: CreditCard,
    title: "Payment Options",
    badge: "Coming Soon",
    description: "Accept payments via Razorpay or Cash on Delivery - you choose what works for you",
  },
  {
    icon: PaintBucket,
    title: "Storefront Themes",
    description: "Choose from beautiful templates that match your brand and products",
  },
  {
    icon: Share2,
    title: "Social Integration",
    description: "Connect with Instagram, Facebook, and Telegram to reach more customers",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Everything works perfectly on mobile - for both you and your customers",
  },
]

export default function FeatureShowcase() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  }

  return (
    <div ref={containerRef} className="py-12">
      <motion.div 
        className="mx-auto grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
        variants={container}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        {features.map((feature, index) => (
          <motion.div 
            key={index} 
            className="group relative flex flex-col space-y-4 rounded-2xl border bg-background p-6 transition-all hover:shadow-md"
            variants={item}
          >
            {/* Decorative gradient background */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-emerald-50/50 via-transparent to-transparent dark:from-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>
            
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400 group-hover:bg-emerald-200 dark:group-hover:bg-emerald-900/30 transition-colors">
              <feature.icon className="h-6 w-6" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold">{feature.title}</h3>
              {feature.badge && (
                <Badge className="mt-1 mb-2 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 hover:bg-emerald-200 dark:hover:bg-emerald-900/60">
                  {feature.badge}
                </Badge>
              )}
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
            
            <div className="mt-auto pt-4">
              <div className="h-1 w-12 bg-emerald-100 dark:bg-emerald-800/50 rounded-full overflow-hidden group-hover:w-full transition-all duration-500">
                <div className="h-full w-1/2 bg-emerald-500 dark:bg-emerald-500/70 rounded-full"></div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}