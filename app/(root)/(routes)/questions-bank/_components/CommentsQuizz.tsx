'use client';

import { Textarea } from '@/components/ui/textarea';
import { formatDate } from '@/lib/utils';
import { useAuth, UserButton, useUser } from '@/lib/mock-clerk';
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, ThumbsUp, ThumbsDown, Send, Pencil, Trash2, Flag, Loader2 } from 'lucide-react';
import ReportModal from '@/components/shared/ReportModal';
import { toast } from 'sonner';

interface CommentsQuizzProps {
  questionId: number;
  userId: string;
}

interface Comment {
  id: number;
  user_id: string;
  content: string;
  created_at: string;
  likes: number;
  dislikes: number;
  userReaction?: 'like' | 'dislike' | null;
}

const CommentsQuizz: React.FC<CommentsQuizzProps> = ({ questionId, userId }) => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedCommentId, setSelectedCommentId] = useState<number | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editedContent, setEditedContent] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);

  const fetchComments = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/list/${questionId}`);
      if (!response.ok) throw new Error('Error fetching comments');
      const data = await response.json();
      setComments(data.comments);
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Failed to load comments. Please refresh the page.');
    }
  }, [questionId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    const token = await getToken();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/create`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ userId, questionId, content: newComment }),
      });
      
      if (!response.ok) throw new Error('Error sending comment');
      
      const data = await response.json();
      setComments(prev => [...prev, { ...data.comment, likes: 0, dislikes: 0, userReaction: null }]);
      setNewComment('');
      toast.success('Comment posted successfully!');
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Failed to post comment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (commentId: number, type: 'like' | 'dislike') => {
    const token = await getToken();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reactions/create`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, commentId, type }),
      });
      
      if (!response.ok) throw new Error('Error updating reaction');
      
      await fetchComments();
      toast.success(`${type === 'like' ? 'Liked' : 'Disliked'} comment successfully!`);
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Failed to update reaction. Please try again.');
    }
  };

  const handleEditComment = async (commentId: number, newContent: string) => {
    if (!newContent.trim()) {
      toast.error('Comment cannot be empty');
      return;
    }

    const token = await getToken();
    setIsEditing(true);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/update/${commentId}`, {
        method: 'PUT',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newContent }),
      });
      
      if (!response.ok) throw new Error('Error updating comment');
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId ? { ...comment, content: newContent } : comment
      ));
      setEditingCommentId(null);
      setEditedContent('');
      toast.success('Comment updated successfully!');
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Failed to update comment. Please try again.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    const token = await getToken();
    setIsDeleting(commentId);
    
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/comments/${commentId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) throw new Error('Error deleting comment');
      
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      setShowDeleteConfirm(null);
      toast.success('Comment deleted successfully!');
    } catch (error) {
      console.error('API Error:', error);
      toast.error('Failed to delete comment. Please try again.');
    } finally {
      setIsDeleting(null);
    }
  };

  const handleSubmitReport = async (report: { userId: string; categorie: string; contenu: string }) => {
    const token = await getToken();

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/reports`, {
        method: "POST",
        headers: { 
          'Authorization': `Bearer ${token}`,
          "Content-Type": "application/json" 
        },
        body: JSON.stringify(report),
      });

      if (!response.ok) throw new Error("Failed to submit the report.");

      toast.success("Report submitted successfully!");
      setSelectedCommentId(null);
    } catch (error) {
      console.error("Error submitting report:", error);
      toast.error("Failed to submit the report. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-10">
      {/* Header */}
      <div className="flex items-center gap-3 bg-white/90 p-4 rounded-2xl shadow-sm border border-[#EECE84]/50">
        <div className="bg-[#EECE84]/80 rounded-full p-3">
          <MessageCircle className="w-5 h-5" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-800">Comments</h2>
      </div>

      {/* Comments List */}
      <div className="space-y-4 my-6">
        <AnimatePresence mode="popLayout">
          {comments.length > 0 ? (
            comments.map((comment, index) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6"
              >
                <div className="flex flex-col space-y-3">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <UserButton />
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800">
                          {user?.lastName || 'Anonymous'}
                        </span>
                        <span className="text-sm text-gray-500">
                          {comment.created_at ? formatDate(comment.created_at) : 'Invalid date'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleReaction(comment.id, 'like')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                          comment.userReaction === 'like'
                            ? 'bg-blue-100 text-blue-600'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span className="text-sm font-medium">{comment.likes}</span>
                      </button>
                      <button
                        onClick={() => handleReaction(comment.id, 'dislike')}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-full transition-all ${
                          comment.userReaction === 'dislike'
                            ? 'bg-red-100 text-red-600'
                            : 'hover:bg-gray-100 text-gray-600'
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                        <span className="text-sm font-medium">{comment.dislikes}</span>
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  {editingCommentId === comment.id ? (
                    <div className="w-full space-y-2">
                      <Textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="min-h-[80px] bg-gray-50 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-[#EECE84] focus:border-transparent"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingCommentId(null);
                            setEditedContent('');
                          }}
                          disabled={isEditing}
                          className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-all disabled:opacity-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditComment(comment.id, editedContent)}
                          disabled={isEditing}
                          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-full transition-all disabled:opacity-50"
                        >
                          {isEditing && <Loader2 className="w-4 h-4 animate-spin" />}
                          <span>{isEditing ? 'Saving...' : 'Save'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-700 leading-relaxed">{comment.content}</p>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2">
                    {comment.user_id === userId && !editingCommentId && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingCommentId(comment.id);
                            setEditedContent(comment.content);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                        >
                          <Pencil className="w-4 h-4" />
                          <span>Edit</span>
                        </button>
                        {showDeleteConfirm === comment.id ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => setShowDeleteConfirm(null)}
                              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              disabled={isDeleting === comment.id}
                              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-full transition-all disabled:opacity-50"
                            >
                              {isDeleting === comment.id && (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              )}
                              <span>
                                {isDeleting === comment.id ? 'Deleting...' : 'Confirm Delete'}
                              </span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setShowDeleteConfirm(comment.id)}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-full transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        )}
                      </div>
                    )}
                    <button
                      onClick={() => setSelectedCommentId(comment.id)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-full transition-all"
                    >
                      <Flag className="w-4 h-4" />
                      <span>Report</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 bg-white rounded-2xl"
            >
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No comments yet. Start the conversation!</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Comment Input */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Share your thoughts..."
          className="min-h-[120px] bg-gray-50 border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-[#EECE84] focus:border-transparent"
        />
        <div className="flex justify-end mt-4">
          <button
            onClick={handleCommentSubmit}
            disabled={loading || !newComment.trim()}
            className="flex items-center gap-2 bg-[#EECE84]/80 px-6 py-2.5 rounded-full font-medium transition-all hover:bg-[#EECE84]/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{loading ? 'Posting...' : 'Post Comment'}</span>
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {selectedCommentId && (
        <ReportModal
          isOpen={selectedCommentId !== null}
          onClose={() => setSelectedCommentId(null)}
          onSubmit={handleSubmitReport}
          userId={userId}
        />
      )}
    </div>
  );
};

export default CommentsQuizz;