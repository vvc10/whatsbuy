export type SubscriptionPlan = "free" | "starter" | "pro"

export const subscriptionLimits = {
  free: {
    productLimit: 5,
    storeLimit: 1,
  },
  starter: {
    productLimit: 15,
    storeLimit: 2,
  },
  pro: {
    productLimit: Infinity,
    storeLimit: 5,
  },
}

export interface LuckyCode {
  id: string
  code: string
  is_used: boolean
  plan_id: SubscriptionPlan
  created_at: string
  used_at: string | null
  used_by: string | null
  expires_at: string | null
}