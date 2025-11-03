/* eslint-disable @next/next/no-img-element */
'use client';

import { useAuth, useUser } from '@/lib/mock-clerk';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from '@/components/ui/loader';
import { toast } from 'sonner';
import { Edit3, Save, X as XIcon } from 'lucide-react';
import HeaderState from './Header';
import Explanation from './ExplanationQuizz';
import CommentsQuizz from './CommentsQuizz';
import ReviewForm from './ReviewForm';
import SidebarCard from './Sidebar';
import FooterState from './Footer';
import QuestionOptions from './QuestionOptionsQuizz';
import AIChat from './AIChats';
import FlyComputer from './FlyComputer';
import AIOverlay from './AIOverlay';
import ScientificCalculator from './ScientificCalculator';

interface QuizData {
  topic_name?: string;
  chapters: string[];
  subChapters: string[];
  questionCount: number;
  userId: string;
  testId: number | null;
  tryagainfilter: string | null;
  nombre_question: number;
  total_question: number;
  filter: {
    countries: string | null;
    question_not_seen: boolean;
    green_tag: boolean;
    red_tag: boolean;
    orange_tag: boolean;
    wrong_answer: boolean;
    last_exam: number;
  };
}

interface RawQuestion {
  id: number;
  question_text: string;
  answer: string;
  options: Record<string, string>;
  explanation: string;
  sub_chapter_id: number;
  countries: Record<string, Record<string, string[]>>;
  chatExplanations?: {
    id: number;
    explanation: string;
  }[];
  explanation_images: string | null;
  question_images: string | null;
  quality_score: string;
}

interface Question {
  id: number;
  questionText: string;
  answer: string;
  options: Record<string, string>;
  explanation: string;
  subChapterId: number;
  countries: Record<string, Record<string, string[]>>;
  chatExplanations?: {
    id: number;
    explanation: string;
  }[];
  explanation_images: string | null;
  question_images: string | null;
  quality_score: string;
}


interface AnsweredQuestion {
  questionId: number;
  userAnswer: string;
  isCorrect: boolean;
  correctAnswer: string;
}

interface QuestionResponse {
  id: number;
  user_answer: string;
}

const QuizzComponents = () => {
  const router = useRouter();
  const { user } = useUser();
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedIndex = localStorage.getItem('currentQuestionIndex');
      return savedIndex ? parseInt(savedIndex, 10) : 0;
    }
    return 0;
  });
  const [answeredQuestions, setAnsweredQuestions] = useState<AnsweredQuestion[]>(() => {
    if (typeof window !== 'undefined') {
      const savedAnswers = localStorage.getItem('answeredQuestions');
      return savedAnswers ? JSON.parse(savedAnswers) : [];
    }
    return [];
  });
  const [selectedContent, setSelectedContent] = useState(0);
  const [timeSpents, setTimeSpents] = useState(0);
  const [testId, setTestId] = useState<number | null>(null);
  const [pinnedQuestions, setPinnedQuestions] = useState<Record<number, string[]>>({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [topicName, setTopicName] = useState<string>('');
  const [isFlyComputerOpen, setIsFlyComputerOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [isAnnexesOpen, setIsAnnexesOpen] = useState(false);
  const [annexes, setAnnexes] = useState<any[]>([]);
  const [selectedAnnex, setSelectedAnnex] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loadingAnnexes, setLoadingAnnexes] = useState(false);
  const [isDevMode, setIsDevMode] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
  const [tempQuestionId, setTempQuestionId] = useState<string>('');
  const [editingQuestionText, setEditingQuestionText] = useState<number | null>(null);
  const [tempQuestionText, setTempQuestionText] = useState<string>('');
  const [editingExplanationText, setEditingExplanationText] = useState<number | null>(null);
  const [tempExplanationText, setTempExplanationText] = useState<string>('');
  const [uploadingImages, setUploadingImages] = useState<boolean>(false);
  const [uploadingExplanationImages, setUploadingExplanationImages] = useState<boolean>(false);
  const [confirmationModal, setConfirmationModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    onCancel: () => {},
  });

  const animationVariants = {
    enter: { opacity: 0, x: -100 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 100 },
  };

  // Convert HH:MM:SS to seconds
  const timeStringToSeconds = (timeStr: string) => {
    const [hours, minutes, seconds] = timeStr.split(':').map(Number);
    return (hours * 3600) + (minutes * 60) + seconds;
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedTime = localStorage.getItem('timeSpents');
      setTimeSpents(storedTime ? parseInt(storedTime, 10) : 0);
  
      const interval = setInterval(() => {
        setTimeSpents((prev) => {
          const newTime = prev + 1;
          if (typeof window !== 'undefined') {
            localStorage.setItem('timeSpents', newTime.toString());
          }
          return newTime;
        });
      }, 1000);
  
      return () => clearInterval(interval);
    }
  }, []);

  useEffect(() => {
    const fetchQuestions = async () => {
      const token = await getToken();
      const testIdFromUrl = searchParams.get('testId');
      const isFromHistory = searchParams.get('fromHistory') === 'true';
      const isFromResume = searchParams.get('fromResume') === 'true';
      const data = searchParams.get('data');
  
      if (!user?.id) {
        console.error("User not connected or invalid ID");
        return;
      }
  
      try {
        if ((isFromHistory || isFromResume) && testIdFromUrl) {
          const endpoint = isFromResume 
            ? `/api/tests/resumeTest`
            : `/api/tests/continueTest/${testIdFromUrl}`;

          const response = await fetch(endpoint, {
            // Token will be automatically injected by API proxy from cookies
          });

          if (!response.ok) {
            throw new Error('Error fetching test data');
          }
  
          const responseData = await response.json();
          setTopicName(responseData.topic_name || '');
          setTestId(parseInt(testIdFromUrl));
  
          // Handle saved timespent
          if (responseData.timespent) {
            const savedSeconds = timeStringToSeconds(responseData.timespent);
            if (typeof window !== 'undefined') {
              localStorage.setItem('timeSpents', savedSeconds.toString());
            }
            setTimeSpents(savedSeconds);
          }

          const formattedQuestions: Question[] = responseData.questions.map(
            (question: RawQuestion) => ({
              id: question.id,
              questionText: question.question_text,
              answer: question.answer,
              options: question.options,
              explanation: question.explanation,
              subChapterId: question.sub_chapter_id,
              countries: question.countries,
              question_images: question.question_images,
              explanation_images: question.explanation_images,
              quality_score: question.quality_score,
              chatExplanations: question.chatExplanations,
            })
          );

          setQuestions(formattedQuestions);
          
          if (responseData.questions) {
            const answeredQuestionsData = responseData.questions
              .filter((q: QuestionResponse) => q.user_answer)
              .map((q: QuestionResponse) => {
                const question = formattedQuestions.find(fq => fq.id === q.id);
                return {
                  questionId: q.id,
                  userAnswer: q.user_answer,
                  isCorrect: q.user_answer === question?.answer,
                  correctAnswer: question?.answer || ''
                };
              });
            setAnsweredQuestions(answeredQuestionsData);
          }
  
          if (responseData.current_question_index !== undefined) {
            setCurrentQuestionIndex(responseData.current_question_index);
          }
  
        } else if (data) {
          const quizData: QuizData = JSON.parse(decodeURIComponent(data));
          
          const bodyData = {
            userId: user.id,
            testId: quizData.testId || null,
            tryagainfilter: quizData.tryagainfilter || null,
            total_question: quizData.total_question || quizData.questionCount,
            nombre_question: quizData.nombre_question || quizData.questionCount,
            sub_chapters: quizData.subChapters?.map(subChapter => parseInt(subChapter, 10)) || [],
            subChapters: quizData.subChapters?.map(subChapter => parseInt(subChapter, 10)) || [],
            questionCount: quizData.total_question || quizData.questionCount,
            chapters: quizData.chapters || [],
            filter: {
              ...quizData.filter,
              countries: null,
              question_not_seen: false,
              green_tag: false,
              red_tag: false,
              orange_tag: false,
              wrong_answer: false,
              last_exam: null
            }
          };
          
          console.log('📤 Sending request to /api/tests/start:', bodyData);
  
          // Get token from localStorage (same as dashboard)
          let accessToken: string | null = null;
          try {
            const tokensStr = typeof window !== 'undefined' ? localStorage.getItem('keycloak_tokens') : null;
            if (tokensStr) {
              const tokens = JSON.parse(tokensStr);
              // Vérification de l'expiration désactivée pour une meilleure expérience d'étude
              // Les étudiants peuvent rester connectés pendant leurs longues sessions d'étude
              // if (tokens.expires_at && tokens.expires_at > Date.now()) {
              //   accessToken = tokens.access_token;
              // }
              accessToken = tokens.access_token;
            }
          } catch (e) {
            console.error('[Quiz] Error reading tokens:', e);
          }
          
          const response = await fetch(
            `/api/tests/start`,
            {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/json',
                ...(accessToken && { 'Authorization': `Bearer ${accessToken}` })
              },
              body: JSON.stringify(bodyData),
            }
          );
  
          if (!response.ok) {
            const errorDetails = await response.json();
            throw new Error(errorDetails.message || 'Error fetching questions');
          }
  
          const responseData = await response.json();
          setTopicName(responseData.topic_name || '');
          setTestId(responseData.test_id);
  
          const formattedQuestions: Question[] = responseData.questions.map(
            (question: RawQuestion) => ({
              id: question.id,
              questionText: question.question_text,
              answer: question.answer,
              options: question.options,
              explanation: question.explanation,
              subChapterId: question.sub_chapter_id,
              countries: question.countries,
              chatExplanations: question.chatExplanations,
              explanation_images: question.explanation_images,
              question_images: question.question_images,
              quality_score: question.quality_score,
            })
          );
  
          setQuestions(formattedQuestions);
        } else {
          console.error("No 'data' parameter or testId found in request");
        }
      } catch (error) {
        console.error('API Error:', error);
        toast.error('Error loading quiz data');
      } finally {
        setLoading(false);
      }
    };
  
    fetchQuestions();
  }, [getToken, searchParams, user]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('currentQuestionIndex', currentQuestionIndex.toString());
    }
  }, [currentQuestionIndex]);

  const goToPreviousQuestion = useCallback(() => {
    setCurrentQuestionIndex((prevIndex) => Math.max(0, prevIndex - 1));
  }, []);

  const goToNextQuestion = useCallback(() => {
    setCurrentQuestionIndex((prevIndex) => Math.min(questions.length - 1, prevIndex + 1));
  }, [questions.length]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        goToPreviousQuestion();
      } else if (event.key === 'ArrowRight') {
        goToNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextQuestion, goToPreviousQuestion]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
    }
  }, [answeredQuestions]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading user information...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>No questions found for the selected chapters and sub-chapters.</p>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const handleContentChange = (index: number): void => {
    setSelectedContent(index);
  };

  const handleFlyComputerToggle = (): void => {
    if (!isFlyComputerOpen) {
      // Fermer les autres fenêtres avant d'ouvrir Flight Computer
      setIsAIOpen(false);
      setIsCalculatorOpen(false);
    }
    setIsFlyComputerOpen(!isFlyComputerOpen);
  };

  const handleAIToggle = (): void => {
    if (!isAIOpen) {
      // Fermer les autres fenêtres avant d'ouvrir AI
      setIsFlyComputerOpen(false);
      setIsCalculatorOpen(false);
      setIsAnnexesOpen(false);
    }
    setIsAIOpen(!isAIOpen);
  };

  const handleCalculatorToggle = (): void => {
    if (!isCalculatorOpen) {
      // Fermer les autres fenêtres avant d'ouvrir Calculator
      setIsFlyComputerOpen(false);
      setIsAIOpen(false);
      setIsAnnexesOpen(false);
    }
    setIsCalculatorOpen(!isCalculatorOpen);
  };

  const handleAnnexesToggle = (): void => {
    if (!isAnnexesOpen) {
      // Fermer les autres fenêtres avant d'ouvrir Annexes
      setIsFlyComputerOpen(false);
      setIsAIOpen(false);
      setIsCalculatorOpen(false);
      // Charger les annexes si pas encore chargées
      if (annexes.length === 0) {
        loadAnnexes();
      }
    }
    setIsAnnexesOpen(!isAnnexesOpen);
  };

  const loadAnnexes = async () => {
    setLoadingAnnexes(true);
    try {
      const token = await getToken();
      console.log('🔑 Token obtenu:', token ? 'Oui' : 'Non');
      
      const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/annexes`;
      console.log('🌐 URL API:', apiUrl);
      console.log('🌐 NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_BACKEND_URL);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);
      console.log('📡 Response URL:', response.url);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Error response:', errorText);
        throw new Error(`Failed to load annexes: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('✅ Annexes chargées:', data);
      setAnnexes(data);
    } catch (error) {
      console.error('Error loading annexes:', error);
      toast.error(`Failed to load annexes: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoadingAnnexes(false);
    }
  };

  const handleAnnexSelect = (annex: any) => {
    console.log('📖 Sélection annexe:', annex);
    setSelectedAnnex(annex);
    setCurrentPage(1);
    
    // Définir le nombre total de pages selon l'annexe
    if (annex.id === 1) {
      setTotalPages(70); // Visual Aids Handbook
      console.log('📚 Visual Aids Handbook sélectionné - 70 pages');
    } else if (annex.id === 2) {
      setTotalPages(304); // Ace Technical Interview
      console.log('📚 Ace Technical Interview sélectionné - 304 pages');
    }
  };

  const handleCloseAnnexViewer = () => {
    setSelectedAnnex(null);
    setCurrentPage(1);
    setTotalPages(0);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const getPageImagePath = (annexId: number, page: number) => {
    const pageNumber = String(page - 1).padStart(3, '0');
    let imagePath = '';
    
    if (annexId === 1) {
      imagePath = `${process.env.NEXT_PUBLIC_BACKEND_URL}/annexes/visual_aids_handbook_pages/page_${pageNumber}.jpg`;
    } else if (annexId === 2) {
      imagePath = `${process.env.NEXT_PUBLIC_BACKEND_URL}/annexes/ace_interview_pages/page_${pageNumber}.jpg`;
    }
    
    console.log('🖼️ Image path:', imagePath);
    console.log('🆔 Annex ID:', annexId);
    console.log('📄 Page:', page);
    console.log('🔢 Page number:', pageNumber);
    
    return imagePath;
  };

  const handleDevModeToggle = (): void => {
    setIsDevMode(!isDevMode);
    // Réinitialiser l'édition si on désactive le mode dev
    if (isDevMode) {
      setEditingQuestionId(null);
      setTempQuestionId('');
      setEditingQuestionText(null);
      setTempQuestionText('');
    }
  };

  const showConfirmation = (title: string, message: string, onConfirm: () => void) => {
    setConfirmationModal({
      isOpen: true,
      title,
      message,
      onConfirm,
      onCancel: () => setConfirmationModal(prev => ({ ...prev, isOpen: false }))
    });
  };

  const handleEditQuestionId = (questionId: number): void => {
    setEditingQuestionId(questionId);
    setTempQuestionId(questionId.toString());
  };

  const handleSaveQuestionId = async (): Promise<void> => {
    if (!editingQuestionId || !tempQuestionId.trim()) return;

    const originalId = questions.find(q => q.id === editingQuestionId)?.id;
    if (originalId?.toString() === tempQuestionId.trim()) {
      // Pas de changement, pas besoin de confirmation
      setEditingQuestionId(null);
      setTempQuestionId('');
      return;
    }

    showConfirmation(
      'Confirmer la modification de l\'ID',
      `Êtes-vous sûr de vouloir modifier l'ID de la question de ${originalId} à ${tempQuestionId.trim()} ?`,
      async () => {
        try {
          const token = await getToken();
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/${editingQuestionId}`, {
            method: 'PATCH',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: parseInt(tempQuestionId.trim())
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to update question ID');
          }

          // Mettre à jour l'état local
          setQuestions(prev => prev.map(q => 
            q.id === editingQuestionId 
              ? { ...q, id: parseInt(tempQuestionId.trim()) }
              : q
          ));

          toast.success('Question ID updated successfully');
          setEditingQuestionId(null);
          setTempQuestionId('');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error updating question ID:', error);
          toast.error('Failed to update question ID');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    );
  };

  const handleCancelEdit = (): void => {
    setEditingQuestionId(null);
    setTempQuestionId('');
  };

  const handleEditQuestionText = (questionId: number): void => {
    setEditingQuestionText(questionId);
    const question = questions.find(q => q.id === questionId);
    setTempQuestionText(question?.questionText || '');
  };

  const handleSaveQuestionText = async (): Promise<void> => {
    if (!editingQuestionText || !tempQuestionText.trim()) return;

    const originalText = questions.find(q => q.id === editingQuestionText)?.questionText;
    if (originalText === tempQuestionText.trim()) {
      // Pas de changement, pas besoin de confirmation
      setEditingQuestionText(null);
      setTempQuestionText('');
      return;
    }

    showConfirmation(
      'Confirmer la modification du libellé',
      'Êtes-vous sûr de vouloir modifier le libellé de cette question ? Cette action ne peut pas être annulée.',
      async () => {
        try {
          const token = await getToken();
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/${editingQuestionText}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              question_text: tempQuestionText.trim()
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to update question text');
          }

          // Mettre à jour l'état local
          setQuestions(prev => prev.map(q => 
            q.id === editingQuestionText 
              ? { ...q, questionText: tempQuestionText.trim() }
              : q
          ));

          toast.success('Question text updated successfully');
          setEditingQuestionText(null);
          setTempQuestionText('');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error updating question text:', error);
          toast.error('Failed to update question text');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    );
  };

  const handleCancelEditText = (): void => {
    setEditingQuestionText(null);
    setTempQuestionText('');
  };

  const handleEditExplanationText = (questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      setEditingExplanationText(questionId);
      setTempExplanationText(question.explanation);
    }
  };

  const handleSaveExplanationText = async () => {
    if (!editingExplanationText) return;

    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/${editingExplanationText}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          explanation: tempExplanationText,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update explanation');
      }

      // Mettre à jour l'état local
      setQuestions(prev => prev.map(q => 
        q.id === editingExplanationText 
          ? { ...q, explanation: tempExplanationText }
          : q
      ));

      setEditingExplanationText(null);
      setTempExplanationText('');
      toast.success('Explanation updated successfully');
    } catch (error) {
      console.error('Error updating explanation:', error);
      toast.error('Failed to update explanation');
    }
  };

  const handleCancelEditExplanationText = () => {
    setEditingExplanationText(null);
    setTempExplanationText('');
  };

  const handleImageUpload = async (questionId: number, file: File): Promise<void> => {
    showConfirmation(
      'Confirmer l\'ajout d\'image',
      `Êtes-vous sûr de vouloir ajouter l'image "${file.name}" à cette question ?`,
      async () => {
        setUploadingImages(true);
        try {
          const token = await getToken();
          const formData = new FormData();
          formData.append('image', file);
          formData.append('questionId', questionId.toString());

          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/${questionId}/images`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to upload image');
          }

          const result = await response.json();
          
          // Mettre à jour l'état local
          setQuestions(prev => prev.map(q => 
            q.id === questionId 
              ? { 
                  ...q, 
                  question_images: JSON.stringify([...(q.question_images ? JSON.parse(q.question_images) : []), result.imageUrl])
                }
              : q
          ));

          toast.success('Image uploaded successfully');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error uploading image:', error);
          toast.error('Failed to upload image');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } finally {
          setUploadingImages(false);
        }
      }
    );
  };

  const handleImageDelete = async (questionId: number, imageIndex: number): Promise<void> => {
    showConfirmation(
      'Confirmer la suppression d\'image',
      'Êtes-vous sûr de vouloir supprimer cette image ? Cette action ne peut pas être annulée.',
      async () => {
        try {
          const token = await getToken();
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/${questionId}/images/${imageIndex}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to delete image');
          }

          // Mettre à jour l'état local
          setQuestions(prev => prev.map(q => 
            q.id === questionId 
              ? { 
                  ...q, 
                  question_images: JSON.stringify(
                    (q.question_images ? JSON.parse(q.question_images) : [])
                      .filter((_: any, index: number) => index !== imageIndex)
                  )
                }
              : q
          ));

          toast.success('Image deleted successfully');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error deleting image:', error);
          toast.error('Failed to delete image');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    );
  };

  const handleImageReplace = async (questionId: number, imageIndex: number, file: File): Promise<void> => {
    showConfirmation(
      'Confirmer le remplacement d\'image',
      `Êtes-vous sûr de vouloir remplacer cette image par "${file.name}" ? L'ancienne image sera supprimée.`,
      async () => {
        setUploadingImages(true);
        try {
          const token = await getToken();
          const formData = new FormData();
          formData.append('image', file);
          formData.append('imageIndex', imageIndex.toString());

          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/${questionId}/images/${imageIndex}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to replace image');
          }

          const result = await response.json();
          
          // Mettre à jour l'état local
          setQuestions(prev => prev.map(q => 
            q.id === questionId 
              ? { 
                  ...q, 
                  question_images: JSON.stringify(
                    (q.question_images ? JSON.parse(q.question_images) : [])
                      .map((img: any, index: number) => 
                        index === imageIndex ? result.imageUrl : img
                      )
                  )
                }
              : q
          ));

          toast.success('Image replaced successfully');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error replacing image:', error);
          toast.error('Failed to replace image');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } finally {
          setUploadingImages(false);
        }
      }
    );
  };

  const handleExplanationImageUpload = async (questionId: number, file: File): Promise<void> => {
    showConfirmation(
      'Confirmer l\'ajout d\'image d\'explication',
      `Êtes-vous sûr de vouloir ajouter l'image "${file.name}" à l'explication de cette question ?`,
      async () => {
        setUploadingExplanationImages(true);
        try {
          const token = await getToken();
          const formData = new FormData();
          formData.append('image', file);
          formData.append('questionId', questionId.toString());

          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/${questionId}/explanation-images`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to upload explanation image');
          }

          const result = await response.json();
          
          // Mettre à jour l'état local
          setQuestions(prev => prev.map(q => 
            q.id === questionId 
              ? { 
                  ...q, 
                  explanation_images: JSON.stringify([...(q.explanation_images ? JSON.parse(q.explanation_images) : []), result.imageUrl])
                }
              : q
          ));

          toast.success('Explanation image uploaded successfully');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error uploading explanation image:', error);
          toast.error('Failed to upload explanation image');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } finally {
          setUploadingExplanationImages(false);
        }
      }
    );
  };

  const handleExplanationImageDelete = async (questionId: number, imageIndex: number): Promise<void> => {
    showConfirmation(
      'Confirmer la suppression d\'image d\'explication',
      'Êtes-vous sûr de vouloir supprimer cette image d\'explication ? Cette action ne peut pas être annulée.',
      async () => {
        try {
          const token = await getToken();
          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/${questionId}/explanation-images/${imageIndex}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            throw new Error('Failed to delete explanation image');
          }

          // Mettre à jour l'état local
          setQuestions(prev => prev.map(q => 
            q.id === questionId 
              ? { 
                  ...q, 
                  explanation_images: JSON.stringify(
                    (q.explanation_images ? JSON.parse(q.explanation_images) : [])
                      .filter((_: any, index: number) => index !== imageIndex)
                  )
                }
              : q
          ));

          toast.success('Explanation image deleted successfully');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error deleting explanation image:', error);
          toast.error('Failed to delete explanation image');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        }
      }
    );
  };

  const handleExplanationImageReplace = async (questionId: number, imageIndex: number, file: File): Promise<void> => {
    showConfirmation(
      'Confirmer le remplacement d\'image d\'explication',
      `Êtes-vous sûr de vouloir remplacer cette image d'explication par "${file.name}" ? L'ancienne image sera supprimée.`,
      async () => {
        setUploadingExplanationImages(true);
        try {
          const token = await getToken();
          const formData = new FormData();
          formData.append('image', file);
          formData.append('imageIndex', imageIndex.toString());

          const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/${questionId}/explanation-images/${imageIndex}`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
            body: formData,
          });

          if (!response.ok) {
            throw new Error('Failed to replace explanation image');
          }

          const result = await response.json();
          
          // Mettre à jour l'état local
          setQuestions(prev => prev.map(q => 
            q.id === questionId 
              ? { 
                  ...q, 
                  explanation_images: JSON.stringify(
                    (q.explanation_images ? JSON.parse(q.explanation_images) : [])
                      .map((img: any, index: number) => 
                        index === imageIndex ? result.imageUrl : img
                      )
                  )
                }
              : q
          ));

          toast.success('Explanation image replaced successfully');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } catch (error) {
          console.error('Error replacing explanation image:', error);
          toast.error('Failed to replace explanation image');
          setConfirmationModal(prev => ({ ...prev, isOpen: false }));
        } finally {
          setUploadingExplanationImages(false);
        }
      }
    );
  };

  const handleAnswer = (questionId: number, userAnswer: string) => {
    setAnsweredQuestions((prev) => {
      const newAnswers = [
        ...prev.filter((q) => q.questionId !== questionId),
        { 
          questionId, 
          userAnswer, 
          isCorrect: userAnswer === questions.find(q => q.id === questionId)?.answer,
          correctAnswer: questions.find(q => q.id === questionId)?.answer || ''
        }
      ];
      if (typeof window !== 'undefined') {
        localStorage.setItem('answeredQuestions', JSON.stringify(newAnswers));
      }
      return newAnswers;
    });

    setTimeout(goToNextQuestion, 500);
  };

  const handleStartReview = async () => {
    const token = await getToken();
  
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentQuestionIndex');
        localStorage.removeItem('answeredQuestions');
      }
    
      const validationData = {
        testId: testId,
        filter: null,
        data: answeredQuestions.map(({ questionId, userAnswer }) => ({
          question_id: questionId,
          user_answer: userAnswer
        }))
      };
    
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tests/validate`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(validationData),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("Error validating test:", errorDetails);
        throw new Error(errorDetails.message || 'Error validating test.');
      }
  
      const validationResponse = await response.json();
      
      // Store validation data in localStorage to avoid duplicate API call
      if (typeof window !== 'undefined') {
        localStorage.setItem('validationData', JSON.stringify(validationResponse));
      }
      
      toast.success('Test submitted successfully.')
      router.push(`/questions-bank/study/review?testId=${validationResponse.testId}`);
    } catch (error) {
      console.error('Error during test validation:', error);
      toast.error('An error occurred during test validation.');
    }
  };

  const togglePinQuestion = async (questionId: number, color: string) => {
    const token = await getToken();

    try {
      const currentColors = pinnedQuestions[questionId] || [];
      const isPinned = currentColors.includes(color);

      const updatedColors = isPinned
        ? currentColors.filter((c) => c !== color)
        : [...currentColors, color];

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/questions/pin`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            testId: testId,
            userId: user?.id,
            question_id: questionId,
            is_pinned: color,
          }),
        }
      );

      if (!response.ok) {
        throw new Error('Error changing pin state');
      }

      setPinnedQuestions((prev) => ({
        ...prev,
        [questionId]: updatedColors,
      }));
    } catch (error) {
      console.error('Error pinning question:', error);
    }
  };

  const handleSubmitReport = async (report: { userId: string; categorie: string; contenu: string }) => {
    const token = await getToken();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports`, {
        method: "POST",
        headers: { 
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) {
        throw new Error("Failed to submit report");
      }

      toast.success("Report submitted successfully!");
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit report. Please try again.");
    }
  };

  const handleSaveTest = async () => {
    const token = await getToken();

    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentQuestionIndex');
        localStorage.removeItem('answeredQuestions');
      }
    
      const saveData = {
        testId: testId,
        data: answeredQuestions.map(({ questionId, userAnswer }) => ({
          question_id: questionId,
          user_answer: userAnswer
        }))
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/tests/saveTest`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(saveData),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error("API error during test saving:", errorDetails);
        throw new Error(errorDetails.message || 'Error during test saving.');
      }
      
      toast.success('Test saved successfully.')
      router.push(`/questions-bank/history`);
    } catch (error) {
      console.error('Error saving the test:', error);
      toast.error('Failed to save test. Please try again.');
    }
  };
  
  const formattedText = currentQuestion?.questionText
    ?.replace(/\n/g, "<br />")
    ?.replace(/\t/g, " ") || "";

  // Function to clean and format explanation HTML - enhanced for math
  const cleanExplanationHTML = (explanation: string) => {
    if (!explanation) return "";
    
    // Enhanced cleaning with math formatting
    let cleaned = explanation
      // Fix math formatting - convert m\n2\n to m², etc.
      .replace(/m\\n2\\n/g, 'm²')
      .replace(/m\\n3\\n/g, 'm³')
      .replace(/kg\/m\\n2\\n/g, 'kg/m²')
      .replace(/kg\/m\\n3\\n/g, 'kg/m³')
      .replace(/\\n2\\n/g, '²')
      .replace(/\\n3\\n/g, '³')
      // Fix incomplete strong tags
      .replace(/<strong>([^<]*)$/g, '<strong>$1</strong>')
      .replace(/^([^<]*)<\/strong>/g, '<strong>$1</strong>')
      // Fix incomplete underline tags
      .replace(/<u>([^<]*)$/g, '<u>$1</u>')
      .replace(/^([^<]*)<\/u>/g, '<u>$1</u>')
      // Fix math expressions with line breaks
      .replace(/(\d+)\\n\\n(kg\/m²?)/g, '$1 $2')
      .replace(/(\d+\.\d+)\\n\\n(kg\/m²?)/g, '$1 $2')
      // Remove excessive line breaks (more than 2 consecutive)
      .replace(/\n{3,}/g, '\n\n')
      // Clean up extra spaces around line breaks
      .replace(/[ \t]+\n/g, '\n')
      .replace(/\n[ \t]+/g, '\n')
      // Remove empty paragraphs
      .replace(/<p>\s*<\/p>/g, '')
      // Clean up excessive whitespace (but keep single spaces)
      .replace(/[ \t]{2,}/g, ' ')
      .trim();
    
    // Convert line breaks to HTML breaks, but preserve existing HTML structure
    cleaned = cleaned
      .replace(/\n/g, '<br />')
      .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;');
    
    return cleaned;
  };

  const formattedExplanation = currentQuestion?.explanation 
    ? cleanExplanationHTML(currentQuestion.explanation)
    : "";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header - Fixed at top */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <HeaderState
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          timeSpent={timeSpents}
          onPreviousQuestion={goToPreviousQuestion}
          onNextQuestion={goToNextQuestion}
          onPinQuestion={togglePinQuestion}
          onSubmitReport={handleSubmitReport}
          pinnedQuestions={pinnedQuestions}
          currentQuestionId={currentQuestion?.id}
          userId={user?.id}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isDevMode={isDevMode}
          onToggleDevMode={handleDevModeToggle}
        />
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-[76px] mb-[64px]">
        <div className="max-w-[1260px] mx-auto px-4 h-full">
          <div className="flex flex-col lg:flex-row relative h-full">
            {/* Main Content Area */}
            <div className="flex-1 lg:max-w-[calc(100%-400px)] w-full">
              <div className="py-6">
                {selectedContent === 0 && (
                  <motion.div
                    key={currentQuestionIndex}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    variants={animationVariants}
                    transition={{ duration: 0.5 }}
                    className="space-y-6 mb-6"
                  >
                     {/* Question Text */}
                     <div className="relative group">
                       {editingQuestionText === currentQuestion.id ? (
                         <div className="space-y-2">
                           <textarea
                             value={tempQuestionText}
                             onChange={(e) => setTempQuestionText(e.target.value)}
                             className="w-full text-[18px] leading-tight p-3 border border-[#EECE84] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EECE84]/50 resize-none"
                             rows={4}
                             autoFocus
                           />
                           <div className="flex gap-2">
                             <button
                               onClick={handleSaveQuestionText}
                               className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                             >
                               <Save className="w-4 h-4" />
                               Save
                             </button>
                             <button
                               onClick={handleCancelEditText}
                               className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                             >
                               <XIcon className="w-4 h-4" />
                               Cancel
                             </button>
                           </div>
                         </div>
                       ) : (
                         <div className="flex items-start gap-2">
                           <motion.div
                             className="quiz-question-text cursor-pointer transition-all duration-300 flex-1"
                             dangerouslySetInnerHTML={{ __html: formattedText }}
                             whileHover={{ scale: 1.1 }}
                             whileTap={{ scale: 0.9 }}
                           />
                           {isDevMode && (
                             <button
                               onClick={() => handleEditQuestionText(currentQuestion.id)}
                               className="p-2 hover:bg-blue-100 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                               title="Edit Question Text"
                             >
                               <Edit3 className="w-4 h-4 text-blue-600" />
                             </button>
                           )}
                         </div>
                       )}
                     </div>

                    {currentQuestion && (
                      <QuestionOptions
                        options={currentQuestion.options}
                        currentQuestionIndex={currentQuestionIndex}
                        questionId={currentQuestion.id}
                        answeredQuestions={answeredQuestions}
                        handleAnswer={handleAnswer}
                        currentQuestion={currentQuestion}
                        isDevMode={isDevMode}
                        editingQuestionId={editingQuestionId}
                        tempQuestionId={tempQuestionId}
                        onEditQuestionId={handleEditQuestionId}
                        onSaveQuestionId={handleSaveQuestionId}
                        onCancelEdit={handleCancelEdit}
                        onTempQuestionIdChange={setTempQuestionId}
                        editingQuestionText={editingQuestionText}
                        tempQuestionText={tempQuestionText}
                        onEditQuestionText={handleEditQuestionText}
                        onSaveQuestionText={handleSaveQuestionText}
                        onCancelEditText={handleCancelEditText}
                        onTempQuestionTextChange={setTempQuestionText}
                        uploadingImages={uploadingImages}
                        onImageUpload={handleImageUpload}
                        onImageDelete={handleImageDelete}
                        onImageReplace={handleImageReplace}
                      />
                    )}
                  </motion.div>
                )}

                {selectedContent === 1 && currentQuestion && (
                  <div className="lg:pr-[200px] max-w-4xl">
                    <Explanation 
                      explanation={formattedExplanation} 
                      questionId={currentQuestion.id}
                      chatExplanations={currentQuestion.chatExplanations}
                      explanation_images={currentQuestion.explanation_images}
                      isDevMode={isDevMode}
                      uploadingExplanationImages={uploadingExplanationImages}
                      onExplanationImageUpload={handleExplanationImageUpload}
                      onExplanationImageDelete={handleExplanationImageDelete}
                      onExplanationImageReplace={handleExplanationImageReplace}
                      editingExplanationText={editingExplanationText}
                      tempExplanationText={tempExplanationText}
                      onEditExplanationText={handleEditExplanationText}
                      onSaveExplanationText={handleSaveExplanationText}
                      onCancelEditExplanationText={handleCancelEditExplanationText}
                      onTempExplanationTextChange={setTempExplanationText}
                    />
                  </div>
                )}

                {/* AI content removed - now handled by overlay */}

                {selectedContent === 3 && currentQuestion && (
                  <CommentsQuizz 
                    questionId={currentQuestion.id} 
                    userId={user?.id || ''} 
                  />
                )}

                {selectedContent === 4 && currentQuestion && (
                  <div className="p-8 mb-6">
                    <div className="max-w-2xl mx-auto">
                      <div className="mb-8 max-w-[620px] mx-auto">
                        <h2 className="text-3xl font-bold text-gray-900 mb-3">Review Question</h2>
                        <p className="text-gray-600 text-lg">
                          Help us improve by providing your feedback on this question.
                        </p>
                      </div>

                      {/* Countries */}
                      <div className="flex flex-wrap gap-2 mb-6 max-w-[620px] mx-auto">
                        {currentQuestion.countries && (
                          Array.isArray(currentQuestion.countries) ? (
                            // Handle array format: ["Spain", "Austro Control", ...]
                            currentQuestion.countries.map((country, index) => (
                              <div key={index} className="group relative">
                                <div className="px-4 py-2 rounded-full bg-[#EECE84]/50 text-sm font-medium text-black border border-[#EECE84]/40 hover:bg-[#EECE84]/20 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                                  <span className="flex items-center gap-2 text-xs">
                                    {country}
                                  </span>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50">
                                  <div className="bg-white rounded-lg shadow-xl p-4 text-sm min-w-[250px] border border-gray-200/50">
                                    <div className="font-medium text-gray-900 mb-2 pb-2 border-b">
                                      {country} Exam Sessions
                                    </div>
                                    <div className="text-gray-500 text-sm">Available in this country</div>
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : (
                            // Handle object format: {country: {year: [dates]}}
                            Object.entries(currentQuestion.countries).map(([country, years]) => (
                              <div key={country} className="group relative">
                                <div className="px-4 py-2 rounded-full bg-[#EECE84]/50 text-sm font-medium text-black border border-[#EECE84]/40 hover:bg-[#EECE84]/20 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md">
                                  <span className="flex items-center gap-2 text-xs">
                                    {country}
                                  </span>
                                </div>
                                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block z-50">
                                  <div className="bg-white rounded-lg shadow-xl p-4 text-sm min-w-[250px] border border-gray-200/50">
                                    <div className="font-medium text-gray-900 mb-2 pb-2 border-b">
                                      {country} Exam Sessions
                                    </div>
                                    {!years ? (
                                      <div className="text-gray-500 text-sm">No exam data available</div>
                                    ) : Array.isArray(years) ? (
                                      <div className="mt-1 text-gray-600 flex flex-wrap gap-1">
                                        {years.map((date, index) => (
                                          <span
                                            key={index}
                                            className="px-2 py-1 rounded-md bg-gray-50 text-xs"
                                          >
                                            {date}
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      Object.entries(years).map(([year, dates]) => (
                                        <div key={year} className="mb-2">
                                          <span className="font-medium text-[#EECE84]">{year}:</span>
                                          <div className="mt-1 text-gray-600 flex flex-wrap gap-1">
                                            {Array.isArray(dates) ? dates.map((date, index) => (
                                              <span
                                                key={index}
                                                className="px-2 py-1 rounded-md bg-gray-50 text-xs"
                                              >
                                                {date}
                                              </span>
                                            )) : Object.values(dates).flat().map((date: any, index: number) => (
                                              <span
                                                key={index}
                                                className="px-2 py-1 rounded-md bg-gray-50 text-xs"
                                              >
                                                {date}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      ))
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))
                          )
                        )}
                      </div>

                      <ReviewForm
                        questionId={currentQuestion.id}
                        userId={user.id}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <aside className="w-full lg:w-[280px] lg:fixed 2xl:right-[max(0px,calc((100vw-1255px)/2+16px))] xl:right-[max(0px,calc((100vw-1250px)/2+16px))] lg:right-[max(0px,calc((100vw-1040px)/2+16px))] lg:top-[90px]">
              <div className="py-6">
                <div className="flex flex-col items-center justify-center space-y-4">
                  <SidebarCard
                    totalQuestions={questions.length}
                    currentQuestionIndex={currentQuestionIndex}
                    questions={questions}
                    onNavigateToQuestion={setCurrentQuestionIndex}
                    answeredQuestions={answeredQuestions}
                    isOpen={isSidebarOpen}
                    onOpenChange={setIsSidebarOpen}
                    onValidate={handleStartReview}
                    onSave={handleSaveTest}
                  />
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Footer - Fixed at bottom */}
      <FooterState 
        onContentChange={handleContentChange} 
        onFlyComputerToggle={handleFlyComputerToggle}
        onAIToggle={handleAIToggle}
        onCalculatorToggle={handleCalculatorToggle}
        onAnnexesToggle={handleAnnexesToggle}
        topicName={topicName}
        isFlyComputerOpen={isFlyComputerOpen}
        isAIOpen={isAIOpen}
        isCalculatorOpen={isCalculatorOpen}
        isAnnexesOpen={isAnnexesOpen}
      />

      {/* Fly Computer Modal */}
      <FlyComputer 
        isVisible={isFlyComputerOpen} 
        onClose={() => setIsFlyComputerOpen(false)}
      />

      {/* AI Overlay */}
      {currentQuestion && (
        <AIOverlay
          isVisible={isAIOpen}
          onClose={() => setIsAIOpen(false)}
          questionId={currentQuestion.id}
        />
      )}

      {/* Scientific Calculator Modal */}
      <ScientificCalculator
        isVisible={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />

      {/* Annexes Modal */}
      {isAnnexesOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-6xl mx-4 shadow-2xl border border-gray-200 w-full h-[80vh] flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">Annexes PDF</h2>
              <button
                onClick={() => setIsAnnexesOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XIcon className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            {loadingAnnexes ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EECE84] mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement des annexes...</p>
                </div>
              </div>
            ) : selectedAnnex ? (
              <div className="flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{selectedAnnex.title}</h3>
                  <button
                    onClick={handleCloseAnnexViewer}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <XIcon className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden flex flex-col">
                  {/* Navigation */}
                  <div className="flex items-center justify-between mb-4 bg-gray-50 p-3 rounded-lg">
                    <button
                      onClick={handlePreviousPage}
                      disabled={currentPage <= 1}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Précédent
                    </button>
                    
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">
                        Page {currentPage} sur {totalPages}
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="1"
                          max={totalPages}
                          value={currentPage}
                          onChange={(e) => {
                            const page = parseInt(e.target.value);
                            if (page >= 1 && page <= totalPages) {
                              setCurrentPage(page);
                            }
                          }}
                          className="w-16 px-2 py-1 text-center border border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-500">/ {totalPages}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage >= totalPages}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                    >
                      Suivant
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  {/* Image Viewer */}
                  <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                    <img
                      src={getPageImagePath(selectedAnnex.id, currentPage)}
                      alt={`${selectedAnnex.title} - Page ${currentPage}`}
                      className="max-w-full max-h-full object-contain"
                      style={{ maxHeight: '70vh' }}
                      onLoad={() => {
                        console.log('✅ Image chargée avec succès');
                      }}
                      onError={(e) => {
                        console.error('❌ Erreur de chargement de l\'image:', e);
                        console.error('❌ URL tentée:', e.currentTarget.src);
                        e.currentTarget.style.display = 'none';
                        
                        // Afficher un message d'erreur
                        const errorDiv = document.createElement('div');
                        errorDiv.className = 'text-center p-8';
                        errorDiv.innerHTML = `
                          <div class="text-red-500 mb-4">
                            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                            </svg>
                          </div>
                          <h3 class="text-lg font-semibold text-gray-700 mb-2">Erreur de chargement</h3>
                          <p class="text-gray-500 mb-2">Impossible de charger la page ${currentPage}</p>
                          <p class="text-sm text-gray-400">URL: ${e.currentTarget.src}</p>
                        `;
                        e.currentTarget.parentNode?.appendChild(errorDiv);
                      }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {annexes.map((annex) => (
                    <motion.div
                      key={annex.id}
                      className="bg-gray-50 rounded-xl p-6 hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200 hover:border-[#EECE84] hover:shadow-lg"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnnexSelect(annex)}
                    >
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-32 bg-white rounded-lg shadow-md border border-gray-200 flex items-center justify-center overflow-hidden">
                            {annex.thumbnail_path ? (
                              <img
                                src={`${process.env.NEXT_PUBLIC_BACKEND_URL}${annex.thumbnail_path}`}
                                alt={`${annex.title} thumbnail`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                  const nextElement = e.currentTarget.nextElementSibling as HTMLElement;
                                  if (nextElement) {
                                    nextElement.style.display = 'flex';
                                  }
                                }}
                              />
                            ) : null}
                            <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center" style={{ display: annex.thumbnail_path ? 'none' : 'flex' }}>
                              <div className="text-center">
                                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                                  <span className="text-white text-sm font-bold">PDF</span>
                                </div>
                                <div className="text-xs text-blue-600 font-medium">{annex.page_count} pages</div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                            {annex.title}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                            {annex.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                              {annex.category}
                            </span>
                            <span>{Math.round(annex.file_size / 1024 / 1024)} MB</span>
                            <span>{annex.page_count} pages</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                {annexes.length === 0 && (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XIcon className="w-8 h-8 text-gray-400" />
                      </div>
                      <p className="text-gray-600">Aucune annexe disponible</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl p-6 max-w-md mx-4 shadow-2xl border border-gray-200"
          >
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XIcon className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {confirmationModal.title}
              </h3>
              <p className="text-gray-600 mb-6">
                {confirmationModal.message}
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={confirmationModal.onCancel}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmationModal.onConfirm}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Confirmer
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default QuizzComponents;