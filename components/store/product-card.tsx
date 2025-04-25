"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, ShoppingCart, Eye, Share2, PhoneCall } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import WhatsAppButton from "../whatsapp-integration/whatsapp-button"

interface ProductCardProps {
    product: any
    store: any
    featured?: boolean
}

export default function ProductCard({ product, store, featured = false }: ProductCardProps) {
    const [isLiked, setIsLiked] = useState(false)
    const [quickViewOpen, setQuickViewOpen] = useState(false)

    const handleLikeToggle = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsLiked(!isLiked)
    }

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setQuickViewOpen(true)
    }

    const buyLink = `https://wa.me/${store.whatsapp_number}?text=Hi! I'm interested in ${encodeURIComponent(product.name)} priced at ₹${product.price}. Can I order it?`

    return (
        <>
            <div
                className="group relative overflow-hidden transition-all duration-300 bg-white rounded-xl"
                style={{
                    borderRadius: "var(--category-card-radius)",
                    boxShadow: "var(--category-card-shadow)",
                    transition: "var(--category-transition)",
                }}
            >
                {/* Product link overlay */}
                {/* <Link href={`/store/${store.slug}/product/${product.id}`}>
          <span className="sr-only">View {product.name}</span>
        </Link> */}

                {/* Product Image */}
                <div className="relative aspect-square overflow-hidden">
                    <Image
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Action Buttons */}
                    <div className="absolute top-3 right-3 flex gap-2">
                        {/* <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm"
                          onClick={handleQuickView}
                        >
                             
                                <Eye className="h-4 w-4" />
                           
                        </Button> */}
                        <Button
                            variant="outline"
                            size="icon"
                            className={`h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm ${isLiked ? "text-red-500 hover:text-red-600" : ""
                                }`}
                            onClick={handleLikeToggle}
                        >
                            <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                        </Button>
                    </div>

                    {/* Badges */}
                    {featured && <Badge className="absolute top-3 left-3 bg-primary text-white">Featured</Badge>}
                    {product.is_new && <Badge className="absolute top-3 left-3 bg-blue-500 text-white">New</Badge>}
                    {product.discount_percentage > 0 && (
                        <Badge className="absolute top-3 left-3 bg-red-500 text-white">-{product.discount_percentage}%</Badge>
                    )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                    {product.category && (
                        <div className="text-xs text-primary font-medium mb-1">
                            {product.category}
                        </div>
                    )}

                    <Link href={`/store/${store.slug}/product/${product.id}`} className="block">
                        <h3 className="font-medium text-base mb-1 line-clamp-1">{product.name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1 mb-2">{product.description}</p>
                    </Link>

                    <div className="flex flex-col gap-4">
                        <div>
                            <span className="font-semibold text-left ">₹{product.price}</span>
                            {product.original_price && (
                                <span className="text-xs text-muted-foreground line-through ml-2">₹{product.original_price}</span>
                            )}
                        </div>
                        <Button
                            size="sm"
                            variant="outline"
                            className="bg-primary hover:bg-primary text-white hover:text-white rounded-full h-8 w-full px-5 py-4"
                            asChild
                        >
                            <Link href={buyLink} target="_blank" onClick={(e) => e.stopPropagation()}>
                               Buy on Whatsapp <PhoneCall className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick View Dialog (same as before) */}
            <Dialog open={quickViewOpen} onOpenChange={setQuickViewOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>{product.name}</DialogTitle>
                        <DialogDescription>
                            {product.description}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-6 sm:grid-cols-2 py-4">
                        <div className="aspect-square relative bg-gray-100 rounded-md overflow-hidden">
                            <Image
                                src={product.images?.[0] || "/placeholder.svg?height=300&width=300"}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-2xl font-bold text-primary">₹{product.price}</p>
                                    {product.original_price && (
                                        <p className="text-sm text-muted-foreground line-through">₹{product.original_price}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="outline"
                                        className={isLiked ? "text-red-500" : ""}
                                        onClick={() => setIsLiked(!isLiked)}
                                    >
                                        <Heart className={`h-4 w-4 ${isLiked ? "fill-red-500" : ""}`} />
                                    </Button>
                                    <Button size="icon" variant="outline">
                                        <Share2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-4 flex-1">
                                <div>
                                    <h4 className="text-sm font-medium mb-1">Description</h4>
                                    <p className="text-sm text-muted-foreground">
                                        {product.description || "No description available for this product."}
                                    </p>
                                </div>

                                {product.features && (
                                    <div>
                                        <h4 className="text-sm font-medium mb-1">Features</h4>
                                        <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                                            {product.features.map((feature: string, index: number) => (
                                                <li key={index}>{feature}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            <div className="mt-6 space-y-2">
                                <Button className="w-full bg-primary hover:bg-primary/90" asChild>
                                    <Link href={buyLink} target="_blank">
                                        <ShoppingCart className="mr-2 h-4 w-4" /> Buy on WhatsApp
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}