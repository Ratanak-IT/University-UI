"use client";

import React, { useEffect, useState, useRef } from "react";
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
  Camera,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import {
  fetchTeacherProfile,
  uploadTeacherAvatar,
  TeacherProfile,
} from "@/lib/api/teacher";
import ProfileTeacherSkeleton from "./ProfileTeacherSkeleton";

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-card rounded-2xl border border-border shadow-sm ${className}`}
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
      <label className="block text-xs text-muted-foreground mb-1.5">{label}</label>
      <div
        className={`flex items-center justify-between rounded-lg border px-3 py-2.5 text-sm ${
          locked
            ? "bg-muted border-border text-muted-foreground"
            : "bg-card border-border text-card-foreground"
        }`}
      >
        <span>{value}</span>
        {locked && <Lock className="w-3.5 h-3.5 text-muted-foreground" />}
      </div>
      {helper && <p className="text-xs text-muted-foreground mt-1.5">{helper}</p>}
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
      ? "bg-purple-50 text-purple-700 border-purple-100 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-900"
      : "bg-primary/10 text-primary border-primary/20";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-sm font-medium ${styles}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </span>
  );
}

export default function Profile() {
  const [profile, setProfile] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    async function load() {
      const p = await fetchTeacherProfile();
      if (p) {
        setProfile(p);
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
      setPhotoError("Please choose an image file (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image size must be under 5MB.");
      return;
    }

    setPhotoError("");
    setUploading(true);

    const updated = await uploadTeacherAvatar(file);
    if (updated) {
      setProfile(updated);
    } else {
      setPhotoError("Failed to upload avatar. Please try again.");
    }
    setUploading(false);
    e.target.value = "";
  }

  if (loading) {
    return <ProfileTeacherSkeleton />;
  }

  const teacherName = profile
    ? `${profile.firstName} ${profile.lastName}`
    : "Teacher Profile";
  const teacherCode = profile?.teacherCode ?? "TCH-2026-089";

  return (
    <div className="min-h-screen bg-background px-8 py-8">
      {/* Hidden File Input for Avatar Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">
          {/* Header card with Avatar Upload */}
          <Card className="p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Avatar Container with Camera Overlay */}
                <div className="relative group w-20 h-20 rounded-full overflow-hidden bg-muted ring-2 ring-primary/20 shrink-0">
                  {profile?.avatarUrl ? (
                    <Image
                      src={profile.avatarUrl}
                      alt={teacherName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-bold text-xl">
                      {profile?.firstName?.[0]}
                      {profile?.lastName?.[0]}
                    </div>
                  )}

                  {/* Camera overlay button */}
                  <button
                    type="button"
                    onClick={handlePhotoClick}
                    disabled={uploading}
                    title="Update Profile Picture"
                    className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  >
                    {uploading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <Camera className="w-5 h-5" />
                        <span className="text-[10px] font-medium mt-0.5">Upload</span>
                      </>
                    )}
                  </button>
                </div>

                <div>
                  <h1 className="text-lg font-semibold text-card-foreground">
                    {teacherName}
                  </h1>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-primary/10 text-primary px-2.5 py-1 font-medium dark:text-gray-200">
                      ID: {teacherCode}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground dark:text-gray-200">
                      {profile?.position ?? "Faculty Member"}
                    </span>
                  </div>
                  {photoError && (
                    <p className="mt-1 text-xs text-rose-600 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {photoError}
                    </p>
                  )}
                </div>
              </div>

              <button
                onClick={handlePhotoClick}
                disabled={uploading}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary hover:opacity-90 transition-colors text-primary-foreground text-sm font-medium px-4 py-2.5 shadow-sm"
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Update Photo
                    <Camera className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-base font-semibold text-card-foreground">
                Personal Information
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              <Field label="First Name" value={profile?.firstName ?? "—"} />
              <Field label="Last Name" value={profile?.lastName ?? "—"} />
              <div>
                <Field
                  label="Email Address"
                  value={profile?.email ?? "—"}
                  locked
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  Managed via Keycloak SSO &amp; IT Department
                </p>
              </div>
              <Field
                label="Teacher Code"
                value={profile?.teacherCode ?? "—"}
                locked
              />
            </div>
          </Card>

          {/* Professional Expertise */}
          <Card className="p-6">
            <h2 className="text-base font-semibold text-card-foreground mb-5">
              Professional Expertise
            </h2>
            <div className="mb-5">
              <label className="block text-xs text-muted-foreground mb-1.5">
                Primary Specialization
              </label>
              <div className="rounded-lg border border-border px-3 py-2.5 text-sm text-card-foreground font-medium">
                {profile?.specialization || "Computer Science & Software Engineering"}
              </div>
            </div>
            <div>
              {/* <label className="block text-xs text-muted-foreground mb-2.5">
                Assigned Departments
              </label>
              <div className="flex flex-wrap items-center gap-2">
                {profile?.departments && profile.departments.length > 0 ? (
                  profile.departments.map((dept) => (
                    <Tag
                      key={dept.departmentId}
                      icon={Monitor}
                      label={`${dept.code} - ${dept.name}`}
                    />
                  ))
                ) : (
                  <Tag icon={Monitor} label="Department of Computer Science" />
                )}
              </div> */}
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-6">

          {/* HR & Employment */}
          <Card className="p-5">
            <p className="text-xs font-semibold tracking-wide text-muted-foreground mb-4">
              HR &amp; EMPLOYMENT
            </p>
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Hire Date</p>
                <p className="text-sm font-semibold text-card-foreground">
                  {profile?.hireDate || "2024-05-12"}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Employment Status</p>
                <p className="text-sm font-semibold text-card-foreground capitalize">
                  {profile?.employmentStatus?.toLowerCase() || "Permanent Faculty"}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}