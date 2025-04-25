import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { createServerClient } from "@/lib/supabase/server"
import StoreThemeProvider from "@/components/store/store-theme-provider"
import FloatingWhatsAppButton from "@/components/store/floating-whatsapp-button"
import ProductCard from "@/components/store/product-card"
import ViewTracker from "@/components/store/view-tracker"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
  ChevronLeft,
  ShoppingBag,
  MessageCircle,
  Star,
  Truck,
  ShieldCheck,
  RefreshCw,
  Heart,
  Share2,
  Minus,
  Plus,
} from "lucide-react"
import type { Metadata } from "next"

interface ProductPageProps {
  params: { slug: string; id: string }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  try {
    const supabase = createServerClient()
    const { data: product } = await supabase.from("products").select("name, description").eq("id", params.id).single()

    if (!product) return { title: "Product Not Found" }

    return {
      title: `${product.name} | WhatsBuy.in`,
      description: product.description || `Check out this amazing product`,
      openGraph: {
        title: `${product.name} | WhatsBuy.in`,
        description: product.description || `Check out this amazing product`,
        type: "website",
      },
    }
  } catch (error) {
    return { title: "Product | WhatsBuy.in" }
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  try {
    const supabase = createServerClient()

    // Fetch product details
    const { data: product, error } = await supabase.from("products").select("*").eq("id", params.id).single()

    if (error || !product) notFound()

    // Fetch store details
    const { data: store } = await supabase.from("stores").select("*").eq("id", product.store_id).single()

    if (!store) notFound()

    // Fetch related products
    const { data: relatedProducts } = await supabase
      .from("products")
      .select("*")
      .eq("store_id", store.id)
      .eq("is_active", true)
      .neq("id", product.id)
      .eq("category", product.category)
      .limit(4)

    // Product images (using placeholder for demo)
    const productImages = [
      product.image_url || "/placeholder.svg?height=600&width=600",
      "/placeholder.svg?height=600&width=600&text=Image+2",
      "/placeholder.svg?height=600&width=600&text=Image+3",
      "/placeholder.svg?height=600&width=600&text=Image+4",
    ]

    // Reviews (placeholder for demo)
    const reviews = [
      {
        id: 1,
        name: "Arjun Mehta",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 5,
        date: "2 weeks ago",
        text: "This product exceeded my expectations. The quality is excellent and it arrived quickly.",
      },
      {
        id: 2,
        name: "Neha Gupta",
        avatar: "/placeholder.svg?height=40&width=40",
        rating: 4,
        date: "1 month ago",
        text: "Very good product for the price. Would recommend to others looking for something similar.",
      },
    ]

    return (
      <StoreThemeProvider theme={store.theme || "default"} primaryColor={store.primary_color || "#059669"}>
        <ViewTracker storeId={store.id} />
        <div className="flex min-h-screen flex-col bg-gray-50">
          {/* HEADER */}
          <header
            className="sticky top-0 z-30 flex h-16 items-center border-b bg-white/95 backdrop-blur-sm px-4 shadow-sm"
            style={{ boxShadow: "var(--header-shadow)" }}
          >
            <div className="container mx-auto max-w-5xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link
                  href={`/store/${store.slug}`}
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Back</span>
                </Link>
              </div>
              <div className="flex items-center gap-2 font-medium">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <span className="text-primary">{store.name}</span>
              </div>
              <div className="flex items-center gap-3">
                {store.whatsapp_number && (
                  <Link
                    href={`https://wa.me/${store.whatsapp_number}?text=Hi%20${encodeURIComponent(
                      store.name,
                    )},%20I'm%20interested%20in%20${encodeURIComponent(product.name)}.`}
                    target="_blank"
                  >
                    <Button size="sm" className="bg-primary hover:bg-primary/90 rounded-full">
                      <MessageCircle className="mr-2 h-4 w-4" /> Chat
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <main className="flex-1 py-8">
            <div className="container mx-auto max-w-5xl px-4">
              {/* PRODUCT DETAILS */}
              <div
                className="bg-white rounded-xl overflow-hidden shadow-sm mb-12"
                style={{
                  boxShadow: "var(--category-card-shadow)",
                  borderRadius: "var(--category-card-radius)",
                }}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {/* PRODUCT IMAGES */}
                  <div className="relative">
                    {/* Main Image */}
                    <div className="aspect-square relative overflow-hidden">
                      <Image
                        src={productImages[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {product.is_featured && (
                        <Badge className="absolute top-4 left-4 bg-primary text-white">Featured</Badge>
                      )}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm"
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-full bg-white/80 backdrop-blur-sm"
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Thumbnail Images */}
                    <div className="grid grid-cols-4 gap-2 p-4">
                      {productImages.map((image, index) => (
                        <div
                          key={index}
                          className={`aspect-square relative overflow-hidden rounded-lg border-2 ${index === 0 ? "border-primary" : "border-transparent"}`}
                        >
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`${product.name} - Image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* PRODUCT INFO */}
                  <div className="p-6 sm:p-8 flex flex-col">
                    <div className="mb-6">
                      {product.category && (
                        <div className="text-sm text-primary font-medium mb-2">{product.category}</div>
                      )}
                      <h1
                        className="text-2xl sm:text-3xl font-bold mb-2"
                        style={{ fontFamily: "var(--category-font)" }}
                      >
                        {product.name}
                      </h1>
                      <div className="flex items-center gap-2 mb-4">
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                          <Star className="fill-amber-500 h-4 w-4" />
                        </div>
                        <span className="text-sm font-medium text-gray-600">5.0 (12 reviews)</span>
                      </div>
                      <div className="text-3xl font-bold mb-4" style={{ color: "hsl(var(--primary))" }}>
                        ₹{product.price}
                      </div>
                      <p className="text-gray-600 mb-6">
                        {product.description || "No description available for this product."}
                      </p>
                    </div>

                    {/* QUANTITY SELECTOR */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                      <div className="flex items-center">
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-l-lg">
                          <Minus className="h-4 w-4" />
                        </Button>
                        <div className="h-10 w-16 flex items-center justify-center border-y">1</div>
                        <Button variant="outline" size="icon" className="h-10 w-10 rounded-r-lg">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* ACTION BUTTONS */}
                    <div className="grid sm:grid-cols-2 gap-3 mb-8">
                      <Button className="bg-primary hover:bg-primary/90 h-12">Add to Cart</Button>
                      <Button variant="outline" className="border-primary text-primary hover:bg-primary/5 h-12">
                        Buy Now
                      </Button>
                    </div>

                    {/* PRODUCT FEATURES */}
                    <div className="border-t pt-6 space-y-4">
                      <div className="flex items-center gap-3">
                        <Truck className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Free Delivery</p>
                          <p className="text-sm text-gray-500">2-3 business days</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Quality Guarantee</p>
                          <p className="text-sm text-gray-500">Satisfaction guaranteed</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <RefreshCw className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="font-medium">Easy Returns</p>
                          <p className="text-sm text-gray-500">30 day return policy</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* PRODUCT DETAILS TABS */}
              <div
                className="bg-white rounded-xl overflow-hidden shadow-sm mb-12"
                style={{
                  boxShadow: "var(--category-card-shadow)",
                  borderRadius: "var(--category-card-radius)",
                }}
              >
                <Tabs defaultValue="description" className="w-full">
                  <TabsList className="grid grid-cols-3 h-14 rounded-none border-b">
                    <TabsTrigger
                      value="description"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      Description
                    </TabsTrigger>
                    <TabsTrigger
                      value="specifications"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      Specifications
                    </TabsTrigger>
                    <TabsTrigger
                      value="reviews"
                      className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    >
                      Reviews
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="description" className="p-6">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold mb-4">Product Description</h3>
                      <p>{product.description || "No detailed description available for this product."}</p>
                      <p className="mt-4">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit
                        arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor.
                        Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor.
                      </p>
                    </div>
                  </TabsContent>
                  <TabsContent value="specifications" className="p-6">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold mb-4">Product Specifications</h3>
                      <table className="w-full border-collapse">
                        <tbody>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Brand</td>
                            <td className="py-2">{store.name}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Category</td>
                            <td className="py-2">{product.category || "Uncategorized"}</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Material</td>
                            <td className="py-2">Premium Quality</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Weight</td>
                            <td className="py-2">0.5 kg</td>
                          </tr>
                          <tr className="border-b">
                            <td className="py-2 font-medium">Dimensions</td>
                            <td className="py-2">25 × 10 × 5 cm</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </TabsContent>
                  <TabsContent value="reviews" className="p-6">
                    <div className="prose max-w-none">
                      <h3 className="text-lg font-semibold mb-4">Customer Reviews</h3>
                      <div className="space-y-6">
                        {reviews.map((review) => (
                          <div key={review.id} className="border-b pb-6">
                            <div className="flex items-center gap-4 mb-3">
                              <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden">
                                <Image
                                  src={review.avatar || "/placeholder.svg"}
                                  alt={review.name}
                                  width={40}
                                  height={40}
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="font-medium">{review.name}</p>
                                <div className="flex items-center gap-2">
                                  <div className="flex text-amber-500">
                                    {Array.from({ length: review.rating }).map((_, i) => (
                                      <Star key={i} className="h-3 w-3 fill-amber-500" />
                                    ))}
                                  </div>
                                  <span className="text-xs text-gray-500">{review.date}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-gray-600">{review.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* RELATED PRODUCTS */}
              {relatedProducts && relatedProducts.length > 0 && (
                <section className="mb-12">
                  <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: "var(--category-font)" }}>
                    You May Also Like
                  </h2>
                  <div className="grid gap-6 grid-cols-2 sm:grid-cols-4">
                    {relatedProducts.map((relatedProduct) => (
                      <ProductCard key={relatedProduct.id} product={relatedProduct} store={store} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          </main>

          {/* FOOTER */}
          <footer className="border-t bg-white py-8">
            <div className="container mx-auto max-w-5xl px-4">
              <div className="grid gap-8 sm:grid-cols-3 text-left mb-8">
                <div>
                  <h3 className="font-medium mb-3" style={{ fontFamily: "var(--category-font)" }}>
                    About {store.name}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {store.description ||
                      `${store.name} offers quality products with fast delivery and excellent customer service.`}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium mb-3" style={{ fontFamily: "var(--category-font)" }}>
                    Contact Us
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Have questions? Reach out to us on WhatsApp for quick assistance.
                  </p>
                  {store.whatsapp_number && (
                    <Link
                      href={`https://wa.me/${store.whatsapp_number}`}
                      target="_blank"
                      className="text-sm text-primary font-medium mt-2 inline-block"
                    >
                      +{store.whatsapp_number}
                    </Link>
                  )}
                </div>
                <div>
                  <h3 className="font-medium mb-3" style={{ fontFamily: "var(--category-font)" }}>
                    Quick Links
                  </h3>
                  <ul className="space-y-2 text-sm">
                    <li>
                      <Link href={`/store/${store.slug}`} className="text-gray-600 hover:text-primary">
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-gray-600 hover:text-primary">
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-gray-600 hover:text-primary">
                        Terms & Conditions
                      </Link>
                    </li>
                    <li>
                      <Link href="#" className="text-gray-600 hover:text-primary">
                        Privacy Policy
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="pt-4 border-t text-sm text-gray-500 text-center">
                <p>
                  Powered by <span className="font-medium text-primary">WhatsBuy.in</span> - Create your own WhatsApp
                  store in 60 seconds
                </p>
              </div>
            </div>
          </footer>

          {/* FLOATING WHATSAPP BUTTON */}
          {store.whatsapp_number && (
            <FloatingWhatsAppButton whatsappNumber={store.whatsapp_number} storeName={store.name} />
          )}
        </div>
      </StoreThemeProvider>
    )
  } catch (error) {
    console.error("Product page error:", error)
    notFound()
  }
}
