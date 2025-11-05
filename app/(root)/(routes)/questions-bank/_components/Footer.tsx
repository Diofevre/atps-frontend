import React, { useState } from 'react';
import { Eye, LayoutPanelLeft, MessageCircleMore, Sparkles, BookOpen, Plane, Calculator, FileText } from 'lucide-react';

interface FooterStateProps {
  onContentChange?: (index: number) => void;
  onFlyComputerToggle?: () => void;
  onAIToggle?: () => void;
  onCalculatorToggle?: () => void;
  onAnnexesToggle?: () => void;
  topicName: string;
  isFlyComputerOpen?: boolean;
  isAIOpen?: boolean;
  isCalculatorOpen?: boolean;
  isAnnexesOpen?: boolean;
}

const FooterState: React.FC<FooterStateProps> = ({ 
  onContentChange, 
  onFlyComputerToggle, 
  onAIToggle, 
  onCalculatorToggle, 
  onAnnexesToggle, 
  topicName, 
  isFlyComputerOpen = false, 
  isAIOpen = false, 
  isCalculatorOpen = false,
  isAnnexesOpen = false 
}) => {
  const [selectedContent, setSelectedContent] = useState<number>(0);

  const handleButtonClick = (index: number): void => {
    setSelectedContent(index);
    onContentChange?.(index);
  };

  const handleFlyComputerToggle = (): void => {
    onFlyComputerToggle?.();
  };

  const handleAIToggle = (): void => {
    onAIToggle?.();
  };

  const handleCalculatorToggle = (): void => {
    onCalculatorToggle?.();
  };

  const handleAnnexesToggle = (): void => {
    onAnnexesToggle?.();
  };

  return (
    <div className="fixed left-0 right-0 z-50" style={{ bottom: 0 }}>
      <div className="backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[
                { icon: <LayoutPanelLeft className="w-5 h-5" />, label: "Overview" },
                { icon: <BookOpen className="w-5 h-5" />, label: "Explanation" },
                { icon: <Sparkles className="w-5 h-5" />, label: "AI" },
                { icon: <Plane className="w-5 h-5" />, label: "Fly Computer", isToggle: true },
                { icon: <Calculator className="w-5 h-5" />, label: "Calculator", isToggle: true },
                { icon: <FileText className="w-5 h-5" />, label: "Annexes", isToggle: true },
                { icon: <MessageCircleMore className="w-5 h-5" />, label: "Comments" },
                { icon: <Eye className="w-5 h-5" />, label: "Preview" },
              ].map((item, index) => {
                const isFlyComputer = item.label === "Fly Computer";
                const isAI = item.label === "AI";
                const isCalculator = item.label === "Calculator";
                const isAnnexes = item.label === "Annexes";
                // Ajuster l'index pour le mapping correct avec QuizzComponents
                const adjustedIndex = index > 5 ? index - 3 : index > 4 ? index - 2 : index > 3 ? index - 1 : index; // Fly Computer, Calculator et Annexes n'ont pas d'index dans selectedContent
                const isActive = isFlyComputer ? isFlyComputerOpen : isAI ? isAIOpen : isCalculator ? isCalculatorOpen : isAnnexes ? isAnnexesOpen : selectedContent === adjustedIndex;
                
                return (
                  <button
                    key={index}
                    onClick={() => {
                      if (isFlyComputer) {
                        handleFlyComputerToggle();
                      } else if (isAI) {
                        handleAIToggle();
                      } else if (isCalculator) {
                        handleCalculatorToggle();
                      } else if (isAnnexes) {
                        handleAnnexesToggle();
                      } else {
                        handleButtonClick(adjustedIndex);
                      }
                    }}
                    className={`
                      group flex items-center gap-2 px-4 py-2 rounded-[12px] transition-all duration-300
                      ${isActive
                        ? 'bg-gradient-to-r from-[#EECE84] to-[#EECE84]/50 text-black dark:text-gray-900 shadow-lg shadow-blue-500/25'
                        : 'hover:bg-[#EECE84] text-slate-600 dark:text-text-secondary hover:text-slate-900 dark:hover:text-white'
                      }
                    `}
                  >
                    <span className="text-sm font-medium">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterState;