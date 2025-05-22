"use client"

import { ProtectedRoute } from "@/components/auth/protected-route"
import AskQuestionForm from "@/components/ask-question-form"

export default function AskQuestion() {
  return (
    <ProtectedRoute>
      <AskQuestionForm />
    </ProtectedRoute>
  )
}
