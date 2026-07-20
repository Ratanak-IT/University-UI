import { LessonPlayer } from "@/components/teacher/detail-lesson/LessonPlayer.tsx";
import { LessonTabs } from "@/components/teacher/detail-lesson/LessonTabs";
import { ModuleNavigation } from "@/components/teacher/detail-lesson/ModuleNavigation";
import { getLessonById } from "@/lib/api/lessons";
import { CheckCircle2 } from "lucide-react";

export default async function LessonPage({
  params,
}: {
  params: { id: string };
}) {
  const lesson = await getLessonById(params.id);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6 px-8 py-8">
      <div>
        <LessonPlayer thumbnailUrl={lesson.thumbnailUrl} videoUrl={lesson.videoUrl} />

        <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
            <p className="text-sm text-slate-500 mt-1">{lesson.courseLabel}</p>
          </div>
          <button className="flex items-center gap-2 rounded-xl bg-blue-800 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-900 transition-colors shrink-0">
            <CheckCircle2 className="h-4 w-4" />
            Mark as Complete
          </button>
        </div>

        <div className="mt-6">
          <LessonTabs description={lesson.description} objectives={lesson.objectives} />
        </div>
      </div>

      <ModuleNavigation progress={lesson.moduleProgress} items={lesson.moduleItems} />
    </div>
  );
}