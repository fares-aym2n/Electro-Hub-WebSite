import type { FC } from "react";
import { useState, useEffect, useCallback } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import type { PageId } from "../../context/NavigationContext";
import { useParams } from "../../context/NavigationContext";
import { authService } from "../../services/authService";
import { BackButton } from "../common/BackButton";

interface ResetPasswordViewProps {
  onNavigate: (page: PageId) => void;
}

type ValidationStatus = "validating" | "valid" | "invalid";

export const ResetPasswordView: FC<ResetPasswordViewProps> = ({ onNavigate }) => {
  const { userId: paramUserId, resetToken: paramResetToken } = useParams<{
    userId?: string;
    resetToken?: string;
    resetPasswordToken?: string;
  }>();

  // Extraction of URL parameters (/reset-password/:userId/:resetToken)
  const extractParams = useCallback(() => {
    let uid: number | undefined;
    let tok: string | undefined = paramResetToken;

    if (paramUserId) {
      const parsedId = parseInt(paramUserId, 10);
      if (!isNaN(parsedId)) {
        uid = parsedId;
      }
    }

    if (!uid || !tok) {
      // Direct pathname inspection fallback: /reset-password/:userId/:resetToken
      const pathSegments = window.location.pathname.split("/").filter(Boolean);
      if (
        pathSegments.length >= 3 &&
        pathSegments[0].toLowerCase() === "reset-password"
      ) {
        const parsedId = parseInt(pathSegments[1], 10);
        if (!isNaN(parsedId)) {
          uid = parsedId;
        }
        tok = decodeURIComponent(pathSegments.slice(2).join("/"));
      }
    }

    return {
      userId: uid,
      resetPasswordToken: tok,
    };
  }, [paramUserId, paramResetToken]);

  const [params, setParams] = useState<{
    userId?: number;
    resetPasswordToken?: string;
  }>(extractParams);

  // Link validation state
  const [validationStatus, setValidationStatus] =
    useState<ValidationStatus>("validating");
  const [validationError, setValidationError] = useState<string | null>(null);

  // Form states (ONLY newPassword & confirmPassword)
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  // Submission states
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Validate the Reset Link on mount or when route parameters update
  useEffect(() => {
    let isCancelled = false;
    const currentParams = extractParams();
    setParams(currentParams);

    const { userId, resetPasswordToken } = currentParams;

    if (!userId || !resetPasswordToken) {
      setValidationStatus("invalid");
      setValidationError(
        "Invalid reset link: The URL is missing required parameters (userId or reset token). Please request a new link."
      );
      return;
    }

    const validateLink = async () => {
      setValidationStatus("validating");
      setValidationError(null);

      try {
        // Call GET /api/users/auth/reset-password/:userId/:resetPasswordToken
        await authService.validateResetPasswordLink(userId, resetPasswordToken);

        if (!isCancelled) {
          setValidationStatus("valid");
        }
      } catch (err: any) {
        if (!isCancelled) {
          console.error("Reset link validation failed:", err);
          setValidationStatus("invalid");
          setValidationError(
            err.message ||
              "This password reset link is invalid or has expired. Please request a new link."
          );
        }
      }
    };

    validateLink();

    return () => {
      isCancelled = true;
    };
  }, [extractParams]);

  // 2. Submit the new password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    const { userId, resetPasswordToken } = params;

    if (!userId || !resetPasswordToken) {
      setSubmitError("Missing reset link parameters. Please request a new link.");
      return;
    }

    if (!newPassword.trim()) {
      setSubmitError("Please enter your new password.");
      return;
    }

    if (newPassword.length < 5) {
      setSubmitError("New password must be at least 5 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setSubmitError(
        "Passwords do not match. Please ensure both fields are identical."
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // POST /api/users/auth/reset-password
      // Exact DTO: { userId, resetPasswordToken, newPassword }
      // confirmPassword is strictly for client-side validation and NEVER sent to the backend
      const res = await authService.resetPassword({
        userId,
        resetPasswordToken,
        newPassword,
      });

      setSuccessMessage(
        res?.message ||
          "Password has been reset successfully! You can now log in with your new password."
      );
    } catch (err: any) {
      console.error("Reset password error:", err);
      setSubmitError(
        err.message ||
          "Unable to reset password. The reset link may have expired."
      );
    } finally {
      setIsSubmitting(false);
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
          {/* RIGHT COLUMN: RESET PASSWORD CONTENT / FORM               */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 max-w-lg w-full mx-auto lg:ml-auto space-y-6">
            <div>
              <span className="text-[12px] font-bold tracking-[0.08em] text-[#C49B82] uppercase block mb-1">
                CREDENTIAL UPDATE
              </span>
              <h1 className="text-[34px] sm:text-[42px] lg:text-[46px] font-bold text-[#111111] leading-tight tracking-tight">
                Set New Password
              </h1>
              <p className="text-[14px] text-[#555555] mt-1 leading-relaxed">
                Choose a strong, secure new password for your Electro Hub account.
              </p>
            </div>

            {/* STATE 1: VALIDATING RESET LINK (GET /api/users/auth/reset-password/:userId/:token) */}
            {validationStatus === "validating" && (
              <div className="p-8 rounded-2xl bg-white border border-[#E8DFD8] text-center space-y-3 animate-in fade-in duration-150">
                <Loader2 className="w-8 h-8 animate-spin text-[#C49B82] mx-auto" />
                <h3 className="font-bold text-[#111111] text-base">
                  Verifying Reset Link
                </h3>
                <p className="text-xs text-[#666666] leading-relaxed max-w-xs mx-auto">
                  Please wait while we verify your password reset authorization...
                </p>
              </div>
            )}

            {/* STATE 2: INVALID OR EXPIRED LINK */}
            {validationStatus === "invalid" && (
              <div className="p-7 rounded-2xl bg-white border border-red-200 text-center space-y-4 animate-in fade-in duration-150">
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mx-auto">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-[#111111] text-lg">
                    Invalid Reset Link
                  </h3>
                  <p className="text-xs text-red-600 mt-1 leading-relaxed">
                    {validationError ||
                      "This password reset link is invalid or has expired."}
                  </p>
                  <p className="text-xs text-[#666666] mt-2 leading-relaxed">
                    Password reset tokens are one-time use and expire for your security. Please submit a new forgot password request.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onNavigate("forgot-password")}
                    className="w-full h-11 rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-98 shadow-xs"
                  >
                    <span>Request New Reset Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onNavigate("signin")}
                    className="w-full h-10 rounded-lg bg-transparent hover:bg-[#F3ECE6] text-[#666666] font-semibold text-xs uppercase transition"
                  >
                    Return to Sign In
                  </button>
                </div>
              </div>
            )}

            {/* STATE 3: VALID LINK - SHOW FORM */}
            {validationStatus === "valid" && (
              <>
                {/* Error Banner on submission */}
                {submitError && (
                  <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5 animate-in fade-in duration-150">
                    <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-red-600" />
                    <div>
                      <div className="font-bold text-xs uppercase text-red-800">
                        Reset Error
                      </div>
                      <div className="text-xs mt-0.5 text-red-700 leading-relaxed">
                        {submitError}
                      </div>
                    </div>
                  </div>
                )}

                {/* Success Notification */}
                {successMessage ? (
                  <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-[#111111] space-y-3 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 font-bold text-emerald-800 text-sm uppercase">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      Password Reset Completed!
                    </div>
                    <p className="text-xs text-emerald-800 leading-relaxed">
                      {successMessage}
                    </p>
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => onNavigate("signin")}
                        className="w-full h-11 rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition active:scale-98 shadow-xs"
                      >
                        <span>Proceed to Sign In</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* INPUT 1: New Password */}
                    <div className="space-y-1.5">
                      <label className="flex items-center justify-between text-[12px] font-bold text-[#111111] uppercase tracking-[0.05em]">
                        <span>NEW PASSWORD</span>
                        <span className="text-[10px] text-[#888888] font-normal normal-case flex items-center gap-1">
                          <Lock className="w-3 h-3 text-[#C49B82]" /> Min. 5 characters
                        </span>
                      </label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          required
                          minLength={5}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter your new password"
                          className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] pl-4 pr-11 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword((prev) => !prev)}
                          aria-label={showNewPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111] transition"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* INPUT 2: Confirm Password */}
                    <div className="space-y-1.5">
                      <label className="block text-[12px] font-bold text-[#111111] uppercase tracking-[0.05em]">
                        CONFIRM NEW PASSWORD
                      </label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          minLength={5}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Re-enter your new password"
                          className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] pl-4 pr-11 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword((prev) => !prev)}
                          aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888888] hover:text-[#111111] transition"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Submit Action */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full h-[46px] rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase transition active:scale-98 shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
                    >
                      {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                      {isSubmitting ? "SAVING NEW PASSWORD..." : "SAVE NEW PASSWORD"}
                    </button>

                    {/* Return to Sign In Link */}
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
