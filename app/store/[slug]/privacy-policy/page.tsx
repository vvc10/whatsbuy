import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createServerClient } from "@/lib/supabase/server"
import StoreThemeProvider from "@/components/store/store-theme-provider"
import type { Metadata } from "next"

interface PrivacyPolicyPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: PrivacyPolicyPageProps): Promise<Metadata> {
  try {
    const supabase = createServerClient()
    const { data: store } = await supabase.from("stores").select("name").eq("slug", params.slug).single()

    if (!store) return { title: "Store Not Found" }

    return {
      title: `Privacy Policy | ${store.name}`,
      description: `Privacy Policy for ${store.name}`,
    }
  } catch (error) {
    return { title: "Privacy Policy | WhatsBuy.in" }
  }
}

export default async function PrivacyPolicyPage({ params }: PrivacyPolicyPageProps) {
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
                Privacy Policy
              </h1>

              <div className="prose max-w-none">
                <p>Last Updated: April 22, 2024</p>

                <p>
                  This Privacy Policy describes how {store.name} ("we", "us", or "our") collects, uses, and shares your
                  personal information when you visit our store, use our services, or make a purchase.
                </p>

                <h2>Information We Collect</h2>
                <p>When you visit our store, we may collect certain information about you, including:</p>
                <ul>
                  <li>Personal information (such as name, email address, phone number, shipping address)</li>
                  <li>Order information (products purchased, order value, payment information)</li>
                  <li>Device information (IP address, browser type, operating system)</li>
                  <li>Usage data (pages visited, time spent on site, actions taken)</li>
                </ul>

                <h2>How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Process and fulfill your orders</li>
                  <li>Communicate with you about your orders and provide customer support</li>
                  <li>Improve our products and services</li>
                  <li>Send you marketing communications (with your consent)</li>
                  <li>Detect and prevent fraud</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2>Sharing Your Information</h2>
                <p>We may share your personal information with:</p>
                <ul>
                  <li>Service providers (payment processors, shipping companies, etc.)</li>
                  <li>Business partners (with your consent)</li>
                  <li>Legal authorities when required by law</li>
                </ul>

                <h2>Your Rights</h2>
                <p>
                  Depending on your location, you may have certain rights regarding your personal information,
                  including:
                </p>
                <ul>
                  <li>Access to your personal information</li>
                  <li>Correction of inaccurate information</li>
                  <li>Deletion of your information</li>
                  <li>Restriction of processing</li>
                  <li>Data portability</li>
                </ul>

                <h2>Cookies</h2>
                <p>
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze site
                  traffic, and personalize content. You can control cookies through your browser settings.
                </p>

                <h2>Changes to This Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the
                  new Privacy Policy on this page and updating the "Last Updated" date.
                </p>

                <h2>Contact Us</h2>
                <p>
                  If you have any questions about this Privacy Policy, please contact us via WhatsApp
                  {store.whatsapp_number ? ` at +${store.whatsapp_number}` : ""}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </StoreThemeProvider>
    )
  } catch (error) {
    console.error("Privacy Policy page error:", error)
    notFound()
  }
}
