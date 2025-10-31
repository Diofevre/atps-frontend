'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/lib/keycloakAuth';

interface SignupData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type View = 'signup' | 'verify-email';

export default function SignupForm() {
  const [view, setView] = useState<View>('signup');
  const [formData, setFormData] = useState<SignupData>({
    name: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const router = useRouter();

  // Timer for resend cooldown
  useEffect(() => {
    if (view === 'verify-email' && resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown, view]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/keycloak/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          username: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setView('verify-email');
        setResendCooldown(30); // 30 seconds cooldown
      } else {
        setError(data.message || 'Error creating account');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/keycloak/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: verificationCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Show success message
        setSuccess('Account activated successfully! Redirecting to login...');
        
        // Redirect to login after showing success message
        setTimeout(() => {
          router.push('/login?message=account-created');
        }, 2000);
      } else {
        setError(data.message || 'Invalid verification code');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/keycloak/resend-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();

      if (data.success) {
        setResendCooldown(data.waitTime || 30); // Reset cooldown
        setSuccess('Verification code resent successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.message || 'Failed to resend code');
        if (data.waitTime) {
          setResendCooldown(data.waitTime);
        }
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Email verification step
  if (view === 'verify-email') {
    return (
      <form onSubmit={handleVerifyCode} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#2D3748' }}>
            Email Verification
          </h2>
          <p className="text-sm" style={{ color: '#718096' }}>
            We've sent a verification code to <strong>{formData.email}</strong>
          </p>
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="code" 
            className="block text-sm font-semibold"
            style={{ color: '#4A5568' }}
          >
            Verification Code
          </label>
          <input
            id="code"
            type="text"
            placeholder="123456"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
            required
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed text-center text-2xl tracking-widest font-mono"
            style={{
              borderColor: '#C1E0F1',
              backgroundColor: '#F7FAFC'
            }}
            onFocus={(e) => e.target.style.borderColor = '#EECE84'}
            onBlur={(e) => e.target.style.borderColor = '#C1E0F1'}
          />
          <p className="text-xs" style={{ color: '#718096' }}>
            This code expires in 2 minutes
          </p>
        </div>

        {error && (
          <div className="px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-2"
            style={{
              backgroundColor: '#FED7D7',
              color: '#C53030'
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-2"
            style={{
              backgroundColor: '#C6F6D5',
              color: '#22543D'
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>{success}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || verificationCode.length !== 6}
          className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none relative overflow-hidden group"
          style={{
            background: '#EECE84',
            color: '#2D3748',
            boxShadow: '0 10px 30px rgba(238, 206, 132, 0.5)'
          }}
        >
          <span className="relative z-10">
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Verifying...
              </span>
            ) : (
              'Verify Code'
            )}
          </span>
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            style={{
              background: 'rgba(0,0,0,0.1)'
            }}
          />
        </button>

        <button
          type="button"
          onClick={handleResendCode}
          className="w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:bg-gray-100 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ color: '#718096' }}
          disabled={loading || resendCooldown > 0}
        >
          {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
        </button>
      </form>
    );
  }

  // Signup form
  return (
    <form onSubmit={handleSignup} className="space-y-5">
      {/* Full Name and Username on same row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label 
            htmlFor="name" 
            className="block text-sm font-semibold"
            style={{ color: '#4A5568' }}
          >
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{
              borderColor: '#C1E0F1',
              backgroundColor: '#F7FAFC'
            }}
            onFocus={(e) => e.target.style.borderColor = '#EECE84'}
            onBlur={(e) => e.target.style.borderColor = '#C1E0F1'}
          />
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="username" 
            className="block text-sm font-semibold"
            style={{ color: '#4A5568' }}
          >
            Username <span className="text-red-500">*</span>
          </label>
          <input
            id="username"
            type="text"
            placeholder="johndoe"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '') })}
            required
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{
              borderColor: '#C1E0F1',
              backgroundColor: '#F7FAFC'
            }}
            onFocus={(e) => e.target.style.borderColor = '#EECE84'}
            onBlur={(e) => e.target.style.borderColor = '#C1E0F1'}
          />
        </div>
      </div>

      <div className="space-y-2">
        <label 
          htmlFor="email" 
          className="block text-sm font-semibold"
          style={{ color: '#4A5568' }}
        >
          Email <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          type="email"
          placeholder="vous@exemple.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={loading}
          className="w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          style={{
            borderColor: '#C1E0F1',
            backgroundColor: '#F7FAFC'
          }}
          onFocus={(e) => e.target.style.borderColor = '#EECE84'}
          onBlur={(e) => e.target.style.borderColor = '#C1E0F1'}
        />
      </div>

      {/* Password and Confirm Password on same row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label 
            htmlFor="password" 
            className="block text-sm font-semibold"
            style={{ color: '#4A5568' }}
          >
            Password <span className="text-red-500">*</span>
          </label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{
              borderColor: '#C1E0F1',
              backgroundColor: '#F7FAFC'
            }}
            onFocus={(e) => e.target.style.borderColor = '#EECE84'}
            onBlur={(e) => e.target.style.borderColor = '#C1E0F1'}
          />
          <p className="text-xs" style={{ color: '#718096' }}>
            Min. 8 chars
          </p>
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="confirmPassword" 
            className="block text-sm font-semibold"
            style={{ color: '#4A5568' }}
          >
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            required
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{
              borderColor: formData.password === formData.confirmPassword && formData.confirmPassword ? '#C6F6D5' : '#C1E0F1',
              backgroundColor: '#F7FAFC'
            }}
            onFocus={(e) => e.target.style.borderColor = '#EECE84'}
            onBlur={(e) => e.target.style.borderColor = formData.password === formData.confirmPassword && formData.confirmPassword ? '#C6F6D5' : '#C1E0F1'}
          />
        </div>
      </div>

      {error && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium flex items-center space-x-2"
          style={{
            backgroundColor: '#FED7D7',
            color: '#C53030'
          }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none relative overflow-hidden group"
        style={{
          background: '#EECE84',
          color: '#2D3748',
          boxShadow: '0 10px 30px rgba(238, 206, 132, 0.5)'
        }}
      >
        <span className="relative z-10">
          {loading ? (
                          <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating account...
              </span>
            ) : (
              'Create Account'
            )}
        </span>
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{
            background: 'rgba(0,0,0,0.1)'
          }}
        />
      </button>

      <div className="text-center text-sm pt-4" style={{ color: '#718096' }}>
        <p>
          Already have an account?{' '}
          <a href="/login" className="font-semibold hover:underline" style={{ color: '#2D3748' }}>
            Log in
          </a>
        </p>
      </div>
    </form>
  );
}
