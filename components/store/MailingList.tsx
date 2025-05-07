'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "../ui/input"
import { createClient } from "@/lib/supabase/client"

const MailingList = ({ store }: { store: any }) => {
    const [email, setEmail] = useState("")
    const [subscribed, setSubscribed] = useState(false)
    const supabase = createClient()

    const handleSubscribe = async () => {
        if (!email) return

        const { data, error: fetchError } = await supabase
            .from("stores")
            .select("user_mail_list")
            .eq("id", store.id)
            .single()

        if (fetchError) {
            console.error("Fetch error:", fetchError)
            return
        }

        const existingList = data?.user_mail_list || []

        // Check for existing email
        const alreadySubscribed = existingList.some(
            (entry: any) => entry.email === email
        )

        if (alreadySubscribed) {
            setSubscribed(true)
            return
        }

        const updatedList = [
            ...existingList,
            {
                email,
                timestamp: new Date().toISOString(),
            },
        ]

        const { error: updateError } = await supabase
            .from("stores")
            .update({ user_mail_list: updatedList })
            .eq("id", store.id)

        if (updateError) {
            console.error("Update error:", updateError)
        } else {
            setSubscribed(true)
            setEmail("")
        }
    }

    return (
        <section className="mb-16">
            <div className="bg-gradient-to-br from-gray-800 via-gray-800 to-green-900 rounded-2xl shadow-sm border border-gray-700 p-8">
                <div className="max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-white mb-3">Mailing List</h2>
                    <p className="text-gray-300 mb-6 max-w-lg mx-auto">
                        Subscribe below to receive updates about new music, tour dates, videos and merch.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <Input
                            placeholder="name@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="rounded-lg border-gray-700 focus-visible:ring-2 focus-visible:ring-green-500 bg-gray-900 text-white"
                        />

                        <Button
                            className="rounded-lg bg-black hover:bg-gray-900 text-white"
                            onClick={handleSubscribe}
                        >
                            {subscribed ? "Subscribed" : "Subscribe"}
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default MailingList
