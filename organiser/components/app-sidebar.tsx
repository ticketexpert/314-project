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

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem('userId')
        console.log(userId)
        if (!userId) {
          console.error('No user ID found in localStorage')
          return
        }

        const response = await fetch(`https://api.ticketexpert.me/api/users/${userId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch user data')
        }

        const user: User = await response.json()
        setUserData({
          name: user.name,
          email: user.email,
          avatar: "/avatars/shadcn.jpg", // You might want to add avatar to your user model
        })
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserData()
  }, [])

  return (
    <Sidebar className="" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 hover:bg-white/10 transition-colors rounded-md"
            >
              <a href="#">
                <NavUser user={userData} />
              </a>
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