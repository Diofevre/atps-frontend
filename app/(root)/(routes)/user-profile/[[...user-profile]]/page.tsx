/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react';
import { 
  Settings, 
  Mail, 
  MapPin, 
  Globe, 
  Calendar, 
  X, 
  Save, 
  AlertTriangle, 
  Crown, 
  Search, 
  Loader2,
  User,
  Lock,
  Shield,
  Bell,
  Eye,
  EyeOff,
  Camera,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Edit3,
  Trash2,
  Download,
  Upload,
  Key,
  Phone,
  Briefcase,
  GraduationCap,
  Plane,
  Target
} from 'lucide-react';
import { useAuth, useClerk } from '@clerk/nextjs';
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
import useSWR from 'swr';

// Types
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
  achievements?: Achievement[];
  studyStats?: StudyStats;
  notifications?: NotificationSettings;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: 'study' | 'exam' | 'milestone';
}

interface StudyStats {
  totalStudyTime: number;
  questionsAnswered: number;
  examsCompleted: number;
  currentStreak: number;
  longestStreak: number;
  accuracy: number;
  certificatesEarned: number;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  studyReminders: boolean;
  examReminders: boolean;
  achievementNotifications: boolean;
  weeklyReports: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  phoneNumber?: string;
  country?: string;
  language?: string;
  occupation?: string;
  aviationExperience?: string;
  licenseType?: string;
}

// Components
const ComboboxSelect = ({ 
  options,
  value,
  onChange,
  placeholder,
  error,
  searchPlaceholder,
  emptyMessage,
  title
}: { 
  options: Option[],
  value: string,
  onChange: (value: string) => void,
  placeholder: string,
  error?: string,
  searchPlaceholder: string,
  emptyMessage: string,
  title: string
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const currentOption = options.find(option => option.value === value);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        className={cn(
          "w-full justify-between",
          error && "border-red-500"
        )}
        onClick={() => setIsOpen(true)}
      >
        {currentOption?.label || placeholder}
        <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="mt-4 max-h-[300px] overflow-auto">
              {filteredOptions.length === 0 ? (
                <p className="text-sm text-muted-foreground p-2 text-center">
                  {emptyMessage}
                </p>
              ) : (
                <div className="space-y-1">
                  {filteredOptions.map((option) => (
                    <div
                      key={option.value}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm rounded-md cursor-pointer",
                        value === option.value 
                          ? "bg-[#EECE84] text-white"
                          : "hover:bg-muted"
                      )}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                        setSearchQuery('');
                      }}
                    >
                      {option.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

const FormField = ({ 
  label, 
  error, 
  children,
  required = true
}: { 
  label: string, 
  error?: string, 
  children: React.ReactNode,
  required?: boolean
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && '*'}
    </label>
    {children}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const ProfileSkeleton = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
          </div>
        </div>
        <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
              <div className="space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-10 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Page = () => {
  const { user } = useClerk();
  const { getToken } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [editForm, setEditForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phoneNumber: '',
    country: '',
    language: '',
    occupation: '',
    aviationExperience: '',
    licenseType: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [error, setError] = useState('');
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const fetcher = async (url: string) => {
    const token = await getToken();
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  };

  const { data: profile, error: fetchError, mutate } = useSWR<UserProfileData>(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
    fetcher,
    {
      onSuccess: (data) => {
        setEditForm({
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          username: data.username || '',
          email: data.email || '',
          phoneNumber: data.phoneNumber || '',
          country: data.country || '',
          language: data.language || '',
          occupation: data.occupation || '',
          aviationExperience: data.aviationExperience || '',
          licenseType: data.licenseType || ''
        });
      }
    }
  );

  const validateForm = () => {
    const errors: FormErrors = {};
    
    if (!editForm.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!editForm.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!editForm.username.trim()) {
      errors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]{3,20}$/.test(editForm.username)) {
      errors.username = 'Username must be 3-20 characters and contain only letters, numbers, and underscores';
    }
    
    if (!editForm.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editForm.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (editForm.phoneNumber && !/^\+?[\d\s\-\(\)]+$/.test(editForm.phoneNumber)) {
      errors.phoneNumber = 'Invalid phone number format';
    }
    
    if (!editForm.country) {
      errors.country = 'Country is required';
    }
    
    if (!editForm.language) {
      errors.language = 'Language is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setError('');
    
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      
      await mutate();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update your profile", error);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implement password change logic
    console.log('Password change requested');
  };

  const handleUpgrade = () => {
    window.location.href = '/pricing';
  };

  if (fetchError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{fetchError.message}</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return <ProfileSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {error}
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="relative">
                <div className="h-32 bg-gradient-to-r from-[#EECE84] to-[#e5c16e]"></div>
                <div className="absolute -bottom-16 inset-x-0 flex justify-center">
                  <div className="relative">
                  <img
                    src={user?.imageUrl || "/default-avatar.png"}
                      alt="Profile picture"
                      className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
                    />
                    <Button
                      size="sm"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0"
                      variant="secondary"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <CardContent className="pt-20 pb-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-500 mt-1">@{profile.username}</p>
                
                {/* Subscription Status */}
                <div className="mt-4">
                  {profile.subscriptionStatus === 'active' ? (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <Crown className="h-3 w-3 mr-1" />
                      Pro Active
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-gray-600">
                      Free Plan
                    </Badge>
                  )}
                </div>
                
                <div className="mt-6 space-y-3">
                  {profile.subscriptionStatus !== 'active' && (
                      <Button 
                        onClick={handleUpgrade} 
                        className="w-full bg-[#EECE84] hover:bg-[#e5c16e] text-black shadow-md"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Pro
                      </Button>
                  )}
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(true)}
                        className="w-full"
                      >
                    <Edit3 className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                </div>
              </CardContent>
              
              <Separator />
              
              <CardContent className="py-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-5 w-5 text-[#EECE84] mr-3" />
                    <span className="text-sm">{profile.email}</span>
                  </div>
                  {profile.phoneNumber && (
                    <div className="flex items-center text-gray-600">
                      <Phone className="h-5 w-5 text-[#EECE84] mr-3" />
                      <span className="text-sm">{profile.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 text-[#EECE84] mr-3" />
                    <span className="text-sm">
                      {COUNTRIES_ACCOUNT.find(country => country.value === profile.country)?.label || "Not available"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Globe className="h-5 w-5 text-[#EECE84] mr-3" />
                    <span className="text-sm">
                      {LANGUAGES.find(language => language.value === profile.language)?.label || "Not available"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 text-[#EECE84] mr-3" />
                    <span className="text-sm">
                      Joined {new Date(profile.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Study Stats Card */}
            {profile.studyStats && (
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-[#EECE84]" />
                    Study Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Study Time</span>
                    <span className="font-semibold">{Math.floor(profile.studyStats.totalStudyTime / 60)}h</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Questions Answered</span>
                    <span className="font-semibold">{profile.studyStats.questionsAnswered}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Current Streak</span>
                    <span className="font-semibold">{profile.studyStats.currentStreak} days</span>
              </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Accuracy</span>
                    <span className="font-semibold">{profile.studyStats.accuracy}%</span>
            </div>
                  <Progress value={profile.studyStats.accuracy} className="mt-2" />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="aviation">Aviation</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
              </TabsList>

              {/* Profile Tab */}
              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>
                      Update your personal details and contact information
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
              {isEditing ? (
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <FormField label="First Name" error={formErrors.firstName}>
                            <Input
                              value={editForm.firstName}
                              onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                              placeholder="Enter your first name"
                              className={formErrors.firstName ? "border-red-500" : ""}
                            />
                          </FormField>

                          <FormField label="Last Name" error={formErrors.lastName}>
                            <Input
                              value={editForm.lastName}
                              onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                              placeholder="Enter your last name"
                              className={formErrors.lastName ? "border-red-500" : ""}
                            />
                          </FormField>

                          <FormField label="Username" error={formErrors.username}>
                            <Input
                              value={editForm.username}
                              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                              placeholder="Enter your username"
                              className={formErrors.username ? "border-red-500" : ""}
                            />
                          </FormField>

                          <FormField label="Email" error={formErrors.email}>
                            <Input
                              type="email"
                              value={editForm.email}
                              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                              placeholder="Enter your email"
                              className={formErrors.email ? "border-red-500" : ""}
                            />
                          </FormField>

                          <FormField label="Phone Number" error={formErrors.phoneNumber} required={false}>
                            <Input
                              value={editForm.phoneNumber}
                              onChange={(e) => setEditForm({ ...editForm, phoneNumber: e.target.value })}
                              placeholder="Enter your phone number"
                              className={formErrors.phoneNumber ? "border-red-500" : ""}
                            />
                          </FormField>

                      <FormField label="Country" error={formErrors.country}>
                        <ComboboxSelect
                          options={COUNTRIES_ACCOUNT}
                          value={editForm.country}
                          onChange={(value) => setEditForm({ ...editForm, country: value })}
                          placeholder="Select country..."
                          error={formErrors.country}
                          searchPlaceholder="Search country..."
                          emptyMessage="No country found."
                          title="Select Country"
                        />
                      </FormField>

                      <FormField label="Language" error={formErrors.language}>
                        <ComboboxSelect
                          options={LANGUAGES}
                          value={editForm.language}
                          onChange={(value) => setEditForm({ ...editForm, language: value })}
                          placeholder="Select language..."
                          error={formErrors.language}
                          searchPlaceholder="Search language..."
                          emptyMessage="No language found."
                          title="Select Language"
                        />
                      </FormField>
                    </div>

                    <div className="flex justify-end space-x-3 pt-6">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                            className="bg-[#EECE84] hover:bg-[#e5c16e] text-black"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </form>
                    ) : (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                            <p className="text-gray-900">{profile.firstName || 'Not provided'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                            <p className="text-gray-900">{profile.lastName || 'Not provided'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                            <p className="text-gray-900">@{profile.username}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <p className="text-gray-900">{profile.email}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <p className="text-gray-900">{profile.phoneNumber || 'Not provided'}</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                            <p className="text-gray-900">
                              {COUNTRIES_ACCOUNT.find(country => country.value === profile.country)?.label || 'Not provided'}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                            <p className="text-gray-900">
                              {LANGUAGES.find(language => language.value === profile.language)?.label || 'Not provided'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Aviation Tab */}
              <TabsContent value="aviation" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Plane className="h-5 w-5 mr-2 text-[#EECE84]" />
                      Aviation Information
                    </CardTitle>
                    <CardDescription>
                      Tell us about your aviation background and goals
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <FormField label="Occupation" required={false}>
                        <Input
                          value={editForm.occupation}
                          onChange={(e) => setEditForm({ ...editForm, occupation: e.target.value })}
                          placeholder="e.g., Student Pilot, Commercial Pilot, Air Traffic Controller"
                        />
                      </FormField>

                      <FormField label="Aviation Experience" required={false}>
                        <ComboboxSelect
                          options={[
                            { value: 'student', label: 'Student Pilot' },
                            { value: 'private', label: 'Private Pilot' },
                            { value: 'commercial', label: 'Commercial Pilot' },
                            { value: 'atp', label: 'Airline Transport Pilot' },
                            { value: 'instructor', label: 'Flight Instructor' },
                            { value: 'atc', label: 'Air Traffic Controller' },
                            { value: 'maintenance', label: 'Aircraft Maintenance' },
                            { value: 'other', label: 'Other' }
                          ]}
                          value={editForm.aviationExperience}
                          onChange={(value) => setEditForm({ ...editForm, aviationExperience: value })}
                          placeholder="Select your experience level..."
                          searchPlaceholder="Search experience..."
                          emptyMessage="No experience found."
                          title="Select Aviation Experience"
                        />
                      </FormField>

                      <FormField label="License Type" required={false}>
                        <ComboboxSelect
                          options={[
                            { value: 'ppl', label: 'Private Pilot License (PPL)' },
                            { value: 'cpl', label: 'Commercial Pilot License (CPL)' },
                            { value: 'atpl', label: 'Airline Transport Pilot License (ATPL)' },
                            { value: 'ir', label: 'Instrument Rating (IR)' },
                            { value: 'me', label: 'Multi-Engine Rating' },
                            { value: 'instructor', label: 'Flight Instructor Rating' },
                            { value: 'atc', label: 'Air Traffic Control License' },
                            { value: 'none', label: 'No License Yet' }
                          ]}
                          value={editForm.licenseType}
                          onChange={(value) => setEditForm({ ...editForm, licenseType: value })}
                          placeholder="Select your license type..."
                          searchPlaceholder="Search license..."
                          emptyMessage="No license found."
                          title="Select License Type"
                        />
                      </FormField>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Shield className="h-5 w-5 mr-2 text-[#EECE84]" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Manage your password and security preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handlePasswordChange} className="space-y-6">
                      <FormField label="Current Password">
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            placeholder="Enter your current password"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormField>

                      <FormField label="New Password">
                        <Input
                          type="password"
                          value={passwordForm.newPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                          placeholder="Enter your new password"
                        />
                      </FormField>

                      <FormField label="Confirm New Password">
                        <Input
                          type="password"
                          value={passwordForm.confirmPassword}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                          placeholder="Confirm your new password"
                        />
                      </FormField>

                      <Button type="submit" className="bg-[#EECE84] hover:bg-[#e5c16e] text-black">
                        <Key className="h-4 w-4 mr-2" />
                        Update Password
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="h-5 w-5 mr-2 text-[#EECE84]" />
                      Notification Preferences
                    </CardTitle>
                    <CardDescription>
                      Choose how you want to be notified about updates and activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-gray-600">Receive notifications via email</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-gray-600">Receive push notifications in your browser</p>
                        </div>
                        <Switch id="push-notifications" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="study-reminders">Study Reminders</Label>
                          <p className="text-sm text-gray-600">Get reminded to study regularly</p>
                        </div>
                        <Switch id="study-reminders" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="exam-reminders">Exam Reminders</Label>
                          <p className="text-sm text-gray-600">Get notified about upcoming exams</p>
                        </div>
                        <Switch id="exam-reminders" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="achievement-notifications">Achievement Notifications</Label>
                          <p className="text-sm text-gray-600">Get notified when you earn achievements</p>
                        </div>
                        <Switch id="achievement-notifications" defaultChecked />
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="weekly-reports">Weekly Reports</Label>
                          <p className="text-sm text-gray-600">Receive weekly progress reports</p>
                        </div>
                        <Switch id="weekly-reports" />
                      </div>
            </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;