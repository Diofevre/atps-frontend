/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, X, User, MoreVertical, Edit2, Trash2, ImageIcon, XCircle, Link, Hash, Clock } from 'lucide-react';
import type { ForumPost, ForumCategory, ForumComment } from '@/lib/forum';
import { CommentList } from './comment-list';
import { CommentForm } from './comment-for';
import { cn } from '@/lib/utils';

interface PostProps {
  post: ForumPost;
  categories: ForumCategory[];
  onLike: () => void;
  onDislike: () => void;
  onComment: (content: string) => void;
  onUpdate: (updatedPost: {
    category_id: number;
    title: string;
    content: string;
    image_url?: string;
    hashtags: string[];
  }) => void;
  onDelete: () => void;
}

export function Post({ post, categories, onLike, onDislike, onComment, onUpdate, onDelete }: PostProps) {
  const { user } = useUser();
  const { userId, getToken } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(post.title);
  const [editedContent, setEditedContent] = useState(post.content);
  const [editedCategoryId, setEditedCategoryId] = useState(post.category_id);
  const [editedHashtags, setEditedHashtags] = useState(post.hashtags.join(', '));
  const [editedImageUrl, setEditedImageUrl] = useState(post.image_url);
  const [imagePreview, setImagePreview] = useState<string | null>(post.image_url || null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const isAuthor = userId === post.user_id;

  const fetchComments = useCallback(async (postId: number) => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-comments/posts/${postId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      } else {
        console.error('Error fetching comments:', response.status);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  }, [getToken]);

  useEffect(() => {
    if (showComments) {
      fetchComments(post.id);
    }
  }, [showComments, post.id, getToken, fetchComments]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setEditedImageUrl(reader.result as string);
        setShowUrlInput(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setImagePreview(imageUrlInput);
      setEditedImageUrl(imageUrlInput);
      setShowUrlInput(false);
      setImageUrlInput('');
    }
  };

  const handleAddComment = async (content: string, parentCommentId?: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          post_id: post.id,
          content: content,
          parent_comment_id: parentCommentId ? parentCommentId : null,
        }),
      });

      if (response.ok) {
        fetchComments(post.id);
      } else {
        console.error('Error creating comment:', response.status);
      }
    } catch (error) {
      console.error('Error creating comment:', error);
    }
  };

  const handleUpdateComment = async (commentId: string, content: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-comments/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: content }),
      });

      if (response.ok) {
        setComments(prevComments =>
          prevComments.map(c => (c.id === commentId ? { ...c, content: content } : c))
        );
      } else {
        console.error('Error updating comment:', response.status);
        fetchComments(post.id);
      }
    } catch (error) {
      console.error('Error updating comment:', error);
      fetchComments(post.id);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setComments(prevComments => prevComments.filter(c => c.id !== commentId));
      } else {
        console.error('Error deleting comment:', response.status);
        fetchComments(post.id);
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      fetchComments(post.id);
    }
  };

  const handleReplyComment = async (parentCommentId: string, content: string) => {
    try {
      await handleAddComment(content, parentCommentId);
      fetchComments(post.id);
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const handleSubmitEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      category_id: editedCategoryId,
      title: editedTitle,
      content: editedContent,
      image_url: editedImageUrl,
      hashtags: editedHashtags.split(',').map(tag => tag.trim()),
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className={cn(
      "bg-slate-900/80 backdrop-blur-lg",
      "border border-slate-800/60",
      "transition-all duration-300",
      "hover:border-[#EECE84]/20 hover:shadow-[0_0_30px_-10px_rgba(238,206,132,0.2)]",
      "rounded-xl p-1"
    )}>
      <div className="flex flex-col lg:flex-row gap-1">
        <div className={cn(
          "lg:w-[400px] h-[300px] lg:h-[400px]",
          "bg-gradient-to-br from-slate-950 to-slate-900",
          "rounded-xl overflow-hidden",
          "flex-shrink-0"
        )}>
          {post.image_url ? (
            <div className="relative h-full group">
              <img 
                src={post.image_url} 
                alt=""
                onClick={() => setIsImageExpanded(true)}
                className={cn(
                  "w-full h-full",
                  "object-cover cursor-zoom-in",
                  "transition-all duration-500",
                  "group-hover:scale-105"
                )}
                loading="lazy"
              />
              <div className={cn(
                "absolute inset-0",
                "bg-gradient-to-t from-slate-950/80 via-transparent to-transparent",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              )} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <ImageIcon className="w-16 h-16 text-slate-800" />
            </div>
          )}
        </div>

        <div className={cn(
          "flex-1 p-6 lg:p-8",
          "bg-slate-900/40",
          "rounded-xl",
          "flex flex-col"
        )}>
          {isEditing ? (
            <form onSubmit={handleSubmitEdit} className="space-y-6 h-full">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className={cn(
                  "w-full px-5 py-3",
                  "bg-slate-950/50 rounded-xl",
                  "border border-slate-800",
                  "text-slate-200 placeholder-slate-500",
                  "focus:outline-none focus:ring-2 focus:ring-[#EECE84]/20 focus:border-[#EECE84]/40",
                  "transition-all duration-200"
                )}
                placeholder="Title"
              />
              
              <select
                value={editedCategoryId}
                onChange={(e) => setEditedCategoryId(Number(e.target.value))}
                className={cn(
                  "w-full px-5 py-3",
                  "bg-slate-950/50 rounded-xl",
                  "border border-slate-800",
                  "text-slate-200",
                  "focus:outline-none focus:ring-2 focus:ring-[#EECE84]/20 focus:border-[#EECE84]/40",
                  "transition-all duration-200"
                )}
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className={cn(
                  "w-full px-5 py-3",
                  "bg-slate-950/50 rounded-xl",
                  "border border-slate-800",
                  "text-slate-200 placeholder-slate-500",
                  "focus:outline-none focus:ring-2 focus:ring-[#EECE84]/20 focus:border-[#EECE84]/40",
                  "transition-all duration-200",
                  "min-h-[160px] resize-y"
                )}
                placeholder="Share your thoughts..."
              />

              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "px-5 py-3",
                      "bg-slate-800 rounded-xl",
                      "text-slate-200",
                      "hover:bg-slate-700",
                      "transition-all duration-200",
                      "flex items-center gap-2"
                    )}
                  >
                    <ImageIcon className="h-5 w-5" />
                    Upload Image
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrlInput(!showUrlInput)}
                    className={cn(
                      "px-5 py-3",
                      "bg-slate-800 rounded-xl",
                      "text-slate-200",
                      "hover:bg-slate-700",
                      "transition-all duration-200",
                      "flex items-center gap-2"
                    )}
                  >
                    <Link className="h-5 w-5" />
                    Add Image URL
                  </button>

                  {imagePreview && (
                    <button
                      type="button"
                      onClick={() => {
                        setImagePreview(null);
                        setEditedImageUrl(undefined);
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className={cn(
                        "px-5 py-3",
                        "bg-red-950/30 rounded-xl",
                        "text-red-400",
                        "hover:bg-red-950/50",
                        "transition-all duration-200",
                        "flex items-center gap-2"
                      )}
                    >
                      <XCircle className="h-5 w-5" />
                      Remove Image
                    </button>
                  )}
                </div>

                {showUrlInput && (
                  <form onSubmit={handleImageUrlSubmit} className="flex gap-2">
                    <input
                      type="url"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="Enter image URL..."
                      className={cn(
                        "flex-1 px-5 py-3",
                        "bg-slate-950/50 rounded-xl",
                        "border border-slate-800",
                        "text-slate-200 placeholder-slate-500",
                        "focus:outline-none focus:ring-2 focus:ring-[#EECE84]/20 focus:border-[#EECE84]/40",
                        "transition-all duration-200"
                      )}
                    />
                    <button
                      type="submit"
                      className={cn(
                        "px-6 py-3",
                        "bg-[#EECE84] rounded-xl",
                        "text-slate-900 font-medium",
                        "hover:bg-[#f4d898]",
                        "transition-all duration-200"
                      )}
                    >
                      Add
                    </button>
                  </form>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              <div className="relative">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
                <input
                  type="text"
                  value={editedHashtags}
                  onChange={(e) => setEditedHashtags(e.target.value)}
                  className={cn(
                    "w-full pl-12 pr-5 py-3",
                    "bg-slate-950/50 rounded-xl",
                    "border border-slate-800",
                    "text-slate-200 placeholder-slate-500",
                    "focus:outline-none focus:ring-2 focus:ring-[#EECE84]/20 focus:border-[#EECE84]/40",
                    "transition-all duration-200"
                  )}
                  placeholder="Add hashtags (comma-separated)"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className={cn(
                    "px-8 py-3",
                    "bg-[#EECE84] rounded-xl",
                    "text-slate-900 font-medium",
                    "hover:bg-[#f4d898]",
                    "transition-all duration-200",
                    "flex-1 sm:flex-none"
                  )}
                >
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setImagePreview(post.image_url || null);
                    setEditedImageUrl(post.image_url);
                    setShowUrlInput(false);
                    setImageUrlInput('');
                  }}
                  className={cn(
                    "px-8 py-3",
                    "bg-slate-800 rounded-xl",
                    "text-slate-200",
                    "hover:bg-slate-700",
                    "transition-all duration-200",
                    "flex-1 sm:flex-none"
                  )}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {user?.imageUrl ? (
                      <img
                        src={user?.imageUrl}
                        alt="User Profile"
                        className="w-12 h-12 rounded-xl object-cover shadow-inner transform hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#EECE84] to-[#EECE84] flex items-center justify-center shadow-inner transform hover:scale-105 transition-transform duration-200">
                        <User className="h-6 w-6 text-gray-900" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className={cn(
                      "text-xl font-semibold",
                      "text-slate-200",
                      "hover:text-[#EECE84]",
                      "transition-colors duration-200",
                      "cursor-pointer line-clamp-2"
                    )}>
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-sm font-medium text-[#EECE84]">
                        {post.user.username}
                      </span>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Clock className="h-4 w-4" />
                        <time className="text-sm">
                          {formatDate(post.createdAt)}
                        </time>
                      </div>
                    </div>
                  </div>
                </div>

                {isAuthor && (
                  <div className="relative">
                    <button
                      onClick={() => setShowActions(!showActions)}
                      className={cn(
                        "p-2 text-slate-400",
                        "hover:text-slate-200 hover:bg-slate-800",
                        "rounded-lg transition-colors duration-200"
                      )}
                    >
                      <MoreVertical className="h-5 w-5" />
                    </button>
                    
                    {showActions && (
                      <div className={cn(
                        "absolute right-0 mt-2 w-48",
                        "bg-slate-900 rounded-xl",
                        "border border-slate-800",
                        "shadow-xl shadow-black/20",
                        "py-1 z-10"
                      )}>
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setShowActions(false);
                          }}
                          className={cn(
                            "w-full px-4 py-2.5",
                            "text-left text-slate-200",
                            "hover:bg-slate-800",
                            "flex items-center gap-2",
                            "transition-colors duration-200"
                          )}
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit Post
                        </button>
                        <button
                          onClick={() => {
                            handleDelete();
                            setShowActions(false);
                          }}
                          className={cn(
                            "w-full px-4 py-2.5",
                            "text-left text-red-400",
                            "hover:bg-red-950/30",
                            "flex items-center gap-2",
                            "transition-colors duration-200"
                          )}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Post
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex-1 mb-6">
                <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>
              </div>

              <div className="space-y-6">
                <div className={cn(
                  "flex items-center gap-6",
                  "border-t border-b border-slate-800/60",
                  "py-4"
                )}>
                  <button
                    onClick={onLike}
                    className={cn(
                      "flex items-center gap-2",
                      "text-slate-400 hover:text-[#EECE84]",
                      "transition-all duration-200 group"
                    )}
                  >
                    <ThumbsUp className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{post.likes_count}</span>
                  </button>
                  <button
                    onClick={onDislike}
                    className={cn(
                      "flex items-center gap-2",
                      "text-slate-400 hover:text-red-400",
                      "transition-all duration-200 group"
                    )}
                  >
                    <ThumbsDown className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">{post.dislikes_count}</span>
                  </button>
                  <button
                    onClick={() => setShowComments(!showComments)}
                    className={cn(
                      "flex items-center gap-2",
                      "text-slate-400 hover:text-blue-400",
                      "transition-all duration-200 group"
                    )}
                  >
                    <MessageCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">
                      {post.total_comments} {post.total_comments === 1 ? 'Comment' : 'Comments'}
                    </span>
                  </button>
                  <button
                    className={cn(
                      "flex items-center gap-2 ml-auto",
                      "text-slate-400 hover:text-emerald-400",
                      "transition-all duration-200 group"
                    )}
                  >
                    <Share2 className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    <span className="font-medium">Share</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {post.hashtags.map((tag) => (
                    <span
                      key={tag}
                      className={cn(
                        "px-4 py-2",
                        "bg-slate-800/50 rounded-xl",
                        "text-sm text-slate-400",
                        "cursor-pointer",
                        "hover:bg-[#EECE84]/10 hover:text-[#EECE84]",
                        "transition-all duration-200",
                        "hover:scale-105"
                      )}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {showComments && (
                <div className="mt-6 pt-6 border-t border-slate-800/60">
                  <CommentList
                    comments={comments}
                    onDelete={handleDeleteComment}
                    onUpdate={handleUpdateComment}
                    onReply={handleReplyComment}
                  />
                  <CommentForm
                    onSubmit={(content) => onComment(content)}
                    placeholder="Share your thoughts..."
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isImageExpanded && post.image_url && (
        <div 
          className={cn(
            "fixed inset-0 z-50",
            "bg-black/95 backdrop-blur-lg",
            "flex items-center justify-center p-4"
          )}
          onClick={() => setIsImageExpanded(false)}
        >
          <button 
            className={cn(
              "absolute top-6 right-6",
              "text-white/80 hover:text-white",
              "transition-colors duration-200",
              "p-2 rounded-full",
              "hover:bg-white/10"
            )}
            onClick={(e) => {
              e.stopPropagation();
              setIsImageExpanded(false);
            }}
          >
            <X className="h-6 w-6" />
          </button>
          <img 
            src={post.image_url} 
            alt=""
            className={cn(
              "max-w-full max-h-[90vh]",
              "object-contain rounded-2xl",
              "shadow-2xl"
            )}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

export default Post;