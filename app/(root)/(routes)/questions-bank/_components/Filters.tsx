"use client";

import { Circle, Eye, EyeOff, RotateCw, X } from "lucide-react";
import { ExaminingAuthorityCard } from "./ExaminingAuthorityCard";
import { FilterTag } from "./FilterTag";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface FiltersProps {
  filters: {
    greenTag: boolean;
    redTag: boolean;
    orangeTag: boolean;
    seenInExam: boolean;
    neverSeen: boolean;
    wrongAnswer: boolean;
    lastExam: number;
    country: string | null;
  };
  onFilterChange: (filterName: string, value: boolean | number | string) => void;
  onClearFilters: () => void;
}

export const Filters = ({ filters, onFilterChange, onClearFilters }: FiltersProps) => {
  const handleCountryChange = (value: string | null) => {
    onFilterChange('country', value || '');
  };

  return (
    <div className="flex flex-col space-y-4">
      <h2 className="text-2xl font-semibold">Filters</h2>
      
      <div className="p-4 border border-primary/20 rounded-2xl">
        <div className="flex flex-col gap-6">
          {/* Authority Card - Hidden on mobile */}
          <div className="hidden md:block">
            <ExaminingAuthorityCard 
              selectedCountry={filters.country}
              onCountryChange={handleCountryChange}
            />
          </div>

          {/* Status Tags */}
          <div className="flex flex-wrap gap-2">
            {/* Mobile Choose Button */}
            <div className="flex md:hidden">
              <FilterTag icon={Circle} label="Choose" />
            </div>
          
            <FilterTag
              icon={Circle}
              label="Green tag"
              iconColor="text-green-600"
              active={filters.greenTag}
              activeBgColor="bg-green-600"
              activeTextColor="text-white"
              onClick={() => onFilterChange('greenTag', !filters.greenTag)}
            />
            <FilterTag 
              icon={Circle} 
              label="Red tag" 
              iconColor="text-red-600"
              active={filters.redTag}
              activeBgColor="bg-red-600"
              activeTextColor="text-white"
              onClick={() => onFilterChange('redTag', !filters.redTag)}
            />
            <FilterTag 
              icon={Circle} 
              label="Orange tag" 
              iconColor="text-orange-600"
              active={filters.orangeTag}
              activeBgColor="bg-orange-600"
              activeTextColor="text-white"
              onClick={() => onFilterChange('orangeTag', !filters.orangeTag)}
            />
            <FilterTag 
              icon={Eye} 
              label="Seen in exam" 
              iconColor="text-blue-400" 
              active={filters.seenInExam}
              activeBgColor="bg-blue-400"
              activeTextColor="text-white"
              onClick={() => {
                onFilterChange('seenInExam', !filters.seenInExam);
                onFilterChange('country', '0');
              }}
            />
            <FilterTag 
              icon={EyeOff} 
              label="I've never seen" 
              iconColor="text-[#EECE84]"
              active={filters.neverSeen}
              activeTextColor="text-white"
              onClick={() => onFilterChange('neverSeen', !filters.neverSeen)}
            />
            <FilterTag 
              icon={X} 
              label="I answered wrong" 
              iconColor="text-red-600" 
              active={filters.wrongAnswer}
              activeBgColor="bg-red-600"
              activeTextColor="text-white"
              onClick={() => onFilterChange('wrongAnswer', !filters.wrongAnswer)}
            />

            {/* Last Exam Select */}
            <div className="flex items-center gap-3 px-1 sm:px-1 mt-1">
              <label className="text-sm font-medium">Last Exam:</label>
              <Select
                value={filters.lastExam.toString()}
                onValueChange={(value) => onFilterChange('lastExam', parseInt(value, 10))}
              >
                <SelectTrigger className="w-32 rounded-[12px] border border-primary/20">
                  <SelectValue placeholder="Select exam" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="100">100</SelectItem>
                  <SelectItem value="200">200</SelectItem>
                  <SelectItem value="300">300</SelectItem>
                </SelectContent>
              </Select>
            </div>  
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <div className="flex justify-end">
        <FilterTag
          icon={RotateCw}
          label="Clear filters"
          iconColor="text-[#EECE84]"
          onClick={onClearFilters}
        />
      </div>
    </div>
  );
};