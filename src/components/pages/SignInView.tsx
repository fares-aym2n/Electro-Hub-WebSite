import type { FC } from "react";
import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Mail,
  ArrowLeft,
  ArrowRight,
  KeyRound,
} from "lucide-react";
import type { PageId } from "../../context/NavigationContext";
import { useAuth } from "../../context/AuthContext";
import { authService } from "../../services/authService";
import { BackButton } from "../common/BackButton";

interface SignInViewProps {
  onNavigate: (page: PageId) => void;
  initialMode?: "signin" | "forgot";
}

export const SignInView: FC<SignInViewProps> = ({
  onNavigate,
  initialMode = "signin",
}) => {
  const { login } = useAuth();
  const [mode, setMode] = useState<"signin" | "forgot">(initialMode);

  // Sign In Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Forgot Password Form States
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  // Synchronize mode if parent prop changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  // When switching modes, prefill email if already typed
  const switchMode = (newMode: "signin" | "forgot") => {
    setMode(newMode);
    setErrorMessage(null);
    setForgotError(null);
    if (newMode === "forgot") {
      if (email.trim() && !forgotEmail.trim()) {
        setForgotEmail(email.trim());
      }
      onNavigate("forgot-password");
    } else {
      if (forgotEmail.trim() && !email.trim()) {
        setEmail(forgotEmail.trim());
      }
      onNavigate("signin");
    }
  };

  // Handle Login Submission
  const handleSubmitSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;

    setLoading(true);
    setErrorMessage(null);

    try {
      await login({
        email: email.trim(),
        password,
      });

      setSubmitted(true);
      setTimeout(() => {
        onNavigate("home");
      }, 1500);
    } catch (err: any) {
      console.error("Login error:", err);
      setErrorMessage(
        err.message || "Incorrect email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Handle Forgot Password Submission (email only -> POST /api/users/auth/forgot-password)
  const handleSubmitForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotSuccess(null);

    const trimmed = forgotEmail.trim();
    if (!trimmed) {
      setForgotError("Please enter your registered email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmed)) {
      setForgotError("Please enter a valid email address.");
      return;
    }

    setForgotLoading(true);

    try {
      const res = await authService.forgotPassword({ email: trimmed });
      setForgotSuccess(
        res?.message || "Password reset link sent to email, check your inbox."
      );
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setForgotError(
        err.message ||
          "Unable to send reset instructions. Please verify your email and try again."
      );
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="bg-[#FBF6F0] min-h-[calc(100vh-140px)] flex flex-col justify-center py-8 lg:py-12">
      <div className="max-w-[1400px] mx-auto w-full px-6 sm:px-10 lg:px-14">
        {/* Back Button */}
        <div>
          <BackButton
            label={mode === "signin" ? "Back to Store" : "Back to Sign In"}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* ========================================================= */}
          {/* LEFT COLUMN: SUNLIT WORKSPACE PHOTOGRAPHY                 */}
          {/* ========================================================= */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden shadow-xs">
              <img
                src="/assets/signin-desk.jpg"
                alt="Workspace desk setup with headphones and coffee"
                className="w-full h-auto max-h-[460px] object-cover"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: SIGN IN OR FORGOT PASSWORD FORM             */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 max-w-lg w-full mx-auto lg:ml-auto">
            {/* MODE 1: SIGN IN FORM */}
            {mode === "signin" && (
              <div className="space-y-6">
                <div>
                  <span className="text-[12px] font-bold tracking-[0.08em] text-[#C49B82] uppercase block mb-1">
                    ACCOUNT ACCESS
                  </span>
                  <h1 className="text-[36px] sm:text-[44px] lg:text-[48px] font-bold text-[#111111] leading-tight tracking-tight">
                    Welcome back
                  </h1>
                  <p className="text-[14px] text-[#555555] mt-1 leading-relaxed">
                    Sign in with your email and password to access your Electro
                    Hub account.
                  </p>
                </div>

                {/* Error Alert */}
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5 animate-in fade-in duration-150">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                    <div>
                      <div className="font-bold text-xs uppercase text-red-800">
                        Sign In Error
                      </div>
                      <div className="text-xs mt-0.5 text-red-700 leading-relaxed">
                        {errorMessage}
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Notification */}
                {submitted ? (
                  <div className="p-6 rounded-xl bg-[#EDE8E4] border border-[#C49B82]/40 text-[#111111] space-y-2 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 font-bold text-[#C49B82] text-sm uppercase">
                      <CheckCircle2 className="w-5 h-5" />
                      Authenticated Successfully!
                    </div>
                    <p className="text-xs text-[#444444]">
                      Welcome back. Profile token verified with live backend.
                      Redirecting...
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitSignIn} className="space-y-4">
                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label className="block text-[12px] font-bold text-[#111111] uppercase tracking-[0.05em]">
                        EMAIL
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="email"
                        className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition"
                      />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="block text-[12px] font-bold text-[#111111] uppercase tracking-[0.05em]">
                          PASSWORD
                        </label>
                      </div>
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="password"
                        className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition"
                      />
                      {/* 2. Clearly visible Forgot Password link directly below password field */}
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => switchMode("forgot")}
                          className="text-[12px] font-semibold text-[#C49B82] hover:text-[#111111] hover:underline transition flex items-center gap-1 cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Forgot your password?</span>
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full h-[46px] rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase transition active:scale-98 shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                      {loading ? "SIGNING IN TO API..." : "SIGN IN"}
                    </button>

                    {/* 3. Action Links Footer */}
                    <div className="text-center pt-4 space-y-2.5 border-t border-[#EAE0D5] mt-5">
                      <div>
                        <span className="text-[13px] text-[#555555]">
                          Don't have an account?{" "}
                        </span>
                        <button
                          type="button"
                          onClick={() => onNavigate("signup")}
                          className="text-[13px] font-bold text-[#C49B82] hover:underline transition cursor-pointer"
                        >
                          Sign Up
                        </button>
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* MODE 2: FORGOT PASSWORD FORM (EMAIL ONLY) */}
            {mode === "forgot" && (
              <div className="space-y-6">
                <div>
                  <span className="text-[12px] font-bold tracking-[0.08em] text-[#C49B82] uppercase block mb-1">
                    ACCOUNT RECOVERY
                  </span>
                  <h1 className="text-[34px] sm:text-[42px] lg:text-[46px] font-bold text-[#111111] leading-tight tracking-tight">
                    Forgot Password
                  </h1>
                  <p className="text-[14px] text-[#555555] mt-1 leading-relaxed">
                    Enter your registered email address and we'll send you a
                    link to reset your password.
                  </p>
                </div>

                {/* Error Alert */}
                {forgotError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5 animate-in fade-in duration-150">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                    <div>
                      <div className="font-bold text-xs uppercase text-red-800">
                        Request Error
                      </div>
                      <div className="text-xs mt-0.5 text-red-700 leading-relaxed">
                        {forgotError}
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Notification */}
                {forgotSuccess ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#111111] space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm uppercase">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Reset Link Dispatched
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed font-medium">
                      {forgotSuccess}
                    </p>
                    <p className="text-xs text-[#555555] leading-relaxed">
                      Please check your inbox and click the password reset link
                      to choose your new password.
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => switchMode("signin")}
                        className="w-full h-11 rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-98 shadow-xs cursor-pointer"
                      >
                        <span>Return to Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmitForgot} className="space-y-4">
                    {/* Email Only Input */}
                    <div className="space-y-1.5">
                      <label className="flex items-center justify-between text-[12px] font-bold text-[#111111] uppercase tracking-[0.05em]">
                        <span>EMAIL ADDRESS</span>
                        <span className="text-[10px] text-[#888888] font-normal normal-case flex items-center gap-1">
                          <Mail className="w-3 h-3 text-[#C49B82]" /> Required
                        </span>
                      </label>
                      <input
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        placeholder="Enter your registered email"
                        className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition"
                      />
                    </div>

                    {/* Submit Action */}
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full h-[46px] rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase transition active:scale-98 shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer mt-2"
                    >
                      {forgotLoading && (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      )}
                      {forgotLoading
                        ? "SENDING RESET LINK..."
                        : "SEND RESET LINK"}
                    </button>

                    {/* Back to Sign In Link */}
                    <div className="text-center pt-3 border-t border-[#EAE0D5] mt-5">
                      <button
                        type="button"
                        onClick={() => switchMode("signin")}
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
      </div>
    </div>
  );
};
