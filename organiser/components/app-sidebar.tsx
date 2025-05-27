"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react"
import TELogo from "./logo"

import { NavDocuments } from "@/components/nav-documents"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useAuth } from "@/contexts/auth-context"

interface User {
  userId: number
  name: string
  email: string
  role: string
  eventOrgId: number | null
}

const defaultUser = {
  name: "Loading...",
  email: "loading@example.com",
  avatar: "/avatars/shadcn.jpg",
}

const data = {
  brand: {
    title: "Ticket Expert"
  },
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: IconDashboard,
    },
    {
      title: "Sales",
      url: "/sales",
      icon: IconListDetails,
    },
    {
      title: "My Events",
      url: "/events",
      icon: IconChartBar,
    },
    {
      title: "Settings",
      url: "/profile",
      icon: IconSettings,
    },
    {
      title: "Scan Tickets",
      url: "https://entry.ticketexpert.me/",
      icon: IconSettings,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: IconCamera,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: IconFileDescription,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: IconFileAi,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [],
  documents: [],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [userData, setUserData] = useState(defaultUser)
  const [isLoading, setIsLoading] = useState(true)
  const { userId, user, isInitialized } = useAuth()

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!isInitialized) {
          return // Wait for auth to initialize
        }

        if (!userId) {
          console.error('No user ID found in auth context')
          setUserData(defaultUser)
          return
        }

        const response = await fetch(`https://api.ticketexpert.me/api/users/${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const user: User = await response.json()
        setUserData({
          name: user.name || defaultUser.name,
          email: user.email || defaultUser.email,
          avatar: "/avatars/shadcn.jpg", 
        })
      } catch (error) {
        console.error('Error fetching user data:', error)
        setUserData(defaultUser)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [userId, isInitialized])

  return (
    <Sidebar className="" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-white/10 transition-colors rounded-md"
            >
              <div className="w-full">
                <NavUser userData={userData} isLoading={isLoading} />
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <TELogo />
      </SidebarFooter>
    </Sidebar>
  )
}