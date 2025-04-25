"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import { supabase } from "@/lib/supabase"

// Initialize database schema
export async function initializeDatabase() {
  // Create profiles table if it doesn't exist
  const { error } = await supabase.rpc("initialize_profiles_table")

  if (error) {
    console.error("Error initializing database:", error)
  }
}

// Sign up a new user
export async function signUp({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) {
  const supabase = createServerActionClient({ cookies })

  // Sign up the user
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // We don't need to manually create a profile entry anymore
  // The trigger function in the database will handle this automatically

  return { success: true }
}

// Sign in a user
export async function signIn({
  email,
  password,
}: {
  email: string
  password: string
}) {
  const supabase = createServerActionClient({ cookies })

  // Sign in the user
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Check if user has completed onboarding
  if (data.user) {
    const { data: profile } = await supabase.from("profiles").select("onboarding").eq("id", data.user.id).single()

    // Redirect based on onboarding status
    if (profile && profile.onboarding) {
      redirect("/dashboard")
    } else {
      redirect("/onboarding")
    }
  }

  return { success: true }
}

// Complete onboarding
export async function completeOnboarding({
  userId,
  businessName,
  whatsappNumber,
  bio,
}: {
  userId: string
  businessName: string
  whatsappNumber: string
  bio: string
}) {
  const supabase = createServerActionClient({ cookies })

  // Update the profile with onboarding data
  const { error } = await supabase
    .from("profiles")
    .update({
      business_name: businessName,
      whatsapp_number: whatsappNumber,
      bio: bio,
      onboarding: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/dashboard")
  return { success: true }
}

// Sign out
export async function signOut() {
  const supabase = createServerActionClient({ cookies })
  await supabase.auth.signOut()
  redirect("/login")
}
