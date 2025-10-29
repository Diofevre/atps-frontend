'use client'

import React from 'react';
import { MessageSquareOff } from 'lucide-react';

// Page community désactivée - fonctionnalité en cours de migration
const Community = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <MessageSquareOff className="w-16 h-16 mx-auto text-gray-400" />
        <h1 className="text-2xl font-semibold text-gray-900">Community Feature</h1>
        <p className="text-gray-600">This feature is currently under maintenance.</p>
      </div>
    </div>
  );
};

export default Community;
