"use client"

import PasswordSettings from "@/components/settings"

export default function ProfilePage() {
  return (
    <div className="w-full px-4 py-10 space-y-10">
      <h1 className="text-4xl font-bold text-[#034AA6]">Profile</h1>
      <PasswordSettings />
    </div>
  )
}