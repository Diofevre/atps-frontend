import React, { useEffect, useState } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useAuth } from "@clerk/nextjs"

interface Topic {
  id: string
  topic_name: string
}

interface TopicsProps {
  onSelectionChange: (value: string, label: string) => void;
  selectedTopic?: string;
  selectedTopicName?: string;
}

const Topics = ({ onSelectionChange, selectedTopic, selectedTopicName }: TopicsProps) => {
  const { getToken } = useAuth();
  const [options, setOptions] = useState<{ value: string; label: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTopics = async () => {
      const token = await getToken();

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/topics`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        if (!response.ok) {
          throw new Error(`Failed to fetch topics: ${response.statusText}`)
        }
        const data = await response.json()
        if (data.topics && Array.isArray(data.topics)) {
          const formattedTopics = data.topics.map((topic: Topic) => ({
            value: topic.id,
            label: topic.topic_name,
          }))
          setOptions(formattedTopics)
          setError(null)
        } else {
          throw new Error("Unexpected API response format")
        }
      } catch (error) {
        console.error("Error fetching topics:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopics()
  }, [getToken])

  const handleSelection = (value: string) => {
    const selectedOption = options.find(opt => opt.value === value);
    if (selectedOption) {
      onSelectionChange(value, selectedOption.label);
    }
  }

  return (
    <Select onValueChange={handleSelection} value={selectedTopic}>
      <SelectTrigger className="w-[400px] border rounded-[12px] py-6 bg-[#FFFFFF] p-6 dark:bg-transparent">
        <SelectValue placeholder={loading ? "Loading ..." : "Select a syllabus"}>
          {selectedTopicName || (loading ? "Loading ..." : "Select a syllabus")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="border rounded-[10px] bg-[#FFFFFF] dark:bg-[#020526]">
        <SelectGroup className="mt-2 mb-2 ml-2 mr-2">
          {loading ? (
            <div className="p-4">Loading...</div>
          ) : error ? (
            <div className="p-4 text-red-500">{error}</div>
          ) : options.length > 0 ? (
            options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          ) : (
            <div className="p-4">No topics available</div>
          )}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export default Topics