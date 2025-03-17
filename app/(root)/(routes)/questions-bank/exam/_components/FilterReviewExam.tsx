'use client'

import React from 'react';
import { Filter, Check, ChevronDown, CircleCheck, XCircle, HelpCircle } from 'lucide-react';

interface FilterAnswerProps {
  onFilterChange: (filter: string) => void;
}

const FilterReviewExam: React.FC<FilterAnswerProps> = ({ onFilterChange }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selected, setSelected] = React.useState('all');
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const options = [
    { value: 'all', label: 'All', icon: Filter },
    { value: 'correct', label: 'Correct', icon: CircleCheck },
    { value: 'incorrect', label: 'Wrong', icon: XCircle },
    { value: 'notAnswered', label: 'Not answered', icon: HelpCircle },
  ];

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    onFilterChange(value);
    setIsOpen(false);
  };

  const selectedOption = options.find(opt => opt.value === selected);
  const SelectedIcon = selectedOption?.icon || Filter;

  return (
    <div className="relative w-[240px]" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full group flex items-center gap-3 px-5 py-2.5
          bg-gradient-to-r from-[#EECE84]/80 to-white/50 text-black font-medium
          rounded-xl shadow-lg hover:shadow-xl
          transition-all duration-300 hover:-translate-y-0.5"
        >
        <div className="flex items-center gap-3 flex-1">
          <span className="p-1.5 bg-black/10 rounded-lg">
            <SelectedIcon className="w-4 h-4" />
          </span>
          <span className="text-sm font-semibold">{selectedOption?.label}</span>
        </div>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} opacity-70 group-hover:opacity-100`} 
        />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-3 py-1.5 bg-white 
          rounded-xl shadow-xl border border-gray-100"
        >
          {options.map((option) => {
            const Icon = option.icon;
            const isSelected = selected === option.value;
            return (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={`w-full px-4 py-2.5 text-left transition-all
                  flex items-center gap-3 group hover:bg-gray-50
                  ${isSelected ? 'bg-[#EECE84]/10' : ''}`}
                >
                <span className={`p-1.5 rounded-lg transition-colors ${isSelected ? 'bg-[#EECE84]' : 'bg-gray-100 group-hover:bg-gray-200'}`}>
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-gray-600'}`} />
                </span>
                <span className={`text-sm ${isSelected ? 'font-semibold text-black' : 'text-gray-600'}`}>
                  {option.label}
                </span>
                {isSelected && (
                  <Check className="w-4 h-4 ml-auto text-[#EECE84]" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default FilterReviewExam;