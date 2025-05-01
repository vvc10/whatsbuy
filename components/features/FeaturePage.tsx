// app/features/page.tsx

import Link from "next/link"
import FeatureShowcase from "../feature-showcase"
import { Button } from "@/components/ui/button"
import { Check, X, Zap, Star, BadgeCheck } from "lucide-react"

export function FeatureHero() {
    return (
        <section className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                    Powerful Tools for Your WhatsApp Store
                </h1>
                <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                    Everything you need to showcase products, accept orders, and grow your business -
                    all through WhatsApp.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild size="lg" className="bg-emerald-600 hover:bg-emerald-700">
                        <Link href="/signup">Get Started - It's Free</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg">
                        <Link href="#showcase">Explore Features</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
export function FeatureComparison() {
  const plans = [
    {
      name: "Free",
      price: "₹0",
      period: "",
      description: "Perfect for testing your WhatsApp store",
      storeLimit: "1 Store",
      productLimit: "20 Products",
      features: [
        "Basic storefront",
        "WhatsApp ordering",
        "Manual order tracking",
        "WhatsBuy.in branding"
      ],
      cta: "Get Started",
      popular: false
    },
    {
      name: "Starter",
      price: "₹149",
      period: "/month",
      description: "For growing businesses",
      storeLimit: "2 Stores",
      productLimit: "100 Products each",
      features: [
        "Custom themes",
        "WhatsApp & Instagram selling",
        "Razorpay Payment Links",
        "Order dashboard",
        "Remove branding"
      ],
      cta: "Upgrade Now",
      popular: true
    },
    {
      name: "Pro",
      price: "₹299",
      period: "/month",
      description: "For serious sellers",
      storeLimit: "5 Stores",
      productLimit: "Unlimited Products",
      features: [
        "Advanced storefront",
        "UPI QR for each product",
        "Custom domain",
        "Broadcast messages",
        "Inventory management",
        "Priority support"
      ],
      cta: "Go Pro",
      popular: false
    }
  ]

  const allFeatures = [
    "Basic storefront",
    "WhatsApp ordering",
    "Manual order tracking",
    "Branding",
    "Custom themes",
    "Instagram selling",
    "Razorpay Payment Links",
    "Order dashboard",
    "Remove branding",
    "Advanced storefront",
    "UPI QR payments",
    "Custom domain",
    "Broadcast messages",
    "Inventory management",
    "Priority support"
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Plan Comparison
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Choose the perfect plan for your business needs
        </p>
      </div>

      {/* Mobile View - Cards */}
      <div className="lg:hidden space-y-4">
        {plans.map((plan) => (
          <div 
            key={plan.name}
            className={`p-6 rounded-xl border ${
              plan.popular 
                ? "border-emerald-500 ring-2 ring-emerald-500" 
                : "border-gray-200"
            }`}
          >
            {plan.popular && (
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-emerald-600 fill-emerald-200" />
                <span className="text-sm font-medium text-emerald-600">
                  Most Popular
                </span>
              </div>
            )}
            <h3 className="text-xl font-bold">{plan.name}</h3>
            <div className="my-2">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.period && (
                <span className="text-gray-500">{plan.period}</span>
              )}
            </div>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            
            <div className="space-y-2 mb-6">
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24">Stores:</span>
                <span className="font-medium">{plan.storeLimit}</span>
              </div>
              <div className="flex items-center">
                <span className="text-sm text-gray-500 w-24">Products:</span>
                <span className="font-medium">{plan.productLimit}</span>
              </div>
            </div>

            <ul className="space-y-2 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-4 w-4 text-emerald-500 mr-2" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className={`w-full ${
                plan.popular ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-900 hover:bg-gray-800"
              }`}
            >
              {plan.cta}
            </Button>
          </div>
        ))}
      </div>

      {/* Desktop View - Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left pb-4 pl-4 w-1/4">Features</th>
              {plans.map((plan) => (
                <th 
                  key={plan.name} 
                  className={`text-center pb-4 px-4 ${
                    plan.popular ? "bg-emerald-50" : ""
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {plan.popular && (
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="h-4 w-4 text-emerald-600 fill-emerald-200" />
                        <span className="text-xs font-medium text-emerald-600">
                          Popular
                        </span>
                      </div>
                    )}
                    <h3 className="text-xl font-bold">{plan.name}</h3>
                    <div className="my-1">
                      <span className="text-2xl font-bold">{plan.price}</span>
                      {plan.period && (
                        <span className="text-gray-500 text-sm">{plan.period}</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                    <div className="text-sm mt-2 space-y-1">
                      <div>{plan.storeLimit}</div>
                      <div>{plan.productLimit}</div>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {allFeatures.map((feature) => (
              <tr key={feature}>
                <td className="py-3 pl-4 text-sm font-medium">{feature}</td>
                {plans.map((plan) => (
                  <td 
                    key={`${plan.name}-${feature}`} 
                    className={`text-center py-3 px-4 ${
                      plan.popular ? "bg-emerald-50" : ""
                    }`}
                  >
                    {plan.features.includes(feature) ? (
                      <Check className="h-5 w-5 text-emerald-500 mx-auto" />
                    ) : (
                      <X className="h-5 w-5 text-gray-300 mx-auto" />
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td className="py-4 pl-4"></td>
              {plans.map((plan) => (
                <td 
                  key={`${plan.name}-cta`} 
                  className={`text-center py-4 px-4 ${
                    plan.popular ? "bg-emerald-50" : ""
                  }`}
                >
                  <Button
                    className={`w-3/4 ${
                      plan.popular ? "bg-emerald-600 hover:bg-emerald-700" : "bg-gray-900 hover:bg-gray-800"
                    }`}
                  >
                    {plan.cta}
                  </Button>
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  )
}
export function FeatureCTABanner() {
    return (
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-8 md:p-12 text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                    Ready to grow your business?
                </h2>
                <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
                    Join thousands of businesses selling on WhatsApp today. It's free to get started!
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button asChild size="lg" className="bg-white text-emerald-700 hover:bg-gray-100">
                        <Link href="/signup">Create Your Free Store</Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
                        <Link href="/demo">See Live Demo</Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}
export default function FeaturesPage() {
    return (
        <div className="space-y-20 pb-20">
            <FeatureHero />
            <FeatureShowcase />
            <FeatureComparison />
            <FeatureCTABanner />
        </div>
    )
}