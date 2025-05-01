// components/pricing/PricingPage.tsx
"use client"

import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Link from "next/link"
// import Header from "@/components/header"

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

export function PricingPage() {
  return (

    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl py-12 mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          Simple Pricing, No Surprises
        </h1>
        <p className="max-w-2xl mx-auto text-lg">
          Start selling on WhatsApp effortlessly. Choose a plan that fits your journey.
        </p>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-8 shadow-sm ${plan.popular ? "border-emerald-600 ring-2 ring-emerald-600" : "border-gray-200"
                }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 mt-4 mr-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <div className="mt-4 flex items-baseline justify-center gap-x-2">
                <span className="text-4xl font-bold">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm">{plan.period}</span>
                )}
              </div>
              <p className="mt-4 text-sm">{plan.description}</p>

              <ul className="mt-6 space-y-3 flex-1">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    <Check className="h-5 w-5 text-emerald-600 mr-2" />
                    {feature}
                  </li>
                ))}
                {plan.limitations.length > 0 && (
                  <div className="pt-4">
                    {plan.limitations.map((limitation, idx) => (
                      <li key={idx} className="text-xs text-gray-400 ml-7 list-disc">
                        {limitation}
                      </li>
                    ))}
                  </div>
                )}
              </ul>

              <Link href="/register">
                <Button
                  className={`mt-8 w-full ${plan.popular ? "bg-emerald-600 hover:bg-emerald-700" : ""
                    }`}
                >
                  {plan.cta}
                </Button>
              </Link>

            </div>
          ))}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          Need enterprise or custom solutions? <a href="#" className="text-emerald-600 hover:underline">Contact Us</a>
        </p>
      </div>
    </div>

  )
}