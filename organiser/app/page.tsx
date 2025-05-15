"use client"

import { useState } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

import data from "./data.json"

export default function Page() {
  const [tabValue, setTabValue] = useState("overview")

  return (
    <>
      <SiteHeader tabValue={tabValue} setTabValue={setTabValue}/>
      <div className="flex flex-1 flex-col gap-2 py-8">
        <div className="@container/main flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards />
            {tabValue === "overview" && (
              <>
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable data={data} />
              </>
            )}

            {tabValue === "organisation-profile" && (
              <div className="px-4 lg:px-6 text-muted">
                <p>Organisation profile content goes here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}