import { Plus } from "lucide-react";

type WelcomeHeaderProps = {
  teacherName: string;
  academicYear: string;
  semester: string;
  activeClassrooms: number;
  onNewClassroom?: () => void;
};

export default function WelcomeHeader({
  teacherName,
  academicYear,
  semester,
  activeClassrooms,
  onNewClassroom,
}: WelcomeHeaderProps) {
  return (
    <div className="mb-8 flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome back, {teacherName}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Academic Year {academicYear} · {semester} · {activeClassrooms} active classrooms
        </p>
      </div>
      <button
        onClick={onNewClassroom}
        className="flex items-center gap-2 rounded-xl bg-indigo-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800"
      >
        <Plus className="h-4 w-4" strokeWidth={2} />
        New classroom
      </button>
    </div>
  );
}