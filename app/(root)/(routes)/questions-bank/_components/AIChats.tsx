import React, { useCallback, useEffect, useState, useRef, useMemo, memo } from 'react';
import ReactDOM from 'react-dom/client';
import { Send, Loader2, MessageSquareText, Pencil, Check, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth, useUser } from '@/lib/mock-clerk';
import Image from 'next/image';
import ModeSelector from './ModeSelector';
import AviationThumbnail from '@/components/AviationThumbnail';
import SVGRenderer, { extractSVGFromContent, removeSVGFromContent } from '@/components/SVGRenderer';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  id?: number;
  citations?: Array<{
    id: string;
    type: string;
    score: number;
  }>;
  intent?: string;
  diagrams?: Array<{
    type: string;
    svg: string;
    title?: string;
  }>;
  images?: Array<{
    id: string;
    url: string;
    title: string;
    source: string;
    license: string;
    approved: boolean;
    thumbnail: string;
  }>;
}

interface ChatLog {
  id: number;
  user_question: string;
  ai_response: string;
  status: 'success' | 'error';
  error_message: string | null;
  created_at: string;
}

interface ChatPageProps {
  questionId: number;
}

// Composant mémorisé pour les messages
const ChatMessage = memo(({ 
  message, 
  user, 
  userInitial, 
  editingMessageId, 
  editContent, 
  setEditContent, 
  handleEditStart, 
  handleEditSave, 
  handleEditCancel 
}: {
  message: Message;
  user: any;
  userInitial: string;
  editingMessageId: number | null;
  editContent: string;
  setEditContent: (content: string) => void;
  handleEditStart: (message: Message) => void;
  handleEditSave: () => void;
  handleEditCancel: () => void;
}) => {
  const formattedContent = useMemo(() => formatMarkdown(message.content), [message.content]);

  return (
    <div className="flex items-start gap-3 mb-4">
      <Avatar className={cn(
        "w-8 h-8 flex-shrink-0",
        message.role === 'assistant' 
          ? "bg-white p-1" 
          : "bg-gray-700"
      )}>
        {message.role === 'assistant' ? (
          <Image src="/ai.png" alt="ATPS" className="w-full h-full object-contain" width={24} height={24} />
        ) : (
          <AvatarImage src={user?.imageUrl || undefined} alt={user?.firstName || 'User'} />
        )}
        <AvatarFallback className="text-white">
          {message.role === 'assistant' ? '' : userInitial}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
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
            <div className="flex gap-2">
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
              <div className="text-[15px] leading-relaxed break-words">
                {message.role === 'assistant' ? (
                  <div className="w-full">
                    <div 
                      className="prose prose-sm w-full break-words"
                      dangerouslySetInnerHTML={{ 
                        __html: formattedContent
                      }}
                    />
                    {message.diagrams && message.diagrams.length > 0 && (
                      <div className="mt-4 space-y-3">
                        {message.diagrams.map((diagram, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <div 
                              className="max-w-full overflow-x-auto"
                              dangerouslySetInnerHTML={{ __html: diagram.svg }}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    {message.images && message.images.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <h4 className="text-sm font-medium text-gray-700">Images:</h4>
                        {message.images.map((image, index) => (
                          <div key={index} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-start gap-3">
                              <img 
                                src={`${process.env.NEXT_PUBLIC_API_URL}${image.thumbnail}`}
                                alt={image.title}
                                className="w-24 h-24 object-cover rounded-lg"
                                        onError={(e) => {
                                          e.currentTarget.src = '/placeholder-image.svg';
                                        }}
                              />
                              <div className="flex-1">
                                <h5 className="font-medium text-sm text-gray-900">{image.title}</h5>
                                <p className="text-xs text-gray-600 mt-1">
                                  Source: {image.source}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  License: {image.license}
                                </p>
                                {!image.approved && (
                                  <span className="inline-block px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded mt-1">
                                    Pending Approval
                                  </span>
                                )}
                                <div className="mt-2 flex gap-2">
                                  <a 
                                    href={image.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-xs text-blue-600 hover:text-blue-800 underline"
                                  >
                                    View Original
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <h4 className="text-sm font-medium text-gray-700">Citations:</h4>
                        {message.citations.map((citation, index) => (
                          <div key={index} className="bg-blue-50 rounded-lg p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                {citation.type}
                              </span>
                              <span className="text-xs text-blue-600">
                                Score: {citation.score}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-white break-words">
                    {message.content}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
});

export default function ChatPage({ questionId }: ChatPageProps) {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [mode, setMode] = useState<'tutor' | 'exam'>('tutor');
  const [language, setLanguage] = useState('fr');
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const userInitial = user?.firstName?.[0] || 'A';

  // Liste des langues disponibles avec drapeaux
  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Português', flag: '🇵🇹' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ja', name: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
    { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
    { code: 'no', name: 'Norsk', flag: '🇳🇴' },
    { code: 'da', name: 'Dansk', flag: '🇩🇰' },
    { code: 'fi', name: 'Suomi', flag: '🇫🇮' },
    { code: 'pl', name: 'Polski', flag: '🇵🇱' },
    { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
    { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  ];

  const selectedLanguage = languages.find(lang => lang.code === language) || languages[0];

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Ensure we land at the bottom when the chat mounts (e.g., when opening the overlay)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      scrollToBottom();
    }, 0);
    return () => clearTimeout(timeoutId);
  }, []);

  const fetchChatLogs = useCallback(async () => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch chat logs');
      
      const data = await response.json();
      
      console.log('Raw data from backend:', data);
      
      const initialMessages: Message[] = [];
      
      // Les logs sont déjà triés par le backend (plus récent en premier)
      // On les inverse pour avoir l'ordre chronologique (plus ancien en premier)
      const sortedLogs = data.reverse();
      
      console.log('Reversed logs:', sortedLogs);
      
      sortedLogs.forEach((log: ChatLog) => {
        if (log.user_question) {
          initialMessages.push({ role: 'user', content: log.user_question, id: log.id });
        }
        if (log.ai_response) {
          initialMessages.push({ role: 'assistant', content: log.ai_response });
        }
      });
      setMessages(initialMessages);
      // After initial load, ensure we are scrolled to the latest message
      setTimeout(scrollToBottom, 0);
    } catch (error) {
      console.error('Error fetching chat logs:', error);
    }
  }, [getToken]);
  
  useEffect(() => {
    fetchChatLogs();
  }, [questionId, fetchChatLogs]);

  // Fermer le dropdown de langue quand on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isLanguageDropdownOpen) {
        const target = event.target as HTMLElement;
        if (!target.closest('.language-dropdown')) {
          setIsLanguageDropdownOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLanguageDropdownOpen]);

  // Effet pour remplacer les conteneurs aviation et SVG par des composants React
  useEffect(() => {
    const replaceAviationThumbnails = () => {
      const containers = document.querySelectorAll('.aviation-thumbnail-container:not(.processed)');
      containers.forEach((container) => {
        const src = container.getAttribute('data-src');
        const alt = container.getAttribute('data-alt');
        const assetId = container.getAttribute('data-asset-id');
        
        if (src && alt && assetId) {
          // Marquer comme traité pour éviter les re-traitements
          container.classList.add('processed');
          
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

    const replaceSVGPlaceholders = () => {
      const placeholders = document.querySelectorAll('.svg-placeholder:not(.processed)');
      placeholders.forEach((placeholder) => {
        const svgIndex = placeholder.getAttribute('data-svg-index');
        if (svgIndex !== null) {
          // Trouver le message correspondant qui contient ce SVG
          const messageElement = placeholder.closest('.prose');
          if (messageElement) {
            const messageIndex = Array.from(messageElement.parentElement?.parentElement?.parentElement?.children || [])
              .indexOf(messageElement.parentElement?.parentElement?.parentElement as Element);
            
            if (messageIndex >= 0 && messages[messageIndex]) {
              const svgMatches = extractSVGFromContent(messages[messageIndex].content);
              const svgContent = svgMatches[parseInt(svgIndex)];
              
              if (svgContent) {
                // Marquer comme traité
                placeholder.classList.add('processed');
                
                // Créer un élément React pour le SVG
                const svgElement = document.createElement('div');
                svgElement.className = 'svg-wrapper';
                
                // Remplacer le placeholder par le wrapper
                placeholder.parentNode?.replaceChild(svgElement, placeholder);
                
                // Rendre le composant React dans le wrapper
                const root = ReactDOM.createRoot(svgElement);
                root.render(
                  <SVGRenderer 
                    svgContent={svgContent}
                    title={`Diagram ${parseInt(svgIndex) + 1}`}
                  />
                );
              }
            }
          }
        }
      });
    };

    // Exécuter après chaque mise à jour des messages
    const timeoutId = setTimeout(() => {
      replaceAviationThumbnails();
      replaceSVGPlaceholders();
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [messages]);

  const updateMessage = useCallback(async (logId: number, newMessage: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat/logs/${logId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          newMessage
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

      const aiResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: newMessage,
          question_id: questionId
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
  }, [getToken, setMessages]);

  const handleEditStart = useCallback((message: Message) => {
    if (message.id) {
      setEditingMessageId(message.id);
      setEditContent(message.content);
    }
  }, []);

  const handleEditSave = useCallback(async () => {
    if (editingMessageId && editContent.trim()) {
      await updateMessage(editingMessageId, editContent);
      setEditingMessageId(null);
      setEditContent('');
    }
  }, [editingMessageId, editContent, updateMessage]);

  const handleEditCancel = useCallback(() => {
    setEditingMessageId(null);
    setEditContent('');
  }, []);

  const sendMessage = async () => {
    const token = await getToken();
    if (!input.trim() || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage: Message = { role: 'user', content: input };
      setMessages(prev => [...prev, userMessage]);
      setInput('');

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat-intelligent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: input,
          question_id: questionId,
          mode: mode,
          language: language
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      
      // Extraire les diagrammes et images de la réponse si présents
      const diagrams = data.diagrams || [];
      const images = data.images || [];
      
      const aiMessage: Message = {
        role: 'assistant',
        content: data.response,
        citations: data.citations,
        intent: data.intent,
        diagrams: diagrams,
        images: images
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
        .prose pre {
          white-space: pre-wrap;
          word-wrap: break-word;
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
        .prose {
          word-break: break-word;
          overflow-wrap: break-word;
          hyphens: auto;
        }
        .prose p, .prose div, .prose span {
          word-break: break-word;
          overflow-wrap: break-word;
          white-space: normal;
        }
        .prose pre, .prose code {
          word-break: break-word;
          overflow-wrap: break-word;
          white-space: pre-wrap;
        }
      `}</style>
      {/* Chat Header */}
      <div className="px-4 py-3 border-b bg-white rounded-t-xl">
        <div className="flex items-center justify-center gap-3">
          <ModeSelector mode={mode} onModeChange={setMode} />
          
          {/* Language Dropdown */}
          <div className="relative language-dropdown">
            <button
              onClick={() => setIsLanguageDropdownOpen(!isLanguageDropdownOpen)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <span className="text-lg">{selectedLanguage.flag}</span>
              <span className="text-sm font-medium text-gray-700">{selectedLanguage.name}</span>
              <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isLanguageDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isLanguageDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto min-w-[200px]">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      setLanguage(lang.code);
                      setIsLanguageDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${
                      language === lang.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                    {language === lang.code && (
                      <Check className="w-4 h-4 text-blue-600 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Area - Réécrit complètement */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[40vh] text-center space-y-4 text-gray-500">
              <Image src="/ai.png" alt="ATPS" className="w-16 h-16" width={24} height={24} />
              <div>
                <p className="font-medium">How can I help you?</p>
                <p className="text-sm">Ask me anything about this question</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message, index) => (
                <ChatMessage
                  key={message.id || `${message.role}-${index}-${message.content.slice(0, 50)}`}
                  message={message}
                  user={user}
                  userInitial={userInitial}
                  editingMessageId={editingMessageId}
                  editContent={editContent}
                  setEditContent={setEditContent}
                  handleEditStart={handleEditStart}
                  handleEditSave={handleEditSave}
                  handleEditCancel={handleEditCancel}
                />
              ))}
              {isLoading && (
                <div className="flex items-start gap-3">
                  <Avatar className="w-8 h-8 bg-white p-1">
                    <Image src="/ai.png" alt="ATPS" className="w-full h-full object-contain" width={24} height={24} />
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
      </div>

      {/* Input Area */}
      <div className="p-2 border-t bg-white rounded-b-xl">
        <div className="relative">
          <Textarea
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && input.trim()) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="min-h-[40px] max-h-[80px] resize-none rounded-xl border-gray-200 pr-10"
          />
          <Button
            onClick={sendMessage}
            disabled={isLoading || !input.trim()}
            size="icon"
            className={cn(
              "absolute right-1 bottom-1 h-6 w-6 rounded-lg transition-colors shrink-0",
              input.trim() 
                ? "bg-[#EECE84] hover:bg-[#EECE84]/90" 
                : "bg-[#EECE84] cursor-not-allowed"
            )}
          >
            <Send className="h-3 w-3 text-black" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// Fonction utilitaire pour formater le markdown avancé avec support SVG
function formatMarkdown(text: string): string {
  if (!text) return '';
  
  let html = text;
  
  // Détecter et remplacer les SVG par des placeholders
  const svgMatches = extractSVGFromContent(text);
  svgMatches.forEach((svg, index) => {
    const placeholder = `<div class="svg-placeholder" data-svg-index="${index}"></div>`;
    html = html.replace(svg, placeholder);
  });
  
  // Tableaux (markdown simple)
  html = html.replace(
    /^(\|.*\|)\n(\|[-:\s|]+\|)\n((?:\|.*\|\n?)*)/gm,
    (match, header, separator, rows) => {
      const headerCells = header.split('|').slice(1, -1).map((cell: string) => 
        `<th class="px-3 py-2 text-left font-medium text-gray-900 bg-gray-50 border-b break-words min-w-0 max-w-none">${cell.trim()}</th>`
      ).join('');
      
      const rowLines = rows.trim().split('\n').filter((line: string) => line.trim());
      const tableRows = rowLines.map((row: string) => {
        const cells = row.split('|').slice(1, -1).map((cell: string) => {
          const cellContent = cell.trim();
          // Si le contenu est très long, ajouter des styles spéciaux
          const isLongContent = cellContent.length > 50;
          const cellClass = isLongContent 
            ? "px-3 py-2 border-b break-words min-w-0 max-w-none whitespace-normal"
            : "px-3 py-2 border-b break-words min-w-0";
          return `<td class="${cellClass}">${cellContent}</td>`;
        }).join('');
        return `<tr>${cells}</tr>`;
      }).join('');
      
      return `
        <div class="overflow-x-auto my-4 max-w-full">
          <table class="w-full border border-gray-200 rounded-lg break-words" style="table-layout: auto; min-width: 100%;">
            <thead>
              <tr>${headerCells}</tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      `;
    }
  );

  // Code blocks (```code```)
  html = html.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    '<pre class="bg-gray-100 p-3 rounded-lg overflow-x-auto my-3 max-w-full break-words"><code class="text-sm break-words">$2</code></pre>'
  );

  // Code inline
  html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>');

  // Gras
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
  
  // Italique
  html = html.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');

  // Listes numérotées
  html = html.replace(
    /^(\d+\.\s.*(?:\n(?!(?:\d+\.|\n)).*)*)/gm,
    (match) => {
      const items = match.split('\n').map(line => {
        const text = line.replace(/^\d+\.\s/, '').trim();
        return text ? `<li class="mb-1">${text}</li>` : '';
      }).filter(item => item).join('');
      
      return `<ol class="list-decimal list-inside my-3 space-y-1">${items}</ol>`;
    }
  );

  // Listes à puces
  html = html.replace(
    /^([-\*\+]\s.*(?:\n(?![-\*\+\n]).*)*)/gm,
    (match) => {
      const items = match.split('\n').map(line => {
        const text = line.replace(/^[-\*\+]\s/, '').trim();
        return text ? `<li class="mb-1">${text}</li>` : '';
      }).filter(item => item).join('');
      
      return `<ul class="list-disc list-inside my-3 space-y-1">${items}</ul>`;
    }
  );

  // Titres
  html = html.replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mt-5 mb-3">$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mt-6 mb-4">$1</h1>');

  // Citations/blockquotes
  html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-3">$1</blockquote>');

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
    '<img src="$2" alt="$1" class="max-w-full h-auto rounded-lg my-2" onerror="this.src=\'/placeholder-image.svg\'" />'
  );

  // Liens
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:text-blue-800 underline" target="_blank" rel="noopener noreferrer">$1</a>');

  // Saut de ligne (convertir \n en <br> seulement si ce n'est pas déjà dans une balise HTML)
  html = html.replace(/\n(?![^<]*>)/g, '<br>');

  // Nettoyer les <br> en trop
  html = html.replace(/(<br>\s*){3,}/g, '<br><br>');
  html = html.replace(/<br>\s*(<\/[^>]+>)/g, '$1');
  html = html.replace(/(<[^>]+>)\s*<br>/g, '$1');

  return html;
}