"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search, Moon, Sun, Menu, LogOut, User, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useTheme } from "next-themes"
import { useAuth } from "@/context/auth-context"
import { ModerationNavItem } from "@/components/moderation/moderation-nav-item"
import { UserAvatar } from "@/components/user-avatar"
import { AdminNavItem } from "@/components/admin/admin-nav-item"

export function Navbar() {
  const pathname = usePathname()
  const { setTheme, theme } = useTheme()
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error("Failed to log out", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 pt-4">
                <Link href="/home" className="text-sm font-medium transition-colors hover:text-foreground/80">
                  Home
                </Link>
                <Link href="/tags" className="text-sm font-medium transition-colors hover:text-foreground/80">
                  Tags
                </Link>
                <Link href="/users" className="text-sm font-medium transition-colors hover:text-foreground/80">
                  Users
                </Link>
                <Link href="/ask" className="text-sm font-medium transition-colors hover:text-foreground/80">
                  Ask Question
                </Link>
                {user?.isModerator && (
                  <Link href="/moderation" className="text-sm font-medium transition-colors hover:text-foreground/80">
                    Moderation
                  </Link>
                )}
                {user?.isAdmin && (
                  <Link href="/admin" className="text-sm font-medium transition-colors hover:text-foreground/80">
                    Admin
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/home" className="flex items-center space-x-2">
            <span className="font-bold text-xl">UmmahOverflow</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/home"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/home" ? "font-medium text-foreground" : "text-foreground/60"
              }`}
            >
              Home
            </Link>
            <Link
              href="/tags"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/tags" ? "font-medium text-foreground" : "text-foreground/60"
              }`}
            >
              Tags
            </Link>
            <Link
              href="/users"
              className={`transition-colors hover:text-foreground/80 ${
                pathname === "/users" ? "font-medium text-foreground" : "text-foreground/60"
              }`}
            >
              Users
            </Link>
            <ModerationNavItem />
            <AdminNavItem />
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <form className="hidden md:flex relative w-full max-w-sm items-center">
            <Search className="absolute left-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search questions..." className="w-full pl-8 rounded-md bg-background" />
          </form>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <UserAvatar user={user} size="sm" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/users/${user.uid}`} className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="flex items-center">
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}
          <Button asChild className="hidden md:inline-flex">
            <Link href="/ask">Ask Question</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
