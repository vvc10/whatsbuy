// components/AddProductModal.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AddProductPage from "@/app/dashboard/add-product/page"

export default function AddProductModal() {
  const [open, setOpen] = useState(false)

  // Function to handle opening and closing of the modal
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
 
  return (
    <>
      {/* Button to open the modal */}
      <button onClick={handleOpen} className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-md">
        Add Product
      </button>

      {/* Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl overflow-y-auto max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
          <AddProductPage handleClose={handleClose}/>
        </DialogContent>
      </Dialog>
    </>
  )
}
