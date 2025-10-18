import React from 'react';
import { Button } from '@/components/ui/button';
import { GraduationCap, BookOpen } from 'lucide-react';

interface ModeSelectorProps {
  mode: 'tutor' | 'exam';
  onModeChange: (mode: 'tutor' | 'exam') => void;
}

export default function ModeSelector({ mode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      <Button
        variant={mode === 'tutor' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('tutor')}
        className={`flex items-center gap-2 ${
          mode === 'tutor' 
            ? 'bg-[#EECE84] text-black hover:bg-[#EECE84]/90' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <BookOpen className="w-4 h-4" />
        Tutor
      </Button>
      <Button
        variant={mode === 'exam' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModeChange('exam')}
        className={`flex items-center gap-2 ${
          mode === 'exam' 
            ? 'bg-[#EECE84] text-black hover:bg-[#EECE84]/90' 
            : 'text-gray-600 hover:text-gray-900'
        }`}
      >
        <GraduationCap className="w-4 h-4" />
        Exam
      </Button>
    </div>
  );
}
