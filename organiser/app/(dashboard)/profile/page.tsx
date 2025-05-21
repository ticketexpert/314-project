"use client"

import ProfileInfo from "@/components/profile-info"
import BillingInfo from "@/components/billing-info"
import NotificationSettings from "@/components/notification-settings"
import PasswordSettings from "@/components/settings"

export default function ProfilePage() {
  return (
    <div className="w-full px-4 py-10 space-y-10">
      <h1 className="text-4xl font-bold text-[#034AA6]">Profile</h1>
      <ProfileInfo />
      <BillingInfo />
      <NotificationSettings />
      <PasswordSettings />
    </div>
  )
}