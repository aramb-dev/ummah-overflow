"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { BarChart3, Users, Tag, FileText, Flag, Settings, MessageSquare, ShieldAlert, Home } from "lucide-react"

const adminRoutes = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Tags",
    href: "/admin/tags",
    icon: Tag,
  },
  {
    title: "Topics",
    href: "/admin/topics",
    icon: FileText,
  },
  {
    title: "Questions",
    href: "/admin/questions",
    icon: MessageSquare,
  },
  {
    title: "Moderation",
    href: "/admin/moderation",
    icon: ShieldAlert,
  },
  {
    title: "Flags",
    href: "/admin/flags",
    icon: Flag,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-full md:w-64 border-r bg-background md:h-[calc(100vh-4rem)] md:sticky md:top-16 overflow-y-auto">
      <div className="md:hidden flex items-center justify-between px-4 py-2 border-b">
        <h2 className="text-lg font-semibold tracking-tight">Admin Dashboard</h2>
        <Link href="/home" className="text-muted-foreground">
          <Home className="h-4 w-4" />
        </Link>
      </div>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2 hidden md:block">
          <h2 className="text-lg font-semibold tracking-tight">Admin Dashboard</h2>
          <p className="text-sm text-muted-foreground">Manage your platform</p>
        </div>
        <div className="px-3">
          <Link
            href="/home"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            Back to Site
          </Link>
        </div>
        <nav className="space-y-1 px-3">
          {adminRoutes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-foreground",
                pathname === route.href
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground hover:bg-muted/50",
              )}
            >
              <route.icon className="h-4 w-4" />
              {route.title}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
