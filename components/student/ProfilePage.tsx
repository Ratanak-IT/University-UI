"use client";

import { useRef, useState, useEffect } from "react";
import { ShieldCheck, Calendar, IdCard, X, Check, Camera, Loader2 } from "lucide-react";
import { fetchMyProfile, fetchStudentGpa, uploadAvatar, GpaResponse, StudentProfile } from "@/lib/api/student";

type FormState = {
  fullName: string;
  phone: string;
  language: string;
  major: string;
};

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [gpaData, setGpaData] = useState<GpaResponse | null>(null);

  const [form, setForm] = useState<FormState>({
    fullName: "",
    phone: "",
    language: "English (Academic)",
    major: "",
  });
  const [draft, setDraft] = useState<FormState>({
    fullName: "",
    phone: "",
    language: "English (Academic)",
    major: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  const [photoUrl, setPhotoUrl] = useState("/davin.jpg");
  const [photoError, setPhotoError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const p = await fetchMyProfile();
      if (p) {
        setProfile(p);
        const fullName = `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.username || "Student";
        const majorName = p.major || p.department || "General Academic Program";
        const yearLevelText = p.yearLevel ? `Year ${p.yearLevel}` : "Year 1";
        const semesterText = p.semester ? `Semester ${p.semester}` : "Semester 1";
        const academicYearText = p.academicYear ? ` (${p.academicYear})` : "";
        const majorText = `${majorName} · ${yearLevelText} · ${semesterText}${academicYearText}`;
        
        const initialData = {
          fullName,
          phone: p.studentCode || "N/A",
          language: "English (Academic)",
          major: majorText,
        };
        setForm(initialData);
        setDraft(initialData);

        if (p.avatarUrl) {
          setPhotoUrl(p.avatarUrl);
        } else {
          setPhotoUrl("/davin.jpg");
        }

        const gpa = await fetchStudentGpa(p.studentId);
        if (gpa) {
          setGpaData(gpa);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  function handlePhotoClick() {
    fileInputRef.current?.click();
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image must be under 5MB.");
      return;
    }

    setPhotoError("");
    setUploading(true);

    // Show preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPhotoUrl((prev) => {
      if (prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return objectUrl;
    });

    // Upload to MinIO via backend
    const updated = await uploadAvatar(file);
    if (updated) {
      setProfile(updated);
      if (updated.avatarUrl) {
        setPhotoUrl((prev) => {
          if (prev.startsWith("blob:")) URL.revokeObjectURL(prev);
          return updated.avatarUrl!;
        });
      }
    } else {
      setPhotoError("Upload failed. Please try again.");
    }

    setUploading(false);
    e.target.value = "";
  }

  function startEdit() {
    setDraft(form);
    setIsEditing(true);
  }

  function saveEdit() {
    setForm(draft);
    setIsEditing(false);
  }

  function cancelEdit() {
    setDraft(form);
    setIsEditing(false);
  }

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center gap-2">
        <p className="text-lg font-semibold text-slate-700">Failed to load profile</p>
        <p className="text-sm text-slate-500">Please make sure you are logged in.</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-8 transition-colors">
      {/* Breadcrumb header */}
      <div className="mb-6">
        <p className="text-sm font-bold text-indigo-700 dark:text-indigo-400">My Profile</p>
        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
          Academic Year {profile.academicYear} · Semester {profile.semester}
        </p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
          {/* Identity card */}
          <div className="flex flex-wrap gap-4 items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  disabled={uploading}
                  className="group relative block h-20 w-20 overflow-hidden rounded-full border border-slate-200 bg-indigo-600 dark:border-slate-700"
                  aria-label="Change profile picture"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt={`${profile.firstName} profile`}
                    className="h-full w-full object-cover"
                  />
                  {uploading ? (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <Loader2 className="h-6 w-6 animate-spin text-white" />
                    </span>
                  ) : (
                    <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                      <Camera className="h-5 w-5 text-white" strokeWidth={2} />
                    </span>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  aria-label="Upload new profile picture"
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-700 text-white hover:bg-indigo-800 dark:border-slate-900 dark:bg-indigo-600 dark:hover:bg-indigo-500"
                >
                  <Camera className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                {photoError && (
                  <p className="absolute top-full left-0 mt-1 w-40 text-xs font-medium text-rose-600 dark:text-rose-400">
                    {photoError}
                  </p>
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                  {profile.firstName} {profile.lastName}
                </h1>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300">
                    ID: {profile.studentCode}
                  </span>
                  <span className="text-xs text-slate-400 dark:text-slate-500">· Active Student</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={startEdit}
              className="rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 dark:bg-indigo-600 dark:hover:bg-indigo-500 shadow-sm"
            >
              Edit Profile
            </button>
          </div>

          {/* Personal information */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">Personal Information</h2>
              {isEditing ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-400"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Save
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startEdit}
                  className="text-sm font-semibold text-indigo-700 hover:underline dark:text-indigo-400"
                >
                  Edit Details
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Full Legal Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  readOnly={!isEditing}
                  value={isEditing ? draft.fullName : form.fullName}
                  onChange={(e) => setDraft((d) => ({ ...d, fullName: e.target.value }))}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                    isEditing
                      ? "border-indigo-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-indigo-500 dark:bg-slate-800 dark:text-slate-100"
                      : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
                  }`}
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Email Address
                </label>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 dark:border-slate-800 dark:bg-slate-800/50">
                  <span id="email" className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                    {profile.email}
                  </span>
                  <IdCard className="h-4 w-4 text-slate-400 dark:text-slate-500" />
                </div>
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Managed by IT Department</p>
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Student Code Reference
                </label>
                <input
                  id="phone"
                  name="phone"
                  readOnly={true}
                  value={form.phone}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
                />
              </div>
              <div>
                <label htmlFor="language" className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Preferred Language
                </label>
                <select
                  id="language"
                  name="language"
                  disabled={!isEditing}
                  value={isEditing ? draft.language : form.language}
                  onChange={(e) => setDraft((d) => ({ ...d, language: e.target.value }))}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm transition-colors ${
                    isEditing
                      ? "border-indigo-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-indigo-500 dark:bg-slate-800 dark:text-slate-100"
                      : "border-slate-200 bg-slate-50 text-slate-700 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300"
                  }`}
                >
                  <option className="dark:bg-slate-800 dark:text-slate-100">English (Academic)</option>
                  <option className="dark:bg-slate-800 dark:text-slate-100">Khmer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic program */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="mb-5 text-base font-bold text-slate-900 dark:text-slate-100">Academic Program</h2>
            <div>
              <label htmlFor="major" className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">
                Primary Major &amp; Semester
              </label>
              <input
                id="major"
                name="major"
                readOnly={true}
                value={form.major}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-600 dark:border-slate-800 dark:bg-slate-800/50 dark:text-slate-300 font-medium"
              />
            </div>
          </div>
      </div>
    </div>
  );
}
