import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"
import { cn } from "@/lib/utils"

interface SocialLinksProps {
  store: any
  className?: string
  darkMode: boolean
}

export default function SocialLinks({ store, className, darkMode }: SocialLinksProps) {
  if (store.show_social_icons === false) return null

  const instagramUrl = store?.instagram_url || "https://instagram.com"
  const facebookUrl = store?.facebook_url || "https://facebook.com"
  const twitterUrl = store?.twitter_url || "https://twitter.com"

  return (
    <div className={cn("flex gap-3", className)}>
      <Link
        href={instagramUrl}
        target="_blank"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Instagram className="h-4 w-4" />
        <span className="sr-only">Instagram</span>
      </Link>
      <Link
        href={facebookUrl}
        target="_blank"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Facebook className="h-4 w-4" />
        <span className="sr-only">Facebook</span>
      </Link>
      <Link
        href={twitterUrl}
        target="_blank"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      >
        <Twitter className="h-4 w-4" />
        <span className="sr-only">Twitter</span>
      </Link>
    </div>
  )
}
