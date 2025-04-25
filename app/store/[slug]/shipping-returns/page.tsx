import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createServerClient } from "@/lib/supabase/server"
import StoreThemeProvider from "@/components/store/store-theme-provider"
import type { Metadata } from "next"

interface ShippingReturnsPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: ShippingReturnsPageProps): Promise<Metadata> {
  try {
    const supabase = createServerClient()
    const { data: store } = await supabase.from("stores").select("name").eq("slug", params.slug).single()

    if (!store) return { title: "Store Not Found" }

    return {
      title: `Shipping & Returns | ${store.name}`,
      description: `Shipping and return policies for ${store.name}`,
    }
  } catch (error) {
    return { title: "Shipping & Returns | WhatsBuy.in" }
  }
}

export default async function ShippingReturnsPage({ params }: ShippingReturnsPageProps) {
  try {
    const supabase = createServerClient()
    const { data: store, error } = await supabase.from("stores").select("*").eq("slug", params.slug).single()

    if (error || !store) notFound()

    return (
      <StoreThemeProvider
        theme={store.theme || "default"}
        primaryColor={store.primary_color || "#059669"}
        categoryFont={store.category_font}
        categoryButtonStyle={store.category_button_style}
        categoryCardShadow={store.category_card_shadow}
        categoryBorderStyle={store.category_border_style}
        categoryTransition={store.category_transition}
        headerShadow={store.header_shadow}
      >
        <div className="min-h-screen bg-gray-50">
          <div className="container mx-auto max-w-4xl px-4 py-12">
            <Link href={`/store/${params.slug}`}>
              <Button variant="ghost" size="sm" className="mb-8">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to store
              </Button>
            </Link>

            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h1
                className="text-3xl font-bold mb-6 text-gray-900"
                style={{ fontFamily: store.category_font || "inherit" }}
              >
                Shipping & Returns
              </h1>

              <div className="prose max-w-none">
                <h2>Shipping Policy</h2>
                <p>
                  At {store.name}, we strive to deliver your orders as quickly and efficiently as possible. Please
                  review our shipping policy below:
                </p>

                <h3>Processing Time</h3>
                <p>
                  Orders are typically processed within 1-2 business days after payment confirmation. During peak
                  seasons or promotional periods, processing may take an additional 1-2 days.
                </p>

                <h3>Shipping Methods and Timeframes</h3>
                <p>We offer the following shipping options:</p>
                <ul>
                  <li>
                    <strong>Standard Shipping:</strong> 3-5 business days
                  </li>
                  <li>
                    <strong>Express Shipping:</strong> 1-2 business days (where available)
                  </li>
                </ul>

                <h3>Shipping Costs</h3>
                <p>
                  Shipping costs are calculated based on the delivery location, package weight, and selected shipping
                  method. The exact shipping cost will be displayed at checkout before payment.
                </p>

                <h3>Order Tracking</h3>
                <p>
                  Once your order ships, you will receive a confirmation message with tracking information via WhatsApp
                  or email.
                </p>

                <h2>Return Policy</h2>
                <p>
                  We want you to be completely satisfied with your purchase. If you're not entirely happy with your
                  order, we're here to help.
                </p>

                <h3>Return Eligibility</h3>
                <p>You may return items purchased from {store.name} within 14 days of delivery if:</p>
                <ul>
                  <li>Items are in original, unused condition with all tags attached</li>
                  <li>Items are in their original packaging</li>
                  <li>You have proof of purchase (order number or receipt)</li>
                </ul>

                <h3>Non-Returnable Items</h3>
                <p>The following items cannot be returned:</p>
                <ul>
                  <li>Personalized or custom-made products</li>
                  <li>Intimate or sanitary goods</li>
                  <li>Perishable goods</li>
                  <li>Downloadable products or digital content</li>
                  <li>Gift cards</li>
                </ul>

                <h3>Return Process</h3>
                <p>To initiate a return:</p>
                <ol>
                  <li>
                    Contact us via WhatsApp{store.whatsapp_number ? ` at +${store.whatsapp_number}` : ""} within 14 days
                    of receiving your order
                  </li>
                  <li>Provide your order number and details about the item(s) you wish to return</li>
                  <li>We'll guide you through the return process and provide a return address</li>
                </ol>

                <h3>Refunds</h3>
                <p>
                  Once we receive and inspect your return, we'll process your refund. The refund will be issued to the
                  original payment method within 5-7 business days, depending on your bank or payment provider.
                </p>

                <h3>Exchanges</h3>
                <p>
                  If you'd like to exchange an item for a different size or color, please follow the return process and
                  place a new order for the desired item. This ensures the fastest processing time.
                </p>

                <h2>Contact Us</h2>
                <p>
                  If you have any questions about our shipping or return policies, please contact us via WhatsApp
                  {store.whatsapp_number ? ` at +${store.whatsapp_number}` : ""}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </StoreThemeProvider>
    )
  } catch (error) {
    console.error("Shipping & Returns page error:", error)
    notFound()
  }
}
