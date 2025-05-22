import type React from "react"
import { AdminGuard } from "@/components/admin/admin-guard"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Navbar } from "@/components/navbar"

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <AdminGuard>
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <div className="flex-1 flex">
          <AdminSidebar />
          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </AdminGuard>
  )
}
