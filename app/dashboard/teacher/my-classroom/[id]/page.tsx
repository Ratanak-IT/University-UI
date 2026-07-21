import AnnouncementComposer from "@/components/teacher/my-classroom/AnnouncementComposer";
import ClassCodeCard from "@/components/teacher/my-classroom/ClassCodeCard";
import ClassroomHero from "@/components/teacher/my-classroom/ClassroomHero";
// import ClassTabs from "@/components/teacher/my-classroom/ClassTabs";
import CommentInput from "@/components/teacher/my-classroom/CommentInput";
import UpcomingCard from "@/components/teacher/my-classroom/UpcomingCard";
import AssignmentGroupCard from "@/components/teacher/assignment/AssignmentGroupCard";
import { classroom, tabs, upcoming } from "@/lib/data/classroom-data";
import { assignmentGroups } from "@/lib/data/assignmentGroups";

export default function ClassroomAssignmentsPage() {
  const classroomAssignments = assignmentGroups.filter(
    (g) => g.classroom === classroom.title
  );

  return (
    <div>
      {/* <ClassTabs tabs={tabs} activeTab="Assignments" /> */}

      <div className="px-8 py-8">
        <ClassroomHero
          badge={classroom.badge}
          title={classroom.title}
          semester={classroom.semester}
          students={classroom.students}
          room={classroom.room}
        />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr] ">
          {/* Left column */}
          <div className="space-y-5">
            <ClassCodeCard code={classroom.classCode} />
            <UpcomingCard items={upcoming} />
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <AnnouncementComposer initials="CD" />

            {classroomAssignments.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No assignments posted yet for this class.
              </p>
            ) : (
              classroomAssignments.map((group) => (
                <AssignmentGroupCard key={group.id} group={group} />
              ))
            )}

            <CommentInput avatar="https://i.pravatar.cc/80?img=12" />
          </div>
        </div>
      </div>
    </div>
  );
}