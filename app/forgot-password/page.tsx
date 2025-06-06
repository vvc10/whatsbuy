import type { Metadata } from "next"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import ForgotPasswordForm from "@/components/auth/forgot-password-form"

export const metadata: Metadata = {
  title: "Forgot Password - WhatsBuy.in",
  description: "Reset your WhatsBuy.in password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ShoppingBag className="h-5 w-5 text-emerald-600" />
          <span className="text-emerald-600">WhatsBuy.in</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Forgot your password?</h1>
            <p className="text-gray-500">Enter your email and we'll send you a reset link</p>
          </div>
          <ForgotPasswordForm />
          <div className="text-center text-sm">
            <p className="text-gray-500">
              Remember your password?{" "}
              <Link href="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
