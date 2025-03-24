'use client'

import React, { useState } from "react"
import { Airplay as Airplane, BookOpen, CheckCircle, Clock, CloudSun, Compass, FileText, Loader2, PlayCircle, Radio, Shield } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import TopicsExam from "./_components/ExamTopics"
import ExamInfo from "./_components/ExamInfo"

interface TopicInfo {
  id: string
  topic_name: string
  exam_number_question: number
  exam_duration: string
}

export default function ExamPage() {
  const router = useRouter()
  const [selectedTopic, setSelectedTopic] = useState<TopicInfo | null>(null)
  const [startExamLoading, setStartExamLoading] = useState(false)

  const handleTopicSelection = (topicInfo: TopicInfo) => {
    setSelectedTopic(topicInfo)
  }

  const handleStartExam = () => {    
    if (!selectedTopic) return
    setStartExamLoading(true)
    
    // Pass the duration as a URL parameter
    router.push(`/questions-bank/exam/quizz_exam?id=${selectedTopic.id}&duration=${selectedTopic.exam_duration}`)
  }

  const aviationFacts = [
    {
      fact: "Air traffic controllers handle over 43,000 flights daily in the US alone.",
      source: "FAA"
    },
    {
      fact: "The world's busiest airport, Hartsfield-Jackson Atlanta, handles over 100 million passengers annually.",
      source: "ACI"
    },
    {
      fact: "Modern commercial aircraft typically cruise at altitudes between 31,000 and 38,000 feet.",
      source: "Boeing"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Banner */}
      <div className="relative bg-gradient-to-b from-background via-background to-secondary/10">
        <div className="container mx-auto px-4 py-12 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center justify-center p-1.5 bg-primary/10 rounded-full mb-6"
            >
              <div className="p-2.5 bg-[#EECE84] rounded-full">
                <Airplane className="w-7 h-7 text-black/80" />
              </div>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold tracking-tight mb-4"
            >
              ATPS Aviation Assessment
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8"
            >
              Test your aviation knowledge and skills with our comprehensive assessment modules designed for aviation professionals
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-6 mb-4"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#EECE84]" />
                <span className="text-sm font-medium">Industry Standard</span>
              </div>
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-[#EECE84]" />
                <span className="text-sm font-medium">ATC Protocols</span>
              </div>
              <div className="flex items-center gap-2">
                <CloudSun className="w-5 h-5 text-[#EECE84]" />
                <span className="text-sm font-medium">Weather Systems</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-12 gap-8">
            {/* Left Column - Topic Selection & Benefits */}
            <div className="md:col-span-5 space-y-6">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-card rounded-xl border-none shadow-md border p-6"
              >
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-[#EECE84]" />
                  Select Your Assessment Module
                </h2>
                <p className="text-muted-foreground mb-4">
                  Choose from our curated selection of aviation topics designed to test your knowledge
                </p>
                <TopicsExam onSelectionChange={handleTopicSelection} />
              </motion.div>

              {/* Benefits Section */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="bg-card rounded-xl border-none shadow-md p-6"
              >
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <Compass className="w-5 h-5 mr-2 text-[#EECE84]" />
                  Assessment Benefits
                </h3>
                <ul className="space-y-3.5">
                  {[
                    "Comprehensive coverage of essential aviation topics",
                    "Scenario-based questions that simulate real-world situations",
                    "Immediate feedback on your performance and knowledge gaps",
                    "Structured approach to reinforce critical aviation concepts",
                    "Preparation for operational challenges in aviation environments"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-[#EECE84] mr-2.5 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              {/* Aviation Facts */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-card rounded-xl border-none shadow-md border p-6"
              >
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#EECE84]" />
                  Aviation Facts
                </h3>
                <div className="space-y-4">
                  {aviationFacts.map((item, index) => (
                    <div key={index} className="p-3 bg-primary/5 rounded-lg">
                      <p className="text-sm mb-2">{item.fact}</p>
                      <div className="text-xs text-muted-foreground">
                        Source: <span className="font-medium">{item.source}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Right Column - Exam Info & Start Button */}
            <div className="md:col-span-7">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-card rounded-xl shadow-md border-none p-6 h-full"
              >
                {selectedTopic ? (
                  <div className="flex flex-col h-full">
                    <div className="mb-6">
                      <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#EECE84]/20 text-sm font-medium mb-3">
                        <FileText className="w-4 h-4 mr-1.5" />
                        Aviation Assessment
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{selectedTopic.topic_name}</h2>
                      <p className="text-muted-foreground">
                        You&apos;re about to begin your aviation assessment. Review the details below and prepare to demonstrate your knowledge.
                      </p>
                    </div>

                    <div className="bg-primary/5 rounded-lg p-6 mb-8">
                      <h3 className="text-lg font-medium mb-4 flex items-center">
                        <FileText className="w-5 h-5 mr-2 text-[#EECE84]" />
                        Assessment Details
                      </h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-[#EECE84]/20 flex items-center justify-center mr-3 flex-shrink-0">
                            <FileText className="w-5 h-5 text-[#EECE84]" />
                          </div>
                          <div>
                            <p className="font-medium">Questions</p>
                            <p className="text-muted-foreground">{selectedTopic.exam_number_question} questions to complete</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-full bg-[#EECE84]/20 flex items-center justify-center mr-3 flex-shrink-0">
                            <Clock className="w-5 h-5 text-[#EECE84]" />
                          </div>
                          <div>
                            <p className="font-medium">Duration</p>
                            <p className="text-muted-foreground">{selectedTopic.exam_duration} to finish</p>
                          </div>
                        </div>
                      </div>
                      
                      <ExamInfo
                        examNumberQuestion={selectedTopic.exam_number_question}
                        examDuration={selectedTopic.exam_duration}
                      />
                    </div>

                    <div className="bg-primary/5 rounded-lg p-6 mb-8">
                      <h3 className="text-lg font-medium mb-4">Assessment Guidelines</h3>
                      <ul className="space-y-2.5">
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-[#EECE84] mr-2.5 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Ensure you have a stable internet connection</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-[#EECE84] mr-2.5 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Allocate sufficient uninterrupted time</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-[#EECE84] mr-2.5 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">Review all questions carefully before submitting</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle className="w-5 h-5 text-[#EECE84] mr-2.5 flex-shrink-0 mt-0.5" />
                          <span className="text-muted-foreground">A score of 70% is recommended for proficiency</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="flex">
                      <motion.button
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleStartExam}
                        disabled={startExamLoading}
                        className="bg-[#EECE84] text-black text-sm font-medium rounded-[12px] hover:bg-[#EECE84]/80 px-6 py-3 gap-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md"
                      >
                        {startExamLoading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <PlayCircle className="w-5 h-5" />
                            <span>Start Exam</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                    <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-4">
                      <Airplane className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Select an Assessment Module</h3>
                    <p className="text-muted-foreground max-w-md">
                      Choose an aviation topic from the left panel to view assessment details and begin your evaluation
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}