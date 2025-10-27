'use client';

import React, { useState, useEffect } from 'react';
import { User, Edit3, LogOut, Loader2, AlertTriangle, Save, X } from 'lucide-react';
import { getAccessToken } from '@/lib/keycloakAuth';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface UserData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  country: string;
  language: string;
}

export default function UserProfilePage() {
  const { shouldShowLoading } = useRequireAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    country: '',
    language: '',
  });

  // Charger les données utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        console.log('🔍 Fetching user data...');
        const token = getAccessToken();
        
        if (!token) {
          console.error('❌ No access token found');
          setError('Not authenticated - Please log in again');
          setLoading(false);
          return;
        }

        console.log('✅ Token found, length:', token.length);
        console.log('📡 Calling /api/users/me...');

        const response = await fetch('/api/users/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        console.log('📥 Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('❌ Response error:', errorData);
          throw new Error(errorData.error || `Failed to fetch user data (${response.status})`);
        }

        const data = await response.json();
        console.log('✅ User data loaded:', data);
        
        setUserData(data);
        setEditForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          username: data.username || '',
          email: data.email || '',
          country: data.country || '',
          language: data.language || '',
        });
      } catch (err) {
        console.error('❌ Error loading user data:', err);
        setError(err instanceof Error ? err.message : 'Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    // TODO: Implement save
    console.log('Save changes:', editForm);
      setIsEditing(false);
  };

  if (shouldShowLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-[#EECE84]" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center bg-white p-8 rounded-xl shadow-xl max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-[#EECE84] text-black">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-[#EECE84] to-[#e5c16e]"></div>
                <div className="absolute -bottom-16 inset-x-0 flex justify-center">
                  <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                    <User className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-20 pb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {userData?.firstName || 'User'} {userData?.lastName || ''}
                </h2>
                <p className="text-gray-500 mt-1">@{userData?.username || 'username'}</p>
                
                <div className="mt-6 space-y-3">
                      <Button 
                        onClick={() => setIsEditing(true)}
                    className="w-full bg-[#EECE84] hover:bg-[#e5c16e] text-black"
                      >
                    <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                  
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      const { logout } = await import('@/lib/keycloakAuth');
                      await logout();
                      window.location.href = '/login';
                    }}
                    className="w-full"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Information */}
          <div className="lg:col-span-2">
                <Card>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Personal Information</h3>
                <p className="text-gray-600 mb-6">
                  {isEditing ? 'Update your personal details' : 'View your personal details'}
                </p>

              {isEditing ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <Label>First Name</Label>
                            <Input
                              value={editForm.firstName}
                              onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          placeholder="First name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Last Name</Label>
                            <Input
                              value={editForm.lastName}
                              onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          placeholder="Last name"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Username</Label>
                            <Input
                              value={editForm.username}
                              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                          placeholder="Username"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label>Email</Label>
                            <Input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          placeholder="Email"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button onClick={handleSave} className="bg-[#EECE84] hover:bg-[#e5c16e] text-black">
                          <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </div>
                  </div>
                    ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                        <Label className="text-sm text-gray-500">First Name</Label>
                        <p className="text-gray-900 mt-1">{userData?.firstName || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Last Name</Label>
                        <p className="text-gray-900 mt-1">{userData?.lastName || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Username</Label>
                        <p className="text-gray-900 mt-1">@{userData?.username || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm text-gray-500">Email</Label>
                        <p className="text-gray-900 mt-1">{userData?.email || 'Not provided'}</p>
                      </div>
                      </div>
            </div>
                )}
              </div>
                </Card>
          </div>
        </div>
      </div>
    </div>
  );
}