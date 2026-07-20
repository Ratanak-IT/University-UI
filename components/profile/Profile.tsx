import {
  SquarePen,
  ShieldCheck,
  Calendar,
  Briefcase,
  Monitor,
  ShieldHalf,
  Landmark,
  Plus,
  Lock,
  ChevronDown,
} from "lucide-react";
 
function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}
 
function Field({
  label,
  value,
  locked,
  helper,
}: {
  label: string;
  value: string;
  locked?: boolean;
  helper?: string;
}) {
  return (
    <div>
      <label className="block text-xs text-slate-500 mb-1.5">{label}</label>
      <div
        className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm ${
          locked
            ? "bg-slate-50 border-slate-200 text-slate-400"
            : "bg-white border-slate-300 text-slate-800"
        }`}
      >
        <span>{value}</span>
        {locked && <Lock className="w-3.5 h-3.5 text-slate-400" />}
      </div>
      {helper && <p className="text-xs text-slate-400 mt-1.5">{helper}</p>}
    </div>
  );
}
 
function Tag({
  icon: Icon,
  label,
  variant = "default",
}: {
  icon: React.ElementType;
  label: string;
  variant?: "default" | "purple";
}) {
  const styles =
    variant === "purple"
      ? "bg-purple-50 text-purple-700 border-purple-100"
      : "bg-blue-50 text-blue-700 border-blue-100";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${styles}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}
 
export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4">
      <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Header card */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-200 flex items-center justify-center ring-1 ring-slate-200">
                  <svg viewBox="0 0 64 64" className="w-full h-full">
                    <rect width="64" height="64" fill="#dbe4f0" />
                    <circle cx="32" cy="24" r="12" fill="#8fa6c4" />
                    <ellipse cx="32" cy="58" rx="20" ry="16" fill="#8fa6c4" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-slate-900">
                    Mr. Chhay Davin
                  </h1>
                  <div className="mt-1.5 flex items-center gap-2 text-xs">
                    <span className="rounded-full bg-blue-50 text-blue-700 px-2.5 py-1 font-medium">
                      ID: TCH-2026-089
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-slate-500">Joined 2 years ago</span>
                  </div>
                </div>
              </div>
              <button className="inline-flex items-center gap-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 transition-colors text-white text-sm font-medium px-4 py-2.5">
                Edit Profile
                <SquarePen className="w-3.5 h-3.5" />
              </button>
            </div>
          </Card>
 
          {/* Personal Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-slate-900">
                Personal Information
              </h2>
              <button className="text-sm font-medium text-blue-700 hover:text-blue-800">
                Edit Details
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <Field label="Full Legal Name" value="Chhay Davin" />
              <div>
                <Field
                  label="Email Address"
                  value="davin.chhay@university.edu"
                  locked
                />
                <p className="text-xs text-slate-400 mt-1.5">
                  Managed by IT Department
                </p>
              </div>
              <Field label="Phone Number" value="+855 12 345 678" />
              <div>
                <label className="block text-xs text-slate-500 mb-1.5">
                  Preferred Language
                </label>
                <div className="flex items-center justify-between rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800">
                  <span>English (Academic)</span>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </div>
              </div>
            </div>
          </Card>
 
          {/* Professional Expertise */}
          <Card className="p-6">
            <h2 className="text-base font-semibold text-slate-900 mb-5">
              Professional Expertise
            </h2>
            <div className="mb-5">
              <label className="block text-xs text-slate-500 mb-1.5">
                Primary Specialization
              </label>
              <div className="rounded-lg border border-slate-300 px-3 py-2.5 text-sm text-slate-800">
                Quantum Cryptography &amp; Network Security
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2.5">
                Department Matrix
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <Tag icon={Monitor} label="Department of Computer Science" />
                <Tag icon={ShieldHalf} label="Information Security Lab" />
                <Tag icon={Landmark} label="Research Council" variant="purple" />
                <button className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50">
                  <Plus className="w-3.5 h-3.5" />
                  Assign Department
                </button>
              </div>
            </div>
          </Card>
        </div>
 
        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Account Lifecycle */}
          <Card className="p-5">
            <p className="text-xs font-semibold tracking-wide text-slate-400 mb-4">
              ACCOUNT LIFECYCLE
            </p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-slate-700">
                System Status
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 text-green-700 text-xs font-medium px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Active
              </span>
            </div>
            <div className="rounded-xl bg-indigo-50/60 border border-indigo-100 p-4 flex gap-3">
              <ShieldCheck className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-800">
                  SSO Verification
                </p>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  Authentication Managed via Keycloak SSO. Profile sync
                  occurs every 15 minutes.
                </p>
              </div>
            </div>
          </Card>
 
          {/* HR & Employment */}
          <Card className="p-5">
            <p className="text-xs font-semibold tracking-wide text-slate-400 mb-4">
              HR &amp; EMPLOYMENT
            </p>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Joining Date</p>
                <p className="text-sm font-semibold text-slate-800">
                  May 12, 2024
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-slate-500" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Contract Type</p>
                <p className="text-sm font-semibold text-slate-800">
                  Permanent Faculty
                </p>
              </div>
            </div>
            <div className="border-t border-slate-100 my-4" />
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Keycloak Sub Claim ID</span>
                <span className="text-slate-500 font-mono">
                  550e8400-e29b-41d4
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Internal User ID</span>
                <span className="text-slate-500 font-mono">8901224</span>
              </div>
            </div>
          </Card>
 
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-blue-50/60 border-blue-100">
              <p className="text-xs font-medium text-blue-700">Students</p>
              <p className="text-2xl font-bold text-blue-900 mt-1">142</p>
            </Card>
            <Card className="p-4 bg-pink-50/60 border-pink-100">
              <p className="text-xs font-medium text-pink-700">Publications</p>
              <p className="text-2xl font-bold text-pink-900 mt-1">28</p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}