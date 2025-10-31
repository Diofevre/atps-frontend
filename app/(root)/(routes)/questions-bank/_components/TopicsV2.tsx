"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useKeycloakAuth } from "@/hooks/useKeycloakAuth";
import useSWR from "swr";

interface TopicV2 {
  id: string;
  name: string;
  subject_code: string;
  question_count: number;
}

interface TopicsV2Props {
  onSelectionChange: (value: string, label: string) => void;
  selectedTopic?: string;
  selectedTopicName?: string;
}

interface TopicsV2Response {
  topics: TopicV2[];
}

const TopicsV2 = ({ onSelectionChange, selectedTopic, selectedTopicName }: TopicsV2Props) => {
  const { getToken } = useKeycloakAuth();

  const fetcher = async (url: string) => {
    const token = await getToken();
    if (!token) throw new Error("Authentication token not available");
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch topics: ${response.statusText}`);
    }

    return response.json();
  };

  // Récupérer les sujets disponibles depuis la nouvelle structure
  const { data, error, isLoading } = useSWR<TopicsV2Response>(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions-v2/subjects`,
    fetcher
  );

  // Fallback vers les sujets connus si l'API n'est pas encore disponible
  const fallbackTopics = [
    { id: "033", name: "033 - Flight Planning and Monitoring", subject_code: "033", question_count: 0 },
    { id: "010", name: "010 - Air Law", subject_code: "010", question_count: 0 },
    { id: "040", name: "040 - Human Performance", subject_code: "040", question_count: 0 },
    { id: "050", name: "050 - Meteorology", subject_code: "050", question_count: 0 },
    { id: "061", name: "061 - General Navigation", subject_code: "061", question_count: 0 },
    { id: "062", name: "062 - Radio Navigation", subject_code: "062", question_count: 0 },
    { id: "070", name: "070 - Operational Procedures", subject_code: "070", question_count: 0 },
    { id: "081", name: "081 - Principles of Flight", subject_code: "081", question_count: 0 },
    { id: "091", name: "091 - Communications", subject_code: "091", question_count: 0 }
  ];

  const options = (data?.topics || fallbackTopics).map((topic: TopicV2) => ({
    value: topic.subject_code,
    label: `${topic.subject_code} - ${topic.name}${topic.question_count > 0 ? ` (${topic.question_count} questions)` : ''}`,
  }));

  const handleSelection = (value: string): void => {
    const selectedOption = options.find(opt => opt.value === value);
    if (selectedOption) {
      onSelectionChange(value, selectedOption.label);
    }
  };

  return (
    <Select onValueChange={handleSelection} value={selectedTopic}>
      <SelectTrigger className="w-[400px] border rounded-[12px] py-6 bg-[#FFFFFF] p-6 dark:bg-transparent">
        <SelectValue placeholder={isLoading ? "Loading ..." : "Select a syllabus"}>
          {selectedTopicName || (isLoading ? "Loading ..." : "Select a syllabus")}
        </SelectValue>
      </SelectTrigger>
      <SelectContent className="border rounded-[10px] bg-[#FFFFFF] dark:bg-[#020526]">
        <SelectGroup className="mt-2 mb-2 ml-2 mr-2">
          {isLoading ? (
            <div className="p-4">Loading...</div>
          ) : error ? (
            <div className="p-4 text-red-500">{error.message}</div>
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
  );
};

export default TopicsV2;


