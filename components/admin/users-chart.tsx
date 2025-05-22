"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data - in a real app, this would come from your database
const data = [
  {
    name: "Jan",
    total: 45,
    newUsers: 12,
    activeUsers: 32,
  },
  {
    name: "Feb",
    total: 52,
    newUsers: 14,
    activeUsers: 38,
  },
  {
    name: "Mar",
    total: 61,
    newUsers: 18,
    activeUsers: 43,
  },
  {
    name: "Apr",
    total: 67,
    newUsers: 15,
    activeUsers: 49,
  },
  {
    name: "May",
    total: 81,
    newUsers: 21,
    activeUsers: 57,
  },
  {
    name: "Jun",
    total: 93,
    newUsers: 25,
    activeUsers: 63,
  },
]

export function UsersChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Growth</CardTitle>
        <CardDescription>Monthly user statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="newUsers" stroke="#22c55e" strokeWidth={2} />
              <Line type="monotone" dataKey="activeUsers" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
