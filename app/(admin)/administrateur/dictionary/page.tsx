'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2, Book } from 'lucide-react';
import axios from 'axios';
import DictionaryForm from './_components/form';

interface DictionaryEntry {
  id: number;
  word: string;
  definition: string;
}

interface DictionaryFormData {
  word: string;
  definition: string;
}

function App() {
  const [entries, setEntries] = useState<DictionaryEntry[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DictionaryEntry | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const fetchEntries = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/dictionary`);
      setEntries(response.data);
    } catch (error) {
      console.error('Failed to fetch dictionary entries:', error);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleCreateEntry = async (formData: DictionaryFormData) => {
    setIsLoading(true);
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/dictionary`, formData);
      await fetchEntries();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create dictionary entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateEntry = async (formData: DictionaryFormData) => {
    if (!editingEntry) return;
    setIsLoading(true);
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/dictionary/${editingEntry.id}`, formData);
      await fetchEntries();
      setEditingEntry(null);
    } catch (error) {
      console.error('Failed to update dictionary entry:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteEntry = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;
    setIsDeleting(id);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/dictionary/${id}`);
      await fetchEntries();
    } catch (error) {
      console.error('Failed to delete dictionary entry:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Book className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Dictionary Management</h1>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Entry
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-1/4">
                    Word
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Definition
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider w-24">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {entries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{entry.word}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 line-clamp-2">{entry.definition}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingEntry(entry)}
                        className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                        disabled={isDeleting === entry.id}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        disabled={isDeleting === entry.id}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        {isDeleting === entry.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal with backdrop blur */}
      {(isModalOpen || editingEntry) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-2xl w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingEntry ? 'Edit Dictionary Entry' : 'Add New Dictionary Entry'}
              </h2>
              <DictionaryForm
                onSubmit={editingEntry ? handleUpdateEntry : handleCreateEntry}
                initialData={editingEntry || undefined}
                onCancel={() => {
                  setIsModalOpen(false);
                  setEditingEntry(null);
                }}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;