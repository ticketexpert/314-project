"use client"

import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SiteHeader({ tabValue, setTabValue }: {
  tabValue: string
  setTabValue: (value: string) => void
}) {
  return (
    <header className="flex flex-col h-[--header-height] shrink-0 border-b px-4 lf:px-6 py-2">
      {/* Top row */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 h-6"/>
        <h1 className="font-sans font-semibold text-4xl text-[#034AA6]">Hey Matthew!</h1>
      </div>

      {/* Tabs below the name */}
      <div className="mt-4">
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview" onClick={() => setTabValue("overview")} data-state={tabValue === "overview" ? "active" : ""}>
              Overview
            </TabsTrigger>
            <TabsTrigger value="organisation-profile" onClick={() => setTabValue("organisation-profile")} data-state={tabValue === "organisation-profile" ? "active" : ""}>
              Organisation Profile
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </header>
  )
}
