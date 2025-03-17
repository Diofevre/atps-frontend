'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { ChartTooltip } from "@/components/ui/chart"

interface TopicData {
  topic_id: number
  topic_name: string
  score: number
}

interface TopicsChartProps {
  data: TopicData[]
}

export function TopicsChart({ data }: TopicsChartProps) {
  const chartData = data.map(topic => ({
    name: topic.topic_name,
    score: Math.round(topic.score * 100),
  }))

  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 60,
          }}
        >
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#E5E7EB"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            tick={{ 
              fontSize: 12,
              fill: '#6B7280',
            }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <YAxis
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
            tick={{ 
              fontSize: 12,
              fill: '#6B7280',
            }}
            axisLine={{ stroke: '#E5E7EB' }}
            tickLine={{ stroke: '#E5E7EB' }}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload) return null
              return (
                <div className="rounded-lg border bg-white p-4 shadow-lg">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      {payload[0]?.payload.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-[#EECE84]" />
                      <p className="text-2xl font-bold text-gray-900">
                        {payload[0]?.value}%
                      </p>
                    </div>
                  </div>
                </div>
              )
            }}
          />
          <Bar
            dataKey="score"
            fill="#EECE84"
            radius={[6, 6, 0, 0]}
            className="fill-[#EECE84]"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}