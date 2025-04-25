import {
  BarChart3,
  ImageIcon,
  MessageCircle,
  PaintBucket,
  ShoppingBag,
  Smartphone,
  CreditCard,
  Share2,
} from "lucide-react"
import { Badge } from "./ui/badge"

const features = [
  {
    icon: ImageIcon,
    title: "Easy Product Upload",
    description: "Add products with photos, prices, and descriptions in seconds using just your phone",
  },
  {
    icon: ShoppingBag,
    title: "Instant Catalog",
    description: "Get your own storefront URL (yourstore.whatsbuy.in) that works on all devices",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp Ordering",
    description: "Customers can order with one click through pre-filled WhatsApp messages",
  },
  {
    icon: BarChart3,
    title: "Order Dashboard",
    description: "Track all your orders, messages, and customer interactions in one place",
  },
  {
    icon: CreditCard,
    title: "Payment Options",
    badge: "Coming Soon",
    description: "Accept payments via Razorpay or Cash on Delivery - you choose what works for you",
  },
  {
    icon: PaintBucket,
    title: "Storefront Themes",
    description: "Choose from beautiful templates that match your brand and products",
  },
  {
    icon: Share2,
    title: "Social Integration",
    description: "Connect with Instagram, Facebook, and Telegram to reach more customers",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimized",
    description: "Everything works perfectly on mobile - for both you and your customers",
  },
]

export default function FeatureShowcase() {
  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4 pt-12">
      {features.map((feature, index) => (
        <div key={index} className="flex flex-col space-y-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <feature.icon className="h-5 w-5" />
          </div>
          <h3 className="text-lg font-bold">{feature.title}</h3>
          {feature.badge && (
          <Badge className="w-fit bg-green-900">{feature.badge}</Badge>
          )}
          <p className="text-sm text-gray-500">{feature.description}</p>
        </div>
      ))}
    </div>
  )
}
