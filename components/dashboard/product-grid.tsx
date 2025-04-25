"use client"

import Image from "next/image"
import { useState } from "react"
import { Edit, Edit2, Eye, MoreVertical, ShoppingBag, Trash, EyeOff, Badge, ZoomInIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import EditProductModal from "@/components/modals/EditProductModal"
import ViewProductModal from "../modals/ViewProductModal"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  is_active: boolean
}

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient()

  const [openModal, setOpenModal] = useState(false)
  const [openViewModal, setOpenViewModal] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [filter, setFilter] = useState<"all" | "hidden">("all")

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?")
    if (!confirmed) return

    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error

      toast({
        title: "Product deleted",
        description: "The product has been deleted successfully.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: "Error",
        description: "There was an error deleting the product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleToggleVisibility = async (product: Product) => {
    try {
      const { error } = await supabase
        .from("products")
        .update({ is_active: !product.is_active })
        .eq("id", product.id)

      if (error) throw error

      toast({
        title: product.is_active ? "Product hidden" : "Product visible",
        description: product.is_active
          ? "The product has been hidden from your store."
          : "The product is now visible in your store.",
      })

      router.refresh()
    } catch (error) {
      console.error("Error updating product visibility:", error)
      toast({
        title: "Error",
        description: "There was an error updating product visibility. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setOpenModal(true)
  }

  const handleView = (product: Product) => {
    setSelectedProduct(product)
    setOpenViewModal(true)
  }

  const filteredProducts = filter === "hidden"
    ? products.filter(product => !product.is_active)
    : products

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <div className="mb-4 rounded-full bg-emerald-100 p-3">
          <ShoppingBag className="h-6 w-6 text-emerald-600" />
        </div>
        <h3 className="text-lg font-medium">No products yet</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by adding your first product.</p>
        <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700" asChild>
          <a href="/dashboard/add-product">Add Product</a>
        </Button>
      </div>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Products</CardTitle>
              <CardDescription>Manage your product catalog</CardDescription>
            </div>

          </div>
          <div className="mb-4">
            <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "hidden")}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="hidden">Hidden</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

        </CardHeader>
        <CardContent className="p-0">


          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 rounded-full bg-gray-100 p-3">
                <EyeOff className="h-6 w-6 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium">No hidden products</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === "hidden"
                  ? "You don't have any hidden products yet."
                  : "No products match the current filter."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`group relative overflow-hidden rounded-lg border bg-white`}
                >

                  <div className="aspect-square relative">
                    <Image
                      src={product.images?.[0] || `/placeholder.svg?height=200&width=200&text=Product`}
                      alt={product.name}
                      width={200}
                      height={200}
                      className={`object-cover w-full h-full ${!product.is_active ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}
                    />
                    <div className={`absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 ${!product.is_active ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
                      <div className="flex gap-2">
                        <Button
                          className="bg-transparent hover:bg-transparent"
                          size="sm"
                          variant="destructive"
                          onClick={() => handleEdit(product)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>

                        <Button
                          className="bg-transparent hover:bg-transparent"
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(product.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                        <Button
                          className="bg-transparent hover:bg-transparent"
                          size="sm"
                          variant="destructive"
                          onClick={() => handleView(product)}
                        >
                          <ZoomInIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className={`font-medium ${!product.is_active ? "opacity-50 pointer-events-none" : "opacity-100"}`}>{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        {!product.is_active && (

                          <p className="text-red-600 text-[11px] mb-3"> Hidden/Out of stock</p>


                        )}
                        <p className={`text-sm font-bold ${!product.is_active ? "opacity-50 pointer-events-none" : "opacity-100"}`}>₹{product.price}</p>

                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(product)}>
                            <Edit2 className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleVisibility(product)}>
                            {product.is_active ? (
                              <>
                                <EyeOff className="h-4 w-4 mr-2" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="h-4 w-4 mr-2" />
                                Show
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleView(product)}
                            className="text-blue-600"
                          >
                            <ZoomInIcon className="h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600"
                          >
                            <Trash className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </CardContent>
      </Card>

      {selectedProduct && (
        <EditProductModal
          product={selectedProduct}
          isOpen={openModal}
          onClose={() => setOpenModal(false)}
          onSave={() => {
            setOpenModal(false)
            router.refresh()
          }}
        />
      )}

      {selectedProduct && (
        <ViewProductModal
          productId={selectedProduct.id}
          isOpen={openViewModal}
          onClose={() => setOpenViewModal(false)}
        />
      )}
    </>
  )
}