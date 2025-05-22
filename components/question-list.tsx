"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { collection, query, orderBy, getDocs, where, getDoc } from "firebase/firestore"
import { db } from "@/firebase"

interface QuestionListProps {
  limit?: number
  userId?: string
  tag?: string
}

const QuestionList: React.FC<QuestionListProps> = ({ limit, userId, tag }) => {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchQuestions()
  }, [userId, limit, tag])

  const fetchQuestions = async () => {
    setLoading(true)
    try {
      let questionsQuery

      if (userId) {
        questionsQuery = query(
          collection(db, "questions"),
          where("userId", "==", userId),
          orderBy("createdAt", "desc"),
          limit(limit || 10),
        )
      } else if (tag) {
        questionsQuery = query(
          collection(db, "questions"),
          where("tags", "array-contains", tag),
          orderBy("createdAt", "desc"),
          limit(limit || 10),
        )
      } else {
        questionsQuery = query(collection(db, "questions"), orderBy("createdAt", "desc"), limit(limit || 10))
      }

      const querySnapshot = await getDocs(questionsQuery)
      const questionsList = []

      for (const doc of querySnapshot.docs) {
        const questionData = { id: doc.id, ...doc.data() }

        // Fetch user data for each question
        const userDoc = await getDoc(doc(db, "users", questionData.userId))
        const userData = userDoc.exists() ? userDoc.data() : null

        questionsList.push({
          ...questionData,
          user: userData,
        })
      }

      setQuestions(questionsList)
    } catch (error) {
      console.error("Error fetching questions:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <p>Loading...</p>
  }

  return (
    <ul>
      {questions.map((question: any) => (
        <li key={question.id}>
          {question.title} - {question.user?.name || "Unknown User"}
        </li>
      ))}
    </ul>
  )
}

export default QuestionList
