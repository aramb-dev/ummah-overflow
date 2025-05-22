import QuestionList from "@/components/question-list"
import Sidebar from "@/components/sidebar"

export default function Home() {
  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div className="w-full">
          <QuestionList />
        </div>
        <Sidebar />
      </div>
    </div>
  )
}
