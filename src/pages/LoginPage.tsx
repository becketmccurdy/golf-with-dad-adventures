import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button';

import logo from '../assets/react.svg'; // Replace with your own logo

const LoginPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
    } catch (err) {
      console.error('Login error:', err);
      setError('Failed to sign in with Google. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-200 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <img src={logo} alt="Logo" className="h-16 mb-4" />
          <h1 className="text-2xl font-bold text-center">Golf with Dad</h1>
          <p className="text-stone-500 text-center mt-2">
            Log in to track your golf courses and rounds
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <Button
            fullWidth
            onClick={handleGoogleSignIn}
            isLoading={isLoading}
            className="flex items-center justify-center gap-2"
          >
            <span>Sign in with Google</span>
          </Button>

          <div id="recaptcha-container"></div>
        </div>

        <p className="text-xs text-stone-400 text-center mt-8">
          This is a private application for tracking golf adventures.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
