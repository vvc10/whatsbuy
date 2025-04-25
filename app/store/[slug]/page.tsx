import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { MessageCircle, ShoppingBag, Star, Search, Filter, ChevronRight, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createServerClient } from "@/lib/supabase/server"
import StoreShareButton from "@/components/store/store-share-button"
import StoreThemeProvider from "@/components/store/store-theme-provider"
import ProductCard from "@/components/store/product-card"
import FloatingWhatsAppButton from "@/components/store/floating-whatsapp-button"
import type { Metadata } from "next"
import ViewTracker from "@/components/store/view-tracker"

interface StorePageProps {
  params: { slug: string }
}

export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  try {
    const supabase = createServerClient()
    const { data: store } = await supabase.from("stores").select("name, description").eq("slug", params.slug).single()

    if (!store) return { title: "Store Not Found" }

    return {
      title: `${store.name} | WhatsBuy.in`,
      description: store.description || `Shop at ${store.name} - Powered by WhatsBuy.in`,
      openGraph: {
        title: `${store.name} | WhatsBuy.in`,
        description: store.description || `Shop at ${store.name} - Powered by WhatsBuy.in`,
        type: "website",
      },
    }
  } catch (error) {
    return { title: "Online Store | WhatsBuy.in" }
  }
}

export default async function StorePage({ params }: StorePageProps) {
  try {
    const supabase = createServerClient()

    // Fetch store details with all settings
    const { data: store, error } = await supabase.from("stores").select("*").eq("slug", params.slug).single()

    if (error || !store) notFound()

    // Fetch store's active products
    const { data: products } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .eq("is_active", true)
      .order("created_at", { ascending: false })

    // Fetch featured products (top 3 products)
    const { data: featuredProducts } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .eq("is_active", true)
      .limit(3)
      .order("created_at", { ascending: false })

    // Get unique categories from products
    const categories = products ? [...new Set(products.map((product) => product.category).filter(Boolean))] : []

    // Get testimonials (placeholder for now)
    const testimonials = [
      {
        id: 1,
        name: "Priya Sharma",
        avatar: "/avatars/priya.jpg",
        rating: 5,
        text: "Amazing products and super fast delivery! Will definitely shop again.",
      },
      {
        id: 2,
        name: "Rahul Patel",
        avatar: "/avatars/rahul.jpg",
        rating: 4,
        text: "Great quality and reasonable prices. The WhatsApp ordering process was very convenient.",
      },
      {
        id: 3,
        name: "Ananya Singh",
        avatar: "/avatars/ananya.jpg",
        rating: 5,
        text: "Excellent customer service! They were very responsive on WhatsApp.",
      },
    ]

    const whatsappChatLink = store.whatsapp_number
      ? `https://wa.me/${store.whatsapp_number}?text=${encodeURIComponent(
          (store.chat_message || `Hi ${store.name}, I'm interested in your products.`).replace(
            "[STORE_NAME]",
            store.name,
          ),
        )}`
      : null
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
        <ViewTracker storeId={store.id} />
        <div className="flex min-h-screen flex-col bg-white">
          {/* REDESIGNED HEADER - Cleaner, more modern */}
          {store.show_logo !== false && (
            <header
              className="sticky top-0 z-30 flex h-16 items-center border-b bg-white/95 backdrop-blur-sm"
              style={{ boxShadow: store.header_shadow || "0 1px 2px 0 rgba(0, 0, 0, 0.05)" }}
            >
              <div className="container mx-auto max-w-6xl flex items-center justify-between px-4">
                <div className="flex items-center gap-3 font-medium">
                  {store.logo_url && store.show_logo ? (
                    <Image
                      src={store.logo_url || "/placeholder.svg"}
                      alt={store.name}
                      width={36}
                      height={36}
                      className="h-9 w-9 object-contain rounded-md"
                    />
                  ) : (
                    <div className="h-9 w-9 flex items-center justify-center bg-primary/10 rounded-md">
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
                      <Button
                        size="sm"
                        className="bg-primary hover:bg-primary/90 text-white rounded-full shadow-sm transition-all duration-300 hover:shadow"
                      >
                        <MessageCircle className="mr-2 h-4 w-4" /> Chat
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </header>
          )}

          {/* REDESIGNED BANNER - More elegant with overlay gradient */}
          {store.show_banner !== false && (
            <div className="relative overflow-hidden bg-gradient-to-r from-gray-950 to-gray-900 text-white">
              {store.banner_url ? (
                <div className="absolute inset-0 opacity-30">
                  <Image
                    src={store.banner_url || "/placeholder.svg"}
                    alt={store.name}
                    fill
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 pointer-events-none"></div>
              <div className="container mx-auto max-w-6xl px-4 py-16 relative z-10">
                <div className="max-w-2xl">
                  <h1
                    className="text-3xl sm:text-5xl font-bold mb-4 tracking-tight"
                    style={{ fontFamily: store.category_font || "inherit" }}
                  >
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

          {/* REDESIGNED SEARCH - More elegant, floating appearance */}
          <div className="sticky top-16 z-20 bg-white py-4 border-b border-gray-100">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    className="pl-9 bg-gray-50 border-none shadow-sm rounded-full h-10 focus-visible:ring-primary/20 focus-visible:ring-offset-0"
                    style={{
                      borderRadius: store.category_button_style === "rounded" ? "9999px" : "0.5rem",
                      fontFamily: store.category_font || "inherit",
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 h-10 w-10 border-none bg-gray-50 shadow-sm hover:bg-gray-100"
                  style={{
                    borderRadius: store.category_button_style === "rounded" ? "9999px" : "0.5rem",
                  }}
                >
                  <Filter className="h-4 w-4" />
                </Button>
              </div>

              {/* REDESIGNED CATEGORIES - Cleaner tabs with subtle indicators */}
              {categories.length > 0 && (
                <div className="mt-4 overflow-x-auto scrollbar-hide">
                  <Tabs defaultValue="all" className="w-full">
                    <TabsList className="bg-transparent p-0 h-10 w-full justify-start border-b border-gray-100">
                      <TabsTrigger
                        value="all"
                        className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 font-medium"
                        style={{ fontFamily: store.category_font || "inherit" }}
                      >
                        All
                      </TabsTrigger>
                      {categories.map((category) => (
                        <TabsTrigger
                          key={category}
                          value={category}
                          className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary px-4 font-medium whitespace-nowrap"
                          style={{ fontFamily: store.category_font || "inherit" }}
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

          {/* MAIN CONTENT */}
          <main className="flex-1">
            {/* REDESIGNED FEATURED PRODUCTS - Clean cards with soft shadows */}
            {featuredProducts &&
              featuredProducts.length > 0 &&
              store.homepage_sections?.featured_products !== false && (
                <section className="py-16">
                  <div className="container mx-auto max-w-6xl px-4">
                    <div className="flex items-center justify-between mb-8">
                      <h2
                        className="text-2xl font-semibold text-gray-900"
                        style={{ fontFamily: store.category_font || "inherit" }}
                      >
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
                          featured
                          style={{
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                            border: "none",
                            borderRadius: "0.75rem",
                            transition: "all 0.3s ease",
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </section>
              )}

            {/* REDESIGNED CATEGORIES - Modern grid with subtle hover effects */}
            {categories && categories.length > 0 && store.homepage_sections?.categories !== false && (
              <section className="py-16 bg-gray-50">
                <div className="container mx-auto max-w-6xl px-4">
                  <h2
                    className="text-2xl font-semibold mb-8 text-gray-900"
                    style={{ fontFamily: store.category_font || "inherit" }}
                  >
                    Shop by Category
                  </h2>
                  <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 md:grid-cols-4">
                    {categories.map((category) => (
                      <Link
                        key={category}
                        href={`/store/${store.slug}?category=${encodeURIComponent(category)}`}
                        className="group"
                      >
                        <div
                          className="aspect-square rounded-xl bg-white flex items-center justify-center overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1"
                          style={{
                            boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                            border: "none",
                            transition: "all 0.3s ease",
                          }}
                        >
                          <div className="text-center p-4">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                              <ShoppingBag className="h-6 w-6 text-primary" />
                            </div>
                            <h3
                              className="font-medium text-gray-900"
                              style={{ fontFamily: store.category_font || "inherit" }}
                            >
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

            {/* REDESIGNED NEW ARRIVALS - Clean asymmetrical layout */}
            {store.homepage_sections?.new_arrivals !== false && (
              <section className="py-16">
                <div className="container mx-auto max-w-6xl px-4">
                  <div
                    className="overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white"
                    style={{
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      border: "none",
                    }}
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="p-8 sm:p-12 flex flex-col justify-center">
                        <h2
                          className="text-3xl sm:text-4xl font-bold mb-6 tracking-tight"
                          style={{ fontFamily: store.category_font || "inherit" }}
                        >
                          New Collection
                        </h2>
                        <p className="text-gray-300 mb-8 leading-relaxed">
                          Discover our latest arrivals, designed with quality and style in mind. Perfect for every
                          occasion.
                        </p>
                        <Button className="bg-white text-gray-900 hover:bg-gray-100 w-fit rounded-full px-6">
                          Explore Collection <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                      <div className="relative h-64 md:h-auto">
                        <Image
                          src="/placeholder.svg?height=400&width=600"
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

            {/* REDESIGNED ALL PRODUCTS - Clean, consistent grid */}
            {products && products.length > 0 && (
              <section className="py-16">
                <div className="container mx-auto max-w-6xl px-4">
                  <h2
                    className="text-2xl font-semibold mb-8 text-gray-900"
                    style={{ fontFamily: store.category_font || "inherit" }}
                  >
                    All Products
                  </h2>
                  <div className="grid gap-6 grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        store={store}
                        style={{
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                          border: "none",
                          borderRadius: "0.75rem",
                          transition: "all 0.3s ease",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* REDESIGNED TESTIMONIALS - Elegant cards with subtle details */}
            {store.homepage_sections?.testimonials !== false && (
              <section className="py-16 bg-gray-50">
                <div className="container mx-auto max-w-6xl px-4">
                  <h2
                    className="text-2xl font-semibold mb-8 text-gray-900"
                    style={{ fontFamily: store.category_font || "inherit" }}
                  >
                    What Our Customers Say
                  </h2>
                  <div className="grid gap-8 sm:grid-cols-3">
                    {testimonials.map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="p-8 bg-white rounded-xl transition-all duration-300 hover:shadow-md relative"
                        style={{
                          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
                          border: "none",
                          transition: "all 0.3s ease",
                        }}
                      >
                        <div className="absolute top-4 right-4 text-gray-200">
                          <svg
                            width="40"
                            height="32"
                            viewBox="0 0 40 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M17.5 4.8C9.9 7.2 3.5 13.6 3.5 22C3.5 27.2 7.1 30.4 11.5 30.4C15.9 30.4 18.7 27.2 18.7 23.2C18.7 19.2 15.9 16.8 12.7 16.8C11.9 16.8 11.1 16.8 10.7 17.2C11.9 13.2 16.3 9.2 17.9 8C17.9 8 17.5 4.8 17.5 4.8ZM36.7 4.8C29.1 7.2 22.7 13.6 22.7 22C22.7 27.2 26.3 30.4 30.7 30.4C35.1 30.4 37.9 27.2 37.9 23.2C37.9 19.2 35.1 16.8 31.9 16.8C31.1 16.8 30.3 16.8 29.9 17.2C31.1 13.2 35.5 9.2 37.1 8C37.1 8 36.7 4.8 36.7 4.8Z"
                              fill="currentColor"
                            />
                          </svg>
                        </div>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="h-12 w-12 rounded-full bg-gray-100 overflow-hidden">
                            <Image
                              src={`/placeholder.svg?height=48&width=48`}
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

            {/* REDESIGNED NEWSLETTER - Clean, bold call to action */}
            {store.homepage_sections?.about_store !== false && (
              <section className="py-16">
                <div className="container mx-auto max-w-6xl px-4">
                  <div
                    className="bg-white rounded-2xl p-12 text-center"
                    style={{
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      border: "none",
                    }}
                  >
                    <h2
                      className="text-3xl font-bold mb-4 text-gray-900"
                      style={{ fontFamily: store.category_font || "inherit" }}
                    >
                      Stay Updated
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-xl mx-auto">
                      Subscribe to our newsletter to receive updates on new products, special offers, and more.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                      <Input
                        placeholder="Your email address"
                        className="rounded-full border-gray-200 focus-visible:ring-primary/20 focus-visible:ring-offset-0 h-12"
                        style={{
                          borderRadius: store.category_button_style === "rounded" ? "9999px" : "0.5rem",
                        }}
                      />
                      <Button
                        className="bg-primary hover:bg-primary/90 rounded-full whitespace-nowrap h-12 px-8 text-white font-medium shadow-sm hover:shadow transition-all duration-300"
                        style={{
                          borderRadius: store.category_button_style === "rounded" ? "9999px" : "0.5rem",
                        }}
                      >
                        Subscribe
                      </Button>
                    </div>
                  </div>
                </div>
              </section>
            )}
          </main>

          {/* REDESIGNED FOOTER - Clean, well-organized sections */}
          <footer className="border-t bg-white py-16">
            <div className="container mx-auto max-w-6xl px-4">
              <div className="grid gap-12 sm:grid-cols-2 md:grid-cols-4 mb-12">
                {store.footer_links?.about_us !== false && (
                  <div>
                    <h3
                      className="font-semibold mb-4 text-gray-900"
                      style={{ fontFamily: store.category_font || "inherit" }}
                    >
                      About {store.name}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {store.description ||
                        `${store.name} offers quality products with fast delivery and excellent customer service.`}
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
                    <h3
                      className="font-semibold mb-4 text-gray-900"
                      style={{ fontFamily: store.category_font || "inherit" }}
                    >
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
                  <h3
                    className="font-semibold mb-4 text-gray-900"
                    style={{ fontFamily: store.category_font || "inherit" }}
                  >
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
                    <h3
                      className="font-semibold mb-4 text-gray-900"
                      style={{ fontFamily: store.category_font || "inherit" }}
                    >
                      Follow Us
                    </h3>
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-10 w-10 border-gray-200"
                        style={{
                          borderRadius: store.category_button_style === "rounded" ? "9999px" : "0.5rem",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" />
                        </svg>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-10 w-10 border-gray-200"
                        style={{
                          borderRadius: store.category_button_style === "rounded" ? "9999px" : "0.5rem",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                        </svg>
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="rounded-full h-10 w-10 border-gray-200"
                        style={{
                          borderRadius: store.category_button_style === "rounded" ? "9999px" : "0.5rem",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z" />
                        </svg>
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

              {/* REDESIGNED POWERED BY SECTION - Cleaner, more elegant */}
              {store.show_powered_by !== false && (
                <div className="pt-8 border-t text-sm text-gray-500 text-center">
                  <p>
                    Powered by <span className="font-medium text-primary">WhatsBuy.in</span> - Create your own WhatsApp
                    store in 60 seconds
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

          {/* FLOATING WHATSAPP BUTTON - Redesigned, more elegant */}
          {whatsappChatLink && (
            <FloatingWhatsAppButton
              whatsappNumber={store.whatsapp_number}
              storeName={store.name}
              whatsappChatLink={whatsappChatLink}
            />
          )}
        </div>
      </StoreThemeProvider>
    )
  } catch (error) {
    console.error("Store page error:", error)
    notFound()
  }
}
