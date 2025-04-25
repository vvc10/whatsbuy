"use client"

import { useEffect, useRef, useState } from "react"
import { X, Loader2, Trash, ImagePlus, Edit2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth/auth-provider"

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

interface EditProductModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  onSave: () => void
}

export default function EditProductModal({
  product,
  isOpen,
  onClose,
  onSave
}: EditProductModalProps) {
  const supabase = createClient()
  const { toast } = useToast()
  const { user } = useAuth()

  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    tags: "",
  })

  const [images, setImages] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // ✅ Fetch latest product details when modal opens
  useEffect(() => {
    const fetchProduct = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", product.id)
        .single()

      if (error) {
        toast({ title: "Fetch failed", description: error.message, variant: "destructive" })
        return
      }

      setFormData({
        name: data.name,
        description: data.description || "",
        price: data.price.toString(),
        category: data.category || "",
        stock: data.stock || "",
        tags: data.tags || "",
      })
      setImages(data.images || [])
    }

    if (isOpen) fetchProduct()
  }, [isOpen])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !user?.id) return

    const files = Array.from(e.target.files)
    const uploadedUrls: string[] = []

    for (const file of files) {
      const ext = file.name.split('.').pop()
      const filePath = `products/${user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, file)

      if (error) {
        toast({ title: "Upload error", description: error.message, variant: "destructive" })
        continue
      }

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      uploadedUrls.push(publicUrl)
    }

    setImages(prev => [...prev, ...uploadedUrls])
  }

  const handleImageRemove = async (index: number) => {
    const imageUrl = images[index]
    const parts = imageUrl.split('/product-images/')
    if (parts.length > 1) {
      const filePath = `product-images/${parts[1]}`
      await supabase.storage.from('product-images').remove([filePath])
    }

    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("products").update({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        stock: formData.stock,
        tags: formData.tags,
        images,
        updated_at: new Date().toISOString()
      }).eq("id", product.id)

      if (error) throw error

      toast({ title: "Product updated", description: "Changes saved successfully." })
      onSave()
    } catch (err: any) {
      toast({ title: "Update failed", description: err.message, variant: "destructive" })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <>
 
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <Input name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <Input name="price" value={formData.price} onChange={handleInputChange} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea name="description" value={formData.description} onChange={handleInputChange} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <Input name="category" value={formData.category} onChange={handleInputChange} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Stock</label>
                <Input name="stock" value={formData.stock} onChange={handleInputChange} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Tags</label>
              <Input name="tags" value={formData.tags} onChange={handleInputChange} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Images</label>
              <div className="flex flex-wrap gap-2">
                {images.map((url, index) => (
                  <div key={index} className="relative w-24 h-24 border rounded">
                    <img src={url} alt="Product" className="object-cover w-full h-full" />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-0 right-0 m-1"
                      onClick={() => handleImageRemove(index)}
                    >
                      <Trash className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                {images.length < 5 && (
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <ImagePlus className="w-5 h-5" />
                  </Button>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>

  )
}
