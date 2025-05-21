"use client"

import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { BrandPanel } from "@/components/brand-panel"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen p-16 gap-0 bg-white">
      <BrandPanel />

      <div className="w-1/2 bg-white rounded-[48px] flex items-center justify-center relative -ml-20 z-10">
        <div className="w-full max-w-sm space-y-6 px-8 py-12">
          <h2 className="text-2xl font-bold text-[#004AAD]">Start your event<br />on TicketExpert</h2>

          <div className="space-y-4">
            <div>
              <Label className="mb-1">Email Address</Label>
              <Input type="email" placeholder="you@example.com" />
            </div>
            <div>
              <Label className="mb-1">Password</Label>
              <Input type="password" />
            </div>
            <Link href="/home">
              <Button className="w-full bg-[#004AAD] hover:bg-[#003a91] text-white">Log In</Button>
            </Link>
          </div>

          <p className="text-sm text-center">
            New to TicketExpert?{" "}
            <Link href="/signup" className="text-[#004AAD] font-medium underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}