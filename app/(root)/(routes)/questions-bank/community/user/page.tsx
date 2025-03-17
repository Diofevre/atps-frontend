/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useCallback, useEffect, useState } from 'react';
import { User, ArrowLeft, MessageSquare, ThumbsUp } from 'lucide-react';
import { useClerk, useAuth } from '@clerk/nextjs';
import type { ForumPost, ForumCategory } from '@/lib/forum';
import { Post } from '../_components/post';
import { useRouter } from 'next/navigation';

const UserProfile = () => {
  const router = useRouter();
  const { user } = useClerk();
  const { getToken } = useAuth();
  const [userPosts, setUserPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserPosts = useCallback(async () => {
    const token = await getToken();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-posts/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await response.json();
      setUserPosts(data);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setIsLoading(false);
    }
  }, [getToken]);

  const fetchCategories = useCallback(async () => {
    const token = await getToken();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-categories`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [getToken]);

  useEffect(() => {
    fetchUserPosts();
    fetchCategories();
  }, [fetchCategories, fetchUserPosts]);

  const handleLike = async (postId: number) => {
    const token = await getToken();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-post-reactions/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          post_id: postId,
          reaction_type: 'like',
        }),
      });
      fetchUserPosts();
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async (postId: number) => {
    const token = await getToken();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-post-reactions/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          post_id: postId,
          reaction_type: 'dislike',
        }),
      });
      fetchUserPosts();
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

  const handleComment = async (postId: number, content: string) => {
    const token = await getToken();
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          post_id: postId,
          content,
        }),
      });
      fetchUserPosts();
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleUpdate = async (postId: number, updatedPost: {
    category_id: number;
    title: string;
    content: string;
    image_url?: string;
    hashtags: string[];
  }) => {
    const token = await getToken();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-posts/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedPost),
      });
      
      if (response.ok) {
        fetchUserPosts();
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDelete = async (postId: number) => {
    const token = await getToken();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        fetchUserPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const totalLikes = userPosts.reduce((acc, post) => acc + (Number(post.likes_count) || 0), 0);

  return (
    <div className="bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-3xl mx-auto px-4">
          <div className="py-3 flex items-center justify-between">
            <button
              onClick={() => router.push('/questions-bank/community')}
              className="flex items-center gap-1.5 text-gray-400 hover:text-gray-100 transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-gray-800/50 rounded-xl shadow-lg border border-gray-700/50 p-4 mb-6">
          <div className="flex items-center gap-4">
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt="Profile"
                className="w-16 h-16 rounded-xl object-cover shadow-inner"
              />
            ) : (
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[#EECE84] to-[#EECE84] flex items-center justify-center shadow-inner">
                <User className="h-8 w-8 text-gray-900" />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-lg font-semibold text-gray-100">
                {user?.fullName || user?.username}
              </h1>
              <p className="text-sm text-gray-400">@{user?.username}</p>
              <div className="mt-3 flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-[#EECE84]" />
                  <span className="text-sm font-medium text-gray-100">{userPosts.length}</span>
                  <span className="text-sm text-gray-400">posts</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ThumbsUp className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-100">{totalLikes}</span>
                  <span className="text-sm text-gray-400">likes</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Posts Section */}
        <div className="space-y-4">
          <h2 className="text-base font-medium text-gray-100 px-1">Recent Posts</h2>
          {isLoading ? (
            <div className="text-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#EECE84] mx-auto"></div>
              <p className="mt-3 text-sm text-gray-400">Loading posts...</p>
            </div>
          ) : userPosts.length > 0 ? (
            userPosts.map((post) => (
              <Post
                key={post.id}
                post={post}
                categories={categories}
                onLike={() => handleLike(post.id)}
                onDislike={() => handleDislike(post.id)}
                onComment={(content: string) => handleComment(post.id, content)}
                onUpdate={(updatedPost) => handleUpdate(post.id, updatedPost)}
                onDelete={() => handleDelete(post.id)}
              />
            ))
          ) : (
            <div className="text-center py-6 bg-gray-800/50 rounded-xl shadow-lg border border-gray-700/50">
              <p className="text-sm text-gray-400">No posts yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;