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