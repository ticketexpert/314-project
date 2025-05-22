"use client"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useState } from "react"

interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
}

export function SiteHeader({ tabValue, setTabValue }: {
  tabValue: string
  setTabValue: (value: string) => void
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          setError('No user ID found');
          setLoading(false);
          return;
        }

        const response = await fetch(`https://api.ticketexpert.me/api/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="flex flex-col h-[--header-height] shrink-0 border-b px-4 lf:px-6 py-2">
      <div className="flex items-center gap-2">
        {loading ? (
          <h1 className="font-sans font-semibold text-4xl text-[#034AA6]">Loading...</h1>
        ) : error ? (
          <h1 className="font-sans font-semibold text-4xl text-[#034AA6]">Error</h1>
        ) : (
          <h1 className="font-sans font-semibold text-4xl text-[#034AA6]">
            Hey {user?.name || 'User'}!
          </h1>
        )}
      </div>
      
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
