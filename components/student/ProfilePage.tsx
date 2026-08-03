"use client";

import { useRef, useState, useEffect } from "react";
import { ShieldCheck, Calendar, IdCard, Plus, X, Check, Camera, Loader2 } from "lucide-react";
import { fetchMyProfile, fetchStudentGpa, GpaResponse, StudentProfile } from "@/lib/api/student";

type FormState = {
  fullName: string;
  phone: string;
  language: string;
  major: string;
};

const initialClubs = [
  "Department of Computer Science",
  "Coding Club",
  "Student Council",
];

const clubColors = [
  "bg-indigo-50 text-indigo-700",
  "bg-sky-50 text-sky-700",
  "bg-rose-50 text-rose-700",
  "bg-emerald-50 text-emerald-700",
  "bg-amber-50 text-amber-700",
];

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

  const [clubs, setClubs] = useState<string[]>(initialClubs);
  const [isAddingClub, setIsAddingClub] = useState(false);
  const [newClub, setNewClub] = useState("");

  const [photoUrl, setPhotoUrl] = useState("/davin.jpg");
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const p = await fetchMyProfile();
      if (p) {
        setProfile(p);
        const name = `${p.firstName} ${p.lastName}`;
        const majorText = `Year ${p.yearLevel} · Semester ${p.semester} (${p.academicYear})`;
        
        const initialData = {
          fullName: name,
          phone: p.studentCode, // Using studentCode or other identifiers
          language: "English (Academic)",
          major: majorText,
        };
        setForm(initialData);
        setDraft(initialData);

        if (p.avatarUrl) {
          setPhotoUrl(p.avatarUrl);
        }

        const gpa = await fetchStudentGpa(p.id);
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

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
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
    const objectUrl = URL.createObjectURL(file);
    setPhotoUrl((prev) => {
      if (prev.startsWith("blob:")) URL.revokeObjectURL(prev);
      return objectUrl;
    });

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

  function addClub() {
    const trimmed = newClub.trim();
    if (trimmed) {
      setClubs((prev) => [...prev, trimmed]);
    }
    setNewClub("");
    setIsAddingClub(false);
  }

  function removeClub(club: string) {
    setClubs((prev) => prev.filter((c) => c !== club));
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
    <div className="px-8 py-8">
      {/* Breadcrumb header */}
      <div className="mb-6">
        <p className="text-sm font-bold text-indigo-700">My Profile</p>
        <p className="mt-0.5 text-sm text-slate-500">
          Academic Year {profile.academicYear} · Semester {profile.semester}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left / main column */}
        <div className="space-y-6 lg:col-span-2">
          {/* Identity card */}
          <div className="flex flex-wrap gap-4 items-center justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  className="group relative block h-20 w-20 overflow-hidden rounded-full border border-slate-200 bg-indigo-600"
                  aria-label="Change profile picture"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl}
                    alt={`${profile.firstName} profile`}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all group-hover:bg-black/40 group-hover:opacity-100">
                    <Camera className="h-5 w-5 text-white" strokeWidth={2} />
                  </span>
                </button>
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  aria-label="Upload new profile picture"
                  className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-indigo-700 text-white hover:bg-indigo-800"
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
                  <p className="absolute top-full left-0 mt-1 w-40 text-xs font-medium text-rose-600">
                    {photoError}
                  </p>
                )}
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                <div className="mt-1 flex items-center gap-2">
                  <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                    ID: {profile.studentCode}
                  </span>
                  <span className="text-xs text-slate-400">· Active Student</span>
                </div>
              </div>
            </div>
            <button
              type="button"
              onClick={startEdit}
              className="rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800"
            >
              Edit Profile
            </button>
          </div>

          {/* Personal information */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
              {isEditing ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="flex items-center gap-1 text-sm font-semibold text-slate-500 hover:text-slate-700"
                  >
                    <X className="h-3.5 w-3.5" />
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={saveEdit}
                    className="flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:underline"
                  >
                    <Check className="h-3.5 w-3.5" />
                    Save
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={startEdit}
                  className="text-sm font-semibold text-indigo-700 hover:underline"
                >
                  Edit Details
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="fullName" className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Full Legal Name
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  readOnly={!isEditing}
                  value={isEditing ? draft.fullName : form.fullName}
                  onChange={(e) => setDraft((d) => ({ ...d, fullName: e.target.value }))}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-700 ${
                    isEditing
                      ? "border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      : "border-slate-200 bg-slate-50"
                  }`}
                />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Email Address
                </label>
                <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                  <span id="email" className="text-sm text-slate-400">
                    {profile.email}
                  </span>
                  <IdCard className="h-4 w-4 text-slate-300" />
                </div>
                <p className="mt-1 text-xs text-slate-400">Managed by IT Department</p>
              </div>
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Student Code Reference
                </label>
                <input
                  id="phone"
                  name="phone"
                  readOnly={true}
                  value={form.phone}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-400"
                />
              </div>
              <div>
                <label htmlFor="language" className="mb-1.5 block text-xs font-semibold text-slate-500">
                  Preferred Language
                </label>
                <select
                  id="language"
                  name="language"
                  disabled={!isEditing}
                  value={isEditing ? draft.language : form.language}
                  onChange={(e) => setDraft((d) => ({ ...d, language: e.target.value }))}
                  className={`w-full rounded-xl border px-3.5 py-2.5 text-sm text-slate-700 ${
                    isEditing
                      ? "border-indigo-300 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-200"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <option>English (Academic)</option>
                  <option>Khmer</option>
                </select>
              </div>
            </div>
          </div>

          {/* Academic program */}
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-base font-bold text-slate-900">Academic Program</h2>
            <div>
              <label htmlFor="major" className="mb-1.5 block text-xs font-semibold text-slate-500">
                Primary Major &amp; Semester
              </label>
              <input
                id="major"
                name="major"
                readOnly={true}
                value={form.major}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-400"
              />
            </div>
            <div className="mt-5">
              <p className="mb-2.5 text-xs font-semibold text-slate-500">Clubs &amp; Groups</p>
              <div className="flex flex-wrap items-center gap-2">
                {clubs.map((club, idx) => (
                  <span
                    key={club}
                    className={`group flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${
                      clubColors[idx % clubColors.length]
                    }`}
                  >
                    {club}
                    <button
                      type="button"
                      onClick={() => removeClub(club)}
                      aria-label={`Remove ${club}`}
                      className="opacity-50 hover:opacity-100"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}

                {isAddingClub ? (
                  <span className="flex items-center gap-1.5 rounded-full border border-indigo-200 bg-white px-2 py-1">
                    <input
                      autoFocus
                      value={newClub}
                      onChange={(e) => setNewClub(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addClub()}
                      placeholder="Club name"
                      className="w-32 text-sm text-slate-700 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addClub}
                      className="text-indigo-600 hover:text-indigo-800"
                      aria-label="Confirm add club"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingClub(true)}
                    className="flex items-center gap-1 rounded-full border border-dashed border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-500 hover:bg-slate-50"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Join Club
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          {/* Account lifecycle */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Account Lifecycle
            </p>
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">System Status</span>
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                {profile.enabled ? "Active" : "Disabled"}
              </span>
            </div>
            <div className="flex items-start gap-3 rounded-xl bg-indigo-50 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" strokeWidth={1.75} />
              <div>
                <p className="text-sm font-semibold text-indigo-900">SSO Verification</p>
                <p className="mt-1 text-xs text-indigo-700">
                  Authentication managed via Keycloak SSO. Profile sync occurs every 15
                  minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Academic record */}
          <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
              Academic Record
            </p>
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <Calendar className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Academic Year</p>
                <p className="text-sm font-semibold text-slate-800">{profile.academicYear}</p>
              </div>
            </div>
            <div className="mt-4 flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                <IdCard className="h-4 w-4 text-slate-600" />
              </div>
              <div>
                <p className="text-xs text-slate-400">Enrollment Type</p>
                <p className="text-sm font-semibold text-slate-800">Undergraduate · Full Time</p>
              </div>
            </div>
            <div className="mt-4 space-y-1 border-t border-slate-100 pt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Username Claim</span>
                <span className="text-slate-500">{profile.username}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">Graduation Status</span>
                <span className="text-slate-500 font-bold text-indigo-700">{profile.graduationStatus}</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-slate-100 bg-sky-50 p-4 text-center">
              <p className="text-2xl font-bold text-sky-700">
                {gpaData?.subjects?.length ?? 0}
              </p>
              <p className="text-xs font-medium text-sky-600">Courses</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-rose-50 p-4 text-center">
              <p className="text-2xl font-bold text-rose-600">
                {gpaData?.cumulativeGpa !== undefined ? gpaData.cumulativeGpa.toFixed(2) : "0.00"}
              </p>
              <p className="text-xs font-medium text-rose-500">GPA</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
