'use client';

import React, { useState, useEffect } from 'react';
import { 
  Settings, Mail, MapPin, Globe, Calendar, X, Save, AlertTriangle, 
  Crown, Search, Loader2, User, Lock, Shield, Bell, Eye, EyeOff, 
  Camera, Award, BookOpen, Clock, TrendingUp, CheckCircle, AlertCircle,
  Edit3, Trash2, Download, Upload, Key, Phone, Briefcase, GraduationCap,
  Plane, Target, LogOut
} from 'lucide-react';
import { getUser, getAccessToken } from '@/lib/keycloakAuth';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn, COUNTRIES_ACCOUNT, LANGUAGES, Option } from "@/lib/utils";

// Import types
interface UserProfileData {
  id: string;
  clerkId: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  picture: string;
  phoneNumber?: string;
  country: string;
  language: string;
  occupation?: string;
  aviationExperience?: string;
  licenseType?: string;
  createdAt: string;
  updatedAt: string;
  subscriptionStatus?: 'active' | 'expired' | 'none';
  subscriptionEndDate?: string;
}

export default function UserProfileContent() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    country: '',
    language: '',
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = getAccessToken();
        if (!token) {
          console.error('No access token');
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await fetch('/api/users/me', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          console.log('✅ User data from API:', data);
          setUserData(data);
          
          setEditForm({
            firstName: data.firstName || '',
            lastName: data.lastName || '',
            username: data.username || '',
            email: data.email || '',
            phoneNumber: data.phoneNumber || '',
            country: data.country || '',
            language: data.language || '',
          });
        } else {
          const errorData = await response.json();
          console.error('❌ Failed to fetch user data:', errorData);
          setError('Failed to load user data');
        }
      } catch (error) {
        console.error('❌ Error fetching user data:', error);
        setError('Error loading user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    // TODO: Implement save logic
    console.log('Save changes:', editForm);
    setIsEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-[#EECE84]" />
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-xl shadow-xl">
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
                  <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-gray-200 flex items-center justify-center">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-20 pb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {userData?.firstName || 'Not provided'} {userData?.lastName || ''}
                </h2>
                <p className="text-gray-500 mt-1">@{userData?.username || 'username'}</p>
                
                <div className="mt-6 space-y-3">
                  <Button 
                    onClick={() => setIsEditing(true)}
                    className="w-full"
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
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  {isEditing ? 'Update your personal details' : 'View your personal details'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <Label>First Name</Label>
                      <Input
                        value={editForm.firstName}
                        onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <Label>Last Name</Label>
                      <Input
                        value={editForm.lastName}
                        onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                        placeholder="Enter your last name"
                      />
                    </div>
                    <div>
                      <Label>Username</Label>
                      <Input
                        value={editForm.username}
                        onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                        placeholder="Enter your username"
                      />
                    </div>
                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={editForm.email}
                        onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                        placeholder="Enter your email"
                      />
                    </div>
                    <div className="flex justify-end space-x-3 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                      >
                        Cancel
                      </Button>
                      <Button onClick={handleSave} className="bg-[#EECE84] text-black">
                        Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">First Name</Label>
                        <p className="text-gray-900 mt-1">{userData?.firstName || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Last Name</Label>
                        <p className="text-gray-900 mt-1">{userData?.lastName || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Username</Label>
                        <p className="text-gray-900 mt-1">@{userData?.username || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Email</Label>
                        <p className="text-gray-900 mt-1">{userData?.email || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Country</Label>
                        <p className="text-gray-900 mt-1">{userData?.country || 'Not provided'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Language</Label>
                        <p className="text-gray-900 mt-1">{userData?.language || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
