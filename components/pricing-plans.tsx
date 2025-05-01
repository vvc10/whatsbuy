"use client"

import { useState } from "react"
import { Check, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import RazorpayButton from "@/components/payment/razorpay-button"

const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "Perfect for testing your WhatsApp store",
    features: [
      "1 Store allowed",
      "Up to 5 products",
      "Basic storefront",
      "1-Click WhatsApp ordering",
      "Order tracking (manual update)",
      "Mobile-friendly catalog",
      "WhatsBuy.in branding"
    ],
    limitations: [
      "No online payment options",
      "No custom domain",
      "Limited analytics"
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Starter",
    price: "₹99",
    period: "/month",
    description: "For early-stage sellers scaling up",
    features: [
      "2 Stores allowed",
      "Up to 15 products per store",
      "Custom storefront themes",
      "WhatsApp & Instagram direct integration",
      "Simple order management dashboard",
      // "Razorpay Payment Link generation",
      "Basic store analytics",
      "Remove WhatsBuy.in branding",
      "WhatsApp Notification Bot (for order confirm)"
    ],
    limitations: [
      "No full custom domain (Coming Soon)",
      "Limited customization options"
    ],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Pro",
    price: "₹199",
    period: "/month",
    description: "For serious sellers who want full control",
    features: [
      "5 Stores allowed",
      "Unlimited products",
      "Advanced custom storefront",
      "WhatsApp, Instagram & Facebook integrations",
      "Custom UPI QR for each product (Pay & Notify)",
      "Order management + basic inventory tracking",
      "Custom domain support (yourstore.com)",
      "Broadcast promotional messages",
      // "Abandoned cart recovery via WhatsApp",
      "Advanced analytics and reports",
      "Priority WhatsApp Support"
    ],
    limitations: [],
    cta: "Go Pro",
    popular: false,
  },
]
export default function PricingPlans() {
  const [billingInterval, setBillingInterval] = useState<"monthly" | "yearly">("monthly")
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Replace with actual auth logic

  return (
    <div className="py-12">
      <div className="flex flex-col items-center justify-center space-y-4 text-center mb-8">
        <div className="inline-flex items-center rounded-full border p-1 mb-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBillingInterval("monthly")}
            className={cn(
              "relative rounded-full px-6",
              billingInterval === "monthly" && "bg-muted text-foreground"
            )}
          >
            Monthly
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setBillingInterval("yearly")}
            className={cn(
              "relative rounded-full px-6",
              billingInterval === "yearly" && "bg-muted text-foreground"
            )}
          >
            <span>Yearly</span>
            <Badge
              className="absolute -top-2 -right-2 bg-emerald-600 hover:bg-emerald-700 px-2 py-0.5 text-xs"
              variant="default"
            >
              Save 20%
            </Badge>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3 lg:gap-8 mx-auto max-w-6xl">
        {plans.map((plan, i) => {
          const price = billingInterval === "yearly" 
            ? parseFloat(plan.price.replace("₹", "")) * 0.8 * 12
            : parseFloat(plan.price.replace("₹", ""))
          
          const formattedPrice = price === 0 ? "₹0" : `₹${price.toLocaleString('en-IN')}`
          
          return (
            <motion.div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-background p-6",
                plan.popular && "border-emerald-600 shadow-lg shadow-emerald-100/40 dark:shadow-emerald-900/20"
              )}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {plan.popular && (
                <div className="absolute -top-5 left-0 right-0 mx-auto w-fit">
                  <Badge className="bg-emerald-600 hover:bg-emerald-700 px-4 py-1 text-sm">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <div className="mb-5 space-y-2">
                <h3 className="text-2xl font-bold">{plan.name}</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-extrabold tracking-tight">{formattedPrice}</span>
                  {plan.period && (
                    <span className="ml-1 text-sm text-muted-foreground">
                      {billingInterval === "yearly" ? "/year" : plan.period}
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{plan.description}</p>
              </div>
              
              <div className="space-y-4 flex-1">
                <ul className="space-y-2">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-600 dark:text-emerald-500 mt-0.5 shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {plan.limitations.length > 0 && (
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-2">Limitations:</p>
                    <ul className="space-y-2">
                      {plan.limitations.map((limitation) => (
                        <li key={limitation} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <TooltipProvider delayDuration={300}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <HelpCircle className="h-4 w-4 mt-0.5 shrink-0" />
                              </TooltipTrigger>
                              <TooltipContent className="max-w-[200px] text-xs" side="top">
                                {limitation === "WhatsBuy.in branding" && "Your store will display 'Powered by WhatsBuy.in'"}
                                {limitation === "No custom domain" && "You cannot use your own domain name"}
                                {limitation === "Basic analytics" && "Limited to page views and order counts"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <span>{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              <div className="pt-6 mt-auto">
              <Link href="/register">
                <Button
                  className={`mt-8 w-full ${plan.popular ? "bg-emerald-600 hover:bg-emerald-700" : ""
                    }`}
                >
                  {plan.cta}
                </Button>
              </Link>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      <div className="mt-10 text-center">
        <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
          All plans include a 14-day free trial. No credit card required. You can upgrade, downgrade, or cancel anytime.
        </p>
      </div>
    </div>
  )
}