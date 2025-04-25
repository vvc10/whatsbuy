import Link from "next/link"
import { ArrowRight, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import LanguageSelector from "@/components/language-selector"
import PricingPlans from "@/components/pricing-plans"
import FeatureShowcase from "@/components/feature-showcase"
import HeroSection from "@/components/hero-section"
import { createServerClient } from "@/lib/supabase/server"
import Image from "next/image"
import icon from "@/app/assets/icons/icon.png"

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
    <div className="min-h-screen bg-white">
      {/* Floating language selector */}
      <div className="fixed bottom-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Image className="w-10 h-10" src={icon} />
             <span className="text-xl font-bold text-emerald-600">WhatsBuy.in</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-sm font-medium hover:text-emerald-600">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-medium hover:text-emerald-600">
              Pricing
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-emerald-600">
              Testimonials
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/login">
                <Button variant="outline" size="sm" className="hidden md:flex">
                  Log in
                </Button>
              </Link>
            )}
            <Link href={isAuthenticated ? "/dashboard" : "/register"}>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                {isAuthenticated ? "Dashboard" : "Start Free"}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <HeroSection />

        {/* Features Section */}
        <section id="features" className="py-12 md:py-24 bg-emerald-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Everything You Need to Sell on WhatsApp
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Create your WhatsApp store in minutes with these powerful features
                </p>
              </div>
            </div>
            <FeatureShowcase />
          </div>
        </section>

        {/* How It Works */}
        <section className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start Selling in 3 Simple Steps
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  No technical knowledge required - just your phone and your products
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 pt-12">
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  1
                </div>
                <h3 className="text-xl font-bold">Upload Products</h3>
                <p className="text-sm text-gray-500">
                  Add photos, prices, and descriptions of your products using your phone
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  2
                </div>
                <h3 className="text-xl font-bold">Get Your Store Link</h3>
                <p className="text-sm text-gray-500">Receive your custom store URL (yourstore.whatsbuy.in) instantly</p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border p-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  3
                </div>
                <h3 className="text-xl font-bold">Share & Sell</h3>
                <p className="text-sm text-gray-500">
                  Share your store link on WhatsApp, Instagram, Facebook and start receiving orders
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-12 md:py-24 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Simple, Transparent Pricing
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Choose the plan that works for your business
                </p>
              </div>
            </div>
            <PricingPlans />
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Trusted by Local Sellers Across India
                </h2>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  See what our customers are saying about WhatsBuy.in
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 pt-12">
              {[
                {
                  name: "Priya Sharma",
                  business: "Priya's Handmade Jewelry",
                  location: "Jaipur",
                  quote:
                    "I started selling my jewelry on WhatsApp within minutes. My customers love how easy it is to order!",
                },
                {
                  name: "Rajesh Kumar",
                  business: "Fresh Groceries",
                  location: "Pune",
                  quote:
                    "WhatsBuy.in helped me organize my grocery business. Now I get 30% more orders through WhatsApp.",
                },
                {
                  name: "Anita Patel",
                  business: "Anita's Fashion",
                  location: "Ahmedabad",
                  quote:
                    "The simplicity is what I love. My customers can browse products and order directly on WhatsApp.",
                },
              ].map((testimonial, index) => (
                <div key={index} className="flex flex-col space-y-2 rounded-lg border p-6">
                  <p className="text-sm text-gray-500">"{testimonial.quote}"</p>
                  <div className="flex items-center space-x-2 pt-4">
                    <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-emerald-600 font-bold">{testimonial.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{testimonial.name}</h4>
                      <p className="text-xs text-gray-500">
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
        <section className="py-12 md:py-24 bg-emerald-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start Selling on WhatsApp in 60 Seconds – No Website Needed
                </h2>
                <p className="mx-auto max-w-[700px] text-emerald-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join thousands of local sellers who are growing their business with WhatsBuy.in
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-emerald-50">
                    Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-emerald-700">
                    See Demo
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white">
        <div className="container flex flex-col gap-6 py-8 px-4 md:px-6 md:flex-row md:justify-between">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-6 w-6 text-emerald-600" />
              <span className="text-xl font-bold text-emerald-600">WhatsBuy.in</span>
            </div>
            <p className="text-sm text-gray-500">Empowering local sellers with WhatsApp-powered storefronts</p>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Product</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Testimonials
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Company</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Support</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Legal</h4>
              <ul className="space-y-1 text-sm">
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-emerald-600">
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t py-6">
          <div className="container flex flex-col items-center justify-between gap-4 px-4 md:px-6 md:flex-row">
            <p className="text-xs text-gray-500">© 2025 WhatsBuy.in. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <Link href="#" className="text-xs text-gray-500 hover:text-emerald-600">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-gray-500 hover:text-emerald-600">
                Terms of Service
              </Link>
              <Link href="#" className="text-xs text-gray-500 hover:text-emerald-600">
                Cookies Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
