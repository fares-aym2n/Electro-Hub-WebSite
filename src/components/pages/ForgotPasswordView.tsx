import type { FC } from "react";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, Mail, ArrowRight } from "lucide-react";
import type { PageId } from "../electro/ElectroHeader";
import { authService } from "../../services/authService";
import { BackButton } from "../common/BackButton";

interface ForgotPasswordViewProps {
  onNavigate: (page: PageId) => void;
}

export const ForgotPasswordView: FC<ForgotPasswordViewProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setLoading(true);

    try {
      // Submit to exact Backend API endpoint: POST /api/users/auth/forgot-password
      const res = await authService.forgotPassword({ email: trimmedEmail });
      setSuccessMessage(
        res?.message ||
          "Password reset link sent to email, check your inbox.",
      );
    } catch (err: any) {
      console.error("Forgot password error:", err);
      setErrorMessage(
        err.message ||
          "Unable to send reset instructions. Please verify your email and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FBF6F0] min-h-[calc(100vh-140px)] flex flex-col justify-center py-8 lg:py-12">
      <div className="max-w-[1400px] mx-auto w-full px-6 sm:px-10 lg:px-14">
        {/* Back Button */}
        <div>
          <BackButton label="Back to Sign In" />
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
                className="w-full h-auto max-h-[480px] object-cover"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: FORGOT PASSWORD FORM                        */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 max-w-lg w-full mx-auto lg:ml-auto space-y-6">
            <div>
              <span className="text-[12px] font-bold tracking-[0.08em] text-[#C49B82] uppercase block mb-1">
                ACCOUNT RECOVERY
              </span>
              <h1 className="text-[34px] sm:text-[42px] lg:text-[46px] font-bold text-[#111111] leading-tight tracking-tight">
                Forgot Password
              </h1>
              <p className="text-[14px] text-[#555555] mt-1 leading-relaxed">
                Enter your registered email address and we'll send you instructions to reset your password.
              </p>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5 animate-in fade-in duration-150">
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                <div>
                  <div className="font-bold text-xs uppercase text-red-800">
                    Request Error
                  </div>
                  <div className="text-xs mt-0.5 text-red-700 leading-relaxed">
                    {errorMessage}
                  </div>
                </div>
              </div>
            )}

            {/* Success Notification */}
            {successMessage && (
              <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#111111] space-y-3 animate-in fade-in duration-150">
                <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm uppercase">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Reset Link Dispatched
                </div>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  {successMessage}
                </p>
                <p className="text-xs text-[#555555] leading-relaxed">
                  Please check your inbox and click the password reset link to choose your new password.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate("signin")}
                    className="w-full h-11 rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-98 shadow-xs"
                  >
                    <span>Return to Sign In</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Form */}
            {!successMessage && (
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email (e.g. fares@gmail.com)"
                    className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-[46px] rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase transition active:scale-98 shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? "SENDING RESET LINK..." : "SEND RESET LINK"}
                </button>

                {/* Back to Sign In Link */}
                <div className="text-center pt-2">
                  <span className="text-[13px] text-[#555555]">
                    Remember your password?{" "}
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigate("signin")}
                    className="text-[13px] font-bold text-[#C49B82] hover:underline transition"
                  >
                    Sign In
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
