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
import { ReactNode, useState } from "react"
import RazorpayButton from "@/components/payment/razorpay-button"
import { handleRazorpayPayment } from "@/lib/razorpay"
import Loading from "./loading"

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
      "Advanced analytics and reports",
      "Priority WhatsApp Support"
    ],
    limitations: [],
    cta: "Go Pro",
    popular: false,
  },
]

export function PricingModal({ trigger }: { trigger: ReactNode }) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handlePlanSelect = async (plan: typeof plans[0]) => {
    if (plan.name === "Free") {
      console.log("Free plan selected");
      return;
    }

    setLoadingPlan(plan.name);
    try {
      await handleRazorpayPayment({
        amount: plan.name === "Starter" ? 99 : 199,
        onSuccess: (paymentId, orderId) => {
          console.log("Payment successful", paymentId, orderId);
          setLoadingPlan(null);
        },
        onFailure: (error) => {
          console.error("Payment failed", error);
          setLoadingPlan(null);
        },
      });
    } catch (error) {
      console.error("Payment error", error);
      setLoadingPlan(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Choose Your Plan</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 md:grid-cols-3 mt-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border p-6 ${
                plan.popular 
                  ? "border-emerald-600 shadow-lg ring-1 ring-emerald-600" 
                  : "border-gray-200"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Popular
                </div>
              )}

              <div className="space-y-3">
                <h3 className="text-xl font-bold text-center">{plan.name}</h3>
                <div className="flex justify-center items-baseline">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="ml-1 text-gray-500">{plan.period}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500 text-center">{plan.description}</p>
              </div>

              <div className="mt-6 flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 flex-shrink-0 text-emerald-600 mt-0.5" />
                      <span className="ml-2 text-sm">{feature}</span>
                    </li>
                  ))}
                  {plan.limitations.map((limitation) => (
                    <li key={limitation} className="flex items-start text-gray-400">
                      <span className="ml-7 text-xs">{limitation}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                className={`mt-6 w-full ${
                  plan.popular 
                    ? "bg-emerald-600 hover:bg-emerald-700" 
                    : "bg-gray-900 hover:bg-gray-800"
                }`}
                onClick={() => handlePlanSelect(plan)}
                disabled={loadingPlan === plan.name}
              >
                {loadingPlan === plan.name ? (
                  <>
                  <Loading/>
                  </>
                ) : (
                  plan.cta
                )}
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need a custom plan? <a href="#" className="text-emerald-600 hover:underline">Contact us</a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}