import { Classroom } from "@/lib/types/dashboard"
import ClassroomCard from "../ClassroomCard"
import Link from "next/link";


export default function ClassroomsSection({ classrooms }: { classrooms: Classroom[] }) {
  return (
    <div className="lg:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-card-foreground">Your Classrooms</h2>
        <Link
          href="/dashboard/teacher/my-classroom"
          className="text-xs font-semibold tracking-wide text-primary hover:underline dark:text-gray-200"
        >
          MANAGE ALL
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {classrooms.map((room, i) => (
          <ClassroomCard key={`${room.title}-${i}`} {...room} />
        ))}
      </div>
    </div>
  );
}