/* eslint-disable @next/next/no-img-element */
'use client'

import React from 'react';
import { Hash, Users, BookMarked, MessageCircle, User } from 'lucide-react';
import { useClerk } from '@/lib/mock-clerk';
import Link from 'next/link';

interface ForumHashtag {
  id: number;
  name: string;
  usage_count?: number;
}

interface RightSidebarProps {
  myPosts: number;
  pinnedGroups: string[];
  popularTags: ForumHashtag[];
}

export function RightSidebar({ myPosts, pinnedGroups, popularTags }: RightSidebarProps) {
  const { user } = useClerk();

  return (
    <aside className="w-72 bg-gray-900 border-l border-gray-800 h-screen sticky top-0 overflow-y-auto">
      {/* User Profile Section */}
      <div className="p-5 border-b border-gray-800">
        <Link href='/questions-bank/community/user'>
          <button
            className="w-full flex items-center gap-3 hover:bg-gray-800 p-2 rounded-xl transition-colors"
          >
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
            <div className="text-left">
              <h2 className="text-sm font-medium text-gray-100">
                 @{user?.firstName} {user?.lastName}
              </h2>
              <p className="text-xs text-gray-400">View your profile</p>
            </div>
          </button>
        </Link>
      </div>

      {/* Activity Stats */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-1.5 bg-[#EECE84]/20 rounded-lg">
            <MessageCircle className="w-4 h-4 text-[#EECE84]" />
          </div>
          <h3 className="text-sm font-medium text-gray-100">My Activity</h3>
        </div>
        <div className="bg-gray-800 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-300">Total Posts</span>
            <span className="text-sm font-semibold text-[#EECE84]">{myPosts}</span>
          </div>
        </div>
      </div>

      {/* Pinned Groups */}
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-1.5 bg-blue-500/20 rounded-lg">
            <BookMarked className="w-4 h-4 text-blue-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-100">Pinned Groups</h3>
        </div>
        <ul className="space-y-1">
          {pinnedGroups.map((group) => (
            <li key={group}>
              <button className="w-full group flex items-center gap-2 p-2 rounded-md hover:bg-gray-800 transition-colors duration-150">
                <Users className="w-4 h-4 text-gray-500 group-hover:text-blue-400" />
                <span className="text-sm text-gray-400 group-hover:text-blue-400">
                  {group}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Popular Tags */}
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-1.5 bg-emerald-500/20 rounded-lg">
            <Hash className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-sm font-medium text-gray-100">Popular Tags</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {popularTags.map((tag) => (
            <button
              key={tag.id}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-800 hover:bg-emerald-500/20 rounded-full transition-colors duration-150 group"
            >
              <span className="text-xs font-medium text-gray-300 group-hover:text-emerald-400">
                #{tag.name}
              </span>
              {tag.usage_count !== undefined && (
                <span className="text-xs text-gray-500 group-hover:text-emerald-400">
                  {tag.usage_count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default RightSidebar;