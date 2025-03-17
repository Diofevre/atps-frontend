'use client'

import React, { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

interface DictionaryEntry {
  id: number;
  word: string;
  definition: string;
}

interface DictionaryFormData {
  word: string;
  definition: string;
}

interface DictionaryFormProps {
  onSubmit: (data: DictionaryFormData) => void;
  initialData?: DictionaryEntry;
  onCancel: () => void;
  isLoading?: boolean;
}

const DictionaryForm: React.FC<DictionaryFormProps> = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isLoading = false 
}) => {
  const [formData, setFormData] = useState<DictionaryFormData>({
    word: '',
    definition: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        word: initialData.word || '',
        definition: initialData.definition || ''
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.word.trim() || !formData.definition.trim()) {
      alert('Please fill in all fields');
      return;
    }
    onSubmit(formData);
  };

  const inputClassName = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClassName}>
          Word
          <input
            type="text"
            required
            disabled={isLoading}
            value={formData.word}
            onChange={(e) => setFormData({ ...formData, word: e.target.value })}
            className={inputClassName}
            placeholder="Enter word"
          />
        </label>
      </div>

      <div>
        <label className={labelClassName}>
          Definition
          <textarea
            required
            disabled={isLoading}
            value={formData.definition}
            onChange={(e) => setFormData({ ...formData, definition: e.target.value })}
            className={`${inputClassName} min-h-[150px]`}
            placeholder="Enter definition"
          />
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed min-w-[100px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <span>{initialData ? 'Update Entry' : 'Add Entry'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default DictionaryForm;