import Link from "next/link"
import { Button } from "@/components/ui/button"
import { QuestionList } from "@/components/question-list"
import { Sidebar } from "@/components/sidebar"

export default function Home() {
  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Top Questions</h1>
            <Button asChild>
              <Link href="/ask">Ask Question</Link>
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-6">
            <Button variant="secondary" size="sm" className="rounded-full">
              Newest
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full">
              Active
            </Button>
            <Button variant="ghost" size="sm" className="rounded-full">
              Unanswered
            </Button>
          </div>
          <QuestionList />
        </div>
        <Sidebar />
      </div>
    </div>
  )
}
