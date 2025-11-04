'use client'

import React from 'react';
import { MessageSquareOff } from 'lucide-react';

// Page community désactivée - fonctionnalité en cours de migration
const Community = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <MessageSquareOff className="w-16 h-16 mx-auto text-muted-foreground" />
        <h1 className="text-2xl font-semibold text-foreground dark:text-white">Community Feature</h1>
        <p className="text-text-secondary dark:text-white/80">This feature is currently under maintenance.</p>
      </div>
    </div>
  );
};

export default Community;
