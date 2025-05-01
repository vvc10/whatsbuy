import type { Metadata } from "next"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"
import LoginForm from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login - WhatsBuy.in",
  description: "Login to your WhatsBuy.in account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <ShoppingBag className="h-5 w-5 text-emerald-600" />
          <span className="text-emerald-600">WhatsBuy.in</span>
        </Link>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <div className="mx-auto w-full max-w-md space-y-6">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-gray-500">Enter your credentials to access your account</p>
          </div>
          <LoginForm />
          <div className="text-center text-sm">
            <p className="text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-emerald-600 hover:text-emerald-500">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
