"use client"

import Image from "next/image"
import { useState } from "react"
import { Edit2, Eye, EyeOff, MoreVertical, ShoppingBag, Trash, ZoomIn } from "lucide-react"
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
import { Badge } from "../ui/badge"
import { Skeleton } from "../ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "../ui/tooltip"

interface Product {
  id: string
  name: string
  price: number
  images: string[]
  is_active: boolean
  views?: number
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
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?")
    if (!confirmed) return

    try {
      setLoadingStates(prev => ({ ...prev, [id]: true }))
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
    } finally {
      setLoadingStates(prev => ({ ...prev, [id]: false }))
    }
  }

  const handleToggleVisibility = async (product: Product) => {
    try {
      setLoadingStates(prev => ({ ...prev, [product.id]: true }))
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
    } finally {
      setLoadingStates(prev => ({ ...prev, [product.id]: false }))
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
        <div className="mb-4 rounded-full bg-emerald-100 p-3 dark:bg-emerald-900/50">
          <ShoppingBag className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h3 className="text-lg font-medium">No products yet</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Get started by adding your first product.
        </p>
        <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800">
          Add Product
        </Button>
      </div>
    )
  }

  return (
    <TooltipProvider>
      <Card className="border-0 shadow-sm">
        <CardHeader className="p-6 pb-0">
          <div className="flex flex-col space-y-1.5">
            <CardTitle className="text-lg font-semibold">Product Catalog</CardTitle>
            <CardDescription className="text-sm">
              Manage and organize your products
            </CardDescription>
          </div>
          <div className="mt-4">
            <Tabs value={filter} onValueChange={(value) => setFilter(value as "all" | "hidden")}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">All Products</TabsTrigger>
                <TabsTrigger value="hidden">Hidden</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent className="p-6 pt-3">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed">
              <div className="mb-4 rounded-full bg-gray-100 p-3 dark:bg-gray-800">
                <EyeOff className="h-6 w-6 text-gray-600 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium">No {filter === "hidden" ? "hidden" : "matching"} products</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {filter === "hidden"
                  ? "You don't have any hidden products yet."
                  : "No products match the current filter."}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={`group relative overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md ${
                    !product.is_active ? "opacity-80" : ""
                  }`}
                >
                  <div className="relative aspect-square">
                    <Image
                      src={product.images?.[0] || `/placeholder.svg`}
                      alt={product.name}
                      width={300}
                      height={300}
                      className={`h-full w-full object-cover transition-opacity ${
                        !product.is_active ? "opacity-70" : "group-hover:opacity-90"
                      }`}
                      priority={false}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                      <div className="flex gap-2">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-full bg-white/20 text-white hover:bg-white/30"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleView(product)
                              }}
                            >
                              <ZoomIn className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Quick View</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9 rounded-full bg-white/20 text-white hover:bg-white/30"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleEdit(product)
                              }}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Edit</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    {!product.is_active && (
                      <div className="absolute top-2 left-2">
                        <Badge variant="destructive" className="px-2 py-1 text-xs">
                          Hidden
                        </Badge>
                      </div>
                    )}
                    {product.views && product.views > 0 && (
                      <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                        <Eye className="h-3 w-3" />
                        <span>{product.views}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="truncate font-medium">{product.name}</h3>
                        <p className="text-sm font-bold text-primary">₹{product.price}</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0 rounded-full"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem
                            onClick={() => handleEdit(product)}
                            className="cursor-pointer"
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleToggleVisibility(product)}
                            className="cursor-pointer"
                            disabled={loadingStates[product.id]}
                          >
                            {product.is_active ? (
                              <>
                                <EyeOff className="mr-2 h-4 w-4" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="mr-2 h-4 w-4" />
                                Show
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleView(product)}
                            className="cursor-pointer"
                          >
                            <ZoomIn className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(product.id)}
                            className="cursor-pointer text-destructive focus:text-destructive"
                            disabled={loadingStates[product.id]}
                          >
                            <Trash className="mr-2 h-4 w-4" />
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
    </TooltipProvider>
  )
}