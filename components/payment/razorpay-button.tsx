"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"
import { loadRazorpay, initializeRazorpayCheckout } from "@/lib/razorpay"
import LoginForm from "@/components/auth/login-form"
import RegisterForm from "@/components/auth/register-form"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

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
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false) // Replace with actual auth logic
  const { toast } = useToast()

  const handlePayment = async () => {
    if (!isAuthenticated) {
      setIsModalOpen(true)
      return
    }

    setIsLoading(true)

    try {
      // Load Razorpay SDK
      const isLoaded = await loadRazorpay()
      if (!isLoaded) {
        throw new Error("Razorpay SDK failed to load")
      }

      // Call the upgrade-plan API
      const response = await fetch("/api/payments/upgrade-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ planId: "starter", amount }), // Replace "starter" with the actual plan ID dynamically
      })

      if (!response.ok) {
        throw new Error("Failed to upgrade plan")
      }

      const { order } = await response.json()

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_YourTestKeyId",
        amount: amount * 100, // Razorpay expects amount in paise
        currency: "INR",
        name: "WhatsBuy.in",
        description: "Upgrade Plan Payment",
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

      initializeRazorpayCheckout(options);

      // Dynamically set z-index for Razorpay iframe
      setTimeout(() => {
        const razorpayFrame = document.querySelector('iframe.razorpay-checkout-frame');
        if (razorpayFrame) {
          razorpayFrame.style.zIndex = '9999';
          razorpayFrame.style.position = 'relative';
        }
      }, 500); // Adjust timeout if needed
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
    <>
      <Button onClick={handlePayment} disabled={isLoading} className={`bg-emerald-600 hover:bg-emerald-700 ${className}`}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {buttonText}
      </Button>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Login or Register</DialogTitle>
          </DialogHeader>
          <Tabs defaultValue="login" className="space-y-4">
            <TabsList>
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <LoginForm />
            </TabsContent>
            <TabsContent value="register">
              <RegisterForm />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  )
}
