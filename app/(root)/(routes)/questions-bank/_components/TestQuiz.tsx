'use client';

import React from 'react';

const TestQuiz = () => {
  console.log('🧪 TestQuiz rendering...');
  
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Test Quiz Component</h2>
        <p className="text-gray-600">This is a test component to verify rendering works.</p>
      </div>
    </div>
  );
};

export default TestQuiz;



