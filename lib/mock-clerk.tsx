'use client';

import React, { createContext, useContext, ReactNode } from 'react';

// Mock user object
const mockUser = {
  id: 'mock-user-dev-123',
  emailAddresses: [{ emailAddress: 'test@atps.com' }],
  firstName: 'Test',
  lastName: 'User',
  imageUrl: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// Mock Clerk context
interface MockClerkContextType {
  isLoaded: boolean;
  isSignedIn: boolean;
  user: typeof mockUser | null;
  signOut: () => void;
  getToken: () => Promise<string>;
}

const MockClerkContext = createContext<MockClerkContextType>({
  isLoaded: true,
  isSignedIn: true,
  user: mockUser,
  signOut: () => {},
  getToken: async () => 'mock-token-123',
});

// Mock Clerk Provider
export function MockClerkProvider({ children }: { children: ReactNode }) {
  return (
    <MockClerkContext.Provider
      value={{
        isLoaded: true,
        isSignedIn: true,
        user: mockUser,
        signOut: () => {
          console.log('Mock sign out');
        },
        getToken: async () => 'mock-token-123',
      }}
    >
      {children}
    </MockClerkContext.Provider>
  );
}

// Mock hooks
export function useUser() {
  const context = useContext(MockClerkContext);
  return {
    user: context.user,
    isLoaded: context.isLoaded,
  };
}

export function useAuth() {
  const context = useContext(MockClerkContext);
  return {
    isSignedIn: context.isSignedIn,
    user: context.user,
    userId: context.user?.id,
    getToken: context.getToken,
    signOut: context.signOut,
  };
}

export function useClerk() {
  const context = useContext(MockClerkContext);
  return {
    user: context.user,
    signOut: context.signOut,
    openSignIn: () => {},
    openSignUp: () => {},
  };
}

// Mock components
export function SignedIn({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function SignedOut({ children }: { children: ReactNode }) {
  return null;
}

export function SignInButton({ children, ...props }: any) {
  return <button {...props}>{children}</button>;
}

export function SignUpButton({ children, ...props }: any) {
  return <button {...props}>{children}</button>;
}

export function UserButton({ ...props }: any) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
        TU
      </div>
      <span className="text-sm">Test User</span>
    </div>
  );
}

export function UserProfile({ ...props }: any) {
  return (
    <div className="p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">User Profile</h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <p className="mt-1 text-sm text-gray-900">test@atps.com</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <p className="mt-1 text-sm text-gray-900">Test User</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Member since</label>
          <p className="mt-1 text-sm text-gray-900">{new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
}

export function ClerkProvider({ children }: { children: ReactNode }) {
  return <MockClerkProvider>{children}</MockClerkProvider>;
}

