'use client'

import React, { useState, useEffect } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import { SubChapter, SubChapterFormData, Chapter } from '@/lib/type';

interface SubChapterFormProps {
  onSubmit: (data: SubChapterFormData) => void;
  initialData?: SubChapter;
  onCancel: () => void;
  isLoading?: boolean;
  chapters: Chapter[];
}

const SubChapterForm: React.FC<SubChapterFormProps> = ({ 
  onSubmit, 
  initialData, 
  onCancel, 
  isLoading = false,
  chapters 
}) => {
  const [formData, setFormData] = useState<SubChapterFormData>({
    sub_chapter_text: '',
    chapter_id: chapters[0]?.id || 0
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        sub_chapter_text: initialData.sub_chapter_text,
        chapter_id: initialData.chapter_id
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const inputClassName = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-[12px] text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";
  const iconClassName = "w-4 h-4 text-gray-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClassName}>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className={iconClassName} />
            <span>SubChapter Text</span>
          </div>
          <input
            type="text"
            required
            disabled={isLoading}
            placeholder="Enter subchapter text"
            value={formData.sub_chapter_text}
            onChange={(e) => setFormData({ ...formData, sub_chapter_text: e.target.value })}
            className={inputClassName}
          />
        </label>
      </div>

      <div>
        <label className={labelClassName}>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen className={iconClassName} />
            <span>Chapter</span>
          </div>
          <select
            required
            disabled={isLoading}
            value={formData.chapter_id}
            onChange={(e) => setFormData({ ...formData, chapter_id: Number(e.target.value) })}
            className={inputClassName}
          >
            {chapters.map((chapter) => (
              <option key={chapter.id} value={chapter.id}>
                {chapter.chapter_text}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-[12px] hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-[12px] hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed min-w-[100px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Loading...</span>
            </>
          ) : (
            <span>{initialData ? 'Update SubChapter' : 'Create SubChapter'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default SubChapterForm;