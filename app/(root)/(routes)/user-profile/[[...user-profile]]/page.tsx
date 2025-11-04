'use client';

import React, { useState, useEffect } from 'react';
import { User, Edit3, LogOut, Loader2, AlertTriangle, Save, X } from 'lucide-react';
import { GiUpgrade } from "react-icons/gi";
import { useRouter } from 'next/navigation';
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
  const router = useRouter();
  const { shouldShowLoading } = useRequireAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'security' | 'notifications'>('general');
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
          <p className="text-text-secondary mt-2">Manage your account settings and preferences</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="overflow-hidden bg-card border border-border">
              <div className="relative">
                <div className="h-32 bg-main-gradient"></div>
                <div className="absolute -bottom-16 inset-x-0 flex justify-center">
                  <div className="w-32 h-32 rounded-full border-4 border-card shadow-lg bg-muted flex items-center justify-center">
                    <User className="h-16 w-16 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-20 pb-6 text-center">
                <h2 className="text-2xl font-bold text-card-foreground">
                  {userData?.firstName || 'User'} {userData?.lastName || ''}
                </h2>
                <p className="text-muted-foreground mt-1">@{userData?.username || 'username'}</p>
                
                <div className="mt-6 space-y-3">
                      <Button 
                        onClick={() => setIsEditing(true)}
                    className="w-full bg-[#EECE84] hover:bg-[#e5c16e] text-black"
                      >
                    <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                  
                  <Button 
                    onClick={() => router.push('/settings')}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
                  >
                    <GiUpgrade className="h-4 w-4 mr-2" />
                    Upgrade Plan
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

            {/* Subscription Banner */}
            <Card className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700/30 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-full opacity-20">
                {/* Cloud shapes */}
                <div className="absolute top-2 left-2 w-16 h-12 bg-white dark:bg-gray-300 rounded-full"></div>
                <div className="absolute top-4 left-8 w-12 h-8 bg-white dark:bg-gray-300 rounded-full"></div>
                <div className="absolute top-1 left-20 w-10 h-6 bg-white dark:bg-gray-300 rounded-full"></div>
              </div>
              
              <CardContent className="relative p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300 mb-1">Subscription</p>
                    <p className="text-xl font-bold text-yellow-900 dark:text-yellow-200">Free limited</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Sun icon */}
                    <div className="w-12 h-12 rounded-full bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center">
                      <span className="text-2xl">☀️</span>
                    </div>
                    <Button 
                      onClick={() => router.push('/settings')}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm px-4 py-2"
                    >
                      Upgrade now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Tabs Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="border-b border-border mb-6">
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('general')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'general'
                      ? 'border-[#EECE84] text-[#EECE84]'
                      : 'border-transparent text-text-secondary hover:text-foreground hover:border-border'
                  }`}
                >
                  General Information
                </button>
                <button
                  onClick={() => setActiveTab('security')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'security'
                      ? 'border-[#EECE84] text-[#EECE84]'
                      : 'border-transparent text-text-secondary hover:text-foreground hover:border-border'
                  }`}
                >
                  Security
                </button>
                <button
                  onClick={() => setActiveTab('notifications')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'notifications'
                      ? 'border-[#EECE84] text-[#EECE84]'
                      : 'border-transparent text-text-secondary hover:text-foreground hover:border-border'
                  }`}
                >
                  Notifications
                </button>
              </nav>
            </div>

            {/* Tab Content */}
            {activeTab === 'general' && (
              <Card className="bg-card border border-border">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-card-foreground">Personal Information</h3>
                  <p className="text-text-secondary mb-6">
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
                          <Label className="text-sm text-muted-foreground">First Name</Label>
                          <p className="text-card-foreground mt-1">{userData?.firstName || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Last Name</Label>
                          <p className="text-card-foreground mt-1">{userData?.lastName || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Username</Label>
                          <p className="text-card-foreground mt-1">@{userData?.username || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm text-muted-foreground">Email</Label>
                          <p className="text-card-foreground mt-1">{userData?.email || 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card className="bg-card border border-border">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-card-foreground">Security Settings</h3>
                  <p className="text-text-secondary mb-6">Manage your password and security preferences</p>
                  
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-semibold">Change Password</Label>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">Update your password to keep your account secure</p>
                      <Button variant="outline">Change Password</Button>
                    </div>
                    
                    <div className="border-t border-border pt-6">
                      <Label className="text-base font-semibold">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">Add an extra layer of security to your account</p>
                      <Button variant="outline">Enable 2FA</Button>
                    </div>
                    
                    <div className="border-t border-border pt-6">
                      <Label className="text-base font-semibold">Active Sessions</Label>
                      <p className="text-sm text-muted-foreground mt-1 mb-4">Manage devices where you're logged in</p>
                      <Button variant="outline">View Sessions</Button>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'notifications' && (
              <Card className="bg-card border border-border">
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 text-card-foreground">Notification Preferences</h3>
                  <p className="text-text-secondary mb-6">Choose how you want to be notified</p>
                  
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-semibold">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground mt-1">Receive email updates about your account</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" defaultChecked />
                    </div>
                    
                    <div className="border-t border-border pt-6 flex items-center justify-between">
                      <div>
                        <Label className="text-base font-semibold">Push Notifications</Label>
                        <p className="text-sm text-muted-foreground mt-1">Get notified about important updates</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" />
                    </div>
                    
                    <div className="border-t border-border pt-6 flex items-center justify-between">
                      <div>
                        <Label className="text-base font-semibold">Study Reminders</Label>
                        <p className="text-sm text-muted-foreground mt-1">Reminders to continue your studies</p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" defaultChecked />
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}