import type { FC } from "react";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import type { PageId } from "../electro/ElectroHeader";
import { useAuth } from "../../context/AuthContext";
import { BackButton } from "../common/BackButton";

interface SignUpViewProps {
  onNavigate: (page: PageId) => void;
}

export const SignUpView: FC<SignUpViewProps> = ({ onNavigate }) => {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password) return;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (password.length < 5) {
      setErrorMessage("Password must be at least 5 characters long.");
      return;
    }

    setLoading(true);
    setErrorMessage(null);

    try {
      const res = await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      setSuccessMessage(
        res.message ||
          "Verification email has been sent. Please verify your email and login.",
      );
    } catch (err: any) {
      console.error("Registration error:", err);
      setErrorMessage(
        err.message || "Failed to create account. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FBF6F0] min-h-[calc(100vh-140px)] flex flex-col justify-center">
      <div className="max-w-[1400px] mx-auto w-full px-6 sm:px-10 lg:px-14 py-8 lg:py-12">
        {/* Back Button */}
        <div>
          <BackButton label="Back to Store" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          {/* ========================================================= */}
          {/* LEFT COLUMN: TITLE, SUBTITLE & LIFESTYLE DESK IMAGE */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 space-y-6 lg:space-y-8">
            <div className="space-y-3">
              <h1 className="text-[38px] sm:text-[46px] lg:text-[54px] font-bold text-[#111111] tracking-tight leading-[1.08]">
                create your account
              </h1>
              <p className="text-[15px] sm:text-[16px] text-[#444444] leading-relaxed max-w-md">
                Join Electro Hub to access exclusive deals, track orders, and
                get personalised picks.
              </p>
            </div>

            {/* Lifestyle Desk Image with Laptop, Headphone & Plant */}
            <div className="rounded-2xl overflow-hidden shadow-xs">
              <img
                src="/assets/signup-desk.jpg"
                alt="Electro Hub Workspace"
                className="w-full h-auto max-h-[340px] object-cover"
              />
            </div>
          </div>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: SIGN UP FORM */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 max-w-lg w-full mx-auto lg:ml-auto">
            <div className="space-y-5">
              <div className="text-[15px] font-bold tracking-[0.08em] text-[#C49B82] uppercase">
                SIGN UP
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs uppercase">
                      Registration Error
                    </div>
                    <div className="text-xs mt-0.5">{errorMessage}</div>
                  </div>
                </div>
              )}

              {successMessage ? (
                <div className="p-6 rounded-2xl bg-[#EDE8E4] border border-[#C49B82]/40 text-[#111111] space-y-3">
                  <div className="flex items-center gap-2 font-bold text-[#C49B82] text-sm uppercase">
                    <CheckCircle2 className="w-5 h-5" />
                    Account Registered!
                  </div>
                  <p className="text-sm text-[#444444] leading-relaxed">
                    {successMessage}
                  </p>
                  <button
                    onClick={() => onNavigate("signin")}
                    className="mt-2 px-6 py-2.5 rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#111111] font-bold text-xs uppercase tracking-wider flex items-center gap-2"
                  >
                    Proceed to Sign In
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Username */}
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-bold text-[#111111] uppercase tracking-[0.05em]">
                      USERNAME
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="username"
                      className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition"
                    />
                  </div>

                  {/* Email */}
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

                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-bold text-[#111111] uppercase tracking-[0.05em]">
                      PASSWORD
                    </label>
                    <input
                      type="password"
                      required
                      minLength={5}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="password"
                      className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition"
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="block text-[12px] font-bold text-[#111111] uppercase tracking-[0.05em]">
                      CONFIRM PASSWORD
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="confirm password"
                      className="w-full h-[46px] rounded-lg bg-[#FAF6F2] border border-[#DFD4C8] px-4 text-sm text-[#111111] placeholder:text-[#999999] focus:outline-none focus:border-[#C49B82] transition"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-[46px] rounded-lg bg-[#CCA893] hover:bg-[#C29D87] text-[#1A1A1A] font-bold text-[13px] tracking-[0.08em] uppercase transition active:scale-98 shadow-xs disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
                  </button>

                  {/* Sign In Redirect Link */}
                  <div className="text-center pt-2">
                    <span className="text-[13px] text-[#555555]">
                      Already have an account?{" "}
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
    </div>
  );
};
