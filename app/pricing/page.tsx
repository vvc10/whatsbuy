// app/pricing/page.tsx
import Footer from "@/components/footer"
import Header from "@/components/header"
import { PricingPage } from "@/components/pricing/PricingPage"

export default function Page() {
  return(
    <>
      <Header />
      <PricingPage />
      <Footer/>
    </>
  )
  
  
}