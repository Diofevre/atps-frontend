/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import axios from 'axios';
import ArticleForm from './_components/form';

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

function App() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  const fetchArticles = async () => {
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);
      setArticles(response.data);

      console.log(response.data);
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleCreateArticle = async (formData: ArticleFormData) => {
    setIsLoading(true);
    try {
      // Transform the data to match the expected API format
      const apiData = {
        title: formData.title,
        title_image: formData.title_image,
        title_text: formData.title_text,
        sections: formData.articles_sections.map(section => ({
          heading: section.heading,
          section_image: section.section_image,
          section_text: section.section_text
        }))
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, apiData);
      await fetchArticles();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateArticle = async (formData: ArticleFormData) => {
    if (!editingArticle) return;
    setIsLoading(true);
    try {
      // Transform the data to match the expected API format
      const apiData = {
        title: formData.title,
        title_image: formData.title_image,
        title_text: formData.title_text,
        sections: formData.articles_sections.map(section => ({
          heading: section.heading,
          section_image: section.section_image,
          section_text: section.section_text
        }))
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${editingArticle.id}`, apiData);
      await fetchArticles();
      setEditingArticle(null);
    } catch (error) {
      console.error('Failed to update article:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (id: number) => {
    if (!confirm('Are you sure you want to delete this article?')) return;
    setIsDeleting(id);
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`);
      await fetchArticles();
    } catch (error) {
      console.error('Failed to delete article:', error);
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Articles Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add Article
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Sections
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Last Updated
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={article.title_image}
                          alt={article.title}
                          className="h-10 w-10 rounded-md object-cover mr-3"
                        />
                        <div className="text-sm font-medium text-gray-900">{article.title}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {article.articles_sections.length} sections
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(article.updated_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setEditingArticle(article)}
                        className="text-blue-600 hover:text-blue-900 mr-4 transition-colors"
                        disabled={isDeleting === article.id}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article.id)}
                        disabled={isDeleting === article.id}
                        className="text-red-600 hover:text-red-900 transition-colors"
                      >
                        {isDeleting === article.id ? (
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
      {(isModalOpen || editingArticle) && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-xl shadow-2xl p-8 max-w-4xl w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingArticle ? 'Edit Article' : 'Create New Article'}
              </h2>
              <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                <ArticleForm
                  onSubmit={editingArticle ? handleUpdateArticle : handleCreateArticle}
                  initialData={editingArticle || undefined}
                  onCancel={() => {
                    setIsModalOpen(false);
                    setEditingArticle(null);
                  }}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;