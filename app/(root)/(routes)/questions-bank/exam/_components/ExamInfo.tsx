"use client"

import React from "react"
import { Clock, ListChecks } from "lucide-react"

interface ExamInfoProps {
  examNumberQuestion: number
  examDuration: string
}

const ExamInfo = ({ examNumberQuestion, examDuration }: ExamInfoProps) => {
  const formatDuration = (duration: string) => {
    const [hours, minutes] = duration.split(':')
    return `${parseInt(hours)}h ${parseInt(minutes)}min`
  }

  return (
    <div className="mt-8 grid grid-cols-2 gap-4">
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-[#EECE84] rounded-lg">
            <ListChecks className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-400">Questions</p>
        </div>
        <p className="text-2xl font-medium text-gray-900 dark:text-white">{examNumberQuestion}</p>
      </div>
      <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
        <div className="flex items-center space-x-3 mb-2">
          <div className="p-2 bg-[#EECE84] rounded-lg">
            <Clock className="w-4 h-4 text-primary" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-400">Duration</p>
        </div>
        <p className="text-2xl font-medium text-gray-900 dark:text-white">{formatDuration(examDuration)}</p>
      </div>
    </div>
  )
}

export default ExamInfo;