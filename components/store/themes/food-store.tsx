"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import {
  MessageCircle,
  Star,
  Search,
  ChevronRight,
  ArrowRight,
  Leaf,
  Instagram,
  Facebook,
  Twitter,
  ShoppingBag,
  Menu,
  X,
  Sun,
  Sparkles,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import StoreShareButton from "@/components/store/store-share-button"
import ProductCard from "@/components/store/product-card"
import FloatingWhatsAppButton from "@/components/store/floating-whatsapp-button"
import { cn } from "@/lib/utils"

export default function OrganicFoodStore({
  store,
  products,
  featuredProducts,
  categories,
  testimonials,
  whatsappChatLink,
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f6f0]">
      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-30 flex h-16 items-center border-b backdrop-blur-sm transition-all duration-300",
          scrolled ? "bg-[#f8f6f0]/90 shadow-sm" : "bg-transparent border-transparent",
        )}
      >
        <div className="container mx-auto max-w-5xl flex items-center justify-between px-4">
          {store.show_logo !== false && (
            <Link href={`/store/${store.slug}`} className="flex items-center gap-2 font-medium">
              {store.logo_url && store.show_logo ? (
                <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-[#e4dbc8] p-0.5">
                  <Image
                    src={store.logo_url}
                    alt={store.name}
                    width={36}
                    height={36}
                    className="h-full w-full object-contain rounded-full"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 flex items-center justify-center bg-[#e4dbc8] rounded-full">
                  <Leaf className="h-5 w-5 text-[#5c8d67]" />
                </div>
              )}
              <span className="font-serif font-semibold tracking-tight text-[#3a523f]">{store.name}</span>
            </Link>
          )}

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full text-[#5c8d67] hover:bg-[#e4dbc8] hover:text-[#3a523f]"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-[#5c8d67] hover:bg-[#e4dbc8] hover:text-[#3a523f]"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="bg-[#f8f6f0] border-l border-[#e4dbc8]">
                <SheetHeader>
                  <SheetTitle className="font-serif text-[#3a523f]">Menu</SheetTitle>
                  <SheetDescription>Browse our organic categories and products</SheetDescription>
                </SheetHeader>
                <div className="mt-6 space-y-6">
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-[#3a523f]">Categories</h3>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <Link
                          key={category}
                          href={`/store/${store.slug}?category=${encodeURIComponent(category)}`}
                          className="block py-2 text-[#5c8d67] hover:text-[#3a523f] transition-colors"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium mb-3 text-[#3a523f]">Quick Links</h3>
                    <div className="space-y-2">
                      {store.footer_links?.about_us !== false && (
                        <Link
                          href={`/store/${store.slug}/about`}
                          className="block py-2 text-[#5c8d67] hover:text-[#3a523f] transition-colors"
                        >
                          About Us
                        </Link>
                      )}
                      {store.footer_links?.contact !== false && (
                        <Link
                          href={`/store/${store.slug}/contact`}
                          className="block py-2 text-[#5c8d67] hover:text-[#3a523f] transition-colors"
                        >
                          Contact
                        </Link>
                      )}
                      {whatsappChatLink && (
                        <Link
                          href={whatsappChatLink}
                          target="_blank"
                          className="block py-2 text-[#5c8d67] hover:text-[#3a523f] transition-colors"
                        >
                          Chat with Us
                        </Link>
                      )}
                    </div>
                  </div>
                  {store.show_social_icons !== false && (
                    <div className="pt-6 border-t border-[#e4dbc8]">
                      <div className="flex gap-4">
                        <Link
                          href="https://instagram.com"
                          target="_blank"
                          className="h-10 w-10 rounded-full bg-[#e4dbc8] hover:bg-[#d6c9a9] flex items-center justify-center text-[#5c8d67]"
                        >
                          <Instagram className="h-5 w-5" />
                        </Link>
                        <Link
                          href="https://facebook.com"
                          target="_blank"
                          className="h-10 w-10 rounded-full bg-[#e4dbc8] hover:bg-[#d6c9a9] flex items-center justify-center text-[#5c8d67]"
                        >
                          <Facebook className="h-5 w-5" />
                        </Link>
                        <Link
                          href="https://twitter.com"
                          target="_blank"
                          className="h-10 w-10 rounded-full bg-[#e4dbc8] hover:bg-[#d6c9a9] flex items-center justify-center text-[#5c8d67]"
                        >
                          <Twitter className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>

            {store.show_share_buttons !== false && (
              <StoreShareButton storeSlug={store.slug} storeName={store.name} />
            )}

            {whatsappChatLink && (
              <Link href={whatsappChatLink} target="_blank">
                <Button size="sm" className="bg-[#5c8d67] hover:bg-[#3a523f] text-white rounded-full shadow-sm">
                  <MessageCircle className="mr-2 h-4 w-4" /> Chat
                </Button>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Search Bar (Conditional) */}
      {isSearchOpen && (
        <div className="border-b border-[#e4dbc8] bg-[#f8f6f0] py-3 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5c8d67]" />
              <Input
                placeholder="Search organic products..."
                className="pl-9 border-[#e4dbc8] bg-white rounded-full h-11 focus-visible:ring-[#5c8d67]"
                autoFocus
              />
            </div>
          </div>
        </div>
      )}

      {/* Banner */}
      {store.show_banner !== false && (
        <div className="relative overflow-hidden bg-[#3a523f] text-white">
          {store.banner_url && (
            <div className="absolute inset-0 opacity-30">
              <Image
                src={store.banner_url}
                alt={store.name}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#3a523f]/70 z-10"></div>
          <div className="container mx-auto max-w-5xl px-4 py-24 relative z-20">
            <div className="max-w-2xl">
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-3 py-1 rounded-full mb-4">
                100% Organic & Natural
              </Badge>
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {store.name}
              </h1>
              {store.description && (
                <p className="text-lg text-white/90 mb-8 leading-relaxed">{store.description}</p>
              )}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-0.5 text-[#d4a24e]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-[#d4a24e]" />
                  ))}
                </div>
                <span className="text-sm text-white/90">5.0 (24 reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-3 py-1 rounded-full">
                  100% Organic
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-3 py-1 rounded-full">
                  Farm Fresh
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-3 py-1 rounded-full">
                  Eco-Friendly
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Categories Tabs */}
      {categories.length > 0 && (
        <div className="border-y border-[#e4dbc8] bg-[#f0ece0]">
          <div className="container mx-auto max-w-5xl px-4">
            <div className="overflow-x-auto scrollbar-hide py-2">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-transparent p-0 h-10 w-full justify-start">
                  <TabsTrigger
                    value="all"
                    className="rounded-full data-[state=active]:bg-[#5c8d67] data-[state=active]:text-white px-5 font-medium"
                  >
                    All
                  </TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="rounded-full data-[state=active]:bg-[#5c8d67] data-[state=active]:text-white px-5 font-medium whitespace-nowrap"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {/* Featured Products */}
        {featuredProducts?.length > 0 && store.homepage_sections?.featured_products !== false && (
          <section className="py-16">
            <div className="container mx-auto max-w-5xl px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="font-serif text-2xl font-bold text-[#3a523f] relative">
                  Featured Products
                  <span className="absolute -bottom-2 left-0 w-12 h-1 bg-[#d4a24e]"></span>
                </h2>
                <Button variant="link" className="text-[#5c8d67] p-0 h-auto font-normal hover:text-[#3a523f]">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-3">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    store={store}
                    storeType="food"
                    featured
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories Grid */}
        {categories?.length > 0 && store.homepage_sections?.categories !== false && (
          <section className="py-16 bg-[#f0ece0]">
            <div className="container mx-auto max-w-5xl px-4">
              <h2 className="font-serif text-2xl font-bold text-[#3a523f] mb-8 text-center relative inline-block">
                Shop by Category
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-[#d4a24e]"></span>
              </h2>
              <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/store/${store.slug}?category=${encodeURIComponent(category)}`}
                    className="group"
                  >
                    <div className="aspect-square rounded-xl bg-white flex items-center justify-center overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 border border-[#e4dbc8]">
                      <div className="text-center p-4">
                        <div className="w-14 h-14 bg-[#e4dbc8] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-[#d6c9a9] transition-colors duration-300">
                          <CategoryIcon category={category} />
                        </div>
                        <h3 className="font-medium text-[#3a523f]">
                          {category}
                        </h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* New Collection Banner */}
        {store.homepage_sections?.new_arrivals !== false && (
          <section className="py-16">
            <div className="container mx-auto max-w-5xl px-4">
              <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-[#3a523f] to-[#5c8d67] text-white shadow-lg">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-8 sm:p-12 flex flex-col justify-center">
                    <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 mb-4 w-fit">New Arrival</Badge>
                    <h2 className="font-serif text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
                      New Collection
                    </h2>
                    <p className="text-white/80 mb-8 leading-relaxed">
                      Discover our latest arrivals, designed with quality and style in mind. Perfect for every occasion.
                    </p>
                    <Button className="bg-white text-[#3a523f] hover:bg-gray-100 w-fit rounded-full px-6">
                      Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                  <div className="relative h-64 md:h-auto">
                    <Image
                      src="https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                      alt="New Collection"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* All Products */}
        {products?.length > 0 && (
          <section className="py-16">
            <div className="container mx-auto max-w-5xl px-4">
              <h2 className="font-serif text-2xl font-bold text-[#3a523f] mb-8 relative inline-block">
                All Products
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-[#d4a24e]"></span>
              </h2>
              <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    store={store}
                    storeType="food"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        {store.homepage_sections?.testimonials !== false && (
          <section className="py-16 bg-[#f0ece0]">
            <div className="container mx-auto max-w-5xl px-4">
              <h2 className="font-serif text-2xl font-bold text-[#3a523f] mb-8 text-center relative inline-block">
                What Our Customers Say
                <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-[#d4a24e]"></span>
              </h2>
              <div className="grid gap-8 sm:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="p-8 bg-white rounded-xl transition-all duration-300 hover:shadow-md border border-[#e4dbc8]"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-[#e4dbc8]">
                        <Image
                          src={testimonial.avatar || "/placeholder.svg"}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-[#3a523f]">{testimonial.name}</p>
                        <div className="flex text-[#d4a24e]">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-[#d4a24e]" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-[#5c8d67] leading-relaxed">{testimonial.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter */}
        {store.homepage_sections?.about_store !== false && (
          <section className="py-16">
            <div className="container mx-auto max-w-5xl px-4">
              <div className="bg-[#3a523f] rounded-2xl p-12 text-center shadow-md">
                <h2 className="font-serif text-3xl font-bold mb-4 text-white">
                  Stay Updated
                </h2>
                <p className="text-white/80 mb-8 max-w-xl mx-auto">
                  Subscribe to our newsletter to receive updates on new products, special offers, and more.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    placeholder="Your email address"
                    className="rounded-full border-transparent h-12 focus-visible:ring-[#d4a24e] bg-white/10 text-white placeholder:text-white/60"
                  />
                  <Button className="bg-[#d4a24e] hover:bg-[#c08e3a] text-white rounded-full h-12 px-8 font-medium">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#e4dbc8] bg-white py-16">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 mb-12">
            {store.footer_links?.about_us !== false && (
              <div>
                <h3 className="font-semibold mb-4 text-[#3a523f]">About {store.name}</h3>
                <p className="text-[#5c8d67] leading-relaxed">
                  {store.description || `${store.name} offers quality products with fast delivery and excellent customer service.`}
                </p>
                <Link
                  href={`/store/${store.slug}/about`}
                  className="text-[#5c8d67] font-medium mt-4 inline-block hover:underline"
                >
                  Learn more
                </Link>
              </div>
            )}

            {store.footer_links?.contact !== false && (
              <div>
                <h3 className="font-semibold mb-4 text-[#3a523f]">Contact Us</h3>
                <p className="text-[#5c8d67] leading-relaxed">
                  Have questions? Reach out to us on WhatsApp for quick assistance.
                </p>
                {store.whatsapp_number && (
                  <Link
                    href={`https://wa.me/${store.whatsapp_number}`}
                    target="_blank"
                    className="text-[#5c8d67] font-medium mt-4 inline-flex items-center hover:underline"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />+{store.whatsapp_number}
                  </Link>
                )}
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-4 text-[#3a523f]">Quick Links</h3>
              <ul className="space-y-3">
                {store.footer_links?.privacy_policy !== false && (
                  <li>
                    <Link
                      href={`/store/${store.slug}/privacy-policy`}
                      className="text-[#5c8d67] hover:text-[#3a523f] transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                )}
                {store.footer_links?.terms_of_service !== false && (
                  <li>
                    <Link
                      href={`/store/${store.slug}/terms-of-service`}
                      className="text-[#5c8d67] hover:text-[#3a523f] transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                )}
                {store.footer_links?.shipping_returns !== false && (
                  <li>
                    <Link
                      href={`/store/${store.slug}/shipping-returns`}
                      className="text-[#5c8d67] hover:text-[#3a523f] transition-colors"
                    >
                      Shipping & Returns
                    </Link>
                  </li>
                )}
                {!store.is_premium && (
                  <li className="pt-2">
                    <Link href="/pricing" className="text-[#5c8d67] font-medium hover:underline">
                      Upgrade to premium
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {store.show_social_icons !== false && (
              <div>
                <h3 className="font-semibold mb-4 text-[#3a523f]">Follow Us</h3>
                <div className="flex gap-3">
                  <Link
                    href="https://instagram.com"
                    target="_blank"
                    className="h-10 w-10 rounded-full bg-[#e4dbc8] hover:bg-[#d6c9a9] flex items-center justify-center text-[#5c8d67]"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://facebook.com"
                    target="_blank"
                    className="h-10 w-10 rounded-full bg-[#e4dbc8] hover:bg-[#d6c9a9] flex items-center justify-center text-[#5c8d67]"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    className="h-10 w-10 rounded-full bg-[#e4dbc8] hover:bg-[#d6c9a9] flex items-center justify-center text-[#5c8d67]"
                  >
                    <Twitter className="h-5 w-5" />
                  </Link>
                </div>
                {!store.is_premium && (
                  <div className="mt-6">
                    <Link href="/pricing" className="text-[#5c8d67] text-sm hover:underline">
                      Upgrade to premium to customize
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Powered By Section */}
          {store.show_powered_by !== false && (
            <div className="pt-8 border-t border-[#e4dbc8] text-sm text-[#5c8d67] text-center">
              <p>
                Powered by <span className="font-medium text-[#3a523f]">WhatsBuy.in</span> - Create your own WhatsApp store in 60 seconds
              </p>
              {!store.is_premium && (
                <p className="mt-3">
                  <Link href="/pricing" className="text-[#5c8d67] font-medium hover:underline">
                    Upgrade to premium to customize
                  </Link>
                </p>
              )}
            </div>
          )}
        </div>
      </footer>

      {/* Floating WhatsApp Button */}
      {whatsappChatLink && (
        <FloatingWhatsAppButton
          whatsappNumber={store.whatsapp_number}
          storeName={store.name}
          whatsappChatLink={whatsappChatLink}
        />
      )}
    </div>
  )
}

// Helper component for category icons
function CategoryIcon({ category }) {
  switch (category.toLowerCase()) {
    case "fruits":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#d4a24e]"
        >
          <path d="M17.5 6.5c.5 0 .9.4.9.9 0 2.5-2.4 4.5-5.4 4.5-2.5 0-4.6-1.5-5.2-3.5" />
          <path d="M14.5 4.5c0 1.1-.9 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2z" />
          <path d="M7 14c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2" />
          <path d="M14.5 14c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2z" />
        </svg>
      )
    case "vegetables":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#5c8d67]"
        >
          <path d="M2 22s10-4 20-4V4s-10 4-20 4Z" />
        </svg>
      )
    case "dairy":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#5c8d67]"
        >
          <path d="M8 2h8" />
          <path d="M9 2v2.789a4 4 0 0 1-.672 2.219l-.656.984A4 4 0 0 0 7 10.212V20a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-9.789a4 4 0 0 0-.672-2.219l-.656-.984A4 4 0 0 1 15 4.788V2" />
        </svg>
      )
    case "bakery":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#d4a24e]"
        >
          <path d="M6 12h.01" />
          <path d="M2 8h20" />
          <path d="M2 20h20" />
          <path d="M2 14h.01" />
          <path d="M18 14h.01" />
          <path d="M10 14h.01" />
          <path d="M14 14h.01" />
          <path d="M6 18h.01" />
          <path d="M18 18h.01" />
          <path d="M10 18h.01" />
          <path d="M14 18h.01" />
          <path d="M20 4v.01" />
          <path d="M16 4v.01" />
          <path d="M12 4v.01" />
          <path d="M8 4v.01" />
          <path d="M4 4v.01" />
        </svg>
      )
    case "snacks":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#d4a24e]"
        >
          <path d="M12 2a9.96 9.96 0 0 0-7.071 2.929A9.96 9.96 0 0 0 2 12c0 5.523 4.477 10 10 10a9.96 9.96 0 0 0 7.071-2.929A9.96 9.96 0 0 0 22 12c0-5.523-4.477-10-10-10Z" />
          <path d="M12 6v12" />
          <path d="M6 12h12" />
        </svg>
      )
    case "beverages":
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[#5c8d67]"
        >
          <path d="M8 2h8" />
          <path d="M12 6v12" />
          <path d="M4 14c0 2.5 2 4 4 4" />
          <path d="M16 14c0 2.5 2 4 4 4" />
          <path d="M4 14v-3a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
        </svg>
      )
    default:
      return <Leaf className="h-6 w-6 text-[#5c8d67]" />
  }
}