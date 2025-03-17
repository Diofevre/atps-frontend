/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState } from 'react';
import { Lock, Mail, User } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle authentication logic here
  };

  const handleSocialLogin = (provider: string) => {
    // Handle social login logic here
    console.log(`Logging in with ${provider}`);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Main Content */}
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="mb-8 text-center">
          <img 
            src="/atps-default.png"
            alt="Luxury Hotel"
            className="w-20 h-20 mx-auto rounded-[12px] object-cover shadow-lg"
          />
        </div>

        {/* Main Card */}
        <div className="p-8">
          <h2 className="text-2xl font-light text-center text-blue-900 mb-8">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>

          {/* Social Login Buttons */}
          <div className="space-y-3 mb-8">
            <button
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center space-x-3 py-3 rounded-xl text-gray-700 bg-white border transition-colors"
            >
              <FcGoogle className="w-5 h-5 text-gray-700" />
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </button>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 text-gray-500 bg-white ">Or continue with</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-3 text-gray-900 placeholder-gray-400 bg-white rounded-xl focus:ring-2 focus:ring-emerald-500/80 focus:outline-none transition-colors border border-gray-200"
                    placeholder="Full Name"
                    required
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 text-gray-900 placeholder-gray-400 bg-white rounded-xl focus:ring-2 focus:ring-emerald-500/80 focus:outline-none transition-colors border border-gray-200"
                  placeholder="Email address"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 text-gray-900 placeholder-gray-400 bg-white rounded-xl focus:ring-2 focus:ring-emerald-500/80 focus:outline-none transition-colors border border-gray-200"
                  placeholder="Password"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end">
                <button className="text-sm text-emerald-600 hover:text-emerald-700">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 bg-[#EECE84] py-3 px-4 rounded-xl hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-300 transition-colors mt-6"
            >
              <span>{isLogin ? 'CONTINUE' : 'CONTINUE'}</span>
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-emerald-600 hover:text-emerald-700"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-sm text-gray-500">
          By clicking continue, you agree to our{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700">Terms of Service</a>{' '}
          and acknowledge that you have read our{' '}
          <a href="#" className="text-blue-600 hover:text-blue-700">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
}

export default Login;