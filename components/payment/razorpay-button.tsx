"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { loadRazorpay, createRazorpayOrder, initializeRazorpayCheckout } from "@/lib/razorpay"

interface RazorpayButtonProps {
  amount: number
  onSuccess?: (paymentId: string, orderId: string) => void
  onFailure?: (error: any) => void
  buttonText?: string
  className?: string
}

export default function RazorpayButton({
  amount,
  onSuccess,
  onFailure,
  buttonText = "Pay Now",
  className,
}: RazorpayButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handlePayment = async () => {
    setIsLoading(true)

    try {
      // Load Razorpay SDK
      const isLoaded = await loadRazorpay()
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load")
      }

      // Create order
      const { order } = await createRazorpayOrder(amount)

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourTestKeyId",
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "WhatsBuy.in",
        description: "Payment for your order",
        order_id: order.id,
        handler: (response: any) => {
          // Handle successful payment
          toast({
            title: "Payment Successful",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          })

          if (onSuccess) {
            onSuccess(response.razorpay_payment_id, order.id)
          }
        },
        prefill: {
          name: "Customer Name",
          email: "customer@example.com",
          contact: "9876543210",
        },
        theme: {
          color: "#059669",
        },
      }

      initializeRazorpayCheckout(options)
    } catch (error) {
      console.error("Payment failed:", error)
      toast({
        title: "Payment Failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })

      if (onFailure) {
        onFailure(error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button onClick={handlePayment} disabled={isLoading} className={`bg-emerald-600 hover:bg-emerald-700 ${className}`}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {buttonText}
    </Button>
  )
}
