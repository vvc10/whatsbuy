// components/AddProductModal.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AddProductPage from "@/app/dashboard/add-product/page"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { AlertTriangle } from "lucide-react"

interface AddProductModalProps {
  storeId?: string
  disabled?: boolean
}

export default function AddProductModal({ 
  storeId, 
  disabled = false, 
}: AddProductModalProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  const handleOpen = () => {
    // if (disabled && onDisabledClick) {
    //   onDisabledClick()
    //   return
    // }
    setOpen(true)
  }

  const handleClose = () => setOpen(false)
  const handleUpgrade = () => router.push('/dashboard/billing')

  return (
    <>
 
        <Button 
          onClick={handleOpen} 
          className="bg-emerald-600 hover:bg-emerald-700"
          
        >
          Add Product
        </Button>
       

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
          {/* <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader> */}
          {disabled ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">Product Limit Reached</h3>
              <p className="text-gray-500 mb-6">
                You've reached the maximum number of products allowed on the free plan.
              </p>
              <Button 
                onClick={handleUpgrade}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Upgrade Now
              </Button>
            </div>
          ) : (
            <AddProductPage handleClose={handleClose} storeId={storeId} />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}