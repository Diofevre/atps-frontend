"use client";

import React, { useEffect, useState } from "react";

interface Topic {
  id: number;
  topic_name: string;
}

interface TopicsResponse {
  topics: Topic[];
}

export default function TestTopics() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        console.log('🔍 TestTopics: Starting fetch...');
        const response = await fetch('http://localhost:8000/api/topics', {
          headers: {
            'Authorization': 'Bearer mock-token-123'
          }
        });
        
        console.log('📡 TestTopics: Response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: TopicsResponse = await response.json();
        console.log('📦 TestTopics: Data received:', data);
        
        setTopics(data.topics);
        setLoading(false);
      } catch (err) {
        console.error('❌ TestTopics: Error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    fetchTopics();
  }, []);

  if (loading) {
    return <div className="p-4">Loading topics...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4">
      <h3 className="text-lg font-semibold mb-2">Topics ({topics.length})</h3>
      <ul className="space-y-1">
        {topics.map((topic) => (
          <li key={topic.id} className="text-sm">
            {topic.id}: {topic.topic_name}
          </li>
        ))}
      </ul>
    </div>
  );
}


