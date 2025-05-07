// app/actions/verifycode.ts
'use server'

import { createServerClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"

export async function verifyLuckyCode(code: string) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  try {
    // 1. Check if code exists, is unused, and is valid
    const { data: codeData, error } = await supabase
      .from('referral_codes') // or 'lucky_codes' depending on your table name
      .select('id, is_used, is_valid')
      .eq('code', code.trim())
      .maybeSingle()

    if (error || !codeData) {
      return { success: false, error: 'Invalid referral code' }
    }

    if (codeData.is_used) {
      return { success: false, error: 'This code has already been used' }
    }

    if (!codeData.is_valid) {
      return { success: false, error: 'This code is no longer valid' }
    }

    // 2. Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return { success: false, error: 'User not authenticated' }
    }

    // 3. Mark code as used
    const { error: updateError } = await supabase
      .from('referral_codes')
      .update({ is_used: true })
      .eq('id', codeData.id)

    if (updateError) {
      return { success: false, error: updateError.message }
    }

    // 4. Upgrade user to pro plan
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        subscription_plan: 'pro',
        subscription_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      })
      .eq('id', user.id)

    if (profileError) {
      return { success: false, error: profileError.message }
    }

    revalidatePath('/dashboard')
    return { success: true }
  } catch (error) {
    console.error('Error verifying code:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}