import { getQuestion } from "@/lib/data"
import { notFound } from "next/navigation"

interface Props {
  params: { id: string }
}

export default async function QuestionPage({ params: { id } }: Props) {
  const question = await getQuestion(id)

  if (!question) {
    notFound()
  }

  return (
    <div className="container py-6 px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <h1 className="text-2xl font-bold">{question.title}</h1>
          <p className="mt-2">{question.content}</p>
        </div>
        <div>
          {/* Sidebar content here */}
          <div className="bg-gray-100 p-4 rounded">
            <h2 className="text-lg font-semibold">Related Questions</h2>
            <ul>
              <li>Question 1</li>
              <li>Question 2</li>
              <li>Question 3</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
