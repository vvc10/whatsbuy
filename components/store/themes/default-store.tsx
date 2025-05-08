"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Music, Menu, X, ChevronDown, ShoppingBag,
  Instagram, Facebook, Twitter, Play, Disc, ArrowRight, ArrowLeft,
  Dot,
  MoreHorizontal,
  Youtube
} from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

import ProductCard from "@/components/store/product-card"
import FloatingWhatsAppButton from "@/components/store/floating-whatsapp-button"
import CartDrawer from "@/components/store/cart-drawer"
import QuickViewModal from "@/components/store/quick-view-modal"
import StoreShareButton from "../store-share-button"
import TestimonialCard from "../testimonial-card"
import MailingList from "../MailingList"

interface DefaultStoreProps {
  store: {
    id: string
    slug: string
    name: string
    description: string
    logo_url?: string
    banner_url?: string
    show_banner?: boolean
    show_share_buttons?: boolean
    show_social_icons?: boolean
    show_powered_by?: boolean
    whatsapp_number?: string
    store_social_links?: {
      instagram?: string
      facebook?: string
      twitter?: string
      youtube?: string
    }
    // Corrected homepage_sections type from boolean[] to an object
    homepage_sections?: {
      categories?: boolean
      about_store?: boolean
      new_arrivals?: boolean
      store_banner?: boolean
      testimonials?: boolean
      featured_products?: boolean
      mailing_list?: boolean
    },
    footer_links?: {
      contact: boolean,
      about_us: boolean,
      privacy_policy: boolean,
      shipping_returns: boolean,
      terms_of_service: boolean
    }

  }

  products: Array<{
    id: string
    name: string
    price: number
    image?: string
    images?: string[]
    category: string
    isNew?: boolean
    isSale?: boolean
    salePrice?: number
  }>

  featuredProducts: Array<any>
  categories: string[]
  testimonials: Array<any>
  whatsappChatLink: string | null
}


export default function DefaultStore({
  store,
  products,
  featuredProducts,
  categories,
  testimonials,
  whatsappChatLink
}: DefaultStoreProps) {
  // State management
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null)
  const [activeCategory, setActiveCategory] = useState("all")
  const [showAllProducts, setShowAllProducts] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const primaryColor = store.primary_color || "#059669";
  // Derived state
  const filteredProducts = products.filter(
    (product) =>
      (activeCategory === "all" || product.category === activeCategory) &&
      (!searchQuery || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const displayedProducts = showAllProducts ? filteredProducts : filteredProducts.slice(0, 8)
  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Helper functions
  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.id === product.id)
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
    setIsCartOpen(true)
  }

  const openQuickView = (product: any) => {
    setQuickViewProduct(product)
  }

  const musicCategories = categories.map((category) => ({
    "Fruits": "Albums",
    "Vegetables": "Singles",
    "Dairy": "Merchandise",
    "Bakery": "Vinyl",
    "Snacks": "Digital"
  }[category] || category))

  // Components
  const SearchBar = () => (
    <AnimatePresence>
      {isSearchOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="sticky top-16 z-30 w-[60%] mx-auto rounded-2xl bg-gray-900 border-b border-gray-800 shadow-sm"
        >
          <div className="container mx-auto max-w-6xl items-center justify-center text-center flex flex-col gap-4 px-2 py-3">
            <div className="text-gray-200 font-[700]">Search {store.name}</div>
            <div className="relative mx-auto w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search for music, merch, or events..."
                className="pl-9 border-gray-700 rounded-full h-10 focus-visible:ring-amber-500 bg-gray-800 text-white"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 text-gray-400 hover:text-gray-300"
                  onClick={() => setSearchQuery("")}
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const HeroBanner = () => (
    store.show_banner !== false && (
      <section className="mb-10">
        <div className="relative md:h-[500px] h-[600px] sm:h-[500px] rounded-2xl overflow-hidden bg-gray-900">
          {store.banner_url ? (
            <Image
              src={store.banner_url}
              alt={store.name}
              fill
              className="object-cover opacity-80"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-400" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          <HeroContent />
          <HeroControls />
        </div>
      </section>
    )
  )

  const HeroContent = () => (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-center md:px-6 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-xl"
      >
        {store.logo_url && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative w-28 h-28 mx-auto mb-6 rounded-full overflow-hidden border-4 border-white/10 shadow-xl"
          >
            <Image
              src={store.logo_url}
              alt={store.name}
              fill
              className="object-cover p-2"
            />
          </motion.div>
        )}
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{store.name}</h1>
        <p className="text-xl text-gray-300 mb-6">{store.description}</p>
        {
          store.show_social_icons && (
            <SocialLinks />
          )
        }

        <Button
          className="rounded-full font-medium px-6"
          style={{ backgroundColor: primaryColor }}
        >
          Chat
        </Button>

      </motion.div>
    </div>
  )

  const SocialLinks = () => (
    <div className="flex gap-3 mb-4">
      {store.store_social_links && (
        <div className="flex justify-center gap-4 mb-8 mx-auto">
          {store.store_social_links.instagram && (
            <Link
              href={store.store_social_links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </Link>
          )}
          {store.store_social_links.twitter && (
            <Link
              href={store.store_social_links.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-amber-400 transition-colors"
            >
              <Twitter className="h-6 w-6" />
            </Link>
          )}
          {store.store_social_links.facebook && (
            <Link
              href={store.store_social_links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-amber-400 transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </Link>
          )}
          {store.store_social_links.youtube && (
            <Link
              href={store.store_social_links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-amber-400 transition-colors"
            >
              <Youtube className="h-6 w-6" />
            </Link>
          )}
        </div>
      )}
    </div>
  )

  const HeroControls = () => (
    <div className="absolute top-4 right-4 flex flex-row items-center gap-4">
      {/* <Button
        variant="ghost"
        size="icon"
        className="rounded-full text-gray-300"
        onClick={() => setIsSearchOpen(!isSearchOpen)}
        aria-label={isSearchOpen ? "Close search" : "Open search"}
      >
        {isSearchOpen ? <X className="h-5 w-5" /> : <Search className="h-5 w-5" />}
      </Button> */}

      {store.show_share_buttons !== false && (
        <StoreShareButton storeSlug={store.slug} storeName={store.name} />
      )}

      <CartButton />
      {/* <MobileMenu /> */}
    </div>
  )

  const CartButton = () => (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-full text-gray-300"
      onClick={() => setIsCartOpen(true)}
      aria-label="Open cart"
    >
      <ShoppingBag className="h-5 w-5" />
      {cartItemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full">
          {cartItemCount}
        </span>
      )}
    </Button>
  )



  const CategoryMenu = () => (
    <div>
      <h3 className="text-sm font-medium text-white mb-3">Categories</h3>
      <div className="space-y-1">
        <button
          onClick={() => {
            setActiveCategory("all")
            document.querySelector("#releases")?.scrollIntoView({ behavior: "smooth" })
          }}
          className={cn(
            "w-full text-left px-2 py-2 rounded-md text-sm transition-colors",
            activeCategory === "all"
              ? "bg-amber-900/30 text-amber-300 font-medium"
              : "text-gray-300 hover:bg-gray-800",
          )}
        >
          All Releases
        </button>
        {musicCategories.map((category) => (
          <button
            key={category}
            onClick={() => {
              setActiveCategory(category)
              document.querySelector("#releases")?.scrollIntoView({ behavior: "smooth" })
            }}
            className={cn(
              "w-full text-left px-2 py-2 rounded-md text-sm transition-colors",
              activeCategory === category
                ? "bg-amber-900/30 text-amber-300 font-medium"
                : "text-gray-300 hover:bg-gray-800",
            )}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  )

  const QuickLinks = () => (
    <div>
      <h3 className="text-sm font-medium text-white mb-3">Quick Links</h3>
      <div className="space-y-1">
        <Link href="#latest" className="block px-2 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800">
          Latest Release
        </Link>
        <Link href="#videos" className="block px-2 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800">
          Videos
        </Link>
        <Link href="#tour" className="block px-2 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800">
          Tour Dates
        </Link>
        <Link href="#merch" className="block px-2 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-800">
          Merchandise
        </Link>
      </div>
    </div>
  )

  const SocialMediaLinks = () => (
    store.show_social_icons && (
      <div className="flex gap-3 mt-4">
        <Link
          href="https://instagram.com"
          target="_blank"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700"
        >
          <Instagram className="h-4 w-4" />
        </Link>
        <Link
          href="https://facebook.com"
          target="_blank"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700"
        >
          <Facebook className="h-4 w-4" />
        </Link>
        <Link
          href="https://twitter.com"
          target="_blank"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-800 text-gray-300 hover:bg-gray-700"
        >
          <Twitter className="h-4 w-4" />
        </Link>
      </div>
    )
  )

  const LatestReleaseSection = () => (
    <section id="latest" className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Latest Release</h2>
        <Link href="#" className="text-amber-400 hover:text-amber-300 text-sm flex items-center">
          VIEW ALL <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="bg-amber-400 rounded-2xl overflow-hidden">
        <div className="p-8 flex flex-col items-center justify-center">
          <div className="w-48 h-48 relative mb-6">
            <Image
              src="/placeholder.svg?height=200&width=200"
              alt="Cassette Tape"
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
          <Button className="bg-white hover:bg-gray-100 text-black font-medium rounded-full px-6">
            Listen now
          </Button>
        </div>
      </div>
    </section>
  )

  const VideosSection = () => (
    <section id="videos" className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Videos</h2>
        <Link href="#" className="text-amber-400 hover:text-amber-300 text-sm flex items-center">
          VIEW ALL <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="bg-amber-600 rounded-2xl overflow-hidden relative">
        <div className="p-8 flex flex-col items-center justify-center min-h-[200px]">
          <div className="w-48 h-48 relative mb-6 flex items-center justify-center">
            <Image
              src="/placeholder.svg?height=200&width=200"
              alt="Video Thumbnail"
              width={200}
              height={200}
              className="object-contain"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full bg-black/50 flex items-center justify-center">
                <Play className="h-8 w-8 text-white" fill="white" />
              </div>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 text-white"
          aria-label="Previous video"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/30 text-white"
          aria-label="Next video"
        >
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </section>
  )

  const MusicReleasesSection = () => (
    <section id="releases" className="mb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">{activeCategory === "all" ? "Music" : activeCategory}</h2>
          <p className="text-gray-400">{filteredProducts.length} releases available</p>
        </div>

        <CategoryFilters />
      </div>

      {filteredProducts.length === 0 ? (
        <NoResultsMessage />
      ) : (
        <ProductGrid />
      )}

      {filteredProducts.length > 8 && !showAllProducts && (
        <div className="mt-8 text-center">
          <Button
            variant="outline"
            className="rounded-full border-gray-700 text-gray-300 hover:bg-gray-800"
            onClick={() => setShowAllProducts(true)}
          >
            Show More <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </section>
  )

  const CategoryFilters = () => (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <Button
        variant={activeCategory === "all" ? "default" : "outline"}
        size="sm"
        className={cn(
          "rounded-full",
          activeCategory === "all"
            ? "bg-amber-500 hover:bg-amber-600 text-black"
            : "border-gray-700 text-gray-300",
        )}
        onClick={() => setActiveCategory("all")}
      >
        All
      </Button>

      {musicCategories.map((category) => (
        <Button
          key={category}
          variant={activeCategory === category ? "default" : "outline"}
          size="sm"
          className={cn(
            "rounded-full whitespace-nowrap",
            activeCategory === category
              ? "bg-amber-500 hover:bg-amber-600 text-black"
              : "border-gray-700 text-gray-300",
          )}
          onClick={() => setActiveCategory(category)}
        >
          {category}
        </Button>
      ))}
    </div>
  )

  const NoResultsMessage = () => (
    <div className="bg-gray-800 rounded-2xl shadow-sm border border-gray-700 p-10 text-center">
      <div className="flex flex-col items-center gap-4 max-w-md mx-auto">
        <div className="h-16 w-16 rounded-full bg-gray-700 flex items-center justify-center">
          <Search className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-medium text-white">No releases found</h3>
        <p className="text-gray-400">
          We couldn't find any music matching your search. Try different keywords or browse all categories.
        </p>
        <Button
          className="mt-2 bg-amber-500 hover:bg-amber-600 text-black rounded-full"
          onClick={() => {
            setActiveCategory("all")
            setSearchQuery("")
          }}
        >
          View All Releases
        </Button>
      </div>
    </div>
  )

  const ProductGrid = () => (
    <div className="flex flex-col gap-6 mb-12">
      <h2 className="text-gray-200 text-[22px] font-[700]">All Products</h2>
  
      {displayedProducts.length === 0 ? (
        <div className="text-center text-gray-400 py-10">No products yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {displayedProducts.map((product) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ProductCard
                store={store}
                product={product}
                onAddToCart={() => addToCart(product)}
                onQuickView={() => openQuickView(product)}
                whatsappNumber={store.whatsapp_number}
                storeName={store.name}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
  

  const TourDatesSection = () => (
    <section id="tour" className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Tour Dates</h2>
        <Link href="#" className="text-amber-400 hover:text-amber-300 text-sm flex items-center">
          VIEW ALL <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="space-y-4">
        {[
          { month: "JUN", day: "23", venue: "The O2", location: "London, UK" },
          { month: "JUN", day: "25", venue: "Zenith", location: "Paris, France" }
        ].map((date, index) => (
          <TourDateCard key={index} {...date} />
        ))}
      </div>
    </section>
  )

  const TourDateCard = ({ month, day, venue, location }: any) => (
    <div className="bg-gray-800 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="bg-gray-900 rounded-lg p-2 text-center min-w-[60px]">
          <div className="text-xs text-amber-400 font-medium">{month}</div>
          <div className="text-xl font-bold text-white">{day}</div>
        </div>
        <div>
          <h3 className="font-medium text-white">{venue}</h3>
          <p className="text-sm text-gray-400">{location}</p>
        </div>
      </div>
      <Button size="sm" className="bg-black hover:bg-gray-900 text-white rounded-lg">
        Tickets
      </Button>
    </div>
  )

  const MerchandiseSection = () => (
    <section id="merch" className="mb-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Merch</h2>
        <Link href="#" className="text-amber-400 hover:text-amber-300 text-sm flex items-center">
          VIEW ALL <ArrowRight className="ml-1 h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MerchItem
          icon={<Disc className="h-16 w-16 text-amber-400" />}
          title="Vinyl"
          price="$20.00"
        />
        <MerchItem
          icon={<ShoppingBag className="h-16 w-16 text-amber-400" />}
          title="T-Shirt"
          price="$15.00"
        />
      </div>
    </section>
  )

  const MerchItem = ({ icon, title, price }: any) => (
    <div className="bg-gray-800 rounded-xl p-4">
      <div className="aspect-square bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-medium text-white">{title}</h3>
      <p className="text-amber-400 font-medium">{price}</p>
    </div>
  )


  const Footer = () => (
    <section className="mb-10">
      <div className=" w-fit h-fit rounded-2xl mx-auto shadow-sm p-8">
        <div className="max-w-3xl mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">


              {store?.show_powered_by !== false && (
                <p className="text-gray-500 text-xs">
                  Powered by <span className="font-medium text-gray-300">whatsbuy.in</span>
                </p>
              )}
            </div>

            {/* {store?.footer_links && (
          <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm">
            {store.footer_links.contact && <a href="/contact" className="hover:text-white">Contact</a>}
            {store.footer_links.about_us && <a href="/about-us" className="hover:text-white">About Us</a>}
            {store.footer_links.privacy_policy && <a href="/privacy-policy" className="hover:text-white">Privacy Policy</a>}
            {store.footer_links.shipping_returns && <a href="/shipping-returns" className="hover:text-white">Shipping & Returns</a>}
            {store.footer_links.terms_of_service && <a href="/terms-of-service" className="hover:text-white">Terms of Service</a>}
          </div>
        )} */}
          </div>
        </div>
      </div>
    </section>
  )


  return (
    <div className={`flex min-h-screen flex-col bg-gradient-to-b from-gray-950 to-gray-900 transition-colors duration-300`}>
      <SearchBar />

      <main className="flex-1 container mx-auto max-w-6xl px-4 py-6">
        <HeroBanner />
        {/* <LatestReleaseSection /> */}
        {/* <VideosSection /> */}
        {/* <MusicReleasesSection /> */}
        {/* <TourDatesSection /> */}
        <ProductGrid
        />

        {/* {
          store.homepage_sections?.testimonials && (
            <TestimonialCard store={store} />
          )} */}

        {
          store.homepage_sections?.mailing_list && (
            <MailingList store={store} />
          )
        }

      </main>

      <Footer />

      {/* Floating WhatsApp Button */}
      {/* {whatsappChatLink && (
        <FloatingWhatsAppButton
          whatsappNumber={store.whatsapp_number}
          storeName={store.name}
          whatsappChatLink={whatsappChatLink}
        />
      )} */}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        setCartItems={setCartItems}
        darkMode={true}
        whatsappNumber={store.whatsapp_number}
        storeName={store.name}
      />

      {/* Quick View Modal */}
      {quickViewProduct && (


        <QuickViewModal
          store={store}
          product={quickViewProduct}
          isOpen={!!quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
          onAddToCart={() => addToCart(quickViewProduct)}
          darkMode={true} // Set based on your theme
          primaryColor={primaryColor} // Your brand color from Supabase
        />
      )}
    </div>
  )
}