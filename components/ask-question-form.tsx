"use client"

import type React from "react"
import { useState } from "react"

interface AskQuestionFormProps {
  onSubmit: (question: string) => void
}

const AskQuestionForm: React.FC<AskQuestionFormProps> = ({ onSubmit }) => {
  const [question, setQuestion] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(question)
    setQuestion("")
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:gap-6">
      <div>
        <label htmlFor="question" className="block text-sm font-medium text-gray-700">
          Your Question:
        </label>
        <div className="mt-1">
          <textarea
            id="question"
            name="question"
            rows={3}
            className="w-full px-3 py-2 sm:px-4 sm:py-3 border rounded-md"
            placeholder="Ask your question here..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            required
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="px-4 py-2 sm:px-6 sm:py-3 text-sm sm:text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Submit Question
        </button>
      </div>
    </form>
  )
}

export default AskQuestionForm
