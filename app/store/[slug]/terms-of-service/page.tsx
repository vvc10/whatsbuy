import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createServerClient } from "@/lib/supabase/server"
import StoreThemeProvider from "@/components/store/store-theme-provider"
import type { Metadata } from "next"

interface TermsPageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  try {
    const supabase = createServerClient()
    const { data: store } = await supabase.from("stores").select("name").eq("slug", params.slug).single()

    if (!store) return { title: "Store Not Found" }

    return {
      title: `Terms of Service | ${store.name}`,
      description: `Terms of Service for ${store.name}`,
    }
  } catch (error) {
    return { title: "Terms of Service | WhatsBuy.in" }
  }
}

export default async function TermsOfServicePage({ params }: TermsPageProps) {
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
                Terms of Service
              </h1>

              <div className="prose max-w-none">
                <p>Last Updated: April 22, 2024</p>

                <p>
                  Please read these Terms of Service ("Terms") carefully before using the services offered by{" "}
                  {store.name} ("we", "us", or "our").
                </p>

                <h2>Acceptance of Terms</h2>
                <p>
                  By accessing or using our services, you agree to be bound by these Terms. If you do not agree to all
                  the terms and conditions, you may not access or use our services.
                </p>

                <h2>Changes to Terms</h2>
                <p>
                  We reserve the right to modify these Terms at any time. We will provide notice of any material changes
                  by updating the "Last Updated" date. Your continued use of our services following the posting of
                  revised Terms means you accept those changes.
                </p>

                <h2>Products and Services</h2>
                <p>
                  We make every effort to display as accurately as possible the colors, features, specifications, and
                  details of the products available on our store. However, we do not guarantee that the colors,
                  features, specifications, and details of the products will be accurate, complete, reliable, current,
                  or free of other errors.
                </p>

                <h2>Pricing and Payment</h2>
                <p>
                  All prices are shown in the local currency and do not include taxes or shipping costs, which are added
                  at checkout. We reserve the right to modify prices at any time. Payment must be made at the time of
                  purchase through the available payment methods.
                </p>

                <h2>Order Acceptance and Fulfillment</h2>
                <p>
                  We reserve the right to refuse or cancel any order for any reason, including but not limited to
                  product availability, errors in product or pricing information, or problems identified by our fraud
                  detection systems.
                </p>

                <h2>Intellectual Property</h2>
                <p>
                  All content on our store, including text, graphics, logos, images, and software, is the property of{" "}
                  {store.name} or its content suppliers and is protected by copyright, trademark, and other intellectual
                  property laws.
                </p>

                <h2>User Conduct</h2>
                <p>
                  You agree not to use our services for any illegal or unauthorized purpose, or to engage in any
                  activity that disrupts the services or the servers and networks connected to the services.
                </p>

                <h2>Limitation of Liability</h2>
                <p>
                  In no event shall {store.name}, its officers, directors, employees, or agents, be liable for any
                  indirect, incidental, special, consequential, or punitive damages arising out of or related to your
                  use of our services.
                </p>

                <h2>Governing Law</h2>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in
                  which {store.name} is established, without regard to its conflict of law provisions.
                </p>

                <h2>Contact Information</h2>
                <p>
                  Questions about the Terms should be sent to us via WhatsApp
                  {store.whatsapp_number ? ` at +${store.whatsapp_number}` : ""}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </StoreThemeProvider>
    )
  } catch (error) {
    console.error("Terms of Service page error:", error)
    notFound()
  }
}
