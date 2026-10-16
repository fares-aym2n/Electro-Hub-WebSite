import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { useAuth, type AuthModalMode } from '../../context/AuthContext';
import { authService } from '../../services/authService';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    setAuthModalMode,
    login,
    register,
  } = useAuth();

  const mode = authModalMode;

  // Common Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Sign Up Specific States
  const [username, setUsername] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot Password Specific States
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Submission & Validation States
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Prevent background scrolling while modal is open
  useEffect(() => {
    if (isAuthModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAuthModalOpen]);

  // Handle Escape key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isAuthModalOpen && !loading) {
        closeAuthModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isAuthModalOpen, loading, closeAuthModal]);

  if (!isAuthModalOpen) return null;

  // Mode switching helper with state preservation
  const handleSwitchMode = (newMode: AuthModalMode) => {
    setAuthModalMode(newMode);
    setErrorMessage(null);
    setSuccessMessage(null);
    setForgotSuccess(null);

    // If switching between sign in and forgot, carry over email
    if (newMode === 'forgot' && email.trim() && !forgotEmail.trim()) {
      setForgotEmail(email.trim());
    } else if (newMode === 'signin' && forgotEmail.trim() && !email.trim()) {
      setEmail(forgotEmail.trim());
    }
  };

  // Sign In Handler
  const handleSignInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      await login({
        email: email.trim(),
        password,
      });

      setSuccessMessage('Authenticated successfully! Welcome back.');
      setTimeout(() => {
        closeAuthModal();
      }, 700);
    } catch (err: any) {
      console.error('Login error:', err);
      setErrorMessage(
        err.messages?.[0] || err.message || 'Incorrect email or password. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Sign Up Handler
  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername || !trimmedEmail || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password.length < 5) {
      setErrorMessage('Password must be at least 5 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const res = await register({
        username: trimmedUsername,
        email: trimmedEmail,
        password,
      });

      setSuccessMessage(
        res.message || 'Account registered! A verification email has been sent. Please check your inbox.'
      );
    } catch (err: any) {
      console.error('Registration error:', err);
      setErrorMessage(
        err.messages?.[0] || err.message || 'Failed to create account. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Forgot Password Handler
  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setForgotSuccess(null);

    const trimmed = forgotEmail.trim();
    if (!trimmed) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setLoading(true);

    try {
      const res = await authService.forgotPassword({ email: trimmed });
      setForgotSuccess(
        res?.message || 'Password reset link sent to your email. Please check your inbox.'
      );
    } catch (err: any) {
      console.error('Forgot password error:', err);
      setErrorMessage(
        err.messages?.[0] || err.message || 'Unable to send reset instructions. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={(e) => {
        // Close modal when clicking dark overlay backdrop
        if (e.target === e.currentTarget && !loading) {
          closeAuthModal();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      {/* Modal Container */}
      <div
        className="w-full max-w-[460px] bg-[#FAF6F2] rounded-3xl border border-[#DFD4C8] shadow-2xl p-5 sm:p-8 space-y-5 relative my-auto max-h-[calc(100vh-2rem)] overflow-y-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          disabled={loading}
          className="absolute top-5 right-5 p-2 rounded-full text-[#666666] hover:text-[#111111] hover:bg-[#EEE9E5] transition disabled:opacity-40 cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Brand Header */}
        <div className="text-center pt-1">
          <span className="text-[11px] font-bold text-[#C49B82] uppercase tracking-[0.14em] block mb-1">
            ELECTRO HUB
          </span>
          <h2
            id="auth-modal-title"
            className="text-[24px] sm:text-[26px] font-bold text-[#111111] tracking-tight"
          >
            {mode === 'signin' && 'Welcome Back'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p className="text-xs sm:text-[13px] text-[#666666] mt-1 max-w-sm mx-auto leading-relaxed">
            {mode === 'signin' && 'Sign in to access your orders, wishlist, and exclusive member deals.'}
            {mode === 'signup' && 'Join Electro Hub to enjoy personalized recommendations and order tracking.'}
            {mode === 'forgot' && "Enter your email address and we'll send you password recovery instructions."}
          </p>
        </div>

        {/* Tab Switcher (Visible in Sign In and Sign Up modes) */}
        {mode !== 'forgot' && (
          <div className="flex bg-[#EEE9E5] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => handleSwitchMode('signin')}
              disabled={loading}
              className={`flex-1 py-2 text-xs font-bold tracking-[0.05em] uppercase rounded-lg transition-all cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#FAF6F2] text-[#111111] shadow-xs'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleSwitchMode('signup')}
              disabled={loading}
              className={`flex-1 py-2 text-xs font-bold tracking-[0.05em] uppercase rounded-lg transition-all cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#FAF6F2] text-[#111111] shadow-xs'
                  : 'text-[#666666] hover:text-[#111111]'
              }`}
            >
              Create Account
            </button>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-150">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <div className="flex-1 leading-snug">{errorMessage}</div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 1: SIGN IN FORM                                       */}
        {/* ========================================================= */}
        {mode === 'signin' && (
          <div className="space-y-4">
            {successMessage ? (
              <div className="p-5 rounded-2xl bg-[#EDE8E4] border border-[#C49B82]/40 text-[#111111] space-y-2 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 font-bold text-[#C49B82] text-sm uppercase">
                  <CheckCircle2 className="w-5 h-5" />
                  Authenticated Successfully!
                </div>
                <p className="text-xs text-[#555555]">
                  {successMessage}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSignInSubmit} className="space-y-3.5">
                {/* Email Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#111111] uppercase tracking-[0.05em]">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      disabled={loading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-11 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] pl-10 pr-4 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition disabled:opacity-50"
                    />
                    <Mail className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="block text-[11px] font-bold text-[#111111] uppercase tracking-[0.05em]">
                      PASSWORD
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      disabled={loading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full h-11 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] pl-10 pr-11 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition disabled:opacity-50"
                    />
                    <Lock className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111] p-1 transition cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={() => handleSwitchMode('forgot')}
                      className="text-[12px] font-semibold text-[#C49B82] hover:text-[#111111] hover:underline transition flex items-center gap-1 cursor-pointer"
                    >
                      <KeyRound className="w-3.5 h-3.5" />
                      <span>Forgot password?</span>
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase transition active:scale-98 shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'SIGNING IN...' : 'SIGN IN'}
                </button>

                {/* Footer Switch Link */}
                <div className="text-center pt-3 border-t border-[#EAE0D5] text-[13px] text-[#666666]">
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signup')}
                    className="font-bold text-[#C49B82] hover:underline transition cursor-pointer"
                  >
                    Sign Up
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: SIGN UP FORM                                       */}
        {/* ========================================================= */}
        {mode === 'signup' && (
          <div className="space-y-4">
            {successMessage ? (
              <div className="p-6 rounded-2xl bg-[#EDE8E4] border border-[#C49B82]/40 text-[#111111] space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 font-bold text-[#C49B82] text-sm uppercase">
                  <CheckCircle2 className="w-5 h-5" />
                  Account Registered!
                </div>
                <p className="text-xs text-[#444444] leading-relaxed">
                  {successMessage}
                </p>
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signin')}
                  className="w-full h-11 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-98 shadow-xs cursor-pointer"
                >
                  Proceed to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleSignUpSubmit} className="space-y-3.5">
                {/* Username Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#111111] uppercase tracking-[0.05em]">
                    USERNAME
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      disabled={loading}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Choose a username"
                      className="w-full h-11 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] pl-10 pr-4 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition disabled:opacity-50"
                    />
                    <User className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#111111] uppercase tracking-[0.05em]">
                    EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      disabled={loading}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-11 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] pl-10 pr-4 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition disabled:opacity-50"
                    />
                    <Mail className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-1">
                  
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={5}
                      disabled={loading}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create password"
                      className="w-full h-11 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] pl-10 pr-11 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition disabled:opacity-50"
                    />
                    <Lock className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111] p-1 transition cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#111111] uppercase tracking-[0.05em]">
                    CONFIRM PASSWORD
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      disabled={loading}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat password"
                      className="w-full h-11 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] pl-10 pr-11 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition disabled:opacity-50"
                    />
                    <Lock className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111] p-1 transition cursor-pointer"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase transition active:scale-98 shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                </button>

                {/* Footer Switch Link */}
                <div className="text-center pt-3 border-t border-[#EAE0D5] text-[13px] text-[#666666]">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signin')}
                    className="font-bold text-[#C49B82] hover:underline transition cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: FORGOT PASSWORD FORM                               */}
        {/* ========================================================= */}
        {mode === 'forgot' && (
          <div className="space-y-4">
            {forgotSuccess ? (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#111111] space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm uppercase">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Reset Link Dispatched
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                  {forgotSuccess}
                </p>
                <button
                  type="button"
                  onClick={() => handleSwitchMode('signin')}
                  className="w-full h-11 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-98 shadow-xs cursor-pointer"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-[#111111] uppercase tracking-[0.05em]">
                    REGISTERED EMAIL ADDRESS
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      disabled={loading}
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full h-11 rounded-xl bg-[#FAF6F2] border border-[#DFD4C8] pl-10 pr-4 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition disabled:opacity-50"
                    />
                    <Mail className="w-4 h-4 text-[#888888] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase transition active:scale-98 shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'SENDING RESET LINK...' : 'SEND RESET LINK'}
                </button>

                <div className="text-center pt-3 border-t border-[#EAE0D5]">
                  <button
                    type="button"
                    onClick={() => handleSwitchMode('signin')}
                    className="text-[13px] font-bold text-[#C49B82] hover:underline transition flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Sign In</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
