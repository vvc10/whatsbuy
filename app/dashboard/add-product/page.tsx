"use client"

import { useState, useRef, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ImagePlus, Trash, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ProductData = {
  name: string;
  description: string;
  price: string;
  category: string;
  stock: string;
  tags: string;
};

export default function AddProductPage({handleClose}: {handleClose: () => void}) {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [productData, setProductData] = useState<ProductData>({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "10",
    tags: "",
  });
  const supabase = createClient();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user?.id) return;

    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast({
        title: "Maximum 5 images allowed",
        description: "You can upload up to 5 images per product",
        variant: "destructive",
      });
      return;
    }

    const newUploadProgress = Array(files.length).fill(0);
    setUploadProgress([...uploadProgress, ...newUploadProgress]);

    try {
      const uploadedImageUrls: string[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `products/${fileName}`;

        const { error } = await supabase.storage
          .from('product-images')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
            contentType: file.type,
          });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        uploadedImageUrls.push(publicUrl);
        console.log("Uploaded image URL:", publicUrl);

        const updatedProgress = [...uploadProgress];
        updatedProgress[i] = 100;
        setUploadProgress(updatedProgress);
      }

      setImages([...images, ...uploadedImageUrls]);

      // Set preview image to the first uploaded image (if not already set)
      if (uploadedImageUrls.length > 0 && !previewImage) {
        setPreviewImage(uploadedImageUrls[0]);
        console.log("Preview image set:", uploadedImageUrls[0]); // Add this log for debugging
      }
    } catch (error: any) {
      toast({
        title: "Error uploading images",
        description: error.message || "Failed to upload images",
        variant: "destructive",
      });
    } finally {
      setUploadProgress([]);
    }
  };


  const removeImage = async (index: number) => {
    const newImages = [...images];
    const imageUrl = newImages[index];

    try {
      const urlParts = imageUrl.split('/product-images/');
      if (urlParts.length > 1) {
        const filePath = `product-images/${urlParts[1]}`;
        await supabase.storage.from('product-images').remove([filePath]);
      }

      newImages.splice(index, 1);
      setImages(newImages);
      if (previewImage === imageUrl) {
        setPreviewImage(newImages[0] || null);
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      toast({
        title: "Error deleting image",
        description: "Could not remove the image",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!user?.id) throw new Error("User not authenticated");
      if (images.length === 0) throw new Error("Please upload at least one product image");

      const { data: store, error: storeError } = await supabase
        .from("stores")
        .select("id")
        .eq("owner_id", user.id)
        .single();

      if (storeError || !store) throw new Error("Store not found. Please complete onboarding first.");

      const { error } = await supabase.from("products").insert({
        store_id: store.id,
        name: productData.name,
        description: productData.description,
        price: Number.parseFloat(productData.price),
        images: images,
        category: productData.category || null,
        tags: productData.tags ? productData.tags.split(",").map((tag) => tag.trim()) : [],
        stock: Number.parseInt(productData.stock),
        is_active: true,
      });

      if (error) throw error;

      toast({
        title: "Product added",
        description: "Your product has been added successfully.",
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      toast({
        title: "Error adding product",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {

      setIsLoading(false);
      
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold">Add New Product</h1>
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
                  className={`relative aspect-square rounded-md border overflow-hidden cursor-pointer ${previewImage === image ? "ring-2 ring-emerald-600" : ""
                    }`}
                  onClick={() => setPreviewImage(image)}
                >
                  <Image
                    src={image}
                    alt={`Product image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <button
                    type="button"
                    className="absolute top-1 right-1 rounded-full bg-white p-1 shadow-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(index);
                    }}
                  >
                    <Trash className="h-3 w-3 text-red-500" />
                  </button>
                  {uploadProgress[index] > 0 && uploadProgress[index] < 100 && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                      <div
                        className="h-full bg-emerald-500"
                        style={{ width: `${uploadProgress[index]}%` }}
                      />
                    </div>
                  )}
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
                  value={productData.category}
                  onValueChange={(value) =>
                    setProductData((prev) => ({ ...prev, category: value }))
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
                  value={productData.tags}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-4">
            <h2 className="text-lg font-semibold">WhatsApp Order Settings</h2>
            <div className="mt-4 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsapp-message">Custom WhatsApp Message</Label>
                <Textarea
                  id="whatsapp-message"
                  placeholder="Hi, I'm interested in [Product Name]. Can I order it?"
                  rows={3}
                />
                <p className="text-xs text-gray-500">
                  Use placeholders like [Product Name] and [Price] which will be automatically filled.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Payment Options</Label>
                <div className="flex items-center space-x-2">
                  <Input type="checkbox" id="cod" className="h-4 w-4" defaultChecked />
                  <Label htmlFor="cod" className="text-sm font-normal">
                    Cash on Delivery
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Input type="checkbox" id="razorpay" className="h-4 w-4" />
                  <Label htmlFor="razorpay" className="text-sm font-normal">
                    Razorpay (Online Payment)
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Publish Product"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}