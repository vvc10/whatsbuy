import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { amount, currency = "INR" } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // In a real app, you would make a call to Razorpay API to create an order
    // For demo purposes, we'll simulate a successful order creation

    // Mock response
    const order = {
      id: `order_${Math.random().toString(36).substring(2, 15)}`,
      amount,
      currency,
      created_at: new Date().toISOString(),
    }

    return NextResponse.json({
      success: true,
      order,
    })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
