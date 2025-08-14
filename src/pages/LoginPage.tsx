import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Target, MapPin, Camera, TrendingUp, ArrowRight, Phone, ShieldCheck } from 'lucide-react';
import golfIcon from '../assets/golf-icon.svg';
import { Button } from '../components/Button';
import { useToast } from '../hooks/useToast';

const LoginPage: React.FC = () => {
  const { signInWithGoogle, signInWithPhone, confirmPhoneCode, currentUser } = useAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  // Phone auth state
  const [phone, setPhone] = React.useState('');
  const [verificationId, setVerificationId] = React.useState<string | null>(null);
  const [code, setCode] = React.useState('');
  const [isSending, setIsSending] = React.useState(false);
  const [isVerifying, setIsVerifying] = React.useState(false);

  // If already authenticated, redirect to dashboard
  React.useEffect(() => {
    if (currentUser) {
      navigate('/dashboard', { replace: true });
    }
  }, [currentUser, navigate]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signInWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to sign in. Please try again.');
      showToast('Unable to sign in with Google', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendCode = async () => {
    if (!phone || phone.replace(/\D/g, '').length < 10) {
      setError('Enter a valid phone number');
      return;
    }
    try {
      setIsSending(true);
      setError(null);
      const confirmationResult: any = await signInWithPhone(phone);
      setVerificationId(confirmationResult.verificationId);
      showToast('Verification code sent', 'info');
    } catch (err) {
      console.error('Phone sign-in error:', err);
      setError('Failed to send verification code. Please try again.');
      showToast('Failed to send verification code', 'error');
    } finally {
      setIsSending(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationId) return;
    if (!code || code.length < 6) {
      setError('Enter the 6-digit verification code');
      return;
    }
    try {
      setIsVerifying(true);
      setError(null);
      await confirmPhoneCode(verificationId, code);
      navigate('/dashboard');
    } catch (err) {
      console.error('Code verification error:', err);
      setError('Invalid or expired code. Please try again.');
      showToast('Invalid or expired code', 'error');
    } finally {
      setIsVerifying(false);
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
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 lg:p-8 relative" role="region" aria-label="Sign in panel">
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

              <Button onClick={handleGoogleSignIn} disabled={isLoading} isLoading={isLoading} fullWidth aria-label="Sign in with Google" className="mb-3">
                <span className="flex items-center gap-3">
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="font-medium">Continue with Google</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </span>
              </Button>

              {/* Divider */}
              <div className="flex items-center my-4" role="separator" aria-label="or continue with phone">
                <div className="flex-1 h-px bg-stone-200" />
                <span className="px-3 text-xs text-stone-400">or</span>
                <div className="flex-1 h-px bg-stone-200" />
              </div>

              {/* Phone sign-in */}
              <div className="space-y-3" aria-label="Phone sign in">
                <label className="block text-sm font-medium text-stone-700">Phone number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 text-stone-400" size={18} aria-hidden="true" />
                  <input
                    type="tel"
                    inputMode="tel"
                    placeholder="e.g., +1 555 123 4567"
                    className="pl-10 w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    aria-label="Phone number"
                  />
                </div>
                <Button type="button" variant="secondary" isLoading={isSending} onClick={handleSendCode} fullWidth>
                  Send verification code
                </Button>

                {verificationId && (
                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-stone-700">Verification code</label>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="6-digit code"
                      className="w-full rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-500 focus:border-transparent py-2 px-3 tracking-widest"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                      aria-label="Verification code"
                    />
                    <Button type="button" isLoading={isVerifying} onClick={handleVerifyCode} fullWidth>
                      Verify and continue
                    </Button>
                    <div className="text-xs text-stone-500 flex items-center gap-1">
                      <ShieldCheck size={14} />
                      Protected by reCAPTCHA.
                    </div>
                  </div>
                )}
              </div>

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
