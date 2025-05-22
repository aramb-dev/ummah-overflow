import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function TagNotFound() {
  return (
    <div className="container py-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Tag Not Found</h1>
      <p className="text-muted-foreground mb-6">The tag you're looking for doesn't exist or has been removed.</p>
      <div className="flex justify-center gap-4">
        <Button asChild>
          <Link href="/tags">Browse All Tags</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  )
}
