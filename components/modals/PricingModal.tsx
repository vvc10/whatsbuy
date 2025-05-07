"use client"

import { Check, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ReactNode, useState, useEffect } from "react"
import RazorpayButton from "@/components/payment/razorpay-button"
import { handleRazorpayPayment } from "@/lib/razorpay"
import Loading from "./loading"
import { SubscriptionPlan } from "@/types/suscriptionlimits"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { verifyLuckyCode } from "@/app/actions/verifycode"
import { checkSubscription, updateSubscription, cancelSubscription } from "@/app/actions/subscription"

interface PricingModalProps {
  trigger: ReactNode
}

interface SubscriptionStatus {
  plan: SubscriptionPlan
  isActive: boolean
  validUntil?: Date | null
  daysRemaining?: number
}

const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "Perfect for testing your WhatsApp store",
    features: [
      "1 Store allowed",
      "Up to 5 products",
      "Basic storefront ",
      "1-Click WhatsApp ordering",
      "Order tracking (manual update)",
      "Mobile-friendly catalog",
      "WhatsBuy.in branding"
    ],
    limitations: [
      "No Social Media Integration",
      "No custom domain",
      "Limited analytics",
      "Limited customization options"
    ],
    cta: "Start Free",
    popular: false,
    planId: "free" as SubscriptionPlan
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
      "Integration analytics",
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
    planId: "starter" as SubscriptionPlan
  },
  {
    name: "Pro",
    price: "₹199",
    period: "/month",
    description: "For serious sellers who want full control",
    features: [
      "Unlimited products",
      "5 Stores allowed (Raise request for more)",
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
    planId: "pro" as SubscriptionPlan
  },
]

export function PricingModal({ trigger }: PricingModalProps) {
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
  const [showLuckyCodeInput, setShowLuckyCodeInput] = useState(false)
  const [luckyCode, setLuckyCode] = useState("")
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus>({
    plan: 'free',
    isActive: false
  })
  const { toast } = useToast()

  useEffect(() => {
    const loadSubscription = async () => {
      const status = await checkSubscription()
      setSubscriptionStatus(status)
    }
    loadSubscription()
  }, [])

  const handlePlanSelect = async (plan: typeof plans[0]) => {
    if (plan.planId === subscriptionStatus.plan && subscriptionStatus.isActive) return
    
    if (plan.name === "Free") {
      try {
        setLoadingPlan(plan.name)
        await cancelSubscription()
        toast({
          title: "Success",
          description: "Your subscription has been cancelled",
          variant: "default",
        })
        window.location.reload()
      } catch (error) {
        console.error("Failed to cancel subscription", error)
        toast({
          title: "Error",
          description: "Failed to cancel subscription",
          variant: "destructive",
        })
      } finally {
        setLoadingPlan(null)
      }
      return
    }

    setLoadingPlan(plan.name)
    try {
      await handleRazorpayPayment({
        amount: plan.name === "Starter" ? 99 : 199,
        onSuccess: async (paymentId, orderId) => {
          try {
            await updateSubscription(plan.planId)
            toast({
              title: "Success!",
              description: `Your ${plan.name} plan has been activated`,
              variant: "default",
            })
            window.location.reload()
          } catch (error) {
            console.error("Subscription update failed", error)
            toast({
              title: "Payment Successful",
              description: "But we encountered an issue updating your subscription. Please contact support.",
              variant: "destructive",
            })
          }
        },
        onFailure: (error) => {
          console.error("Payment failed", error)
          toast({
            title: "Payment Failed",
            description: error.message || "Please try again",
            variant: "destructive",
          })
        },
      })
    } catch (error) {
      console.error("Payment error", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoadingPlan(null)
    }
  }

  const handleLuckyCodeSubmit = async () => {
    if (!luckyCode.trim()) {
      toast({
        title: "Error",
        description: "Please enter a referral code",
        variant: "destructive",
      })
      return
    }
    
    setIsVerifyingCode(true)
    try {
      const { success, error } = await verifyLuckyCode(luckyCode)
      
      if (success) {
        toast({
          title: "Congratulations! 🎉",
          description: "You've unlocked free Pro access for 30 days!",
          variant: "default",
        })
        // Refresh after 2 seconds to show the updated plan
        setTimeout(() => window.location.reload(), 2000)
      } else {
        toast({
          title: "Invalid Code",
          description: error || "The referral code you entered is not valid",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Verification error:", error)
      toast({
        title: "Error",
        description: "Failed to verify code. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsVerifyingCode(false)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">Choose Your Plan</DialogTitle>
        </DialogHeader>

        {/* Lucky Code Section */}
        <div className="text-center mb-6">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => setShowLuckyCodeInput(!showLuckyCodeInput)}
          >
            <Gift className="h-4 w-4" />
            {showLuckyCodeInput ? "Hide" : "Have a referral Code?"}
          </Button>

          {showLuckyCodeInput && (
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Enter your lucky code"
                value={luckyCode}
                onChange={(e) => setLuckyCode(e.target.value)}
                className="flex-1"
              />
              <Button 
                onClick={handleLuckyCodeSubmit}
                disabled={isVerifyingCode || !luckyCode.trim()}
              >
                {isVerifyingCode ? <Loading /> : "Redeem"}
              </Button>
            </div>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-3 mt-6">
          {plans.map((plan) => {
            const isCurrentPlan = plan.planId === subscriptionStatus.plan
            const isActive = isCurrentPlan && subscriptionStatus.isActive
            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-xl border p-6 ${
                  plan.popular
                    ? "border-emerald-600 shadow-lg ring-1 ring-emerald-600"
                    : "border-gray-200"
                } ${isCurrentPlan ? "ring-1 ring-gray-300" : ""}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-4 transform -translate-y-1/2 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Popular
                  </div>
                )}
                {isCurrentPlan && (
                  <div className="absolute top-0 left-4 transform -translate-y-1/2 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">
                    Active
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
                  {isCurrentPlan && subscriptionStatus.validUntil && (
                    <p className="text-xs text-gray-500 mt-1">
                      {isActive ? (
                        `Active until ${new Date(subscriptionStatus.validUntil).toLocaleDateString()} (${subscriptionStatus.daysRemaining} days remaining)`
                      ) : (
                        "Expired - Renew to continue access"
                      )}
                    </p>
                  )}
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
                  } ${isCurrentPlan ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed" : ""}`}
                  onClick={() => handlePlanSelect(plan)}
                  disabled={loadingPlan === plan.name || (isCurrentPlan && isActive)}
                >
                  {loadingPlan === plan.name ? (
                    <Loading />
                  ) : isCurrentPlan ? (
                    isActive ? "Current Plan" : "Renew Plan"
                  ) : (
                    plan.cta
                  )}
                </Button>
              </div>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Need a custom plan?{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              Contact us
            </a>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}