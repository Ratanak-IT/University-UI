"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Users, Shield, Loader2, Eye, EyeOff } from "lucide-react";
import { useLoginUserMutation } from "@/lib/redux/apiSlice";
import { fetchUserProfile } from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter();
  const [loginUser] = useLoginUserMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const loginRes = await loginUser({ email: email.trim(), password }).unwrap();
      if (!loginRes) {
        setError("Invalid email or password. Please try again.");
        setLoading(false);
        return;
      }

      // Store tokens
      localStorage.setItem("token", loginRes.accessToken);
      localStorage.setItem("access_token", loginRes.accessToken);
      localStorage.setItem("refresh_token", loginRes.refreshToken);

      // Fetch user profile to verify role
      const profile = await fetchUserProfile(loginRes.accessToken);
      if (!profile) {
        setError("Failed to fetch user profile. Contact system administrator.");
        setLoading(false);
        return;
      }

      // Redirect based on role
      if (profile.role === "TEACHER") {
        router.push("/dashboard/teacher");
      } else if (profile.role === "STUDENT") {
        router.push("/dashboard/student");
      } else if (profile.role === "ADMIN") {
        router.push("/dashboard/teacher"); // Admin fallback
      } else {
        setError(`Unauthorized role: ${profile.role}`);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 font-sans sm:p-6 lg:p-8">
      {/* Login Card Container */}
      <div className="flex w-full max-w-[1100px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl lg:h-[700px]">
        {/* Left Side: Login Form */}
        <div className="flex w-full flex-col justify-center px-6 py-10 sm:px-12 md:px-16 lg:w-1/2">
          <div className="mx-auto w-full max-w-[400px]">
            {/* Logo */}
            <div className="flex justify-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-indigo-600/20 bg-indigo-50 p-2">
                <Image
                  src="/logo-rm.png"
                  alt="UML crest"
                  width={64}
                  height={64}
                  className="object-contain"
                  priority
                />
              </div>
            </div>

            {/* Header Text */}
            <div className="mt-6 text-center">
              <h1 className="text-3xl font-black tracking-tight text-indigo-900">
                Welcome To UML
              </h1>
              <p className="mt-2 text-sm font-medium text-slate-500">
                Sign in to your account
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-6 rounded-xl bg-rose-50 p-3.5 text-center text-xs font-semibold text-rose-600 border border-rose-100">
                {error}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {/* Email field */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Email
                </label>
                <div className="mt-1.5">
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Example@email.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all"
                  />
                </div>
              </div>

              {/* Password field */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-bold uppercase tracking-wider text-slate-700"
                >
                  Password
                </label>
                <div className="relative mt-1.5">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-4 pr-11 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-600/10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4.5 w-4.5" />
                    ) : (
                      <Eye className="h-4.5 w-4.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remeber me & Forgot password */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600"
                  />
                  <span className="text-xs font-semibold text-slate-600">Remember me</span>
                </label>
                <a
                  href="#"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-6 flex w-full items-center justify-center rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-600/25 disabled:opacity-75"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4.5 w-4.5 animate-spin" /> Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>
            </form>

            {/* Sign up link */}
            <p className="mt-8 text-center text-xs font-semibold text-slate-500">
              Don&apos;t you have an account?{" "}
              <a href="#" className="font-bold text-indigo-600 hover:underline">
                Sign up
              </a>
            </p>
          </div>
        </div>

        {/* Right Side: Welcome graphic & Portal cards */}
        <div className="relative hidden w-1/2 flex-col justify-between bg-gradient-to-br from-indigo-50/70 via-blue-50/60 to-indigo-100/40 p-10 lg:flex">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo-rm.png"
              alt="UML Logo"
              width={40}
              height={40}
              className="h-9 w-auto object-contain"
            />
            <div>
              <span className="text-xl font-black text-indigo-900">University</span>{" "}
              <span className="text-xl font-medium text-slate-600">Management System</span>
            </div>
          </div>

          {/* Description & Illustration */}
          <div className="my-auto flex flex-col items-center text-center">
            <p className="max-w-[400px] text-sm font-semibold leading-relaxed text-slate-600">
              A unified platform for students, lecturers and administrators.
            </p>
            <div className="relative mt-6 h-[250px] w-full max-w-[420px]">
              <Image
                src="/welcome.png"
                alt="University illustration"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Bottom Portal Icons */}
          <div className="grid grid-cols-3 gap-4 border-t border-indigo-100/50 pt-8">
            {/* Student */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="mt-2.5 text-xs font-bold text-indigo-950">Student Portal</h3>
              <p className="mt-1 text-[10px] leading-snug text-slate-500">
                Manage courses, grades and more.
              </p>
            </div>

            {/* Lecturer */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="mt-2.5 text-xs font-bold text-indigo-950">Lecturer Portal</h3>
              <p className="mt-1 text-[10px] leading-snug text-slate-500">
                Manage classes, attendance and grades.
              </p>
            </div>

            {/* Admin */}
            <div className="flex flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-600">
                <Shield className="h-5 w-5" />
              </div>
              <h3 className="mt-2.5 text-xs font-bold text-indigo-950">Admin Portal</h3>
              <p className="mt-1 text-[10px] leading-snug text-slate-500">
                Manage users, system and report.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
