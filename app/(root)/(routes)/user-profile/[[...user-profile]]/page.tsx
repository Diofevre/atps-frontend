/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useEffect, useCallback } from 'react';
import { Settings, Mail, MapPin, Globe, Calendar, X, Save, AlertTriangle, Crown, Search, Loader2 } from 'lucide-react';
import { useAuth, useClerk, UserProfile } from '@clerk/nextjs';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { cn, COUNTRIES_ACCOUNT, LANGUAGES, Option } from "@/lib/utils";

// Types
interface UserProfile {
  id: string;
  clerkId: string;
  email: string;
  name: string;
  username: string;
  picture: string;
  country: string;
  language: string;
  createdAt: string;
  updatedAt: string;
}

interface FormErrors {
  name?: string;
  username?: string;
  email?: string;
  picture?: string;
  country?: string;
  language?: string;
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
  children 
}: { 
  label: string, 
  error?: string, 
  children: React.ReactNode 
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} *
    </label>
    {children}
    {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
  </div>
);

const Page = () => {
  const { user } = useClerk();
  const { getToken } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    email: '',
    picture: '',
    country: '',
    language: ''
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const validateForm = () => {
    const errors: FormErrors = {};
    
    if (!editForm.name.trim()) {
      errors.name = 'Name is required';
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
    
    if (!editForm.country) {
      errors.country = 'Country is required';
    }
    
    if (!editForm.language) {
      errors.language = 'Language is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const fetchProfile = useCallback(async () => {
    const token = await getToken();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch profile');
      const data = await response.json();

      setProfile(data);
      setEditForm({
        name: data.name || '',
        username: data.username || '',
        email: data.email || '',
        picture: data.picture || '',
        country: data.country || '',
        language: data.language || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setError('');
    
    const token = await getToken();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (!response.ok) throw new Error('Failed to update profile');
      const updatedProfile = await response.json();
      setProfile(updatedProfile);
      setIsEditing(false);

      fetchProfile();
    } catch (error) {
      console.error("Failed to update your profile", error);
      setError('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpgrade = () => {
    window.location.href = '/upgrade';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EECE84]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
            <div className="bg-[#f7f7f7] rounded-2xl shadow-lg border border-primary/10 overflow-hidden">
              <div className="relative">
                <div className="h-32 bg-[#EECE84]"></div>
                <div className="absolute -bottom-12 inset-x-0 flex justify-center">
                <img
                  src={user?.imageUrl || "/default-avatar.png"}
                  alt="Photo de profil"
                  className="w-16 h-16 rounded-full"
                />
                </div>
              </div>
              
              <div className="pt-16 pb-8 px-6 text-center">
                <h2 className="text-2xl font-bold text-gray-900">{profile?.name}</h2>
                <p className="text-gray-500 mt-1">@{user?.username}</p>
                
                <div className="mt-6 space-y-4">
                  {!isEditing && (
                    <>
                      <Button 
                        onClick={handleUpgrade} 
                        className="w-full bg-[#EECE84] hover:bg-[#e5c16e] text-black shadow-md"
                      >
                        <Crown className="h-4 w-4 mr-2" />
                        Upgrade to Pro
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => setIsEditing(true)}
                        className="w-full"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                    </>
                  )}
                </div>
              </div>
              
              <Separator />
              
              <div className="px-6 py-4">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-600">
                    <Mail className="h-5 w-5 text-[#EECE84] mr-3" />
                    <span className="text-sm">{user?.primaryEmailAddress?.emailAddress}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-5 w-5 text-[#EECE84] mr-3" />
                    <span className="text-sm">
                      {COUNTRIES_ACCOUNT.find(country => country.value === profile?.country)?.label || "Non disponible"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Globe className="h-5 w-5 text-[#EECE84] mr-3" />
                    <span className="text-sm">
                      {LANGUAGES.find(language => language.value === profile?.language)?.label || "Non disponible"}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-5 w-5 text-[#EECE84] mr-3" />
                    <span className="text-sm">
                      Joined {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Non disponible"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Edit Form or Activity */}
          <div className="lg:col-span-2">
            <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${isEditing && 'p-8'}`}>
              {isEditing ? (
                <>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Edit Profile</h3>
                  <form onSubmit={handleUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                        className='rounded-[20px]'
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        className="bg-[#EECE84] hover:bg-[#e5c16e] text-black rounded-[20px]"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  </form>
                </>
              ) : (
                <>
                  <UserProfile />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Page;