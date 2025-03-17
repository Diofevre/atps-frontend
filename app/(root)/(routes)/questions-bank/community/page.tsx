'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { LeftSidebar } from './_components/LeftSidebar';
import { RightSidebar } from './_components/RightSidebar';
import type { ForumPost, ForumCategory, ForumHashtag } from '@/lib/forum';
import { Post } from './_components/post';
import { CreatePostModal } from './_components/create-post-modal';
import { useAuth } from '@clerk/nextjs';
import { MessageSquareOff } from 'lucide-react';
import { cn } from '@/lib/utils';

const Community = () => {
  const { getToken } = useAuth();
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [categories, setCategories] = useState<ForumCategory[]>([]);
  const [popularTags, setPopularTags] = useState<ForumHashtag[]>([]);
  const [myPosts, setMyPosts] = useState<number>(0);
  const [pinnedGroups] = useState<string[]>(['Aviation', 'Sports', 'Technology']);
  const [, setSearchQuery] = useState('');

  const fetchPosts = useCallback(async () => {
    const token = await getToken();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-posts`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
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

  const fetchPopularTags = useCallback(async () => {
    const token = await getToken();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-hashtags/popular`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await response.json();
      setPopularTags(data);
    } catch (error) {
      console.error('Error fetching popular tags:', error);
    }
  }, [getToken]);

  const fetchUserPosts = useCallback(async () => {
    const token = await getToken();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-posts/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      const data = await response.json();
      setMyPosts(data.length);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  }, [getToken]);

  useEffect(() => {
    fetchPosts();
    fetchCategories();
    fetchPopularTags();
    fetchUserPosts();
  }, [fetchCategories, fetchPopularTags, fetchPosts, fetchUserPosts]);

  const handleCreatePost = async (post: {
    category_id: number;
    title: string;
    content: string;
    image_url?: string;
    hashtags: string[];
  }) => {
    const token = await getToken();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(post),
      });
      
      if (response.ok) {
        setIsCreatePostModalOpen(false);
        fetchPosts(); 
        fetchUserPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleUpdatePost = async (postId: number, updatedPost: {
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
        fetchPosts();
      }
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  const handleDeletePost = async (postId: number) => {
    const token = await getToken();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forum-posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        fetchPosts();
        fetchUserPosts();
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

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
      fetchPosts();
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
      fetchPosts();
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filteredPosts = posts.filter(post => 
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase()) ||
        post.hashtags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setPosts(filteredPosts);
    } else {
      fetchPosts();
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

  return (
    <div className="dark">
      <div className="bg-gray-900">
        <div className="flex">
          <LeftSidebar 
            onCreatePost={() => setIsCreatePostModalOpen(true)}
            onSearch={handleSearch}
          />
          
          <main className={cn(
            "flex-1 p-6 overflow-y-auto",
            "bg-gradient-to-b from-gray-900/50 to-gray-900",
            "min-h-screen"
          )}>
            <div className={cn(
              "max-w-3xl mx-auto",
              "relative z-10"
            )}>
              {/* Background Pattern */}
              <div className="absolute inset-0 grid grid-cols-2 -space-x-52 opacity-20 -z-10">
                <div className="blur-[106px] h-56 bg-gradient-to-br from-blue-600 to-gray-900"></div>
                <div className="blur-[106px] h-32 bg-gradient-to-r from-cyan-600 to-blue-800"></div>
              </div>

              {/* Posts Container */}
              <div className="space-y-6">
                {posts.length === 0 ? (
                  <div className={cn(
                    "bg-gray-800/80 backdrop-blur-xl",
                    "rounded-2xl shadow-xl",
                    "p-12 text-center",
                    "border border-gray-700",
                    "transition-all duration-300",
                    "hover:shadow-2xl hover:bg-gray-800/90"
                  )}>
                    <div className={cn(
                      "w-20 h-20 mx-auto mb-6",
                      "rounded-full bg-gray-700",
                      "flex items-center justify-center"
                    )}>
                      <MessageSquareOff className="h-10 w-10 text-gray-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-100 mb-3">
                      No Posts Yet
                    </h3>
                    <p className="text-gray-400 mb-6 max-w-md mx-auto">
                      Be the first one to start a conversation!
                    </p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <div 
                      key={post.id}
                      className={cn(
                        "transform transition-all duration-500",
                        "hover:-translate-y-1 hover:shadow-xl"
                      )}
                    >
                      <Post
                        post={post}
                        onLike={() => handleLike(post.id)}
                        onDislike={() => handleDislike(post.id)}
                        onComment={(content: string) => handleComment(post.id, content)}
                        onUpdate={(updatedPost) => handleUpdatePost(post.id, updatedPost)}
                        onDelete={() => handleDeletePost(post.id)}
                        categories={categories}
                      />
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>

          <RightSidebar
            myPosts={myPosts}
            pinnedGroups={pinnedGroups}
            popularTags={popularTags}
          />
        </div>

        <CreatePostModal
          isOpen={isCreatePostModalOpen}
          onClose={() => setIsCreatePostModalOpen(false)}
          onSubmit={handleCreatePost}
          categories={categories}
        />
      </div>
    </div>
  );
}

export default Community;