import type { FC } from "react";
import { useState } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import type { PageId } from "../electro/ElectroHeader";
import { useAuth } from "../../context/AuthContext";
import { BackButton } from "../common/BackButton";

interface SignInViewProps {
  onNavigate: (page: PageId) => void;
}

export const SignInView: FC<SignInViewProps> = ({ onNavigate }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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
        err.message || "Incorrect email or password. Please try again.",
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
          {/* LEFT COLUMN: SUNLIT WORKSPACE PHOTOGRAPHY */}
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
          {/* RIGHT COLUMN: WELCOME BACK & SIGN IN FORM */}
          {/* ========================================================= */}
          <div className="lg:col-span-6 max-w-lg w-full mx-auto lg:ml-auto">
            <div className="space-y-6">
              <div>
                <h1 className="text-[36px] sm:text-[44px] lg:text-[48px] font-bold text-[#111111] leading-tight tracking-tight">
                  Welcome back
                </h1>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex items-start gap-2.5">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-xs uppercase">
                      Sign In Error
                    </div>
                    <div className="text-xs mt-0.5">{errorMessage}</div>
                  </div>
                </div>
              )}

              {submitted ? (
                <div className="p-6 rounded-xl bg-[#EDE8E4] border border-[#C49B82]/40 text-[#111111] space-y-2">
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
                <form onSubmit={handleSubmit} className="space-y-4">
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="password"
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
                    {loading ? "SIGNING IN TO API..." : "SIGN IN"}
                  </button>

                  {/* Sign Up Redirect Link */}
                  <div className="text-center pt-2">
                    <span className="text-[13px] text-[#555555]">
                      Don't have an account?{" "}
                    </span>
                    <button
                      type="button"
                      onClick={() => onNavigate("signup")}
                      className="text-[13px] font-bold text-[#C49B82] hover:underline transition"
                    >
                      Sign Up
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
