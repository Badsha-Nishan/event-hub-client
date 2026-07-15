// src/pages/AuthPages.tsx
import React, { useState } from "react";
import { useToast } from "../context/ToastContext";
import { Mail, Lock, User as UserIcon, ShieldAlert } from "lucide-react";

interface AuthPagesProps {
  onLoginSuccess: (role: "user" | "admin", name: string, email: string) => void;
}

export function AuthPages({ onLoginSuccess }: AuthPagesProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const { showToast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.includes("@") || password.length < 6) {
      showToast("❌ Invalid email or password (min 6 chars)!", "error");
      return;
    }

    if (!isLogin && !name.trim()) {
      showToast("❌ Name is required for registration!", "error");
      return;
    }

    // Default to regular user on custom form submit
    onLoginSuccess("user", isLogin ? "Active User" : name, email);
    showToast(
      `🎉 Welcome ${isLogin ? "Back" : ""}! Logged in successfully.`,
      "success"
    );
  };

  // Requirement 7: Demo Login Auto-fill & Action
  const handleDemoLogin = (role: "user" | "admin") => {
    if (role === "admin") {
      setEmail("admin@eventhub.com");
      setPassword("admin123");
      onLoginSuccess("admin", "Sarah Jenkins", "admin@eventhub.com");
      showToast("⚡ Administrator Session Activated!", "success");
    } else {
      setEmail("user@eventhub.com");
      setPassword("user123");
      onLoginSuccess("user", "Alex Rivera", "user@eventhub.com");
      showToast("🎉 Premium Member Session Activated!", "success");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 bg-slate-50">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-xl text-left space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            {isLogin ? "Access Portal" : "Create Account"}
          </h2>
          <p className="text-xs text-slate-500">
            {isLogin
              ? "Sign in to explore and book assemblies"
              : "Register to secure passes"}
          </p>
        </div>

        {/* Demo Login Row */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 space-y-2.5">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">
            ⚡ Quick Demo Access (Requirement 7)
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => handleDemoLogin("user")}
              className="flex-1 bg-white border border-slate-200 text-[11px] font-bold py-2 px-3 rounded-xl hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 transition-all cursor-pointer text-center"
            >
              Demo User
            </button>
            <button
              onClick={() => handleDemoLogin("admin")}
              className="flex-1 bg-slate-900 text-white text-[11px] font-bold py-2 px-3 rounded-xl hover:bg-indigo-600 transition-all cursor-pointer text-center"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-100"></div>
          <span className="flex-shrink mx-4 text-[10px] font-bold text-slate-400 uppercase">
            Or Secure Form
          </span>
          <div className="flex-grow border-t border-slate-100"></div>
        </div>

        {/* Main Credentials Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-600">
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 outline-hidden focus:border-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 outline-hidden focus:border-indigo-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-bold text-slate-600">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-800 outline-hidden focus:border-indigo-500 focus:bg-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-3 px-4 rounded-xl transition-all cursor-pointer text-center mt-2 shadow-md shadow-indigo-600/10"
          >
            {isLogin ? "Authenticate Session" : "Register Account"}
          </button>
        </form>

        <p className="text-center text-[11px] text-slate-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 font-bold hover:underline cursor-pointer"
          >
            {isLogin ? "Register Here" : "Login Here"}
          </button>
        </p>
      </div>
    </div>
  );
}
