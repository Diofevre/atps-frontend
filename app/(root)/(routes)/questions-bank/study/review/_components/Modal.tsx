'use client'
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Check, Flag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useAuth } from '@clerk/nextjs';

interface FilterState {
  wrong_answer: boolean;
  question_not_seen: boolean;
  green_tag: boolean;
  red_tag: boolean;
  orange_tag: boolean;
}

interface TestStats {
  totalQuestions: number;
  incorrectAnswers: number;
  notAnswered: number;
  red: number;
  green: number;
  orange: number;
}

export default function NewTestModal() {
  const router = useRouter();
  const { getToken } = useAuth();
  const searchParams = useSearchParams();
  const testId = searchParams.get('testId');
  const [open, setOpen] = useState(false);
  const [numQuestions, setNumQuestions] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [totalQuestions, setTotalQuestions] = useState<number>(0);
  const [stats, setStats] = useState<TestStats>({
    totalQuestions: 0,
    incorrectAnswers: 0,
    notAnswered: 0,
    red: 0,
    green: 0,
    orange: 0,
  });

  const [, setFilterState] = useState<FilterState>({
    wrong_answer: false,
    question_not_seen: false,
    green_tag: false,
    red_tag: false,
    orange_tag: false,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!testId) return;

      const token = await getToken();

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/tests/validate`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ testId: Number(testId), filter: null }),
          }
        );

        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();

        const newStats = {
          totalQuestions: data.totalQuestions,
          incorrectAnswers: data.incorrectAnswers,
          notAnswered: data.notAnswered,
          red: data.red,
          green: data.green,
          orange: data.orange,
        };

        setStats(newStats);
        setTotalQuestions(newStats.totalQuestions);
        setNumQuestions(currentNum => Math.min(currentNum, newStats.totalQuestions));
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    if (open) {
      fetchStats();
    }
  }, [getToken, open, testId, numQuestions]);

  const filterOptions = [
    {
      id: 'all',
      label: 'All questions',
      icon: Check,
      color: 'emerald',
      count: stats.totalQuestions,
    },
    {
      id: 'not-answered',
      label: 'Not answered',
      icon: Check,
      color: 'emerald',
      key: 'question_not_seen',
      count: stats.notAnswered,
    },
    {
      id: 'wrong',
      label: 'Wrong answers',
      icon: Check,
      color: 'emerald',
      key: 'wrong_answer',
      count: stats.incorrectAnswers,
    },
  ];

  const flaggedOptions = [
    {
      id: 'green',
      label: 'Green Flagged',
      bg: 'bg-emerald-50',
      key: 'green_tag',
      count: stats.green,
    },
    {
      id: 'orange',
      label: 'Orange Flagged',
      bg: 'bg-amber-50',
      key: 'orange_tag',
      count: stats.orange,
    },
    {
      id: 'red',
      label: 'Red Flagged',
      bg: 'bg-red-50',
      key: 'red_tag',
      count: stats.red,
    },
  ];

  // Handle Filter change
  const handleFilterToggle = (id: string, key?: string) => {
    if (id === activeFilter) return;
  
    setFilterState({
      wrong_answer: false,
      question_not_seen: false,
      green_tag: false,
      red_tag: false,
      orange_tag: false,
    });
  
    setActiveFilter(id);
  
    if (key) {
      setFilterState((prev) => ({
        ...prev,
        [key]: true,
      }));
    }
  
    const option = [...filterOptions, ...flaggedOptions].find((opt) => opt.id === id);
    if (option) {
      setTotalQuestions((prevTotal) => (numQuestions === 0 ? option.count : prevTotal));
      setNumQuestions((currentNum) => Math.min(currentNum || option.count, option.count));
    }
  };

  // Get Total Questions by Filter
  const getTotalQuestionsByFilter = () => {
    const option = [...filterOptions, ...flaggedOptions].find((opt) => opt.id === activeFilter);
    return option ? option.count : totalQuestions;
  };

  // Handle Number of Questions change
  const handleNumQuestionsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Math.min(Number(e.target.value), getTotalQuestionsByFilter());
    setNumQuestions(value);
  
    if (value > getTotalQuestionsByFilter()) {
      alert(
        `You cannot select more than ${getTotalQuestionsByFilter()} questions for the current filter.`
      );
    }
  };

  // Handle Create Test
  const handleCreateTest = async () => {
    // Remove stockage
    localStorage.removeItem('currentQuestionIndex');
    localStorage.removeItem('answeredQuestions');
    localStorage.removeItem('timeSpents');
    
    const tryagainData = {
      testId: Number(testId),
      tryagainfilter: activeFilter,
      nombre_question: numQuestions
    };
    
    const queryParams = new URLSearchParams({
      data: JSON.stringify(tryagainData)
    });
  
    router.push(`/questions-bank/study/quizz?${queryParams}`);
  };

  return (
    <div className="p-0">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <button
            className="
            group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-[#EECE84]/80 to-white/50 
            rounded-xl shadow-sm hover:shadow-lg transform hover:-translate-y-0.5
            transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 
            focus:ring-offset-2"
          >
            <Plus size={16} className="text-emerald-600" />
            <span className="font-medium">Try again</span>
          </button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[800px] shadow-xl">
          <DialogHeader className="pb-4 border-b items-center">
            <DialogTitle className="flex items-center justify-between uppercase">
              <div className="flex items-center gap-2">
                <Flag size={20} className="text-emerald-600" />
                <span className="text-2xl font-semibold">Customize Test</span>
              </div>
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              These filters apply only for this test!
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-8 py-4">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold uppercase mb-3 text-gray-900 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Question Filters
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {filterOptions.map(({ id, label, icon: Icon, color, key, count }) => (
                    <div
                      key={id}
                      onClick={() => handleFilterToggle(id, key)}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-lg",
                        "bg-gray-50/80 cursor-pointer",
                        "transition-all duration-200 hover:shadow-sm hover:bg-gray-100/80",
                        activeFilter === id && "ring-2 ring-emerald-500/20 bg-emerald-50/50",
                        count === 0 && "opacity-100"
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                        <span className="text-xs text-gray-500">{count} questions</span>
                      </div>
                      {activeFilter === id && (
                        <Icon size={16} className={`text-${color}-500`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold uppercase mb-3 text-gray-900 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Flagged Questions
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {flaggedOptions.map(({ id, label, bg, key, count }) => (
                    <div
                      key={id}
                      onClick={() => handleFilterToggle(id, key)}
                      className={cn(
                        "flex items-center justify-between p-2.5 rounded-lg",
                        bg,
                        "cursor-pointer transition-all duration-200 hover:shadow-sm",
                        activeFilter === id && "ring-2 ring-emerald-500/20",
                        count === 0 && "opacity-100"
                      )}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-gray-700">{label}</span>
                        <span className="text-xs text-gray-500">{count} questions</span>
                      </div>
                      {activeFilter === id && (
                        <Check size={16} className="text-emerald-500" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h4 className="font-semibold uppercase mb-3 text-gray-900 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Test Settings
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2.5 bg-gray-50/80 rounded-lg hover:bg-gray-100/80 transition-all duration-200 hover:shadow-sm">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">Questions:</span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={numQuestions}
                          onChange={handleNumQuestionsChange}
                          min={1}
                          max={totalQuestions}
                          aria-label="Number of questions"
                          placeholder="Enter number of questions"
                          className="w-16 px-2 py-1 text-sm border rounded-md focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
                        />
                        <span className="text-sm text-gray-500">/ {getTotalQuestionsByFilter()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <h4 className="font-semibold uppercase mb-3 text-gray-900 flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Selected Filter
                </h4>
                <div className="p-3 bg-gray-50/80 rounded-lg">
                  <p className="text-sm text-gray-600">
                    {activeFilter === 'all' ? 'All questions' : 
                      [...filterOptions, ...flaggedOptions].find(opt => opt.id === activeFilter)?.label}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="mt-6 pt-4 border-t">
            <Button 
              variant="outline"
              onClick={() => setOpen(false)}
              className="shadow-sm hover:shadow-md transition-all duration-200 rounded-[12px]"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTest}
              disabled={numQuestions === 0}
              className={cn(
                "gap-2 shadow-sm hover:shadow-md transition-all duration-200 rounded-[12px]",
                numQuestions === 0 
                  ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed opacity-50" 
                  : "bg-emerald-600 hover:bg-emerald-700"
              )}
            >
              <Check size={16} />
              Create Test
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}