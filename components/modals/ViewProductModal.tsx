"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

interface Product {
  id: string
  name: string
  description?: string
  price: number
  category?: string
  stock?: string
  tags?: string
  images: string[]
}

interface ViewProductModalProps {
    product: Product
    isOpen: boolean
    onClose: () => void
  }
export default function ViewProductModal({
  productId,
  isOpen,
  onClose
}: ViewProductModalProps) {
  const supabase = createClient()
  const { toast } = useToast()

  const [product, setProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single()

      if (error) {
        toast({ title: "Fetch failed", description: error.message, variant: "destructive" })
        return
      }

      setProduct(data)
    }

    if (isOpen && productId) {
      fetchProduct()
    }
  }, [isOpen, productId])

  if (!isOpen || !product) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>View Product</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Name</p>
            <p className="font-medium">{product.name}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="font-medium">₹{product.price}</p>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p className="font-medium">{product.description || "—"}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Category</p>
              <p className="font-medium">{product.category || "—"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stock</p>
              <p className="font-medium">{product.stock || "—"}</p>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground">Tags</p>
            <p className="font-medium">{product.tags || "—"}</p>
          </div>

          {product.images.length > 0 && (
            <div>
              <p className="text-sm text-muted-foreground mb-2">Images</p>
              <div className="flex flex-wrap gap-2">
                {product.images.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Product ${idx}`}
                    className="w-24 h-24 object-cover rounded border"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
