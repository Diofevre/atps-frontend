'use client';

import React, { useState } from 'react';
import { Edit, Save, X, Trash2, Plus, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAdmin } from '@/hooks/useAdmin';
import { toast } from 'sonner';

interface QuestionEditProps {
  question: {
    id: number;
    question_text: string;
    option_a: string;
    option_b: string;
    option_c: string;
    option_d: string;
    correct_answer: string;
    explanation?: string;
    image_url?: string;
  };
  onSave: (questionId: number, data: any) => Promise<void>;
  onDelete?: (questionId: number) => Promise<void>;
}

const QuestionEdit: React.FC<QuestionEditProps> = ({ question, onSave, onDelete }) => {
  const { adminModeEnabled } = useAdmin();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editData, setEditData] = useState({
    question_text: question.question_text,
    option_a: question.option_a,
    option_b: question.option_b,
    option_c: question.option_c,
    option_d: question.option_d,
    correct_answer: question.correct_answer,
    explanation: question.explanation || '',
    image_url: question.image_url || '',
  });

  if (!adminModeEnabled) {
    return null; // Don't show edit controls if admin mode is disabled
  }

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await onSave(question.id, editData);
      setIsEditing(false);
      toast.success('Question updated successfully');
    } catch (error) {
      console.error('Error saving question:', error);
      toast.error('Failed to save question');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      question_text: question.question_text,
      option_a: question.option_a,
      option_b: question.option_b,
      option_c: question.option_c,
      option_d: question.option_d,
      correct_answer: question.correct_answer,
      explanation: question.explanation || '',
      image_url: question.image_url || '',
    });
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (!confirm('Are you sure you want to delete this question?')) {
      return;
    }

    try {
      setIsDeleting(true);
      await onDelete(question.id);
      toast.success('Question deleted successfully');
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file to a server
      // For now, we'll just update the URL
      const imageUrl = URL.createObjectURL(file);
      setEditData({ ...editData, image_url: imageUrl });
    }
  };

  return (
    <div className="relative">
      {/* Admin Mode Overlay */}
      <div className="absolute -top-2 -right-2 z-10 flex gap-1">
        {!isEditing ? (
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 w-8 p-0 bg-white shadow-md"
            >
              <Edit className="w-4 h-4" />
            </Button>
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 w-8 p-0 shadow-md"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </>
        ) : (
          <>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700 shadow-md"
            >
              <Save className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0 bg-white shadow-md"
            >
              <X className="w-4 h-4" />
            </Button>
          </>
        )}
      </div>

      {/* Question Content */}
      <div className="space-y-4">
        {/* Question Text */}
        {isEditing ? (
          <Textarea
            value={editData.question_text}
            onChange={(e) => setEditData({ ...editData, question_text: e.target.value })}
            className="min-h-[100px]"
            placeholder="Enter question text..."
          />
        ) : (
          <div className="text-lg font-medium text-gray-900">
            {question.question_text}
          </div>
        )}

        {/* Image */}
        {isEditing ? (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Question Image
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="flex-1"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditData({ ...editData, image_url: '' })}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            {editData.image_url && (
              <img
                src={editData.image_url}
                alt="Question"
                className="max-w-full h-auto rounded-lg border"
              />
            )}
          </div>
        ) : (
          question.image_url && (
            <img
              src={question.image_url}
              alt="Question"
              className="max-w-full h-auto rounded-lg border"
            />
          )
        )}

        {/* Options */}
        <div className="space-y-3">
          {[
            { key: 'option_a', label: 'A' },
            { key: 'option_b', label: 'B' },
            { key: 'option_c', label: 'C' },
            { key: 'option_d', label: 'D' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm font-medium">
                {label}
              </span>
              {isEditing ? (
                <div className="flex-1 flex items-center gap-2">
                  <Input
                    value={editData[key as keyof typeof editData]}
                    onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                    className="flex-1"
                    placeholder={`Option ${label}`}
                  />
                  <Button
                    variant={editData.correct_answer === label ? "default" : "outline"}
                    size="sm"
                    onClick={() => setEditData({ ...editData, correct_answer: label })}
                    className="w-16"
                  >
                    {editData.correct_answer === label ? 'Correct' : 'Set Correct'}
                  </Button>
                </div>
              ) : (
                <div className="flex-1 flex items-center gap-2">
                  <span className={`flex-1 ${question.correct_answer === label ? 'font-semibold text-green-600' : 'text-gray-700'}`}>
                    {question[key as keyof typeof question]}
                  </span>
                  {question.correct_answer === label && (
                    <span className="text-green-600 font-medium">✓</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Explanation */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Explanation
          </label>
          {isEditing ? (
            <Textarea
              value={editData.explanation}
              onChange={(e) => setEditData({ ...editData, explanation: e.target.value })}
              className="min-h-[80px]"
              placeholder="Enter explanation..."
            />
          ) : (
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
              {question.explanation || 'No explanation provided'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionEdit;
