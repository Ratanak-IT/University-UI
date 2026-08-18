import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Home,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-6 py-12">
      {/* Background decorations */}
      <div className="absolute left-[-100px] top-[-100px] h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
      <div className="absolute bottom-[-120px] right-[-100px] h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />

      <div className="relative z-10 w-full max-w-3xl text-center">
        {/* Logo */}
        <Link
          href="/"
          className="mx-auto flex w-fit items-center gap-3"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-indigo-100 bg-white shadow-sm">
            <Image
              src="/logo-rm.png"
              alt="UMS logo"
              width={42}
              height={42}
              className="object-contain"
              priority
            />
          </div>

          <div className="text-left">
            <p className="text-xl font-black text-indigo-950">
              UMS
            </p>
            <p className="text-xs font-medium text-slate-500">
              E-Learning Platform
            </p>
          </div>
        </Link>

        {/* Error illustration */}
        <div className="relative mx-auto mt-12 flex h-60 w-60 items-center justify-center">
          <div className="absolute inset-0 rounded-full border border-dashed border-indigo-300 animate-[spin_20s_linear_infinite]" />

          <div className="absolute inset-6 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 shadow-inner" />

          <div className="relative flex h-28 w-28 items-center justify-center rounded-3xl bg-indigo-600 text-white shadow-2xl shadow-indigo-600/30 rotate-[-6deg]">
            <BookOpen className="h-14 w-14" />
          </div>

          <div className="absolute right-2 top-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-indigo-600 shadow-lg">
            <GraduationCap className="h-6 w-6" />
          </div>
        </div>

        {/* Error message */}
        <div className="mt-8">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-indigo-600">
            Error 404
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 sm:text-6xl">
            Page not found
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-slate-500 sm:text-base">
            The page you are looking for may have been moved, removed,
            or the address may be incorrect.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:-translate-y-0.5 hover:bg-indigo-700 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Back to home
          </Link>

          <Link
            href="/login"
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Go to login
          </Link>
        </div>

        <p className="mt-12 text-xs font-medium text-slate-400">
          © {new Date().getFullYear()} UMS · University Management
          System
        </p>
      </div>
    </main>
  );
}