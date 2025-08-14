import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Target, MapPin, Camera, TrendingUp, ArrowRight } from 'lucide-react';
import golfIcon from '../assets/golf-icon.svg';

const LoginPage: React.FC = () => {
  const { signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to sign in. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Track Courses",
      description: "Map every course you've played"
    },
    {
      icon: <Camera className="w-5 h-5" />,
      title: "Capture Memories",
      description: "Photos from your rounds"
    },
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: "View Statistics",
      description: "Track your golf journey"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#10b981_1px,transparent_1px)] bg-[size:32px_32px] opacity-[0.03]" />
      
      <div className="relative min-h-screen flex">
        {/* Left Side - Hero Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-500 to-emerald-600 p-12 flex-col justify-between text-white relative overflow-hidden">
          {/* Background Golf Elements */}
          <div className="absolute top-10 right-10 opacity-10">
            <Target size={120} />
          </div>
          <div className="absolute bottom-20 left-10 opacity-10">
            <Target size={80} />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <img src={golfIcon} alt="Golf Icon" className="w-12 h-12" />
              <div>
                <h1 className="text-2xl font-bold">Golf with Dad</h1>
                <p className="text-emerald-100 text-sm">Adventures on the Course</p>
              </div>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl font-bold leading-tight">
                Every Round<br />
                Tells a Story
              </h2>
              <p className="text-emerald-100 text-lg leading-relaxed">
                Track your golf adventures, capture memories, and relive 
                those perfect moments on the course with Dad.
              </p>
            </div>
          </div>
          
          <div className="relative z-10 space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 text-emerald-100">
                <div className="flex-shrink-0 w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  {feature.icon}
                </div>
                <div>
                  <div className="font-medium text-white">{feature.title}</div>
                  <div className="text-sm">{feature.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <img src={golfIcon} alt="Golf Icon" className="w-16 h-16 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-gray-900">Golf with Dad</h1>
              <p className="text-gray-600 mt-2">Track your golf adventures</p>
            </div>

            {/* Login Card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 relative">
              {/* Decorative element */}
              <div className="absolute -top-3 -right-3 w-6 h-6 bg-emerald-500 rounded-full opacity-20" />
              <div className="absolute -bottom-3 -left-3 w-4 h-4 bg-emerald-300 rounded-full opacity-30" />
              
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
                <p className="text-gray-600">Sign in to continue your golf journey</p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
                    <p className="text-red-700 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                aria-label="Sign in with Google"
                className="w-full bg-white border border-gray-300 rounded-xl px-6 py-4 flex items-center justify-center gap-3 hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
              >
                {/* Google Logo */}
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                
                <span className="font-medium text-gray-700 group-hover:text-gray-900">
                  {isLoading ? 'Signing in...' : 'Continue with Google'}
                </span>
                
                {!isLoading && (
                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all duration-200" />
                )}
                
                {isLoading && (
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-emerald-500 rounded-full animate-spin" />
                )}
              </button>

              <div className="mt-8 text-center">
                <p className="text-xs text-gray-500 leading-relaxed">
                  This is a private application for tracking<br />
                  golf adventures with family and friends.
                </p>
              </div>

              {/* reCAPTCHA container */}
              <div id="recaptcha-container" className="mt-4" />
            </div>

            {/* Bottom text */}
            <div className="text-center mt-8">
              <p className="text-sm text-gray-500">
                Ready to track your next round? 
                <span className="text-emerald-600 font-medium ml-1">Let's get started!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
