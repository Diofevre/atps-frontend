"use client";

import React, { useEffect, useState } from "react";

interface Topic {
  id: number;
  topic_name: string;
}

interface TopicsResponse {
  topics: Topic[];
}

interface Chapter {
  id: string;
  chapter_text: string;
  chapterQuestionCount: number;
  subChapters: SubChapter[];
}

interface SubChapter {
  id: string;
  sub_chapter_text: string;
  questionCount: number;
}

export default function TestTopicSelection() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [selectedTopicId, setSelectedTopicId] = useState<string>('');
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load topics on component mount
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        console.log('🔍 TestTopicSelection: Loading topics...');
        const response = await fetch('http://localhost:8000/api/topics', {
          headers: {
            'Authorization': 'Bearer mock-token-123'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data: TopicsResponse = await response.json();
        console.log('📦 TestTopicSelection: Topics loaded:', data);
        
        setTopics(data.topics);
      } catch (err) {
        console.error('❌ TestTopicSelection: Error loading topics:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    fetchTopics();
  }, []);

  // Load chapters when topic is selected
  useEffect(() => {
    if (!selectedTopicId) {
      setChapters([]);
      return;
    }

    const fetchChapters = async () => {
      setLoading(true);
      setError(null);
      
      try {
        console.log('🔍 TestTopicSelection: Loading chapters for topic:', selectedTopicId);
        
        const response = await fetch(`http://localhost:8000/api/topics/${selectedTopicId}/chapters`, {
          headers: {
            'Authorization': 'Bearer mock-token-123'
          }
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 TestTopicSelection: Chapters loaded:', data);
        
        // Handle different response formats
        if (Array.isArray(data)) {
          setChapters(data);
        } else if (data.chapters && Array.isArray(data.chapters)) {
          setChapters(data.chapters);
        } else {
          console.error('Unexpected data format:', data);
          setChapters([]);
        }
      } catch (err) {
        console.error('❌ TestTopicSelection: Error loading chapters:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChapters();
  }, [selectedTopicId]);

  return (
    <div className="p-4 space-y-4">
      <h3 className="text-lg font-semibold">Test Topic Selection</h3>
      
      {/* Topic Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">Select a Topic:</label>
        <select
          value={selectedTopicId}
          onChange={(e) => setSelectedTopicId(e.target.value)}
          className="w-full p-2 border rounded-md"
        >
          <option value="">Choose a topic...</option>
          {topics.map((topic) => (
            <option key={topic.id} value={topic.id.toString()}>
              {topic.id}: {topic.topic_name}
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          Loading chapters...
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          Error: {error}
        </div>
      )}

      {/* Chapters Display */}
      {selectedTopicId && !loading && !error && (
        <div>
          <h4 className="text-md font-semibold mb-2">
            Chapters ({chapters.length}):
          </h4>
          {chapters.length === 0 ? (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              No chapters found for this topic.
            </div>
          ) : (
            <div className="space-y-2">
              {chapters.map((chapter) => (
                <div key={chapter.id} className="p-3 bg-gray-50 border rounded-md">
                  <div className="font-medium">
                    {chapter.id}: {chapter.chapter_text}
                  </div>
                  <div className="text-sm text-gray-600">
                    Questions: {chapter.chapterQuestionCount}
                  </div>
                  {chapter.subChapters && chapter.subChapters.length > 0 && (
                    <div className="mt-2">
                      <div className="text-sm font-medium mb-1">Sub-chapters:</div>
                      <div className="space-y-1 ml-4">
                        {chapter.subChapters.map((subChapter) => (
                          <div key={subChapter.id} className="text-sm">
                            • {(subChapter as any).sub_chapter_text || (subChapter as any).name || 'Untitled'} ({subChapter.questionCount} questions)
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


