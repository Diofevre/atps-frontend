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
import { useAuth } from "@/lib/mock-clerk";
import useSWR from "swr";

interface Topic {
  id: number;
  topic_name: string;
}

interface TopicsProps {
  onSelectionChange: (value: string, label: string) => void;
  selectedTopic?: string;
  selectedTopicName?: string;
}

interface TopicsResponse {
  topics: Topic[];
}

const Topics = ({ onSelectionChange, selectedTopic, selectedTopicName }: TopicsProps) => {
  const { getToken } = useAuth();

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

    const data = await response.json();
    return data;
  };

  const { data, error, isLoading } = useSWR<TopicsResponse>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/topics`,
    fetcher
  );


  const options = data?.topics.map((topic: Topic) => ({
    value: topic.id.toString(),
    label: topic.topic_name,
  })) ?? [];

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

export default Topics;