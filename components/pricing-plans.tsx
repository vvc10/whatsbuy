import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "Perfect for getting started",
    features: ["10 products", "Basic storefront", "WhatsApp ordering", "Order tracking", "Mobile-friendly catalog"],
    limitations: ["WhatsBuy.in branding", "No custom domain", "Basic analytics"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Starter",
    price: "₹99",
    period: "/month",
    description: "For growing businesses",
    features: [
      "50 products",
      "Custom storefront themes",
      "WhatsApp & Instagram integration",
      "Order management",
      "Basic analytics",
      "Remove WhatsBuy.in branding",
      "Payment integration (Razorpay)",
    ],
    limitations: [],
    cta: "Get Started",
    popular: true,
  },
  {
    name: "Pro",
    price: "₹199",
    period: "/month",
    description: "For established sellers",
    features: [
      "Unlimited products",
      "Premium themes",
      "All social integrations",
      "Advanced analytics",
      "Broadcast messages",
      "Custom domain",
      "Priority support",
      "Multiple payment options",
    ],
    limitations: [],
    cta: "Go Pro",
    popular: false,
  },
]

export default function PricingPlans() {
  return (
    <div className="grid gap-6 pt-12 lg:grid-cols-3 lg:gap-8">
      {plans.map((plan) => (
        <div
          key={plan.name}
          className={`flex flex-col rounded-lg border p-6 ${plan.popular ? "border-emerald-600 shadow-lg" : ""}`}
        >
          {plan.popular && (
            <div className="mb-4 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-600 w-fit">
              Most Popular
            </div>
          )}
          <div className="space-y-2">
            <h3 className="text-2xl font-bold">{plan.name}</h3>
            <div className="flex items-baseline">
              <span className="text-3xl font-bold">{plan.price}</span>
              {plan.period && <span className="text-sm text-gray-500">{plan.period}</span>}
            </div>
            <p className="text-sm text-gray-500">{plan.description}</p>
          </div>
          <div className="mt-6 space-y-4">
            <ul className="space-y-2">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
              {plan.limitations.map((limitation) => (
                <li key={limitation} className="flex items-center gap-2 text-gray-500">
                  <span className="text-sm">{limitation}</span>
                </li>
              ))}
            </ul>
            <Link href="/signup">
              <Button className={`w-full ${plan.popular ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}>
                {plan.cta}
              </Button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}
