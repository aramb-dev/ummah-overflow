import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserAvatar } from "@/components/user-avatar"

// Sample data for popular tags
const popularTags = [
  { name: "react", count: 452 },
  { name: "next.js", count: 389 },
  { name: "javascript", count: 325 },
  { name: "typescript", count: 287 },
  { name: "node.js", count: 245 },
  { name: "firebase", count: 198 },
  { name: "tailwindcss", count: 176 },
  { name: "supabase", count: 154 },
]

// Sample data for top users
const topUsers = [
  { id: 1, name: "Ahmed Khan", email: "ahmed@example.com", reputation: 12543 },
  { id: 2, name: "Fatima Ali", email: "fatima@example.com", reputation: 9876 },
  { id: 3, name: "Omar Farooq", email: "omar@example.com", reputation: 8765 },
  { id: 4, name: "Aisha Rahman", email: "aisha@example.com", reputation: 7654 },
  { id: 5, name: "Yusuf Ibrahim", email: "yusuf@example.com", reputation: 6543 },
]

export function Sidebar() {
  return (
    <div className="w-full md:w-80 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Popular Tags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {popularTags.map((tag) => (
              <Link key={tag.name} href={`/tags/${tag.name}`}>
                <Badge variant="secondary" className="rounded-md cursor-pointer">
                  {tag.name}
                  <span className="ml-1 text-xs text-muted-foreground">×{tag.count}</span>
                </Badge>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topUsers.map((user) => (
              <Link
                key={user.id}
                href={`/users/${user.id}`}
                className="flex items-center gap-3 hover:bg-muted p-2 rounded-md transition-colors"
              >
                <UserAvatar
                  username={user.name}
                  user={{
                    displayName: user.name,
                    email: user.email,
                  }}
                  size="sm"
                />
                <div>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.reputation.toLocaleString()} reputation</div>
                </div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
