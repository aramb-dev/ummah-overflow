import type React from "react"

interface Question {
  id: string
  title: string
  tags: string[]
  views: number
  answers: number
  createdAt: Date
}

interface QuestionListProps {
  questions: Question[]
}

const QuestionList: React.FC<QuestionListProps> = ({ questions }) => {
  return (
    <div className="space-y-4 px-4 sm:px-6 md:px-0">
      {questions.map((question) => (
        <div key={question.id} className="p-4 sm:p-6 border rounded-lg hover:bg-muted/50 transition-colors">
          <a href={`/questions/${question.id}`}>
            <h2 className="text-lg sm:text-xl font-semibold line-clamp-2 hover:text-primary transition-colors">
              {question.title}
            </h2>
          </a>
          <div className="flex flex-wrap gap-2 mt-2">
            {question.tags.map((tag) => (
              <span key={tag} className="px-2 py-1 bg-secondary rounded-full text-xs">
                {tag}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-muted-foreground mt-2">
            <span>{question.views} views</span>
            <span>{question.answers} answers</span>
            <span>Created at {question.createdAt.toLocaleDateString()}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default QuestionList
