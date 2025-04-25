import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function StoreNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4 text-center">
      <div className="mb-6 rounded-full bg-red-100 p-4">
        <ShoppingBag className="h-8 w-8 text-red-600" />
      </div>
      <h1 className="mb-2 text-3xl font-bold">Store Not Found</h1>
      <p className="mb-6 max-w-md text-gray-500">
        The store you're looking for doesn't exist or may have been removed.
      </p>
      <Link href="/">
        <Button className="bg-emerald-600 hover:bg-emerald-700">Go Back Home</Button>
      </Link>
    </div>
  )
}
