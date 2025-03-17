'use client'

import React, { useState, useEffect } from 'react';
import { Clock, Hash, BookOpen, Loader2 } from 'lucide-react';
import { Topic, TopicFormData } from '@/lib/type';

interface TopicFormProps {
  onSubmit: (data: TopicFormData) => void;
  initialData?: Topic;
  onCancel: () => void;
  isLoading?: boolean;
  topics: Topic[];
  isEditing: boolean;
}

const TopicForm: React.FC<TopicFormProps> = ({
  onSubmit,
  initialData,
  onCancel,
  isLoading = false,
  topics,
  isEditing
}) => {
  // Initialize form data with default values
  const [formData, setFormData] = useState<TopicFormData>({
    topic_name: initialData ? initialData.topic_name : '',
    exam_number_question: initialData ? initialData.exam_number_question : 0,
    exam_duration: initialData ? initialData.exam_duration || '01:30:00' : '01:30:00',
    type: 'exam' 
  });

  // Update form data when initialData changes (for editing)
  useEffect(() => {
    if (initialData) {
      setFormData({
        topic_name: initialData.topic_name,
        exam_number_question: initialData.exam_number_question,
        exam_duration: initialData.exam_duration || '01:30:00',
        type: 'exam'
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTopicName = e.target.value;
    setFormData({ ...formData, topic_name: selectedTopicName });
  };


  const inputClassName = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-[#EECE84] focus:ring-1 focus:ring-[#EECE84] disabled:bg-gray-100 disabled:cursor-not-allowed";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";
  const iconClassName = "w-4 h-4 text-gray-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Topic Selection or Input */}
      <div>
        <label className={labelClassName}>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className={iconClassName} />
            <span>Topic Name</span>
          </div>
          {isEditing ? (
            <input
              type="text"
              required
              disabled={isLoading || isEditing}
              placeholder="Enter topic name"
              value={formData.topic_name}
              onChange={(e) => setFormData({ ...formData, topic_name: e.target.value })}
              className={inputClassName}
            />
          ) : (
            <select
              value={formData.topic_name}
              onChange={handleTopicChange}
              disabled={isLoading}
              className={inputClassName}
              required
            >
              <option value="">Select an existing topic</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.topic_name}>
                  {topic.topic_name}
                </option>
              ))}
            </select>
          )}
        </label>
      </div>

      {/* Number of Questions */}
      <div>
        <label className={labelClassName}>
          <div className="flex items-center gap-2 mb-2">
            <Hash className={iconClassName} />
            <span>Number of Questions</span>
          </div>
          <input
            type="number"
            required
            disabled={isLoading}
            min="0"
            placeholder="Enter number of questions"
            value={formData.exam_number_question}
            onChange={(e) => setFormData({ ...formData, exam_number_question: parseInt(e.target.value) })}
            className={inputClassName}
          />
        </label>
      </div>

      {/* Duration */}
      <div>
        <label className={labelClassName}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className={iconClassName} />
            <span>Duration (HH:MM:SS)</span>
          </div>
          <input
            type="time"
            step="1"
            required
            disabled={isLoading}
            value={formData.exam_duration}
            onChange={(e) => setFormData({ ...formData, exam_duration: e.target.value })}
            className={inputClassName}
          />
        </label>
      </div>

      {/* Buttons */}
      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-[20px] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EECE84] transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-black bg-[#EECE84] border border-transparent rounded-[20px] hover:bg-[#e6c26e] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#EECE84] transition-colors disabled:bg-[#f5e0b3] disabled:cursor-not-allowed min-w-[100px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <span>{isEditing ? 'Update Topic' : 'Create Topic'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default TopicForm;