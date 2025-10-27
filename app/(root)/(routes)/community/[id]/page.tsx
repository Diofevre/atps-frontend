'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

type Comment = {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  likes: number;
  replies: Reply[];
  createdAt: string;
  hasReplies: boolean;
};

type Reply = {
  id: string;
  content: string;
  author: {
    name: string;
    username: string;
    avatar?: string;
  };
  likes: number;
  createdAt: string;
};

export default function PostPage() {
  const params = useParams();
  const router = useRouter();
  const [showReplyBox, setShowReplyBox] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [commentContent, setCommentContent] = useState('');

  // Mock data for the post
  const post = {
    id: params.id as string,
    title: 'Welcome to the ATPS Community!',
    content: 'This is your space to discuss aviation topics, share experiences, and connect with fellow pilots and students. Feel free to share your thoughts, ask questions, or provide tips! We\'re excited to have you here and look forward to building a vibrant community together.',
    author: {
      name: 'ATPS Team',
      username: 'atps_admin',
      avatar: '/avatar-placeholder.png',
    },
    category: 'announcements',
    tags: ['welcome', 'community', 'aviation'],
    likes: 42,
    comments: 8,
    views: 156,
    is_pinned: true,
    createdAt: new Date().toISOString(),
  };

  // Mock comments data
  const comments: Comment[] = [
    {
      id: '1',
      content: 'Great initiative! Looking forward to learning and sharing with everyone.',
      author: {
        name: 'John Doe',
        username: 'johndoe',
      },
      likes: 5,
      replies: [
        {
          id: '1-1',
          content: 'Absolutely! This is going to be amazing.',
          author: {
            name: 'Jane Smith',
            username: 'janesmith',
          },
          likes: 2,
          createdAt: new Date().toISOString(),
        },
      ],
      createdAt: new Date().toISOString(),
      hasReplies: true,
    },
    {
      id: '2',
      content: 'Can we post questions about exam preparation here?',
      author: {
        name: 'Mike Johnson',
        username: 'mikej',
      },
      likes: 3,
      replies: [],
      createdAt: new Date().toISOString(),
      hasReplies: false,
    },
  ];

  const handleLike = (id: string, type: 'post' | 'comment' | 'reply') => {
    // TODO: Implement like functionality
    console.log(`Liked ${type} ${id}`);
  };

  const handleComment = () => {
    // TODO: Implement comment submission
    console.log('Comment submitted:', commentContent);
    setCommentContent('');
  };

  const handleReply = (commentId: string) => {
    // TODO: Implement reply submission
    console.log('Reply submitted:', replyContent, 'for comment', commentId);
    setReplyContent('');
    setShowReplyBox(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Community
      </button>

      {/* Main Post */}
      <article className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        {post.is_pinned && (
          <div className="bg-atps-yellow text-gray-900 px-4 py-2 text-sm font-semibold flex items-center">
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-5-2.5L5 21V5z" />
            </svg>
            Pinned Post
          </div>
        )}

        <div className="p-6">
          {/* Post Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                {post.author.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{post.author.name}</p>
                <p className="text-sm text-gray-500">@{post.author.username}</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-red-100 text-red-700 text-xs font-semibold rounded-full">
              {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
            </span>
          </div>

          {/* Post Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{post.title}</h1>

          {/* Post Content */}
          <div className="prose max-w-none mb-6">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{post.content}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Post Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => handleLike(post.id, 'post')}
                className="flex items-center space-x-2 text-gray-600 hover:text-atps-yellow transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="font-semibold">{post.likes}</span>
              </button>
              <button className="flex items-center space-x-2 text-gray-600 hover:text-atps-yellow transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span className="font-semibold">{post.comments}</span>
              </button>
              <div className="flex items-center space-x-2 text-gray-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <span>{post.views}</span>
              </div>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </article>

      {/* Comments Section */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments ({post.comments})</h2>

        {/* Add Comment Box */}
        <div className="mb-8 pb-8 border-b border-gray-200">
          <div className="flex space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
              Y
            </div>
            <div className="flex-1">
              <textarea
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-atps-yellow focus:border-transparent resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={handleComment}
                  disabled={!commentContent.trim()}
                  className="px-6 py-2 bg-atps-yellow text-gray-900 font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
              {/* Comment */}
              <div className="flex space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {comment.author.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <p className="font-semibold text-gray-900">{comment.author.name}</p>
                    <p className="text-sm text-gray-500">@{comment.author.username}</p>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-400">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3 whitespace-pre-line">{comment.content}</p>
                  
                  {/* Comment Actions */}
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLike(comment.id, 'comment')}
                      className="flex items-center space-x-1 text-gray-600 hover:text-atps-yellow transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm">{comment.likes}</span>
                    </button>
                    <button
                      onClick={() => setShowReplyBox(showReplyBox === comment.id ? null : comment.id)}
                      className="flex items-center space-x-1 text-gray-600 hover:text-atps-yellow transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                      </svg>
                      <span className="text-sm">Reply</span>
                    </button>
                  </div>

                  {/* Reply Box */}
                  {showReplyBox === comment.id && (
                    <div className="mt-4 ml-4 border-l-2 border-gray-200 pl-4">
                      <div className="flex space-x-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          Y
                        </div>
                        <div className="flex-1">
                          <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-atps-yellow focus:border-transparent resize-none text-sm"
                            rows={2}
                          />
                          <div className="flex justify-end space-x-2 mt-2">
                            <button
                              onClick={() => {
                                setShowReplyBox(null);
                                setReplyContent('');
                              }}
                              className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={() => handleReply(comment.id)}
                              disabled={!replyContent.trim()}
                              className="px-4 py-1.5 text-sm bg-atps-yellow text-gray-900 font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              Reply
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Replies */}
                  {comment.hasReplies && comment.replies.length > 0 && (
                    <div className="mt-4 ml-4 border-l-2 border-gray-200 pl-4 space-y-4">
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3">
                          <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                            {reply.author.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <p className="font-semibold text-gray-900 text-sm">{reply.author.name}</p>
                              <p className="text-xs text-gray-500">@{reply.author.username}</p>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-400">
                                {new Date(reply.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: '2-digit'
                                })}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm whitespace-pre-line">{reply.content}</p>
                            <button
                              onClick={() => handleLike(reply.id, 'reply')}
                              className="mt-2 flex items-center space-x-1 text-gray-600 hover:text-atps-yellow transition-colors"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span className="text-xs">{reply.likes}</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
