'use client';

import { useState, useEffect, Suspense } from 'react';
import { login, LoginCredentials } from '@/lib/keycloakAuth';
import { useRouter, useSearchParams } from 'next/navigation';

interface LoginFormProps {
  redirectTo?: string;
}

type View = 'login' | 'forgot-password';

// Composant interne qui utilise useSearchParams
function LoginFormContent({ redirectTo }: LoginFormProps) {
  const [view, setView] = useState<View>('login');
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [forgotEmail, setForgotEmail] = useState('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for account creation message
  useEffect(() => {
    const message = searchParams.get('message');
    if (message && message === 'account-created') {
      setSuccess('Your account has been created successfully! Please login with your credentials.');
      // Clear the query parameter
      router.replace('/login');
    }
  }, [searchParams, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await login(credentials);
      
      if (response.success) {
        // Show success message before redirecting
        setSuccess('Login successful! Redirecting to dashboard...');
        
        // Wait 1 second to show success message
        setTimeout(() => {
          if (rememberMe) {
            // Store credentials in localStorage (secure cookie would be better in production)
            localStorage.setItem('remember_me', 'true');
          }
          router.push(redirectTo || '/dashboard');
          router.refresh();
        }, 1000);
      } else {
        setError(response.message || 'Identifiants invalides');
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/keycloak/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: forgotEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Si cet email existe dans notre base de données, vous recevrez un lien de réinitialisation.');
        setTimeout(() => {
          setView('login');
          setSuccess('');
          setForgotEmail('');
        }, 3000);
      } else {
        setError(data.message || 'Une erreur est survenue.');
      }
    } catch (error) {
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  // Reset password form
  if (view === 'forgot-password') {
    return (
      <form onSubmit={handleForgotPassword} className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#2D3748' }}>
            Mot de passe oublié ?
          </h2>
          <p className="text-sm" style={{ color: '#718096' }}>
            Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>

        <div className="space-y-2">
          <label 
            htmlFor="forgot-email" 
            className="block text-sm font-semibold"
            style={{ color: '#4A5568' }}
          >
            Adresse email
          </label>
          <input
            id="forgot-email"
            type="email"
            placeholder="vous@exemple.com"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{
              borderColor: '#C1E0F1',
              backgroundColor: '#F7FAFC',
              color: '#2D3748'
            }}
            onFocus={(e) => e.target.style.borderColor = '#EECE84'}
            onBlur={(e) => e.target.style.borderColor = '#C1E0F1'}
          />
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
                Envoi en cours...
              </span>
            ) : (
              'Envoyer le lien de réinitialisation'
            )}
          </span>
          <div 
            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
            style={{
              background: 'rgba(0,0,0,0.1)'
            }}
          />
        </button>

        {/* Back button */}
        <button
          type="button"
          onClick={() => {
            setView('login');
            setError('');
            setForgotEmail('');
          }}
          className="w-full py-3 px-6 rounded-xl font-medium transition-all duration-300 hover:bg-gray-100"
          style={{ color: '#718096' }}
          disabled={loading}
        >
          ← Retour à la connexion
        </button>
      </form>
    );
  }

  // Login form
  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <div className="space-y-2">
        <label 
          htmlFor="username" 
          className="block text-sm font-semibold"
          style={{ color: '#4A5568' }}
        >
          Email ou nom d'utilisateur
        </label>
        <input
          id="username"
          type="text"
          placeholder="vous@exemple.com"
          value={credentials.username}
          onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
          required
          disabled={loading}
          className="w-full px-4 py-3.5 rounded-xl border-2 transition-all duration-200 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
          style={{
            borderColor: '#C1E0F1',
            backgroundColor: '#F7FAFC',
            color: '#2D3748'
          }}
          onFocus={(e) => e.target.style.borderColor = '#EECE84'}
          onBlur={(e) => e.target.style.borderColor = '#C1E0F1'}
        />
      </div>

      <div className="space-y-2">
        <label 
          htmlFor="password" 
          className="block text-sm font-semibold"
          style={{ color: '#4A5568' }}
        >
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
            disabled={loading}
            className="w-full px-4 py-3.5 pr-12 rounded-xl border-2 transition-all duration-200 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            style={{
              borderColor: '#C1E0F1',
              backgroundColor: '#F7FAFC',
              color: '#2D3748'
            }}
            onFocus={(e) => e.target.style.borderColor = '#EECE84'}
            onBlur={(e) => e.target.style.borderColor = '#C1E0F1'}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
            style={{ color: '#718096' }}
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Remember me and Forgot password in same row */}
      <div className="flex items-center justify-between">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-2 transition-colors"
            style={{
              borderColor: '#C1E0F1',
              accentColor: '#EECE84'
            }}
          />
          <span className="text-sm" style={{ color: '#4A5568' }}>Remember me</span>
        </label>
        
        <button
          type="button"
          onClick={() => setView('forgot-password')}
          className="text-sm font-medium hover:underline transition-colors"
          style={{ color: '#2D3748' }}
        >
          Mot de passe oublié ?
        </button>
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
              Connexion en cours...
            </span>
          ) : (
            'Se connecter'
          )}
        </span>
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
          style={{
            background: 'rgba(0,0,0,0.1)'
          }}
        />
      </button>

      {/* Sign up link */}
      <div className="text-center text-sm pt-4 border-t" style={{ borderColor: '#C1E0F1', color: '#718096' }}>
        <p>Don't have an account?{' '}
          <a href="/signup" className="font-semibold hover:underline transition-colors" style={{ color: '#2D3748' }}>
            Sign up
          </a>
        </p>
        <p className="mt-2">Test account: <span className="font-semibold" style={{ color: '#2D3748' }}>client@atps.com</span> / <span className="font-semibold" style={{ color: '#2D3748' }}>client123</span></p>
      </div>
    </form>
  );
}

// Wrapper avec Suspense pour useSearchParams
export default function LoginForm({ redirectTo = '/dashboard' }: LoginFormProps) {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <LoginFormContent redirectTo={redirectTo} />
    </Suspense>
  );
}
