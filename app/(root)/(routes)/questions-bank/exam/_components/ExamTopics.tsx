"use client"

import React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@/lib/mock-clerk"
import { BookOpen } from "lucide-react"
import useSWR from "swr"

interface Topic {
  id: string
  topic_name: string
  exam_number_question: number
  exam_duration: string
}

interface TopicInfo {
  id: string
  topic_name: string
  exam_number_question: number
  exam_duration: string
}

interface TopicsExamProps {
  onSelectionChange: (topicInfo: TopicInfo) => void
}

interface TopicsResponse {
  topics: Topic[]
}

const TopicsExam = ({ onSelectionChange }: TopicsExamProps) => {
  const { getToken } = useAuth()
  const [selectedValue, setSelectedValue] = React.useState<string>("")

  const fetcher = async (url: string) => {
    const token = await getToken()
    if (!token) throw new Error("Authentication token not available")

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch topics: ${response.statusText}`)
    }

    return response.json()
  }

  const { data, error, isLoading } = useSWR<TopicsResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/topics`,
    fetcher
  )

  const options = data?.topics ?? []

  const handleSelection = (value: string) => {
    setSelectedValue(value)
    const selectedTopic = options.find(topic => topic.id === value)
    if (selectedTopic) {
      onSelectionChange({
        id: selectedTopic.id,
        topic_name: selectedTopic.topic_name,
        exam_number_question: selectedTopic.exam_number_question,
        exam_duration: selectedTopic.exam_duration
      })
    }
  }

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
        <BookOpen size={18} />
      </div>
      <Select onValueChange={handleSelection} value={selectedValue}>
        <SelectTrigger 
          className="w-full pl-10 pr-4 h-14 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:border-primary/80 focus:ring-1 focus:ring-primary/20 transition-all duration-200"
        >
          <SelectValue 
            placeholder={isLoading ? "Loading syllabuses..." : "Choose your syllabus"} 
            className="text-gray-600 dark:text-gray-300"
          />
        </SelectTrigger>
        <SelectContent 
          className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg"
        >
          <SelectGroup className="py-2">
            {isLoading ? (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                Loading syllabuses...
              </div>
            ) : error ? (
              <div className="px-4 py-3 text-sm text-red-500">
                {error.message}
              </div>
            ) : options.length > 0 ? (
              options.map((topic) => (
                <SelectItem 
                  key={topic.id} 
                  value={topic.id}
                  className="px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  {topic.topic_name}
                </SelectItem>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                No syllabuses available
              </div>
            )}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}

export default TopicsExam