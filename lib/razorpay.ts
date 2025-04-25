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
    // In a real app, you would make an API call to your backend to create an order
    // For demo purposes, we'll simulate a successful order creation
    const response = await fetch("/api/payments/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount, currency }),
    })

    if (!response.ok) {
      throw new Error("Failed to create order")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating Razorpay order:", error)
    throw error
  }
}

export function initializeRazorpayCheckout(options: RazorpayOptions) {
  if (typeof window === "undefined" || !window.Razorpay) {
    throw new Error("Razorpay SDK not loaded")
  }

  const razorpay = new window.Razorpay(options)
  razorpay.open()
  return razorpay
}
