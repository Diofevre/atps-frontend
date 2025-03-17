import React, { useState } from 'react';
import { Eye, LayoutPanelLeft, MessageCircleMore, Sparkles, BookOpen } from 'lucide-react';

interface FooterStateProps {
  onContentChange?: (index: number) => void;
  topicName: string;
}

const FooterState: React.FC<FooterStateProps> = ({ onContentChange, topicName }) => {
  const [selectedContent, setSelectedContent] = useState<number>(0);

  const handleButtonClick = (index: number): void => {
    setSelectedContent(index);
    onContentChange?.(index);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {[
                { icon: <LayoutPanelLeft className="w-5 h-5" />, label: "Overview" },
                { icon: <BookOpen className="w-5 h-5" />, label: "Explanation" },
                { icon: <Sparkles className="w-5 h-5" />, label: "AI" },
                { icon: <MessageCircleMore className="w-5 h-5" />, label: "Comments" },
                { icon: <Eye className="w-5 h-5" />, label: "Preview" },
              ].map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleButtonClick(index)}
                  className={`
                    group flex items-center gap-2 px-4 py-2 rounded-[12px] transition-all duration-300
                    ${selectedContent === index
                      ? 'bg-gradient-to-r from-[#EECE84] to-[#EECE84]/50 text-black shadow-lg shadow-blue-500/25'
                      : 'hover:bg-[#EECE84] text-slate-600 hover:text-slate-900'
                    }
                  `}
                >
                  <span className={`
                    transition-transform duration-300
                    ${selectedContent === index ? 'scale-110' : 'group-hover:scale-110'}
                  `}>
                    {item.icon}
                  </span>
                  <span className="hidden sm:block text-sm font-medium">
                    {item.label}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex items-center">
              <div className="px-4 py-2">
                <span className="text-sm font-medium bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                  {topicName || 'Loading...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterState;