/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect } from 'react';
import { Plus, X, Trash2, Upload } from 'lucide-react';

interface SubChapter {
  id: number;
  sub_chapter_text: string;
}

interface Option {
  id: string;
  text: string;
}

interface NewQuestion {
  question_text: string;
  answer: string;
  options: Option[];
  explanation: string;
  countries: string[];
  explanation_images: string[];
  question_images: string[];
  quality_score: number;
  sub_chapter_id: number;
}

interface QuestionsFormProps {
  isOpen: boolean;
  onClose: () => void;
  searchFiltersKeyword: string;
  handleSearch: (e: React.FormEvent) => Promise<void>;
  editingQuestion: Question | null;
  onAddQuestion: (e: React.FormEvent) => Promise<void>;
  onModifyQuestion: (e: React.FormEvent) => Promise<void>;
}

interface Question {
  id: number;
  question_text: string;
  answer: string;
  options: Record<string, string>;
  explanation: string;
  countries: Record<string, Record<string, string[]>>;
  quality_score: string;
  question_images?: string[];
  explanation_images?: string[];
}

interface QuestionFormState {
  subChapters: SubChapter[];
  newQuestion: NewQuestion;
}

const QuestionsForm: React.FC<QuestionsFormProps> = ({ isOpen, onClose, searchFiltersKeyword, handleSearch, editingQuestion }) => {
  const [state, setState] = useState<QuestionFormState>({
    subChapters: [],
    newQuestion: {
      question_text: '',
      answer: '',
      options: [
        { id: '1', text: '' },
        { id: '2', text: '' }
      ],
      explanation: '',
      countries: [],
      explanation_images: [],
      question_images: [],
      quality_score: 3,
      sub_chapter_id: 0
    }
  });

  useEffect(() => {
    fetchSubChapters();
  }, []);

  useEffect(() => {
    if (editingQuestion) {
      // Initialize the form with the data of the question being edited
      setState(prevState => ({
        ...prevState,
        newQuestion: {
          question_text: editingQuestion.question_text,
          answer: editingQuestion.answer,
          options: Object.entries(editingQuestion.options).map(([id, text]) => ({ id, text })),
          explanation: editingQuestion.explanation,
          countries: Object.keys(editingQuestion.countries), // Assuming you only need the country names
          explanation_images: editingQuestion.explanation_images || [],
          question_images: editingQuestion.question_images || [],
          quality_score: parseInt(editingQuestion.quality_score), // Convert string to number
          sub_chapter_id: 0, // You might need to fetch this from the backend
        }
      }));
    } else {
      // Reset the form when adding a new question
      setState(prevState => ({
        ...prevState,
        newQuestion: {
          question_text: '',
          answer: '',
          options: [
            { id: '1', text: '' },
            { id: '2', text: '' }
          ],
          explanation: '',
          countries: [],
          explanation_images: [],
          question_images: [],
          quality_score: 3,
          sub_chapter_id: 0
        }
      }));
    }
  }, [editingQuestion]);

  const fetchSubChapters = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subchapters`);
      const data = await response.json();
      setState(prevState => ({ ...prevState, subChapters: data.data }));
    } catch (error) {
      console.error('Error fetching subchapters:', error);
    }
  };

  const handleAddOption = () => {
    setState(prevState => ({
      ...prevState,
      newQuestion: {
        ...prevState.newQuestion,
        options: [...prevState.newQuestion.options, { id: String(prevState.newQuestion.options.length + 1), text: '' }]
      }
    }));
  };

  const handleRemoveOption = (idToRemove: string) => {
    if (state.newQuestion.options.length <= 2) {
      return;
    }
    setState(prevState => ({
      ...prevState,
      newQuestion: {
        ...prevState.newQuestion,
        options: prevState.newQuestion.options.filter(option => option.id !== idToRemove),
        answer: prevState.newQuestion.answer === idToRemove ? '' : prevState.newQuestion.answer
      }
    }));
  };

  const handleOptionChange = (id: string, text: string) => {
    setState(prevState => ({
      ...prevState,
      newQuestion: {
        ...prevState.newQuestion,
        options: prevState.newQuestion.options.map(option =>
          option.id === id ? { ...option, text } : option
        )
      }
    }));
  };


  const uploadImageToS3 = async (file: File): Promise<string | null> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch('/api/s3-upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        console.error('Failed to upload image to S3:', response.statusText);
        return null;
      }

      const data = await response.json();
      if (data.success) {
        return data.fileName;
      } else {
        console.error('S3 upload failed:', data.error);
        return null;
      }
    } catch (error) {
      console.error('Error uploading image to S3:', error);
      return null;
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'question' | 'explanation') => {
    const files = e.target.files;
    if (!files) return;

    const uploadedImageUrls: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = await uploadImageToS3(file);

      if (fileName) {
        // Construct the image URL using the filename and the S3 bucket URL
        const imageUrl = `https://${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/question/${fileName}`;
        uploadedImageUrls.push(imageUrl);
      }
    }

    console.log(uploadedImageUrls);

    setState(prevState => ({
      ...prevState,
      newQuestion: {
        ...prevState.newQuestion,
        [type === 'question' ? 'question_images' : 'explanation_images']: [
          ...prevState.newQuestion[type === 'question' ? 'question_images' : 'explanation_images'],
          ...uploadedImageUrls
        ]
      }
    }));
  };

  const removeImage = (index: number, type: 'question' | 'explanation') => {
    setState(prevState => ({
      ...prevState,
      newQuestion: {
        ...prevState.newQuestion,
        [type === 'question' ? 'question_images' : 'explanation_images']:
          prevState.newQuestion[type === 'question' ? 'question_images' : 'explanation_images'].filter((_, i) => i !== index)
      }
    }));
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const optionsObject = state.newQuestion.options.reduce((acc, curr) => {
        acc[curr.id] = curr.text;
        return acc;
      }, {} as Record<string, string>);

      const questionData = {
        ...state.newQuestion,
        options: optionsObject
      };

      let method = 'POST'; // Default to POST for adding a new question
      let url = `${process.env.NEXT_PUBLIC_API_URL}/api/questions`;

      if (editingQuestion) {
        method = 'PUT'; // Use PUT for updating an existing question
        url = `${process.env.NEXT_PUBLIC_API_URL}/api/questions/${editingQuestion.id}`; // Adjust the URL for update

      }

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(questionData),
      });

      if (!response.ok) {
        throw new Error('Failed to create question');
      }

      onClose();

      setState(prevState => ({
        ...prevState,
        newQuestion: {
          question_text: '',
          answer: '',
          options: [
            { id: '1', text: '' },
            { id: '2', text: '' }
          ],
          explanation: '',
          countries: [],
          explanation_images: [],
          question_images: [],
          quality_score: 3,
          sub_chapter_id: 0
        }
      }));

      if (searchFiltersKeyword) {
        handleSearch(e);
      }
    } catch (error) {
      console.error('Error creating question:', error);
      // setError('Failed to create question. Please try again.'); // Communicate error via props/context instead.
    }
  };

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 ${isOpen ? 'flex' : 'hidden'} items-center justify-center`}>
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{editingQuestion ? "Edit Question" : "Add New Question"}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleAddQuestion} className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sub Chapter</label>
              <select
                className="w-full rounded-lg border border-gray-200 p-2.5"
                onChange={(e) => setState(prevState => ({ ...prevState, newQuestion: { ...prevState.newQuestion, sub_chapter_id: Number(e.target.value) } }))}
                required
              >
                <option value="">Select Sub Chapter</option>
                {state.subChapters.map((subChapter) => (
                  <option key={subChapter.id} value={subChapter.id}>{subChapter.sub_chapter_text}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Question Text</label>
            <textarea
              className="w-full rounded-lg border border-gray-200 p-2.5"
              rows={4}
              value={state.newQuestion.question_text}
              onChange={(e) => setState(prevState => ({ ...prevState, newQuestion: { ...prevState.newQuestion, question_text: e.target.value } }))}
              required
            />
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-medium text-gray-700">Options</label>
              <button
                type="button"
                onClick={handleAddOption}
                className="px-3 py-1.5 text-sm font-medium text-black bg-[#EECE84] rounded-lg hover:bg-[#EECE84]/90 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </button>
            </div>

            {state.newQuestion.options.map((option) => (
              <div key={option.id} className="flex gap-4 items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <label className="text-sm font-medium text-gray-700">Option {option.id}</label>
                    <input
                      type="radio"
                      name="correctAnswer"
                      value={option.id}
                      checked={state.newQuestion.answer === option.id}
                      onChange={(e) => setState(prevState => ({ ...prevState, newQuestion: { ...prevState.newQuestion, answer: e.target.value } }))}
                      className="ml-2"
                      required
                    />
                    <span className="text-sm text-gray-600">Correct answer</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 rounded-lg border border-gray-200 p-2.5"
                      value={option.text}
                      onChange={(e) => handleOptionChange(option.id, e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(option.id)}
                      className="p-2.5 text-red-500 hover:text-red-700 disabled:opacity-50"
                      disabled={state.newQuestion.options.length <= 2}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Explanation</label>
            <textarea
              className="w-full rounded-lg border border-gray-200 p-2.5"
              rows={4}
              value={state.newQuestion.explanation}
              onChange={(e) => setState(prevState => ({ ...prevState, newQuestion: { ...prevState.newQuestion, explanation: e.target.value } }))}
              required
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Images</label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {state.newQuestion.question_images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img src={image} alt={`Question ${index + 1}`} className="w-24 h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(index, 'question')}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Upload Images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'question')}
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Explanation Images</label>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {state.newQuestion.explanation_images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img src={image} alt={`Explanation ${index + 1}`} className="w-24 h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeImage(index, 'explanation')}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
                <label className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                  <Upload className="w-5 h-5 text-gray-600" />
                  <span className="text-sm text-gray-700">Upload Images</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, 'explanation')}
                  />
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quality Score: {state.newQuestion.quality_score}
            </label>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">1</span>
              <input
                type="range"
                min="1"
                max="5"
                value={state.newQuestion.quality_score}
                onChange={(e) => setState(prevState => ({ ...prevState, newQuestion: { ...prevState.newQuestion, quality_score: parseInt(e.target.value) } }))}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#EECE84] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-pointer"
              />
              <span className="text-sm text-gray-500">5</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Countries (comma-separated)</label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-200 p-2.5"
              value={state.newQuestion.countries.join(', ')}
              onChange={(e) => setState(prevState => ({
                ...prevState,
                newQuestion: {
                  ...prevState.newQuestion,
                  countries: e.target.value.split(',').map(country => country.trim()).filter(Boolean)
                }
              }))}
              placeholder="e.g. France, Germany, Italy"
              required
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-black bg-[#EECE84] rounded-lg hover:bg-[#EECE84]/90"
            >
              {editingQuestion ? 'Update Question' : 'Create Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionsForm;