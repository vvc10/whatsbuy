import Link from "next/link"
import { ArrowRight, ArrowUpRight, Link2Icon, Share2Icon, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import PricingPlans from "@/components/pricing-plans"
import FeatureShowcase from "@/components/feature-showcase"
import HeroSection from "@/components/hero-section"
import { createServerClient } from "@/lib/supabase/server"
import Header from "@/components/header"
import Footer from "@/components/footer"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { HowItWorks } from "@/components/howitworks"

export default async function LandingPage() {
  // Check if user is authenticated to show the right CTA
  let isAuthenticated = false

  try {
    const supabase = createServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // Check if there's an active session AND the user object is available
    isAuthenticated = !!session && !!session.user
  } catch (error) {
    console.error("Auth check error:", error)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Trusted by Section */}
        {/* <section className="py-12 border-y bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <p className="text-sm font-medium text-muted-foreground">
                TRUSTED BY THOUSANDS OF INDIAN BUSINESSES
              </p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-12 opacity-70">
                <div className="flex items-center justify-center">
                  <p className="text-xl font-semibold">Brand 1</p>
                </div>
                <div className="flex items-center justify-center">
                  <p className="text-xl font-semibold">Brand 2</p>
                </div>
                <div className="flex items-center justify-center">
                  <p className="text-xl font-semibold">Brand 3</p>
                </div>
                <div className="flex items-center justify-center">
                  <p className="text-xl font-semibold">Brand 4</p>
                </div>
                <div className="flex items-center justify-center">
                  <p className="text-xl font-semibold">Brand 5</p>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* Features Section */}
        <section id="features" className="py-24 md:py-32 bg-gradient-to-b from-emerald-50/50 to-white dark:from-emerald-950/10 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge className="px-4 py-1 border-emerald-200 bg-emerald-100/50 dark:bg-emerald-900/20 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 rounded-full">
                Features
              </Badge>
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Everything You Need to Sell on WhatsApp
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Create your WhatsApp store in minutes with these powerful features designed for Indian businesses
                </p>
              </div>
            </div>
            <FeatureShowcase />
          </div>
        </section>

        {/* How It Works */}
        <section className="py-24 md:py-32 relative overflow-hidden">
          <div className="absolute right-0 top-0 -z-10 h-[50%] w-[40%] bg-emerald-50/60 dark:bg-emerald-950/10 blur-3xl"></div>
          <div className="absolute left-0 bottom-0 -z-10 h-[30%] w-[30%] bg-amber-50/50 dark:bg-amber-950/10 blur-3xl"></div>

          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge className="px-4 py-1 border-amber-200 bg-amber-100/50 dark:bg-amber-900/20 dark:border-amber-800 text-amber-700 dark:text-amber-300 rounded-full">
                Simple Process
              </Badge>
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start Selling in 3 Simple Steps
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  No technical knowledge required - just your phone and your products
                </p>
              </div>
            </div>
            <HowItWorks />

            <div className="flex justify-center mt-16">
              <Link href="/register">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-700 text-white">
                  Create Your Store Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 md:py-32 bg-gradient-to-b from-white to-muted/30 dark:from-background dark:to-muted/10">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge className="px-4 py-1 bg-blue-100/50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 rounded-full">
                Pricing
              </Badge>
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Simple, Transparent Pricing
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Choose the plan that works for your business with no hidden fees
                </p>
              </div>
            </div>
            <PricingPlans />
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-24 md:py-32 bg-gradient-to-b from-muted/30 to-background dark:from-muted/10 dark:to-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <Badge className="px-4 py-1 bg-purple-100/50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 rounded-full">
                Testimonials
              </Badge>
              <div className="space-y-2 max-w-3xl">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Trusted by Local Sellers Across India
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  See what our customers are saying about their success with WhatsBuy.in
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-3 pt-16">
              {[
                {
                  name: "Priya Sharma",
                  business: "Priya's Handmade Jewelry",
                  location: "Jaipur",
                  quote:
                    "I started selling my jewelry on WhatsApp within minutes. My customers love how easy it is to order! My sales have increased by 40% since I started using WhatsBuy.",
                  // image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
                },
                {
                  name: "Rajesh Kumar",
                  business: "Fresh Groceries",
                  location: "Pune",
                  quote:
                    "WhatsBuy.in helped me organize my grocery business. Now I get 30% more orders through WhatsApp and my customers always know what's in stock. The simple ordering process has been a game-changer.",
                  // image: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150",
                },
                {
                  name: "Anita Patel",
                  business: "Anita's Fashion",
                  location: "Ahmedabad",
                  quote:
                    "The simplicity is what I love. My customers can browse products and order directly on WhatsApp. I'm able to manage my boutique and online orders all in one place without any technical headaches.",
                  // image: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
                },
              ].map((testimonial, index) => (
                <div key={index} className="flex flex-col space-y-4 rounded-xl border bg-card p-6 transition-all hover:shadow-md">
                  <div className="relative px-6">
                    <svg
                      className="absolute -top-6 -left-2 h-16 w-16 text-muted/20"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />
                      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" />
                    </svg>
                    <p className="relative text-muted-foreground italic">"{testimonial.quote}"</p>
                  </div>
                  <div className="flex items-center space-x-4 pt-4 mt-auto">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full border-2 border-background shadow-sm">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={60}
                        height={60}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="text-base font-semibold">{testimonial.name}</h4>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.business}, {testimonial.location}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 md:py-32 overflow-hidden bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-800 dark:to-emerald-900 text-white">
          {/* Background dots pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

          <div className="relative container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center max-w-3xl mx-auto">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start Selling on WhatsApp in 60 Seconds – No Website Needed
                </h2>
                <p className="mx-auto max-w-[700px] text-emerald-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of local sellers who are growing their business with WhatsBuy.in
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50 dark:bg-white dark:text-emerald-700 dark:hover:bg-emerald-50">
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>


              </div>

            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}