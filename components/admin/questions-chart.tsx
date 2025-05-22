"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data - in a real app, this would come from your database
const data = [
  {
    name: "Jan",
    questions: 78,
    answers: 124,
    accepted: 56,
  },
  {
    name: "Feb",
    questions: 85,
    answers: 136,
    accepted: 62,
  },
  {
    name: "Mar",
    questions: 101,
    answers: 148,
    accepted: 73,
  },
  {
    name: "Apr",
    questions: 112,
    answers: 167,
    accepted: 81,
  },
  {
    name: "May",
    questions: 138,
    answers: 203,
    accepted: 94,
  },
  {
    name: "Jun",
    questions: 156,
    answers: 237,
    accepted: 112,
  },
]

export function QuestionsChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Question Activity</CardTitle>
        <CardDescription>Monthly question and answer statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="questions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="answers" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="accepted" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
