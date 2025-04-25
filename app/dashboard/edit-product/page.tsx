"use client"

import { useState, useRef, ChangeEvent, FormEvent, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, ImagePlus, Trash, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth/auth-provider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ProductData = {
  name: string
  description: string
  price: number
  category: string | null
  stock: number
  tags: string[]
}

type ImageData = {
  url: string
  file: File | null
}

export default function EditProductPage() {
  const { id } = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [images, setImages] = useState<ImageData[]>([])
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    price: 0,
    category: null,
    stock: 0,
    tags: [],
  })
  const supabase = createClient()

  useEffect(() => {
    const fetchProduct = async () => {
      if (!user?.id || !id) return

      try {
        // Get the product data
        const { data: product, error: productError } = await supabase
          .from("products")
          .select("*")
          .eq("id", id)
          .single()

        if (productError || !product) {
          throw new Error("Product not found")
        }

        // Verify the product belongs to the user's store
        const { data: store, error: storeError } = await supabase
          .from("stores")
          .select("id")
          .eq("owner_id", user.id)
          .eq("id", product.store_id)
          .single()

        if (storeError || !store) {
          throw new Error("You don't have permission to edit this product")
        }

        // Set product data
        setProductData({
          name: product.name,
          description: product.description || "",
          price: product.price,
          category: product.category,
          stock: product.stock,
          tags: product.tags || [],
        })

        // Set existing images
        if (product.images && product.images.length > 0) {
          const existingImages = product.images.map(url => ({
            url,
            file: null
          }))
          setImages(existingImages)
          setPreviewImage(existingImages[0].url)
        }

      } catch (error: any) {
        toast({
          title: "Error loading product",
          description: error.message,
          variant: "destructive",
        })
        router.push("/dashboard/products")
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id, user?.id])

  const handleImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return

    const files = Array.from(e.target.files)
    if (files.length + images.length > 5) {
      toast({
        title: "Maximum 5 images allowed",
        description: "You can upload up to 5 images per product",
        variant: "destructive",
      })
      return
    }

    const newImages = files.map(file => ({
      url: URL.createObjectURL(file),
      file
    }))

    setImages([...images, ...newImages])
    if (!previewImage) {
      setPreviewImage(newImages[0].url)
    }
  }

  const uploadNewImagesToSupabase = async () => {
    if (!user?.id) return []
    
    const uploadedUrls: string[] = []
    
    for (const image of images) {
      // Skip existing images that haven't been changed
      if (!image.file) continue

      const fileExt = image.file.name.split('.').pop()
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
      const filePath = `products/${fileName}`

      const { error } = await supabase.storage
        .from('product-images')
        .upload(filePath, image.file, {
          cacheControl: '3600',
          upsert: false,
          contentType: image.file.type,
        })

      if (error) throw error

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(filePath)

      uploadedUrls.push(publicUrl)
      
      // Clean up the object URL
      URL.revokeObjectURL(image.url)
    }

    return uploadedUrls
  }

  const removeImage = async (index: number) => {
    const imageToRemove = images[index]
    
    try {
      // If the image was already uploaded to Supabase, delete it
      if (imageToRemove.url.startsWith('http') && !imageToRemove.file) {
        const urlParts = imageToRemove.url.split('/product-images/')
        if (urlParts.length > 1) {
          const filePath = `product-images/${urlParts[1]}`
          await supabase.storage.from('product-images').remove([filePath])
        }
      }
      
      // Clean up object URL if it exists
      if (imageToRemove.file) {
        URL.revokeObjectURL(imageToRemove.url)
      }

      const newImages = [...images]
      newImages.splice(index, 1)
      setImages(newImages)
      
      if (previewImage === imageToRemove.url) {
        setPreviewImage(newImages[0]?.url || null)
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      toast({
        title: "Error deleting image",
        description: "Could not remove the image",
        variant: "destructive",
      })
    }
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setProductData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (!user?.id || !id) throw new Error("User not authenticated")
      if (images.length === 0) throw new Error("Please upload at least one product image")

      // First upload all new images to Supabase
      const newImageUrls = await uploadNewImagesToSupabase()
      
      // Combine existing and new image URLs
      const allImageUrls = [
        ...images.filter(img => !img.file).map(img => img.url),
        ...newImageUrls
      ]

      if (allImageUrls.length === 0) throw new Error("Failed to upload images")

      // Update the product
      const { error } = await supabase
        .from("products")
        .update({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          images: allImageUrls,
          category: productData.category,
          tags: productData.tags,
          stock: productData.stock,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)

      if (error) throw error

      toast({
        title: "Product updated",
        description: "Your product has been updated successfully.",
      })

      router.push("/dashboard/products")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error updating product",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      images.forEach(image => {
        if (image.file) {
          URL.revokeObjectURL(image.url)
        }
      })
    }
  }, [images])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/products"
          className="flex items-center text-sm text-gray-500 hover:text-gray-900"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          Back to Products
        </Link>
        <h1 className="text-2xl font-bold">Edit Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-[1fr_2fr]">
        <div className="space-y-4">
          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-lg font-semibold">Product Images</h2>
            <p className="text-sm text-gray-500">Add up to 5 images of your product</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
            <div className="mt-4 grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <div
                  key={index}
                  className={`relative aspect-square rounded-md border overflow-hidden cursor-pointer ${
                    previewImage === image.url ? "ring-2 ring-emerald-600" : ""
                  }`}
                  onClick={() => setPreviewImage(image.url)}
                >
                  <Image
                    src={image.url}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onLoad={() => {
                      if (image.file) {
                        URL.revokeObjectURL(image.url)
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 rounded-full bg-white p-1 shadow-sm"
                    onClick={e => {
                      e.stopPropagation()
                      removeImage(index)
                    }}
                  >
                    <Trash className="h-3 w-3 text-red-500" />
                  </button>
                </div>
              ))}
              {images.length < 5 && (
                <button
                  type="button"
                  className="flex aspect-square items-center justify-center rounded-md border border-dashed"
                  onClick={handleImageClick}
                >
                  <ImagePlus className="h-6 w-6 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-lg font-semibold">Preview</h2>
            <p className="text-sm text-gray-500">How your product will appear to customers</p>
            <div className="mt-4 rounded-lg border p-3">
              {previewImage ? (
                <div className="space-y-3">
                  <div className="aspect-square relative rounded-md overflow-hidden">
                    <Image
                      src={previewImage}
                      alt="Product preview"
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                  <h3 className="font-medium">{productData.name || "Product Name"}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {productData.description || "Product description will appear here..."}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-lg font-bold">₹{productData.price || "0"}</p>
                  </div>
                  <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
                    Buy on WhatsApp
                  </Button>
                </div>
              ) : (
                <div className="flex aspect-square items-center justify-center rounded-md border border-dashed">
                  <p className="text-sm text-gray-500">Add images to see preview</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-lg font-semibold">Product Information</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter product name"
                  value={productData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe your product"
                  rows={4}
                  value={productData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    placeholder="999"
                    value={productData.price}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    placeholder="10"
                    value={productData.stock}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-lg font-semibold">Category & Tags</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  name="category"
                  value={productData.category || ""}
                  onValueChange={value =>
                    setProductData(prev => ({ ...prev, category: value || null }))
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clothing">Clothing</SelectItem>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="home">Home & Kitchen</SelectItem>
                    <SelectItem value="beauty">Beauty & Personal Care</SelectItem>
                    <SelectItem value="food">Food & Groceries</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  name="tags"
                  placeholder="new, featured, sale"
                  value={productData.tags.join(", ")}
                  onChange={(e) => {
                    const tags = e.target.value
                      .split(",")
                      .map(tag => tag.trim())
                      .filter(tag => tag.length > 0)
                    setProductData(prev => ({ ...prev, tags }))
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => router.push("/dashboard/products")}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Update Product"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}