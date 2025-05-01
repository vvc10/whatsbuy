import { NextResponse } from "next/server";
import Razorpay from "razorpay";

console.log("Razorpay Key:", process.env.RAZORPAY_KEY);
console.log("Razorpay Secret:", process.env.RAZORPAY_SECRET ? "[HIDDEN]" : "[NOT SET]");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount } = body;

    if (!amount) {
      return NextResponse.json({ error: "Amount is required" }, { status: 400 });
    }

    // Debugging: Log the amount being processed
    console.log("Processing amount:", amount);

    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: "INR",
      payment_capture: 1,
    });

    // Debugging: Log the created order
    console.log("Created Razorpay order:", order);

    return NextResponse.json({ order });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}