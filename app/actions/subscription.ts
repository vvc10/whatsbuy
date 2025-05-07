// app/actions/subscription.ts
'use server'

import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

interface SubscriptionStatus {
  plan: SubscriptionPlan
  isActive: boolean
  validUntil?: Date | null
  daysRemaining?: number
}

export async function checkSubscription(): Promise<SubscriptionStatus> {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { plan: 'free', isActive: false }
  }

  // 2. Get user's subscription data
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('subscription_plan, subscription_expires_at')
    .eq('id', user.id)
    .single()

  if (error || !profile) {
    return { plan: 'free', isActive: false }
  }

  // 3. Check if subscription is expired
  const currentDate = new Date()
  const expiresAt = profile.subscription_expires_at ? new Date(profile.subscription_expires_at) : null
  const isActive = expiresAt ? expiresAt > currentDate : false
  const daysRemaining = expiresAt ? Math.ceil((expiresAt.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)) : 0

  return {
    plan: profile.subscription_plan || 'free',
    isActive,
    validUntil: expiresAt,
    daysRemaining: isActive ? daysRemaining : 0
  }
}

export async function updateSubscription(plan: SubscriptionPlan, durationInMonths: number = 1) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // 2. Calculate expiration date
  const currentDate = new Date()
  const expiresAt = new Date(currentDate.setMonth(currentDate.getMonth() + durationInMonths))

  // 3. Update user's subscription
  const { error } = await supabase
    .from('profiles')
    .update({ 
      subscription_plan: plan,
      subscription_expires_at: expiresAt.toISOString()
    })
    .eq('id', user.id)

  if (error) {
    throw error
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function cancelSubscription() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // 1. Get current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    throw new Error('User not authenticated')
  }

  // 2. Downgrade to free plan
  const { error } = await supabase
    .from('profiles')
    .update({ 
      subscription_plan: 'free',
      subscription_expires_at: null
    })
    .eq('id', user.id)

  if (error) {
    throw error
  }

  revalidatePath('/dashboard')
  return { success: true }
}