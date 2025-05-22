import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getVercelAvatar, getAnonymousAvatar } from "@/lib/avatar-utils"

interface UserAvatarProps {
  user?: {
    displayName?: string | null
    email?: string | null
    photoURL?: string | null
    uid?: string
  } | null
  username?: string
  size?: "sm" | "md" | "lg" | "xl"
  isAnonymous?: boolean
}

export function UserAvatar({ user, username, size = "md", isAnonymous = false }: UserAvatarProps) {
  // Size mapping
  const sizeClass = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  }

  // Size for Vercel avatar
  const pixelSize = {
    sm: 32,
    md: 40,
    lg: 64,
    xl: 96,
  }

  // If anonymous, use anonymous avatar
  if (isAnonymous) {
    return (
      <Avatar className={sizeClass[size]}>
        <AvatarImage src={getAnonymousAvatar(pixelSize[size]) || "/placeholder.svg"} alt="Anonymous User" />
        <AvatarFallback>A</AvatarFallback>
      </Avatar>
    )
  }

  // If user has a custom photo URL, use that
  if (user?.photoURL) {
    return (
      <Avatar className={sizeClass[size]}>
        <AvatarImage src={user.photoURL || "/placeholder.svg"} alt={user?.displayName || "User"} />
        <AvatarFallback>{user?.displayName?.charAt(0) || username?.charAt(0) || "U"}</AvatarFallback>
      </Avatar>
    )
  }

  // Otherwise, use Vercel avatar
  const displayName = user?.displayName || username || "User"
  const email = user?.email || undefined

  return (
    <Avatar className={sizeClass[size]}>
      <AvatarImage src={getVercelAvatar(displayName, email, pixelSize[size]) || "/placeholder.svg"} alt={displayName} />
      <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
    </Avatar>
  )
}
