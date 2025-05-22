"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data - in a real app, this would come from your database
const data = [
  {
    name: "Jan",
    users: 45,
    questions: 78,
    answers: 124,
  },
  {
    name: "Feb",
    users: 52,
    questions: 85,
    answers: 136,
  },
  {
    name: "Mar",
    users: 61,
    questions: 101,
    answers: 148,
  },
  {
    name: "Apr",
    users: 67,
    questions: 112,
    answers: 167,
  },
  {
    name: "May",
    users: 81,
    questions: 138,
    answers: 203,
  },
  {
    name: "Jun",
    users: 93,
    questions: 156,
    answers: 237,
  },
]

export function Overview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Platform Overview</CardTitle>
        <CardDescription>Monthly activity across the platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Bar dataKey="users" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="questions" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="answers" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
