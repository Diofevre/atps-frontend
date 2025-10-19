/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react';
import { Search, PlusCircle, Heart, Tag, X, MessageCircle, Share2, BookmarkPlus, Reply, Send, User } from 'lucide-react';
import { useCategories, usePosts, usePopularHashtags, usePostComments, type Post, type Comment } from '@/lib/api';
import { useClerk } from '@/lib/mock-clerk';

function CommentComponent({ comment, onReply }: { comment: Comment; onReply: (parentId: number) => void }) {
  const { user } = useClerk();
  return (
    <div className="mb-4">
      <div className="flex items-start gap-3">
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
        <div className="flex-1">
          <div className="bg-slate-700 rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-white">{comment.user.username}</span>
              <span className="text-sm text-slate-400">
                {new Date(comment.createdAt).toLocaleDateString()}
              </span>
            </div>
            {comment.parent && (
              <div className="mb-2 text-sm text-slate-400">
                Replying to: {comment.parent.content.substring(0, 50)}...
              </div>
            )}
            <p className="text-slate-200">{comment.content}</p>
          </div>
          <button
            onClick={() => onReply(comment.id)}
            className="mt-1 text-sm text-slate-400 hover:text-slate-200 flex items-center gap-1"
          >
            <Reply size={14} />
            Reply
          </button>
        </div>
      </div>
    </div>
  );
}

const Community = () => {
  const { user } = useClerk();
  const { data: categories = [] } = useCategories();
  const { data: posts = [] } = usePosts();
  const { data: popularHashtags = [] } = usePopularHashtags();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: '',
    tags: '',
    image: ''
  });

  const { data: comments = [] } = usePostComments(selectedPost?.id || 0);

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };

  const filteredPosts = posts
    .filter(post => 
      (post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.content.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedCategory ? post.category_id.toString() === selectedCategory : true)
    );

  const handleCreatePost = async () => {
    // TODO: Implement post creation API call
    setShowCreateModal(false);
    setNewPost({ title: '', content: '', category: '', tags: '', image: '' });
  };

  const toggleLike = async (postId: number) => {
    // TODO: Implement like API call
  };

  const openDetailModal = (post: Post) => {
    setSelectedPost(post);
    setShowDetailModal(true);
    setNewComment('');
    setReplyingTo(null);
  };

  const handleComment = async () => {
    // TODO: Implement comment creation API call
    setNewComment('');
    setReplyingTo(null);
  };

  return (
    <div className="min-h-screen pt-32 px-6 lg:px-8 bg-slate-900 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar */}
          <div className="lg:w-80">
            <div className="bg-slate-800 rounded-lg p-6 sticky top-8">
              <h1 className="text-3xl font-bold text-white mb-8">Community</h1>
              
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-slate-400"
                  />
                </div>
                
                <div>
                  <label htmlFor="category-select" className="text-sm font-medium text-slate-200 mb-1  block">
                    Select Category
                  </label>
                  <select
                      id="category-select"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  >
                      <option value="">All Categories</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>{category.name}</option>
                      ))}
                  </select>
                </div>

                <button
                  onClick={() => setShowCreateModal(true)}
                  className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <PlusCircle size={20} />
                  Create New Post
                </button>

                <div className="border-t border-slate-700 pt-6">
                  <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-wider mb-4">Popular Tags</h2>
                  <div className="flex flex-wrap gap-2">
                    {popularHashtags.slice(0, 6).map(tag => (
                      <span key={tag.id} className="px-3 py-1 bg-slate-700 text-slate-300 rounded-full text-sm">
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {filteredPosts.map(post => (
              <div
                key={post.id}
                className="bg-slate-800 rounded-lg shadow-lg border border-slate-700 overflow-hidden cursor-pointer transform transition-transform hover:scale-[1.02]"
                onClick={() => openDetailModal(post)}
              >
                {post.image_url && (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={post.image_url}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.user.picture || "https://via.placeholder.com/40"}
                        alt={post.user.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h3 className="font-semibold text-white">{post.user.username}</h3>
                        <p className="text-sm text-slate-400">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(post.id);
                        }}
                        className="flex items-center gap-1 text-slate-400 hover:text-pink-500"
                      >
                        <Heart size={20} />
                        <span>{post.likes_count}</span>
                      </button>
                    </div>
                  </div>
                  <h2 className="text-xl font-semibold mb-2 text-white">{post.title}</h2>
                  <p className="text-slate-300 mb-4 line-clamp-3">{post.content}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm">
                      {getCategoryName(post.category_id)}
                    </span>
                    {post.hashtags.map(tag => (
                      <span
                        key={tag.id}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center gap-1"
                      >
                        <Tag size={14} />
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Create New Post</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X size={24} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="Enter post title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Content
                </label>
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white h-32"
                  placeholder="Write your post content..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Image URL
                </label>
                <input
                  type="text"
                  value={newPost.image}
                  onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="Enter image URL (optional)"
                />
              </div>
              <div>
                <label htmlFor="new-post-category" className="block text-sm font-medium text-slate-200 mb-1">
                  Category
                </label>
                <select
                  id="new-post-category"
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>{category.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={newPost.tags}
                  onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
                  className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                  placeholder="tag1, tag2, tag3"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Create Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Post Detail Modal */}
      {showDetailModal && selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {selectedPost.image_url && (
              <div className="relative h-64 md:h-96">
                <img
                  src={selectedPost.image_url}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedPost.user.picture || "https://via.placeholder.com/48"}
                    alt={selectedPost.user.username}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <h3 className="font-semibold text-white text-lg">{selectedPost.user.username}</h3>
                    <p className="text-slate-400">
                      {new Date(selectedPost.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="text-slate-400 hover:text-slate-200"
                >
                  <X size={24} />
                </button>
              </div>

              <h2 className="text-2xl font-bold text-white mb-4">{selectedPost.title}</h2>
              <p className="text-slate-300 mb-6 leading-relaxed">{selectedPost.content}</p>

              <div className="flex items-center gap-6 mb-6">
                <button
                  onClick={() => toggleLike(selectedPost.id)}
                  className="flex items-center gap-2 text-slate-400 hover:text-pink-500"
                >
                  <Heart size={20} />
                  <span>{selectedPost.likes_count} likes</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-blue-500">
                  <MessageCircle size={20} />
                  <span>{selectedPost.total_comments} comments</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-green-500">
                  <Share2 size={20} />
                  <span>Share</span>
                </button>
                <button className="flex items-center gap-2 text-slate-400 hover:text-purple-500">
                  <BookmarkPlus size={20} />
                  <span>Save</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                <span className="px-3 py-1 bg-slate-700 text-slate-200 rounded-full text-sm">
                  {getCategoryName(selectedPost.category_id)}
                </span>
                {selectedPost.hashtags.map(tag => (
                  <span
                    key={tag.id}
                    className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full text-sm flex items-center gap-1"
                  >
                    <Tag size={14} />
                    {tag.name}
                  </span>
                ))}
              </div>

              {/* Comments Section */}
              <div className="border-t border-slate-700 pt-6">
                <h3 className="text-lg font-semibold text-white mb-4">Comments ({selectedPost.total_comments})</h3>
                
                <div className="mb-6">
                  <div className="flex items-start gap-3">
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
                    <div className="flex-1">
                      <div className="relative">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder={replyingTo ? "Write a reply..." : "Write a comment..."}
                          className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white resize-none"
                          rows={3}
                        />
                        {replyingTo && (
                          <button
                            title='Cancel Reply'
                            onClick={() => setReplyingTo(null)}
                            className="absolute top-2 right-2 text-slate-400 hover:text-slate-200"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={handleComment}
                          disabled={!newComment.trim()}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Send size={16} />
                          {replyingTo ? 'Reply' : 'Comment'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {comments.map((comment: Comment) => (
                    <CommentComponent
                      key={comment.id}
                      comment={comment}
                      onReply={(parentId: number) => {
                        setReplyingTo(parentId);
                        setNewComment('');
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Community;