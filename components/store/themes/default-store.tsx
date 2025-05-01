"use client"

import Link from "next/link"
import Image from "next/image"
import { MessageCircle, ShoppingBag, Star, Search, Filter, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StoreShareButton from "@/components/store/store-share-button"
import ProductCard from "@/components/store/product-card"
import FloatingWhatsAppButton from "@/components/store/floating-whatsapp-button"
import { cn } from "@/lib/utils"

export default function DefaultStore({ store, products, featuredProducts, categories, testimonials, whatsappChatLink }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Header */}
      {store.show_logo !== false && (
        <header className="sticky top-0 z-30 flex h-16 items-center border-b bg-white/95 backdrop-blur-sm">
          <div className="container mx-auto max-w-6xl flex items-center justify-between px-4">
            <div className="flex items-center gap-3 font-medium">
              {store.logo_url && store.show_logo ? (
                <Image
                  src={store.logo_url}
                  alt={store.name}
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain rounded-xl"
                />
              ) : (
                <div className="h-9 w-9 flex items-center justify-center bg-primary/10 rounded-xl">
                  <ShoppingBag className="h-5 w-5 text-primary" />
                </div>
              )}
              <span className="text-gray-900 font-semibold">{store.name}</span>
            </div>

            <div className="flex items-center gap-3">
              {store.show_share_buttons !== false && (
                <StoreShareButton storeSlug={store.slug} storeName={store.name} />
              )}
              {whatsappChatLink && (
                <Link href={whatsappChatLink} target="_blank">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white rounded-full">
                    <MessageCircle className="mr-2 h-4 w-4" /> Chat
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </header>
      )}

      {/* Banner */}
      {store.show_banner !== false && (
        <div className="relative overflow-hidden bg-gradient-to-r from-gray-950 to-gray-900 text-white">
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
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
          <div className="container mx-auto max-w-6xl px-4 py-16 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight">
                {store.name}
              </h1>
              {store.description && (
                <p className="text-lg text-gray-200 mb-8 leading-relaxed">{store.description}</p>
              )}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex items-center gap-0.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="fill-amber-400 h-4 w-4" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-200">5.0 (24 reviews)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-3 py-1 rounded-full">
                  Fast Delivery
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-3 py-1 rounded-full">
                  Secure Payments
                </Badge>
                <Badge className="bg-white/20 hover:bg-white/30 text-white border-0 px-3 py-1 rounded-full">
                  Quality Guaranteed
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search and Categories */}
      <div className="sticky top-16 z-20 bg-white py-4 border-b">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search products..."
                className="pl-9 bg-gray-50 border-none shadow-sm rounded-full h-10"
              />
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border-none bg-gray-50 shadow-sm hover:bg-gray-100 rounded-full"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>

          {categories.length > 0 && (
            <div className="mt-4 overflow-x-auto scrollbar-hide">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="bg-transparent p-0 h-10 w-full justify-start border-b">
                  <TabsTrigger
                    value="all"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 font-medium"
                  >
                    All
                  </TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 font-medium whitespace-nowrap"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        {/* Featured Products */}
        {featuredProducts?.length > 0 && store.homepage_sections?.featured_products !== false && (
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Featured Products
                </h2>
                <Button variant="link" className="text-primary p-0 h-auto font-normal">
                  View all <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              <div className="grid gap-8 grid-cols-1 sm:grid-cols-3">
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    store={store}
                    storeType="default"
                    featured
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Categories Grid */}
        {categories?.length > 0 && store.homepage_sections?.categories !== false && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-2xl font-semibold mb-8 text-gray-900">
                Shop by Category
              </h2>
              <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                {categories.map((category) => (
                  <Link
                    key={category}
                    href={`/store/${store.slug}?category=${encodeURIComponent(category)}`}
                    className="group"
                  >
                    <div className="aspect-square rounded-xl bg-white flex items-center justify-center overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                      <div className="text-center p-4">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                          <ShoppingBag className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-medium text-gray-900">
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
            <div className="container mx-auto max-w-6xl px-4">
              <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="p-8 sm:p-12 flex flex-col justify-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight">
                      New Collection
                    </h2>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                      Discover our latest arrivals, designed with quality and style in mind. Perfect for every occasion.
                    </p>
                    <Button className="bg-white text-gray-900 hover:bg-gray-100 w-fit rounded-full px-6">
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
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-2xl font-semibold mb-8 text-gray-900">
                All Products
              </h2>
              <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    store={store}
                    storeType="default"
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        {store.homepage_sections?.testimonials !== false && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto max-w-6xl px-4">
              <h2 className="text-2xl font-semibold mb-8 text-gray-900">
                What Our Customers Say
              </h2>
              <div className="grid gap-8 sm:grid-cols-3">
                {testimonials.map((testimonial) => (
                  <div
                    key={testimonial.id}
                    className="p-8 bg-white rounded-xl transition-all duration-300 hover:shadow-md relative"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-12 w-12 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{testimonial.name}</p>
                        <div className="flex text-amber-500">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-500" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{testimonial.text}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Newsletter */}
        {store.homepage_sections?.about_store !== false && (
          <section className="py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="bg-white rounded-2xl p-12 text-center shadow-md">
                <h2 className="text-3xl font-bold mb-4 text-gray-900">
                  Stay Updated
                </h2>
                <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                  Subscribe to our newsletter to receive updates on new products, special offers, and more.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                  <Input
                    placeholder="Your email address"
                    className="rounded-full border-gray-200 h-12"
                  />
                  <Button className="bg-primary hover:bg-primary/90 rounded-full h-12 px-8 text-white font-medium">
                    Subscribe
                  </Button>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-white py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 mb-12">
            {store.footer_links?.about_us !== false && (
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">
                  About {store.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {store.description || `${store.name} offers quality products with fast delivery and excellent customer service.`}
                </p>
                <Link
                  href={`/store/${store.slug}/about`}
                  className="text-primary font-medium mt-4 inline-block hover:underline"
                >
                  Learn more
                </Link>
              </div>
            )}

            {store.footer_links?.contact !== false && (
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">
                  Contact Us
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Have questions? Reach out to us on WhatsApp for quick assistance.
                </p>
                {store.whatsapp_number && (
                  <Link
                    href={`https://wa.me/${store.whatsapp_number}`}
                    target="_blank"
                    className="text-primary font-medium mt-4 inline-flex items-center hover:underline"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />+{store.whatsapp_number}
                  </Link>
                )}
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-4 text-gray-900">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {store.footer_links?.privacy_policy !== false && (
                  <li>
                    <Link
                      href={`/store/${store.slug}/privacy-policy`}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                )}
                {store.footer_links?.terms_of_service !== false && (
                  <li>
                    <Link
                      href={`/store/${store.slug}/terms-of-service`}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Terms of Service
                    </Link>
                  </li>
                )}
                {store.footer_links?.shipping_returns !== false && (
                  <li>
                    <Link
                      href={`/store/${store.slug}/shipping-returns`}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      Shipping & Returns
                    </Link>
                  </li>
                )}
                {!store.is_premium && (
                  <li className="pt-2">
                    <Link href="/pricing" className="text-primary font-medium hover:underline">
                      Upgrade to premium
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            {store.show_social_icons !== false && (
              <div>
                <h3 className="font-semibold mb-4 text-gray-900">
                  Follow Us
                </h3>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 border-gray-200"
                  >
                    <Link href="https://instagram.com" target="_blank">
                      <Image
                        src="https://api.iconify.design/mdi:instagram.svg"
                        alt="Instagram"
                        width={18}
                        height={18}
                      />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 border-gray-200"
                  >
                    <Link href="https://facebook.com" target="_blank">
                      <Image
                        src="https://api.iconify.design/mdi:facebook.svg"
                        alt="Facebook"
                        width={18}
                        height={18}
                      />
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full h-10 w-10 border-gray-200"
                  >
                    <Link href="https://twitter.com" target="_blank">
                      <Image
                        src="https://api.iconify.design/mdi:twitter.svg"
                        alt="Twitter"
                        width={18}
                        height={18}
                      />
                    </Link>
                  </Button>
                </div>
                {!store.is_premium && (
                  <div className="mt-6">
                    <Link href="/pricing" className="text-primary text-sm font-medium hover:underline">
                      Upgrade to premium to customize
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Powered By Section */}
          {store.show_powered_by !== false && (
            <div className="pt-8 border-t text-sm text-gray-500 text-center">
              <p>
                Powered by <span className="font-medium text-primary">WhatsBuy.in</span> - Create your own WhatsApp store in 60 seconds
              </p>
              {!store.is_premium && (
                <p className="mt-3">
                  <Link href="/pricing" className="text-primary font-medium hover:underline">
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