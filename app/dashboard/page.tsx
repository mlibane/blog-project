'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface PostStats {
  id: string
  title: string
  views: number
  likes: number
  comments: number
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<PostStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch('/api/dashboard/stats')
          if (response.ok) {
            const data = await response.json()
            setStats(data)
          } else {
            console.error('Failed to fetch stats')
          }
        } catch (error) {
          console.error('Error fetching stats:', error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchStats()
  }, [session])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Post Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="title" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="views" fill="#8884d8" />
              <Bar dataKey="likes" fill="#82ca9d" />
              <Bar dataKey="comments" fill="#ffc658" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Post Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left">Title</th>
                <th className="text-right">Views</th>
                <th className="text-right">Likes</th>
                <th className="text-right">Comments</th>
              </tr>
            </thead>
            <tbody>
              {stats.map((post) => (
                <tr key={post.id}>
                  <td>{post.title}</td>
                  <td className="text-right">{post.views}</td>
                  <td className="text-right">{post.likes}</td>
                  <td className="text-right">{post.comments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}