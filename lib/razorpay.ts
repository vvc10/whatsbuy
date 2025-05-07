import { createClient } from "@/lib/supabase/client";

const supabase = createClient();
 
export interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  handler: (response: any) => void
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  notes?: Record<string, string>
  theme?: {
    color?: string
  }
}

export async function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function createRazorpayOrder(amount: number, currency = "INR") {
  try {
    console.log("Creating Razorpay order with amount:", amount, "currency:", currency);

    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(`${process.env.RAZORPAY_KEY}:${process.env.RAZORPAY_SECRET}`).toString("base64")}`,
      },
      body: JSON.stringify({ amount: amount * 100, currency }),
    });

    if (!response.ok) {
      console.error("Failed to create Razorpay order. Status:", response.status);
      throw new Error("Failed to create Razorpay order");
    }

    const data = await response.json();
    console.log("Razorpay order created successfully:", data);
    return data;
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    throw error;
  }
}

export function initializeRazorpayCheckout(options: RazorpayOptions) {
  if (typeof window === "undefined" || !window.Razorpay) {
    throw new Error("Razorpay SDK not loaded")
  }

  const razorpay = new window.Razorpay(options);
  razorpay.open();

  // Dynamically set z-index for Razorpay iframe
  setTimeout(() => {
    const razorpayFrame = document.querySelector('iframe.razorpay-checkout-frame');
    if (razorpayFrame) {
      razorpayFrame.style.zIndex = '9999';
      razorpayFrame.style.position = 'relative';
    }
  }, 500); // Adjust timeout if needed

  return razorpay;
}

export async function handleRazorpayPayment({ amount, onSuccess, onFailure }: {
  amount: number;
  onSuccess?: (paymentId: string, orderId: string) => void;
  onFailure?: (error: any) => void;
}) {
  try {
    // Load Razorpay SDK
    const isLoaded = await loadRazorpay();
    if (!isLoaded) {
      throw new Error("Razorpay SDK failed to load");
    }

    // Get current user session
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.session) {
      console.error("User session is invalid or expired:", sessionError);
      throw new Error("User session is invalid or expired");
    }

    const userId = session.session.user.id;
    const userEmail = session.session.user.email || "";
    const userName = session.session.user.user_metadata?.full_name || "Customer";

    // Call the upgrade-plan API
    const response = await fetch("/api/payments/upgrade-plan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        planId: amount === 99 ? "starter" : "pro",
        amount,
        userId 
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to upgrade plan");
    }

    const { order } = await response.json();

    // Initialize Razorpay checkout
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || "rzp_test_YourTestKeyId",
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR",
      name: "WhatsBuy.in",
      description: "Upgrade Plan Payment",
      order_id: order.id,
      handler: async (response: any) => {
        try {
          const plan = amount === 99 ? "starter" : "pro";
          
          // Update Supabase profiles table
          const { error } = await supabase
            .from("profiles")
            .update({ 
              subscription_plan: plan,
              updated_at: new Date().toISOString() 
            })
            .eq("id", userId);

          if (error) {
            console.error("Failed to update subscription plan in Supabase:", error);
            throw error;
          }

          console.log("Subscription plan updated successfully in Supabase:", plan);

          // Call the onSuccess callback if provided
          if (onSuccess) {
            onSuccess(response.razorpay_payment_id, order.id);
          }

          // You might want to refresh the session here if needed
          // await supabase.auth.refreshSession();

        } catch (error) {
          console.error("Error in payment handler:", error);
          if (onFailure) {
            onFailure(error);
          }
        }
      },
      prefill: {
        name: userName,
        email: userEmail,
        contact: "", // You might want to fetch this from profile if available
      },
      theme: {
        color: "#059669",
      },
      notes: {
        userId,
        plan: amount === 99 ? "starter" : "pro",
      }
    };

    initializeRazorpayCheckout(options);
  } catch (error) {
    console.error("Error in handleRazorpayPayment:", error);
    if (onFailure) {
      onFailure(error);
    }
  }
}