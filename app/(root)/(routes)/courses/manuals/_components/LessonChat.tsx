'use client';

import React, { useCallback, useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import { Send, Loader2, MessageSquareText, Pencil, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth, useUser } from '@clerk/nextjs';
import Image from 'next/image';
import AviationThumbnail from '@/components/AviationThumbnail';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id?: number;
}

interface ChatLog {
  id: number;
  user_question: string;
  ai_response: string;
  user_id: string;
  updated_at: string;
}

interface LessonChatProps {
  pageId: number;
}

export default function LessonChat({ pageId }: LessonChatProps) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userInitial = user?.firstName?.[0] || 'A';

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchChatLogs = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat_lessons/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch chat logs');
      
      const data = await response.json();
      
      console.log('Raw data from backend (LessonChat):', data);
      
      const initialMessages: Message[] = [];
      
      // Les logs sont déjà triés par le backend (plus récent en premier)
      // On les inverse pour avoir l'ordre chronologique (plus ancien en premier)
      const sortedLogs = data.reverse();
      
      console.log('Reversed logs (LessonChat):', sortedLogs);
      
      sortedLogs.forEach((log: ChatLog) => {
        if (log.user_question) {
          initialMessages.push({ role: 'user', content: log.user_question, id: log.id });
        }
        if (log.ai_response) {
          initialMessages.push({ role: 'assistant', content: log.ai_response });
        }
      });
      setMessages(initialMessages);
    } catch (error) {
      console.error('Error fetching chat logs:', error);
    }
  }, [getToken]);
  
  useEffect(() => {
    fetchChatLogs();
  }, [pageId, fetchChatLogs]);

  // Effet pour remplacer les conteneurs aviation par des composants React
  useEffect(() => {
    const replaceAviationThumbnails = () => {
      const containers = document.querySelectorAll('.aviation-thumbnail-container');
      containers.forEach((container) => {
        const src = container.getAttribute('data-src');
        const alt = container.getAttribute('data-alt');
        const assetId = container.getAttribute('data-asset-id');
        
        if (src && alt && assetId) {
          // Créer un élément React pour le thumbnail
          const thumbnailElement = document.createElement('div');
          thumbnailElement.className = 'aviation-thumbnail-wrapper';
          
          // Remplacer le conteneur par le wrapper
          container.parentNode?.replaceChild(thumbnailElement, container);
          
          // Rendre le composant React dans le wrapper
          const root = ReactDOM.createRoot(thumbnailElement);
          root.render(
            <AviationThumbnail 
              src={src} 
              alt={alt} 
              title={alt}
            />
          );
        }
      });
    };

    // Exécuter après chaque mise à jour des messages
    const timeoutId = setTimeout(replaceAviationThumbnails, 100);
    
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const updateMessage = async (logId: number, newMessage: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat_lessons/logs/${logId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          newMessage,
          page_id: pageId
        })
      });

      if (!response.ok) throw new Error('Failed to update message');

      setMessages(prevMessages => {
        const messageIndex = prevMessages.findIndex(msg => msg.id === logId);
        if (messageIndex === -1) return prevMessages;
        
        const updatedMessages = prevMessages.slice(0, messageIndex + 1);
        updatedMessages[messageIndex] = { ...updatedMessages[messageIndex], content: newMessage };
        return updatedMessages;
      });

      const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat_lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: newMessage,
          page_id: pageId
        }),
      });

      if (!aiResponse.ok) throw new Error('Failed to get AI response');

      const data = await aiResponse.json();
      
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: data.response
      }]);

    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const handleEditStart = (message: Message) => {
    if (message.id) {
      setEditingMessageId(message.id);
      setEditContent(message.content);
    }
  };

  const handleEditSave = async () => {
    if (editingMessageId && editContent.trim()) {
      await updateMessage(editingMessageId, editContent);
      setEditingMessageId(null);
      setEditContent('');
    }
  };

  const handleEditCancel = () => {
    setEditingMessageId(null);
    setEditContent('');
  };

  const sendMessage = async () => {
    const token = await getToken();
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage: Message = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat_lessons`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: input,
          page_id: pageId
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      const aiMessage: Message = {
        role: 'assistant',
        content: data.response
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 rounded-xl shadow-sm chat-container">
      <style jsx>{`
        .prose {
          word-wrap: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }
        .prose table {
          table-layout: auto;
          width: 100%;
          min-width: 100%;
        }
        .prose td, .prose th {
          word-wrap: break-word;
          overflow-wrap: break-word;
          min-width: 0;
          max-width: none;
          white-space: normal;
        }
        .prose td {
          vertical-align: top;
        }
        .message-container {
          max-width: 100%;
          overflow: hidden;
        }
        @media (max-width: 640px) {
          .message-container {
            max-width: 90%;
          }
        }
        .chat-message-container {
          max-width: 60% !important;
          width: auto !important;
        }
        @media (max-width: 768px) {
          .chat-message-container {
            max-width: 70% !important;
          }
        }
        @media (max-width: 480px) {
          .chat-message-container {
            max-width: 80% !important;
          }
        }
        .chat-container {
          max-width: 100%;
          overflow-x: hidden;
        }
      `}</style>
      {/* Chat Header */}
      <div className="px-4 py-3 border-b bg-white rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image src="/ai.png" alt="AI Assistant" className="w-6 h-6" width={24} height={24} />
            <h2 className="font-semibold text-gray-900">Lesson Assistant</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-500 flex items-center gap-1">
              {messages.length}
              <MessageSquareText className="w-5 h-5 mt-1 text-[#EECE84]" />
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4">
        <div className="flex flex-col h-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[40vh] text-center space-y-4 text-gray-500">
              <Image src="/ai.png" alt="AI Assistant" className="w-16 h-16" width={64} height={64} />
              <div>
                <p className="font-medium">How can I help you?</p>
                <p className="text-sm">Ask me anything about this lesson</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-end space-y-6 max-w-full overflow-x-hidden">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 group chat-message-container mr-auto"
                  style={{ maxWidth: '60%' }}
                >
                  <Avatar className={cn(
                    "w-8 h-8",
                    message.role === 'assistant' 
                      ? "bg-white p-1" 
                      : "bg-gray-700"
                  )}>
                    {message.role === 'assistant' ? (
                      <Image src="/ai.png" alt="AI" className="w-full h-full object-contain" width={32} height={32} />
                    ) : (
                      <AvatarImage src={user?.imageUrl} alt={user?.firstName || 'User'} />
                    )}
                    <AvatarFallback className="text-white">
                      {message.role === 'assistant' ? '' : userInitial}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 relative group message-container">
                    {editingMessageId === message.id ? (
                      <div className="flex flex-col gap-2">
                        <Textarea
                          value={editContent}
                          onChange={(e) => setEditContent(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              handleEditSave();
                            } else if (e.key === 'Escape') {
                              handleEditCancel();
                            }
                          }}
                          className="min-h-[60px] resize-none rounded-xl border-gray-200"
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={handleEditCancel}
                            className="h-8 px-2"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={handleEditSave}
                            className="h-8 px-2 bg-[#EECE84] hover:bg-[#EECE84]/90"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {message.role === 'user' && message.id && (
                          <div className="absolute left-0 -ml-8 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditStart(message)}
                              className="h-6 w-6 p-0"
                            >
                              <Pencil className="h-3 w-3" />
                            </Button>
                          </div>
                        )}
                        <div className={cn(
                          "rounded-2xl px-4 py-3 w-full",
                          message.role === 'assistant' 
                            ? "bg-white shadow-sm rounded-bl-none" 
                            : "bg-[#EECE84] text-white rounded-br-none"
                        )}>
                          <div 
                            className="text-[15px] leading-relaxed break-words overflow-wrap-anywhere"
                            dangerouslySetInnerHTML={{ 
                              __html: formatMarkdown(message.content) 
                            }}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-3 mr-auto chat-message-container" style={{ maxWidth: '60%' }}>
                  <Avatar className="w-8 h-8 bg-white p-1">
                    <Image src="/ai.png" alt="AI" className="w-full h-full object-contain" width={32} height={32} />
                    <AvatarFallback></AvatarFallback>
                  </Avatar>
                  <div className="bg-white rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="p-4 border-t bg-white rounded-b-xl">
        <div className="relative">
          <Textarea
            placeholder="Ask about this lesson..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="min-h-[60px] max-h-[120px] resize-none rounded-xl border-gray-200 pr-12"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
            className={cn(
              "absolute right-2 bottom-2 h-8 w-8 rounded-lg transition-colors shrink-0",
              input.trim() 
                ? "bg-[#EECE84] hover:bg-[#EECE84]/90" 
                : "bg-[#EECE84] cursor-not-allowed"
            )}
          >
            <Send className="h-4 w-4 text-black" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Fonction utilitaire pour formater le markdown avancé
function formatMarkdown(text: string): string {
  if (!text) return '';
  
  let html = text;
  
  // Images aviation (détecter les URLs d'assets aviation)
  html = html.replace(
    /!\[([^\]]*)\]\((http:\/\/localhost:8000\/api\/aviation-assets\/asset\/[^)]+)\)/g,
    (match, alt, src) => {
      const assetId = src.split('/').pop();
      return `<div class="aviation-thumbnail-container inline-block my-2" data-src="${src}" data-alt="${alt}" data-asset-id="${assetId}"></div>`;
    }
  );

  // Images markdown classiques
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" onerror="this.src=\'/placeholder-image.png\'" />'
  );

  // Liens
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');

  // Gras
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  
  // Italique
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  // Saut de ligne (convertir \n en <br> seulement si ce n'est pas déjà dans une balise HTML)
  html = html.replace(/\n(?![^<]*>)/g, '<br>');

  // Nettoyer les <br> en trop
  html = html.replace(/(<br>\s*){3,}/g, '<br><br>');
  html = html.replace(/<br>\s*(<\/[^>]+>)/g, '$1');
  html = html.replace(/(<[^>]+>)\s*<br>/g, '$1');

  return html;
}