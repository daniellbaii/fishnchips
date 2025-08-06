'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Button from '@/components/ui/Button';

function AdminLoginForm() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const redirectPath = searchParams.get('redirect') || '/admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Success - redirect to admin panel
        router.push(redirectPath);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="text-5xl sm:text-6xl mb-4">🔐</div>
          <h1 className="text-2xl sm:text-3xl display-font text-coastal mb-2">Admin Access</h1>
          <p className="text-secondary text-sm sm:text-base">Mount Pleasant Fish & Chips</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl coastal-shadow p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-semibold mb-3 text-foreground">
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 text-base border-2 border-border focus:border-coastal rounded-lg bg-warm-white transition-colors duration-200 text-foreground min-h-[48px]"
                placeholder="Enter admin password"
                required
                disabled={isLoading}
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center">
                  <span className="text-red-600 mr-2">⚠️</span>
                  <span className="text-red-700 text-sm font-medium">{error}</span>
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="coastal"
              size="lg"
              className="w-full py-4 font-bold"
              disabled={isLoading}
            >
              {isLoading ? '🔄 Signing In...' : '🔑 Sign In'}
            </Button>
          </form>

          {/* Info Section */}
          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-border">
            <div className="text-center">
              <h3 className="text-sm font-semibold text-coastal mb-2">For Restaurant Staff Only</h3>
              <p className="text-xs text-secondary leading-relaxed">
                This area is restricted to authorized personnel for order management and restaurant operations.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <p className="text-xs text-secondary">
            Need help? Contact the restaurant owner
          </p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-6xl">🍟</div>
      </div>
    }>
      <AdminLoginForm />
    </Suspense>
  );
}