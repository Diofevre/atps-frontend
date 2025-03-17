/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image, AlignLeft, Loader2 } from 'lucide-react';

interface ArticleSection {
  id: number;
  article_id: number;
  heading: string;
  section_image: string;
  section_text: string;
}

interface Article {
  id: number;
  title: string;
  title_image: string;
  title_text: string;
  created_at: string;
  updated_at: string;
  articles_sections: ArticleSection[];
}

interface ArticleFormData {
  title: string;
  title_image: string;
  title_text: string;
  articles_sections: Omit<ArticleSection, 'id' | 'article_id'>[];
}

interface ArticleFormProps {
  onSubmit: (data: ArticleFormData) => void;
  initialData?: Article;
  onCancel: () => void;
  isLoading?: boolean;
}

const ArticleForm: React.FC<ArticleFormProps> = ({ onSubmit, initialData, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<ArticleFormData>({
    title: '',
    title_image: '',
    title_text: '',
    articles_sections: [{ heading: '', section_image: '', section_text: '' }]
  });

  useEffect(() => {
    if (initialData) {
      // Properly map the initial data to the form structure
      setFormData({
        title: initialData.title || '',
        title_image: initialData.title_image || '',
        title_text: initialData.title_text || '',
        articles_sections: initialData.articles_sections.length > 0 
          ? initialData.articles_sections.map(section => ({
              heading: section.heading || '',
              section_image: section.section_image || '',
              section_text: section.section_text || ''
            }))
          : [{ heading: '', section_image: '', section_text: '' }]
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ensure all required fields are filled
    const isValid = formData.title && 
      formData.title_image && 
      formData.title_text && 
      formData.articles_sections.every(section => 
        section.heading && 
        section.section_image && 
        section.section_text
      );

    if (!isValid) {
      alert('Please fill in all required fields');
      return;
    }

    // Submit the form data
    onSubmit({
      title: formData.title,
      title_image: formData.title_image,
      title_text: formData.title_text,
      articles_sections: formData.articles_sections.map(section => ({
        heading: section.heading,
        section_image: section.section_image,
        section_text: section.section_text
      }))
    });
  };

  const addSection = () => {
    setFormData(prev => ({
      ...prev,
      articles_sections: [...prev.articles_sections, { heading: '', section_image: '', section_text: '' }]
    }));
  };

  const removeSection = (index: number) => {
    if (formData.articles_sections.length > 1) {
      setFormData(prev => ({
        ...prev,
        articles_sections: prev.articles_sections.filter((_, i) => i !== index)
      }));
    }
  };

  const updateSection = (index: number, field: keyof Omit<ArticleSection, 'id' | 'article_id'>, value: string) => {
    setFormData(prev => ({
      ...prev,
      articles_sections: prev.articles_sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  const inputClassName = "mt-1 block w-full px-3 py-2 bg-white border border-slate-300 rounded-md text-sm shadow-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed";
  const labelClassName = "block text-sm font-medium text-gray-700 mb-1";
  const iconClassName = "w-4 h-4 text-gray-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={labelClassName}>
          <div className="flex items-center gap-2 mb-2">
            <AlignLeft className={iconClassName} />
            <span>Title</span>
          </div>
          <input
            type="text"
            required
            disabled={isLoading}
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={inputClassName}
            placeholder="Enter article title"
          />
        </label>
      </div>

      <div>
        <label className={labelClassName}>
          <div className="flex items-center gap-2 mb-2">
            <Image className={iconClassName} />
            <span>Title Image URL</span>
          </div>
          <input
            type="url"
            required
            disabled={isLoading}
            value={formData.title_image}
            onChange={(e) => setFormData({ ...formData, title_image: e.target.value })}
            className={inputClassName}
            placeholder="Enter image URL"
          />
          {formData.title_image && (
            <img 
              src={formData.title_image} 
              alt="Title preview" 
              className="mt-2 h-32 w-full object-cover rounded-md"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.style.display = 'none';
              }}
            />
          )}
        </label>
      </div>

      <div>
        <label className={labelClassName}>
          <div className="flex items-center gap-2 mb-2">
            <AlignLeft className={iconClassName} />
            <span>Title Text</span>
          </div>
          <textarea
            required
            disabled={isLoading}
            value={formData.title_text}
            onChange={(e) => setFormData({ ...formData, title_text: e.target.value })}
            className={`${inputClassName} min-h-[100px]`}
            placeholder="Enter article description"
          />
        </label>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Sections</h3>
          <button
            type="button"
            onClick={addSection}
            disabled={isLoading}
            className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Section
          </button>
        </div>

        {formData.articles_sections.map((section, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium">Section {index + 1}</h4>
              {formData.articles_sections.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSection(index)}
                  disabled={isLoading}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div>
              <label className={labelClassName}>
                <span>Heading</span>
                <input
                  type="text"
                  required
                  disabled={isLoading}
                  value={section.heading}
                  onChange={(e) => updateSection(index, 'heading', e.target.value)}
                  className={inputClassName}
                  placeholder="Enter section heading"
                />
              </label>
            </div>

            <div>
              <label className={labelClassName}>
                <span>Section Image URL</span>
                <input
                  type="url"
                  required
                  disabled={isLoading}
                  value={section.section_image}
                  onChange={(e) => updateSection(index, 'section_image', e.target.value)}
                  className={inputClassName}
                  placeholder="Enter section image URL"
                />
                {section.section_image && (
                  <img 
                    src={section.section_image} 
                    alt={`Section ${index + 1} preview`} 
                    className="mt-2 h-32 w-full object-cover rounded-md"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = 'none';
                    }}
                  />
                )}
              </label>
            </div>

            <div>
              <label className={labelClassName}>
                <span>Section Text</span>
                <textarea
                  required
                  disabled={isLoading}
                  value={section.section_text}
                  onChange={(e) => updateSection(index, 'section_text', e.target.value)}
                  className={`${inputClassName} min-h-[100px]`}
                  placeholder="Enter section content"
                />
              </label>
            </div>
          </div>
        ))}
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
            <span>{initialData ? 'Update Article' : 'Create Article'}</span>
          )}
        </button>
      </div>
    </form>
  );
};

export default ArticleForm;