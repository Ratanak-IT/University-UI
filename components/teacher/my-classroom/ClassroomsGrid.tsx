import ClassroomCard from "@/components/teacher/ClassroomCard";
import { Classroom } from "@/lib/types/dashboard";


export default function ClassroomsGrid({ classrooms }: { classrooms: Classroom[] }) {
  return (
    <>
      <h2 className="mb-4 mt-8 text-lg font-bold text-slate-900">
        Your classrooms
      </h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {classrooms.map((room, i) => (
          <ClassroomCard key={`${room.title}-${i}`} {...room} />
        ))}
      </div>
    </>
  );
}