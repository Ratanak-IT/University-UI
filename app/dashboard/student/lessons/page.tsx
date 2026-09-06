"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PlayCircle, FileText } from "lucide-react";
import { SecureFileViewerModal } from "@/components/shared/SecureFileViewerModal";
import ModernSelect from "@/components/shared/ModernSelect";
import { useGetMyClassroomsQuery, useGetLessonsForClassroomsQuery } from "@/lib/redux/apiSlice";

export default function LessonsPage() {
  // A notification or the courses page can link here with ?classroomId= so
  // the click lands pre-filtered to that class, matching the same pattern
  // used on the attendance and assignment pages.
  const searchParams = useSearchParams();
  const [filterClassroom, setFilterClassroom] = useState<string>(
    () => searchParams.get("classroomId") || "ALL"
  );
  const [viewerFile, setViewerFile] = useState<{ name: string; url: string; isVideo?: boolean } | null>(null);

  const { data: classrooms = [], isLoading: loadingClassrooms } = useGetMyClassroomsQuery();

  const classroomArgs = useMemo(
    () => classrooms.map((c) => ({ classroomId: c.classroomId, classCode: c.classCode, className: c.className })),
    [classrooms]
  );
  const { data: allLessons = [], isFetching: loadingLessons } = useGetLessonsForClassroomsQuery(
    classroomArgs,
    { skip: classroomArgs.length === 0 }
  );

  const loading = loadingClassrooms || (classroomArgs.length > 0 && loadingLessons);

  const lessons = useMemo(
    () => [...allLessons].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [allLessons]
  );

  const filteredLessons = useMemo(
    () =>
      filterClassroom === "ALL"
        ? lessons
        : lessons.filter((l) => l.classroomId === filterClassroom),
    [lessons, filterClassroom]
  );

  return (
    <div className="space-y-6 p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-indigo-950 dark:text-gray-200">
            Lessons
          </h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {loading
              ? "Loading..."
              : `Course materials from your enrolled classes. ${filteredLessons.length} lesson${filteredLessons.length === 1 ? "" : "s"} found.`}
          </p>
        </div>

        {!loading && classrooms.length > 0 && (
          <div className="w-56">
            <ModernSelect
              value={filterClassroom}
              onChange={(val) => setFilterClassroom(val)}
              options={[
                { value: "ALL", label: "All Classes" },
                ...classrooms.map((c) => ({
                  value: c.classroomId,
                  label: c.className,
                })),
              ]}
            />
          </div>
        )}
      </div>

      {loading ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="flex items-center gap-4 p-5">
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-56 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
                  <div className="flex gap-3">
                    <div className="h-5 w-14 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
                    <div className="h-4 w-32 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80" />
                  </div>
                </div>
                <div className="hidden h-3 w-20 shrink-0 animate-pulse rounded-md bg-slate-200/80 dark:bg-slate-800/80 sm:block" />
              </li>
            ))}
          </ul>
        </div>
      ) : filteredLessons.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-center">
          <p className="text-lg font-semibold text-slate-700 dark:text-slate-200">
            No lessons found
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {filterClassroom === "ALL"
              ? "No lessons have been posted yet."
              : "No lessons have been posted for this class yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredLessons.map((l) => (
              <li
                key={l.lessonId}
                className="flex items-center gap-4 p-5 transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50"
              >
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-2 text-sm font-bold text-indigo-950 dark:text-gray-200">
                    {l.title}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-3 text-xs">
                    <span className="rounded-md bg-indigo-50 px-2 py-0.5 font-bold text-indigo-700 dark:bg-indigo-950/60 dark:text-gray-200">
                      {l.classCode}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400">{l.className}</span>
                    {l.videoLink && (
                      <button
                        onClick={() => setViewerFile({ name: `${l.title} (Video)`, url: l.videoLink || "", isVideo: true })}
                        className="flex items-center gap-1 text-indigo-600 hover:underline cursor-pointer dark:text-gray-200"
                      >
                        <PlayCircle className="h-3.5 w-3.5" strokeWidth={2} />
                        Video
                      </button>
                    )}
                    {l.files?.map((f) => (
                      <button
                        key={f.fileId}
                        onClick={() => setViewerFile({ name: f.fileOriginalName, url: f.previewUrl || "" })}
                        className="flex items-center gap-1 text-slate-500 hover:text-indigo-600 cursor-pointer dark:text-slate-400 dark:hover:text-indigo-400"
                      >
                        <FileText className="h-3.5 w-3.5" strokeWidth={2} />
                        {f.fileOriginalName}
                      </button>
                    ))}
                  </p>
                </div>

                <span className="hidden shrink-0 text-xs text-slate-400 dark:text-slate-500 sm:block">
                  {new Date(l.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Secure File Viewer Modal */}
      {viewerFile && (
        <SecureFileViewerModal
          isOpen={!!viewerFile}
          onClose={() => setViewerFile(null)}
          fileName={viewerFile.name}
          fileUrl={viewerFile.url}
          isVideo={viewerFile.isVideo}
        />
      )}
    </div>
  );
}
