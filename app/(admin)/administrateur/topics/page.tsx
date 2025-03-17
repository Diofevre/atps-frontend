'use client'

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pencil, Plus, Clock, Hash } from 'lucide-react';
import { toast } from 'sonner';
import TopicForm from './_components/form';
import { Topic, TopicFormData } from '@/lib/type';

const Topics = () => {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTopic, setEditingTopic] = useState<Topic | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection] = useState<'exam'>('exam');

  const fetchTopics = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching topics from:', `${process.env.NEXT_PUBLIC_API_URL}/api/topics`);
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/topics`);
      console.log('Response data:', response.data);

      const topicsData = response.data.topics || response.data || [];
      setTopics(topicsData);

      if (topicsData.length === 0) {
        console.log('No topics found');
      }
    } catch (error) {
      console.error('Error fetching topics:', error);
      toast.error('Failed to fetch topics. Please check the console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  const handleCreateTopic = async (data: TopicFormData) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/topics`, {
        ...data,
        type: activeSection
      });
      console.log('Topic created:', response.data);
      toast.success('Topic created successfully');
      await fetchTopics();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating topic:', error);
      toast.error('Failed to create topic');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTopic = async (data: TopicFormData) => {
    if (!editingTopic) return;
    setIsLoading(true);
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/topics/${editingTopic.id}`, {
        ...data,
        type: activeSection
      });
      console.log('Topic updated:', response.data);
      toast.success('Topic updated successfully');
      await fetchTopics();
      setEditingTopic(undefined);
    } catch (error) {
      console.error('Error updating topic:', error);
      toast.error('Failed to update topic');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-black uppercase">Topics Exam Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#EECE84] text-black rounded-[20px] hover:bg-[#e6c26e] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Manage Topics
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          {isLoading ? (
            <div className="p-8 text-center text-gray-500">Loading topics...</div>
          ) : topics.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No topics found. Create your first topic!</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Topic Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Questions
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topics.map((topic) => (
                    <tr key={topic.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-black">{topic.topic_name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Hash className="w-4 h-4 mr-1 text-gray-400" />
                          {topic.exam_number_question}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1 text-gray-400" />
                          {topic.exam_duration || 'Not set'}
                        </div>
                      </td>
                      <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium`}>
                        <button
                          onClick={() => setEditingTopic(topic)}
                          className="text-[#EECE84] hover:text-[#e6c26e] transition-colors"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {(isModalOpen || editingTopic) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-black mb-6">
                {editingTopic ? 'Edit Topic' : `Manage Topics`}
              </h2>
              <TopicForm
                onSubmit={editingTopic ? handleUpdateTopic : handleCreateTopic}
                initialData={editingTopic}
                onCancel={() => {
                  setIsModalOpen(false);
                  setEditingTopic(undefined);
                }}
                isLoading={isLoading}
                topics={topics} // Pass the topics to the form
                isEditing={!!editingTopic} // Indicate if it's in editing mode
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Topics;