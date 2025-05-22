import './globals.css';
import { rethinkSans } from './fonts';
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Ticket Expert",
  description: "Event Management System",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={rethinkSans.variable}>
      <body className="font-sans">
        {children}
        <Toaster />
      </body>
    </html>
  );
}