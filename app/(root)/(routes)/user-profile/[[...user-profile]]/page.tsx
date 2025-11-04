'use client';

import React, { useState, useEffect } from 'react';
import { User, Edit3, LogOut, Loader2, AlertTriangle, Save, X, Lock, Bell, Shield, Key, Smartphone, Mail, Globe, Check } from 'lucide-react';
import { GiUpgrade } from "react-icons/gi";
import { useRouter } from 'next/navigation';
import { getAccessToken } from '@/lib/keycloakAuth';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-[#EECE84]" />
          <p className="text-text-secondary">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center bg-card border border-border p-8 rounded-xl shadow-lg max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-card-foreground mb-2">Error</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <Button onClick={() => window.location.reload()} className="bg-[#EECE84] hover:bg-[#e5c16e] text-black">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim() || 'User';
  const initials = `${userData?.firstName?.[0] || ''}${userData?.lastName?.[0] || ''}`.toUpperCase() || 'U';

  return (
    <div className="min-h-screen bg-background">
      {/* Header with Profile Banner */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800"></div>
        
        {/* Subscription Banner Overlay */}
        <div className="absolute top-4 right-4">
          <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border border-yellow-200 dark:border-yellow-700/30 rounded-lg p-3 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center">
                <span className="text-xl">☀️</span>
              </div>
              <div>
                <p className="text-xs font-medium text-yellow-800 dark:text-yellow-300">Subscription</p>
                <p className="text-sm font-bold text-yellow-900 dark:text-yellow-200">Free limited</p>
              </div>
              <Button 
                onClick={() => router.push('/settings')}
                className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white text-xs px-3 py-1.5 h-auto"
              >
                <GiUpgrade className="h-3 w-3 mr-1" />
                Upgrade
              </Button>
            </div>
          </div>
        </div>

        {/* Profile Info Overlay */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mb-16">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 pb-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full border-4 border-card shadow-xl bg-card flex items-center justify-center">
                <span className="text-4xl font-bold text-card-foreground">{initials}</span>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#EECE84] hover:bg-[#e5c16e] text-black shadow-lg flex items-center justify-center transition-transform hover:scale-110"
                title="Edit profile"
              >
                <Edit3 className="h-4 w-4" />
              </button>
            </div>

            {/* User Info */}
            <div className="flex-1 pb-2">
              <h1 className="text-3xl font-bold text-card-foreground mb-1">{fullName}</h1>
              <p className="text-text-secondary mb-2">@{userData?.username || 'username'}</p>
              <p className="text-text-secondary text-sm">{userData?.email || 'No email'}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-2">
              <Button
                variant="outline"
                onClick={async () => {
                  const { logout } = await import('@/lib/keycloakAuth');
                  await logout();
                  window.location.href = '/login';
                }}
                className="border-border"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        {/* Tabs */}
        <div className="border-b border-border mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('general')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'general'
                  ? 'border-[#EECE84] text-[#EECE84]'
                  : 'border-transparent text-text-secondary hover:text-foreground hover:border-border'
              }`}
            >
              <User className="h-4 w-4" />
              General Information
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'security'
                  ? 'border-[#EECE84] text-[#EECE84]'
                  : 'border-transparent text-text-secondary hover:text-foreground hover:border-border'
              }`}
            >
              <Shield className="h-4 w-4" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors flex items-center gap-2 ${
                activeTab === 'notifications'
                  ? 'border-[#EECE84] text-[#EECE84]'
                  : 'border-transparent text-text-secondary hover:text-foreground hover:border-border'
              }`}
            >
              <Bell className="h-4 w-4" />
              Notifications
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'general' && (
          <Card className="bg-card border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-card-foreground">Personal Information</CardTitle>
              <CardDescription>
                {isEditing ? 'Update your personal details below' : 'View and manage your personal information'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
                      <Input
                        id="firstName"
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        placeholder="First name"
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
                      <Input
                        id="lastName"
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        placeholder="Last name"
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                      <Input
                        id="username"
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        placeholder="Username"
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="Email"
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-sm font-medium">Country</Label>
                      <Input
                        id="country"
                        value={editForm.country}
                        onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                        placeholder="Country"
                        className="bg-background border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="language" className="text-sm font-medium">Language</Label>
                      <Input
                        id="language"
                        value={editForm.language}
                        onChange={(e) => setEditForm({ ...editForm, language: e.target.value })}
                        placeholder="Language"
                        className="bg-background border-border"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4 border-t border-border">
                    <Button variant="outline" onClick={() => setIsEditing(false)} className="border-border">
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
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">First Name</Label>
                      <p className="text-base text-card-foreground">{userData?.firstName || 'Not provided'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Last Name</Label>
                      <p className="text-base text-card-foreground">{userData?.lastName || 'Not provided'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Username</Label>
                      <p className="text-base text-card-foreground">@{userData?.username || 'Not provided'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        Email
                      </Label>
                      <p className="text-base text-card-foreground">{userData?.email || 'Not provided'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Country
                      </Label>
                      <p className="text-base text-card-foreground">{userData?.country || 'Not provided'}</p>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-muted-foreground">Language</Label>
                      <p className="text-base text-card-foreground">{userData?.language || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card className="bg-card border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Key className="h-5 w-5" />
                  Password
                </CardTitle>
                <CardDescription>
                  Update your password to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="border-border">
                  Change Password
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Two-Factor Authentication
                </CardTitle>
                <CardDescription>
                  Add an extra layer of security to your account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">2FA Status</p>
                    <p className="text-xs text-muted-foreground mt-1">Not enabled</p>
                  </div>
                  <Button variant="outline" className="border-border">
                    Enable 2FA
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Active Sessions
                </CardTitle>
                <CardDescription>
                  Manage devices where you're logged in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Current Session</p>
                      <p className="text-xs text-muted-foreground mt-1">This device • Now</p>
                    </div>
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                      <Check className="h-4 w-4" />
                      <span className="text-xs font-medium">Active</span>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full border-border">
                    View All Sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'notifications' && (
          <Card className="bg-card border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose how you want to be notified about activities and updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <Label className="text-base font-semibold text-card-foreground">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground mt-1">Receive email updates about your account and activities</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#EECE84] dark:peer-focus:ring-[#EECE84] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#EECE84]"></div>
                  </label>
                </div>
                
                <div className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <Label className="text-base font-semibold text-card-foreground">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground mt-1">Get notified about important updates and announcements</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#EECE84] dark:peer-focus:ring-[#EECE84] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#EECE84]"></div>
                  </label>
                </div>
                
                <div className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex-1">
                    <Label className="text-base font-semibold text-card-foreground">Study Reminders</Label>
                    <p className="text-sm text-muted-foreground mt-1">Reminders to continue your studies and complete your courses</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#EECE84] dark:peer-focus:ring-[#EECE84] rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-[#EECE84]"></div>
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}