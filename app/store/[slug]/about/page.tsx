import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createServerClient } from "@/lib/supabase/server"
import StoreThemeProvider from "@/components/store/store-theme-provider"
import type { Metadata } from "next"

interface AboutPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  try {
    const supabase = createServerClient()
    const { data: store } = await supabase.from("stores").select("name").eq("slug", params.slug).single()

    if (!store) return { title: "Store Not Found" }

    return {
      title: `About ${store.name} | WhatsBuy.in`,
      description: `Learn more about ${store.name} and our story.`,
    }
  } catch (error) {
    return { title: "About Us | WhatsBuy.in" }
  }
}

export default async function AboutPage({ params }: AboutPageProps) {
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
                About {store.name}
              </h1>

              <div className="prose max-w-none">
                <p>
                  Welcome to {store.name}, your destination for quality products and exceptional service. We are
                  dedicated to providing our customers with a seamless shopping experience and products that exceed
                  expectations.
                </p>

                <h2>Our Story</h2>
                <p>
                  {store.name} was founded with a simple mission: to offer high-quality products at reasonable prices
                  while providing excellent customer service. We believe in building lasting relationships with our
                  customers and creating a shopping experience that is both enjoyable and convenient.
                </p>

                <h2>Our Values</h2>
                <ul>
                  <li>
                    <strong>Quality:</strong> We carefully select each product to ensure it meets our high standards.
                  </li>
                  <li>
                    <strong>Customer Satisfaction:</strong> Your happiness is our priority. We're committed to providing
                    exceptional service.
                  </li>
                  <li>
                    <strong>Integrity:</strong> We operate with honesty and transparency in all our business practices.
                  </li>
                  <li>
                    <strong>Innovation:</strong> We continuously seek new ways to improve our products and services.
                  </li>
                </ul>

                <h2>Contact Us</h2>
                <p>
                  Have questions or feedback? We'd love to hear from you! Reach out to us through WhatsApp
                  {store.whatsapp_number ? ` at +${store.whatsapp_number}` : ""} or visit our Contact page.
                </p>

                <p className="mt-8">Thank you for choosing {store.name}. We look forward to serving you!</p>
              </div>
            </div>
          </div>
        </div>
      </StoreThemeProvider>
    )
  } catch (error) {
    console.error("About page error:", error)
    notFound()
  }
}
