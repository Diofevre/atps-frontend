import React from 'react';

interface FooterExamStateProps {
  topicName: string;
}

const FooterExamState: React.FC<FooterExamStateProps> = ({ topicName }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="backdrop-blur-3xl">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-end">
            <div className="px-4 py-2">
              <span className="text-sm font-medium bg-gradient-to-r from-slate-700 to-slate-900 bg-clip-text text-transparent">
                {topicName || 'Loading...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterExamState;