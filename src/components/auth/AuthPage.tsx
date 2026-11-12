import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, User } from '../../types';
import { MAKAZI_LOGO } from '../../data/mockData';
import {
  Building2,
  Lock,
  Mail,
  Phone,
  User as UserIcon,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  ArrowRight,
  KeyRound,
  Compass,
  ShieldAlert,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'signin' | 'signup';
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ initialMode = 'signin', onSuccess }) => {
  const { users, loginAs, addUser, setCurrentView, switchRole } = useApp();

  const [mode, setMode] = useState<'signin' | 'signup' | 'forgot'>(initialMode);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Sign In Form
  const [signInIdentifier, setSignInIdentifier] = useState('david.kiprop@makaziproperties.co.ke');
  const [signInPassword, setSignInPassword] = useState('Password123#');

  // Sign Up Form
  const [signUpRole, setSignUpRole] = useState<UserRole>('seeker');
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPhone, setSignUpPhone] = useState('+254 7');
  const [signUpNationalId, setSignUpNationalId] = useState('');
  const [signUpAgency, setSignUpAgency] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Forgot Password Form
  const [forgotEmail, setForgotEmail] = useState('');

  // Google Auth State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleAuthLoading, setGoogleAuthLoading] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [googleSelectedRole, setGoogleSelectedRole] = useState<UserRole>('seeker');

  const handleGoogleAuth = (email: string, name: string, preferredRole: UserRole = 'seeker') => {
    setGoogleAuthLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      let user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        user = {
          id: 'user_google_' + Date.now(),
          name,
          email,
          phone: '+254 700 123 456',
          role: mode === 'signup' ? googleSelectedRole : preferredRole,
          status: 'active',
          isVerified: true,
          createdAt: new Date().toISOString(),
        };
        addUser(user);
      }
      setGoogleAuthLoading(false);
      setShowGoogleModal(false);
      loginAs(user);
      if (onSuccess) onSuccess();
    }, 600);
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    setTimeout(() => {
      // Find user by email or phone
      const matched = users.find(
        (u) =>
          u.email.toLowerCase() === signInIdentifier.trim().toLowerCase() ||
          u.phone.replace(/\D/g, '') === signInIdentifier.replace(/\D/g, '')
      );

      setLoading(false);

      if (matched) {
        if (matched.status === 'suspended') {
          setErrorMsg('This account has been suspended by platform administration. Please contact compliance@makazi.co.ke.');
          return;
        }
        loginAs(matched);
        if (onSuccess) onSuccess();
      } else {
        // Fallback for demo: if user entered demo credentials or any email, allow sign in as seeker or matched
        const demoUser: User = {
          id: 'user_' + Date.now(),
          name: signInIdentifier.split('@')[0],
          email: signInIdentifier,
          phone: '+254 712 345 678',
          role: 'seeker',
          status: 'active',
          isVerified: true,
          createdAt: new Date().toISOString(),
        };
        addUser(demoUser);
        loginAs(demoUser);
        if (onSuccess) onSuccess();
      }
    }, 700);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!agreeTerms) {
      setErrorMsg('Please accept the MAKAZI Terms of Service and Privacy Policy.');
      return;
    }

    if (signUpPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const existing = users.find((u) => u.email.toLowerCase() === signUpEmail.trim().toLowerCase());
      if (existing) {
        setLoading(false);
        setErrorMsg('An account with this email address already exists. Please sign in instead.');
        return;
      }

      const newUser: User = {
        id: 'user_' + Date.now(),
        name: signUpName,
        email: signUpEmail,
        phone: signUpPhone,
        role: signUpRole,
        nationalId: signUpNationalId,
        agencyName: signUpRole === 'manager' ? signUpAgency || 'Independent Property Owner' : undefined,
        status: 'active',
        isVerified: true,
        createdAt: new Date().toISOString(),
      };

      addUser(newUser);
      setLoading(false);
      setSuccessMsg('Account created successfully! Redirecting to your dashboard...');

      setTimeout(() => {
        loginAs(newUser);
        if (onSuccess) onSuccess();
      }, 1000);
    }, 800);
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setSuccessMsg(`A secure password reset SMS and email link has been sent to ${forgotEmail}.`);
    }, 700);
  };

  const handleDemoLogin = (role: UserRole) => {
    switchRole(role);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      
      {/* Return link */}
      <div className="w-full max-w-md mb-6">
        <button
          onClick={() => setCurrentView('home')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#143642] hover:text-[#B76935] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to MAKAZI Marketplace</span>
        </button>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl border border-[#E7E4DE] shadow-xl overflow-hidden">
        
        {/* Brand Banner */}
        <div className="bg-[#143642] text-white p-6 text-center space-y-2 relative overflow-hidden">
          <div className="bg-white px-4 py-2 rounded-2xl inline-block shadow-md mx-auto mb-1">
            <img
              src={MAKAZI_LOGO}
              alt="MAKAZI"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </div>
          <p className="text-xs text-[#E7E4DE]/80">
            {mode === 'signin' && 'Sign in to access your properties, leases, or M-Pesa payments'}
            {mode === 'signup' && 'Create your verified account for Kenya rental real estate'}
            {mode === 'forgot' && 'Reset your password with your mobile phone or email'}
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        {mode !== 'forgot' && (
          <div className="grid grid-cols-2 border-b border-[#E7E4DE] bg-[#F8F6F2] text-xs font-semibold">
            <button
              onClick={() => {
                setMode('signin');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-3 text-center transition-colors ${
                mode === 'signin'
                  ? 'bg-white text-[#143642] border-b-2 border-[#B76935] font-bold'
                  : 'text-[#687477] hover:text-[#202A2D]'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setMode('signup');
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className={`py-3 text-center transition-colors ${
                mode === 'signup'
                  ? 'bg-white text-[#143642] border-b-2 border-[#B76935] font-bold'
                  : 'text-[#687477] hover:text-[#202A2D]'
              }`}
            >
              Register / Sign Up
            </button>
          </div>
        )}

        <div className="p-6 sm:p-8 space-y-5">
          
          {/* Feedback messages */}
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* 1. SIGN IN FORM */}
          {mode === 'signin' && (
            <div className="space-y-4 text-xs">
              {/* Google Sign In Button */}
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#F8F6F2] border border-[#E7E4DE] hover:border-[#143642]/30 text-[#202A2D] font-semibold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2.5 text-xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-[#E7E4DE] w-full" />
                <span className="bg-white px-2.5 text-[10px] text-[#687477] uppercase tracking-wider font-medium absolute">
                  or sign in with email & phone
                </span>
              </div>

              <form onSubmit={handleSignIn} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-[#202A2D] mb-1">
                  Email Address or Safaricom Phone
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#687477] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. david.kiprop@makazi.co.ke or 0712345678"
                    value={signInIdentifier}
                    onChange={(e) => setSignInIdentifier(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E7E4DE] rounded-xl text-xs text-[#202A2D] focus:border-[#B76935] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-[#202A2D]">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setMode('forgot');
                      setErrorMsg('');
                    }}
                    className="text-[11px] text-[#B76935] hover:underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#687477] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter password"
                    value={signInPassword}
                    onChange={(e) => setSignInPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 bg-white border border-[#E7E4DE] rounded-xl text-xs text-[#202A2D] focus:border-[#B76935] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#687477] hover:text-[#202A2D]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMe"
                  defaultChecked
                  className="rounded border-[#E7E4DE] text-[#B76935] focus:ring-[#B76935]"
                />
                <label htmlFor="rememberMe" className="text-xs text-[#687477]">
                  Remember this device for 30 days
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#B76935] hover:bg-[#a05b2d] text-white font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? (
                  <span>Authenticating...</span>
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

          {/* 2. SIGN UP / REGISTRATION FORM */}
          {mode === 'signup' && (
            <div className="space-y-4 text-xs">
              {/* Google Sign Up Button */}
              <button
                type="button"
                onClick={() => setShowGoogleModal(true)}
                className="w-full py-2.5 px-4 bg-white hover:bg-[#F8F6F2] border border-[#E7E4DE] hover:border-[#143642]/30 text-[#202A2D] font-semibold rounded-xl transition-all shadow-2xs flex items-center justify-center gap-2.5 text-xs"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Sign up with Google</span>
              </button>

              <div className="relative flex items-center justify-center my-3">
                <div className="border-t border-[#E7E4DE] w-full" />
                <span className="bg-white px-2.5 text-[10px] text-[#687477] uppercase tracking-wider font-medium absolute">
                  or register with details
                </span>
              </div>

              <form onSubmit={handleSignUp} className="space-y-3.5 text-xs">
              
              {/* Account Role Selector */}
              <div>
                <label className="block font-semibold text-[#202A2D] mb-1.5">
                  I am registering as:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { role: 'seeker' as UserRole, label: 'Property Seeker', icon: Compass },
                    { role: 'manager' as UserRole, label: 'Owner / Landlord', icon: Building2 },
                    { role: 'tenant' as UserRole, label: 'Resident Tenant', icon: KeyRound },
                  ].map((r) => {
                    const Icon = r.icon;
                    const selected = signUpRole === r.role;
                    return (
                      <button
                        key={r.role}
                        type="button"
                        onClick={() => setSignUpRole(r.role)}
                        className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 transition-all ${
                          selected
                            ? 'bg-[#143642] text-white border-[#143642] shadow-xs'
                            : 'bg-[#F8F6F2] text-[#202A2D] border-[#E7E4DE] hover:bg-[#E7E4DE]'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="text-[11px] font-semibold leading-tight">{r.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#202A2D] mb-1">Full Legal Name</label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-[#687477] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kevin Kamau"
                    value={signUpName}
                    onChange={(e) => setSignUpName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#202A2D] mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="kevin@example.com"
                    value={signUpEmail}
                    onChange={(e) => setSignUpEmail(e.target.value)}
                    className="w-full p-2 bg-white border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#202A2D] mb-1">Safaricom Phone</label>
                  <input
                    type="tel"
                    required
                    placeholder="+254 7..."
                    value={signUpPhone}
                    onChange={(e) => setSignUpPhone(e.target.value)}
                    className="w-full p-2 bg-white border border-[#E7E4DE] rounded-xl font-mono focus:border-[#B76935] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#202A2D] mb-1">Kenyan National ID / Passport</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 32891045"
                  value={signUpNationalId}
                  onChange={(e) => setSignUpNationalId(e.target.value)}
                  className="w-full p-2 bg-white border border-[#E7E4DE] rounded-xl font-mono focus:border-[#B76935] focus:outline-hidden"
                />
              </div>

              {signUpRole === 'manager' && (
                <div>
                  <label className="block font-semibold text-[#202A2D] mb-1">
                    Company / Management Agency Name (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lavington Luxury Assets Ltd"
                    value={signUpAgency}
                    onChange={(e) => setSignUpAgency(e.target.value)}
                    className="w-full p-2 bg-white border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-[#202A2D] mb-1">Create Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="At least 6 characters"
                    value={signUpPassword}
                    onChange={(e) => setSignUpPassword(e.target.value)}
                    className="w-full p-2 pr-9 bg-white border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#687477]"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="rounded border-[#E7E4DE] text-[#B76935] focus:ring-[#B76935] mt-0.5"
                />
                <label htmlFor="agreeTerms" className="text-[11px] text-[#687477] leading-tight">
                  I agree to the MAKAZI Tenancy & Verification Terms of Service and Safaricom M-Pesa automated transaction policies.
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#143642] hover:bg-[#0e2730] text-white font-semibold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
              >
                {loading ? <span>Creating Account...</span> : <span>Complete Registration</span>}
              </button>
            </form>
          </div>
        )}

          {/* 3. FORGOT PASSWORD FORM */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgot} className="space-y-4 text-xs">
              <p className="text-[#687477]">
                Enter your registered email address or Safaricom phone number and we will send you an OTP verification code.
              </p>

              <div>
                <label className="block font-semibold text-[#202A2D] mb-1">Email or Phone Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. brian.ochieng@gmail.com"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full p-2.5 bg-white border border-[#E7E4DE] rounded-xl focus:border-[#B76935] focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 bg-[#B76935] text-white font-semibold rounded-xl hover:bg-[#a05b2d]"
                >
                  Send Password Reset Instructions
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('signin');
                    setErrorMsg('');
                    setSuccessMsg('');
                  }}
                  className="w-full py-2 text-xs font-semibold text-[#143642] hover:underline"
                >
                  Return to Sign In
                </button>
              </div>
            </form>
          )}

          {/* QUICK 1-CLICK DEMO LOGINS PANEL (For instant review of all 4 roles) */}
          <div className="pt-5 border-t border-[#E7E4DE] space-y-3">
            <div className="flex items-center justify-between text-xs text-[#687477]">
              <span className="font-semibold uppercase text-[10px] tracking-wider text-[#143642]">
                1-Click Quick Demo Sign In
              </span>
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-medium">
                Instant Access
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleDemoLogin('seeker')}
                className="p-2.5 bg-[#F8F6F2] hover:bg-[#E7E4DE] rounded-xl text-left border border-[#E7E4DE] transition-colors"
              >
                <div className="flex items-center gap-1.5 font-bold text-[#143642]">
                  <Compass className="w-3.5 h-3.5 text-[#B76935]" />
                  <span>Seeker</span>
                </div>
                <p className="text-[10px] text-[#687477] mt-0.5">Wanjiku Mwangi</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('manager')}
                className="p-2.5 bg-[#F8F6F2] hover:bg-[#E7E4DE] rounded-xl text-left border border-[#E7E4DE] transition-colors"
              >
                <div className="flex items-center gap-1.5 font-bold text-[#143642]">
                  <Building2 className="w-3.5 h-3.5 text-[#143642]" />
                  <span>Landlord</span>
                </div>
                <p className="text-[10px] text-[#687477] mt-0.5">David Kiprop</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('tenant')}
                className="p-2.5 bg-[#F8F6F2] hover:bg-[#E7E4DE] rounded-xl text-left border border-[#E7E4DE] transition-colors"
              >
                <div className="flex items-center gap-1.5 font-bold text-[#143642]">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Tenant</span>
                </div>
                <p className="text-[10px] text-[#687477] mt-0.5">Brian Ochieng (Apt 302)</p>
              </button>

              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                className="p-2.5 bg-[#F8F6F2] hover:bg-[#E7E4DE] rounded-xl text-left border border-[#E7E4DE] transition-colors"
              >
                <div className="flex items-center gap-1.5 font-bold text-[#143642]">
                  <ShieldAlert className="w-3.5 h-3.5 text-purple-600" />
                  <span>Administrator</span>
                </div>
                <p className="text-[10px] text-[#687477] mt-0.5">Amina Abdi</p>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* GOOGLE IDENTITY OAUTH MODAL */}
      {showGoogleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-[#E7E4DE] space-y-5 text-xs text-[#202A2D]">
            
            {/* Header with Google Logo */}
            <div className="flex items-start justify-between pb-3 border-b border-[#E7E4DE]">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div>
                  <h3 className="font-bold text-sm text-[#143642]">
                    {mode === 'signup' ? 'Sign up with Google' : 'Sign in with Google'}
                  </h3>
                  <p className="text-[11px] text-[#687477]">Choose an account to continue to MAKAZI</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowGoogleModal(false)}
                className="p-1 rounded-lg text-[#687477] hover:text-[#202A2D] hover:bg-[#F8F6F2] transition-colors"
                aria-label="Close"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            </div>

            {/* Role picker if in registration mode */}
            {mode === 'signup' && (
              <div className="p-3 bg-[#F8F6F2] rounded-2xl border border-[#E7E4DE] space-y-2">
                <span className="font-semibold text-[#143642] block text-[11px] uppercase tracking-wider">
                  Select your intended role:
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { role: 'seeker' as UserRole, label: 'Seeker' },
                    { role: 'manager' as UserRole, label: 'Landlord' },
                    { role: 'tenant' as UserRole, label: 'Tenant' },
                  ].map((r) => (
                    <button
                      key={r.role}
                      type="button"
                      onClick={() => setGoogleSelectedRole(r.role)}
                      className={`py-1.5 px-2 rounded-xl text-center font-semibold text-xs transition-colors ${
                        googleSelectedRole === r.role
                          ? 'bg-[#143642] text-white shadow-2xs'
                          : 'bg-white text-[#202A2D] border border-[#E7E4DE]'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Google Accounts List */}
            <div className="space-y-2">
              <button
                type="button"
                disabled={googleAuthLoading}
                onClick={() => handleGoogleAuth('antonyonyi75@gmail.com', 'Antony Onyi', googleSelectedRole)}
                className="w-full p-3 rounded-2xl border border-[#E7E4DE] hover:border-[#143642] hover:bg-[#F8F6F2] flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#4285F4] text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                    A
                  </div>
                  <div>
                    <div className="font-bold text-[#143642]">Antony Onyi</div>
                    <div className="text-[11px] text-[#687477]">antonyonyi75@gmail.com</div>
                  </div>
                </div>
                <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-medium">
                  Active User
                </span>
              </button>

              <button
                type="button"
                disabled={googleAuthLoading}
                onClick={() => handleGoogleAuth('wanjiku.mwangi@gmail.com', 'Wanjiku Mwangi', 'seeker')}
                className="w-full p-3 rounded-2xl border border-[#E7E4DE] hover:border-[#143642] hover:bg-[#F8F6F2] flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#B76935] text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                    W
                  </div>
                  <div>
                    <div className="font-bold text-[#143642]">Wanjiku Mwangi</div>
                    <div className="text-[11px] text-[#687477]">wanjiku.mwangi@gmail.com</div>
                  </div>
                </div>
                <span className="text-[10px] text-[#687477]">Seeker</span>
              </button>

              <button
                type="button"
                disabled={googleAuthLoading}
                onClick={() => handleGoogleAuth('david.kiprop@makaziproperties.co.ke', 'David Kiprop', 'manager')}
                className="w-full p-3 rounded-2xl border border-[#E7E4DE] hover:border-[#143642] hover:bg-[#F8F6F2] flex items-center justify-between text-left transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#143642] text-white font-bold flex items-center justify-center text-sm shadow-2xs">
                    D
                  </div>
                  <div>
                    <div className="font-bold text-[#143642]">David Kiprop</div>
                    <div className="text-[11px] text-[#687477]">david.kiprop@makaziproperties.co.ke</div>
                  </div>
                </div>
                <span className="text-[10px] text-[#687477]">Landlord</span>
              </button>
            </div>

            {/* Custom Google Account write-in */}
            <div className="pt-2 border-t border-[#E7E4DE] space-y-2">
              <label className="block text-[11px] font-semibold text-[#687477]">
                Or enter another Google account:
              </label>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="your.name@gmail.com"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  className="flex-1 p-2 bg-white border border-[#E7E4DE] rounded-xl text-xs"
                />
                <button
                  type="button"
                  disabled={!customGoogleEmail.includes('@') || googleAuthLoading}
                  onClick={() =>
                    handleGoogleAuth(
                      customGoogleEmail,
                      customGoogleEmail.split('@')[0],
                      googleSelectedRole
                    )
                  }
                  className="px-3 py-2 bg-[#143642] hover:bg-[#0e2730] text-white rounded-xl font-semibold disabled:opacity-40 text-xs shrink-0"
                >
                  {googleAuthLoading ? 'Connecting...' : 'Continue'}
                </button>
              </div>
            </div>

            {/* OAuth Security note */}
            <div className="pt-2 text-[10px] text-[#687477] flex items-center justify-between">
              <span>Google Identity Services · OAuth 2.0</span>
              <span className="text-emerald-700 font-semibold">256-bit Encrypted</span>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
