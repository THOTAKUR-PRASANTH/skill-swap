"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/utils/functions/cn";
import dynamic from "next/dynamic";

// --- SVG Icons (GoogleIcon, GithubIcon) ---
// (Icons are unchanged)
const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
    <path fill="#4285F4" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
    <path fill="#34A853" d="M43.611,20.083L43.595,20L24,20v8h11.303 c-0.792,2.237-2.231,4.166-4.087,5.571l5.657,5.657C39.046,36.666,42.59,31.7,43.611,20.083z" />
    <path fill="#FBBC05" d="M10.211,28.324c-0.575-1.724-0.896-3.56-0.896-5.46 s0.321-3.736,0.896-5.46l-5.657-5.657C3.046,14.736,2,19.227,2,24 s1.046,9.264,2.555,12.269L10.211,28.324z" />
    <path fill="#EA4335" d="M24,48c5.432,0,10.222-1.782,13.59-4.781 l-5.657-5.657c-1.855,1.238-4.148,1.967-6.933,1.967 c-5.223,0-9.651-3.343-11.22-7.961l-5.657,5.657 C7.025,42.062,14.82,48,24,48z" />
  </svg>
);
const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12 c0 4.418 2.865 8.168 6.839 9.492.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343 -.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832 .092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844 c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027 .546 1.378.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12 c0-5.523-4.477-10-10-10z" clipRule="evenodd" />
  </svg>
);

// --- Card ---
const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="card-animation-container relative w-full max-w-4xl rounded-2xl p-[2px] overflow-hidden shadow-2xl shadow-black/40 bg-black/80 backdrop-blur-lg">
    <div className="relative z-10 p-4 sm:p-6 md:p-12 bg-black rounded-[14px] w-full">
      {children}
    </div>
  </div>
);

// --- UI Components (Label, Input, Button) ---
// (No changes to these components)
const Label: React.FC<{ htmlFor: string; children: React.ReactNode }> = ({ htmlFor, children }) => (
  <label htmlFor={htmlFor} className="text-sm font-medium text-gray-200">{children}</label>
);
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={`w-full px-5 py-3 rounded-lg border border-white/10 bg-white/5 text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:outline-none transition text-sm ${props.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
  />
);
const Button: React.FC<{ children: React.ReactNode; variant?: "default" | "oauth"; isLoading?: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>> = ({
  children,
  variant = "default",
  isLoading = false,
  ...props
}) => {
  const base = "w-full relative flex items-center justify-center gap-3 px-6 py-3 rounded-lg font-medium transition active:scale-[0.98] text-sm overflow-hidden";
  const variants = {
    default: "bg-purple-600 text-white hover:bg-purple-700 shadow-lg shadow-purple-600/20",
    oauth: "bg-white/5 border border-white/10 text-gray-200 hover:bg-white/15 backdrop-blur-sm",
  };
  return (
    <button {...props} className={cn(base, variants[variant], props.disabled && "opacity-50 cursor-not-allowed")}>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-5 h-5 border-2 border-transparent border-t-purple-300 rounded-full animate-spin shadow-[0_0_8px_rgba(192,132,252,0.5)]" />
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div animate={{ opacity: isLoading ? 0 : 1 }} transition={{ duration: 0.2 }} className="flex items-center gap-3">
        {children}
      </motion.div>
    </button>
  );
};

// --- Main Component ---
const CustomSignInModal = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mfaToken, setMfaToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMfaStep, setShowMfaStep] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);

  // --- No changes to logic ---
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingProvider("password");
    const result = await signIn("credentials", { redirect: false, email, password, mfaToken });
    if (result?.error) {
      if (result.error === "MFA") setShowMfaStep(true);
      else if (result.error === "OAuthAccount") toast.error("Use Google or GitHub to sign in.");
      else toast.error("Invalid credentials.");
    } else router.push("/dashboard");
    setLoadingProvider(null);
  };
  const handleSocialLogin = async (provider: string) => {
    setLoadingProvider(provider);
    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } catch {
      toast.error("OAuth sign-in failed.");
    } finally {
      setLoadingProvider(null);
    }
  };
   const DynamicPlayer = dynamic(
    () => import("@lottiefiles/react-lottie-player").then(mod => mod.Player),
    { ssr: false }
  );

  return (
    <>
      <style jsx global>{`
        .card-animation-container::before,
        .card-animation-container::after {
          content: '';
          position: absolute;
          top: -50%; left: -50%;
          width: 200%; height: 200%;
          /* --- CHANGED --- Increased opacity from 0.3 to 0.7 for a brighter border --- */
          background: conic-gradient(transparent, rgba(255, 255, 255, 0.7), transparent 15%);
          animation: rotate-border 8s linear infinite;
        }
        .card-animation-container::after { animation-delay: -4s; }
        @keyframes rotate-border {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          .card-animation-container { width: 100%; max-width: 420px; }
        }
      `}</style>

      <div className="fixed inset-0 z-50 overflow-y-auto p-4 flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <motion.div 
          className="my-auto"
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Card>
            <div className="flex flex-col md:grid md:grid-cols-2 gap-12 md:gap-16 items-center justify-center w-full">

              {/* --- Left Lottie Section (Desktop Only) --- */}
              {/* --- NO CHANGE --- This section remains hidden on mobile and works for desktop */}
              <div className="hidden md:flex flex-col items-center justify-center text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {showMfaStep ? "Enter 2FA Code 🔑" : (
                    <motion.div className="flex justify-center"
                      initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                      <DynamicPlayer autoplay loop src="/animations/greeatings.json" style={{ width: "100%", maxWidth: "300px", height: "auto" }} />
                    </motion.div>
                  )}
                </h2>
                {!showMfaStep && (
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                    <DynamicPlayer autoplay loop src="/animations/register.json" style={{ width: "110%", maxWidth: "500px", height: "auto" }} />
                  </motion.div>
                )}
              </div>

              {/* --- Right Form Section (Mobile & Desktop) --- */}
              <div className="w-full flex flex-col items-center justify-center px-2 sm:px-4">
                
                {/* --- Mobile-only "welcome.json" --- */}
                {!showMfaStep && (
                  <motion.div className="md:hidden flex justify-center mb-4"
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}>
                    <DynamicPlayer autoplay loop src="/animations/greeatings.json" style={{ width: "100%", maxWidth: "300px", height: "auto" }} />
                  </motion.div>
                )}

                {/* --- ADDED --- Mobile-only "register.json" --- */}
                {!showMfaStep && (
                  <motion.div className="md:hidden flex justify-center mb-4"
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: "easeOut" }}>
                    <DynamicPlayer autoplay loop src="/animations/register.json" style={{ width: "100%", maxWidth: "350px", height: "auto" }} />
                  </motion.div>
                )}

                <form onSubmit={handleCredentialsSubmit} className="space-y-5 w-full max-w-sm">
                  {!showMfaStep ? (
                    <>
                      <div className="space-y-1">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} disabled={!!loadingProvider} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                          {/* --- BUG FIX --- Changed e.g.target.value to e.target.value --- */}
                          <Input id="password" type={showPassword ? "text" : "password"} value={password}
                            disabled={!!loadingProvider} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
                          <button type="button" disabled={!!loadingProvider} onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-4 flex items-center text-gray-400 hover:text-white">
                            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1">
                      <Label htmlFor="mfa">Authentication Code</Label>
                      <Input id="mfa" type="text" value={mfaToken} disabled={!!loadingProvider}
                        maxLength={6} onChange={(e) => setMfaToken(e.target.value)} placeholder="123456" />
                    </div>
                  )}
                  <Button type="submit" disabled={!!loadingProvider} isLoading={loadingProvider === "password"}>
                    {showMfaStep ? "Verify" : "Sign In"}
                  </Button>
                </form>

                {!showMfaStep && (
                  <>
                    <div className="flex items-center gap-3 my-6 w-full max-w-sm">
                      <div className="h-px bg-white/20 flex-1" />
                      <span className="text-gray-400 text-sm">or</span>
                      <div className="h-px bg-white/20 flex-1" />
                    </div>

                    <div className="flex flex-col gap-3 w-full max-w-sm">
                      <Button variant="oauth" onClick={() => handleSocialLogin("google")} disabled={!!loadingProvider} isLoading={loadingProvider === "google"}>
                        <GoogleIcon className="w-5 h-5" />
                        <span>Continue with Google</span>
                      </Button>
                      <Button variant="oauth" onClick={() => handleSocialLogin("github")} disabled={!!loadingProvider} isLoading={loadingProvider === "github"}>
                        <GithubIcon className="w-5 h-5 text-white" />
                        <span>Continue with GitHub</span>
                      </Button>
                    </div>
                    <p className="text-xs text-center text-gray-400 mt-6">
                      Don’t have an account? <a href="/auth/sign-up" className="underline hover:text-white">Sign Up</a>
                    </p>
                  </>
                )}
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </>
  );
};

export default CustomSignInModal;