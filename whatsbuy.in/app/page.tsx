import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, MessageCircle, ShieldCheck, Smartphone } from "lucide-react"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
    
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageCircle className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold">Whatsbuy.in</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-sm font-medium hover:text-emerald-600 transition-colors">
              Log in
            </Link>
            <Button asChild size="sm">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="flex-1">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Sell Your Services via WhatsApp</h1>
              <p className="text-lg text-gray-600">
                Whatsbuy.in is the easiest way to monetize your expertise and services through WhatsApp. Create your
                profile, set your offerings, and start selling today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="px-8">
                  <Link href="/signup">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Log in to your account</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg blur opacity-25"></div>
                <div className="relative bg-white p-6 rounded-lg shadow-xl">
                  <img
                    src="/placeholder.svg?height=400&width=400"
                    alt="Whatsbuy.in platform preview"
                    className="w-full rounded-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose Whatsbuy.in?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Sell Where Clients Are</h3>
              <p className="text-gray-600">
                Connect with clients on WhatsApp, the platform they already use and love. No need for them to download
                new apps.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <MessageCircle className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Communication</h3>
              <p className="text-gray-600">
                Chat directly with clients, share files, and close deals all through the familiar WhatsApp interface.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-12 w-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-gray-600">
                Receive payments securely through our integrated payment system while chatting with your clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to start selling on WhatsApp?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are growing their business with Whatsbuy.in
          </p>
          <Button asChild size="lg" className="px-8">
            <Link href="/signup">Create Your Account</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-6 w-6 text-emerald-500" />
                <span className="text-xl font-bold text-white">Whatsbuy.in</span>
              </div>
              <p className="mt-2 text-sm text-gray-400">Sell your services via WhatsApp</p>
            </div>
            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-8">
              <Link href="/signup" className="text-sm hover:text-emerald-500 transition-colors">
                Sign Up
              </Link>
              <Link href="/login" className="text-sm hover:text-emerald-500 transition-colors">
                Log In
              </Link>
              <Link href="#" className="text-sm hover:text-emerald-500 transition-colors">
                About Us
              </Link>
              <Link href="#" className="text-sm hover:text-emerald-500 transition-colors">
                Contact
              </Link>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            &copy; {new Date().getFullYear()} Whatsbuy.in. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
