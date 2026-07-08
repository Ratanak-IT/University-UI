import AnnouncementComposer from "@/components/teacher/my-classroom/AnnouncementComposer";
import ClassCodeCard from "@/components/teacher/my-classroom/ClassCodeCard";
import ClassroomHero from "@/components/teacher/my-classroom/ClassroomHero";
import ClassTabs from "@/components/teacher/my-classroom/ClassTabs";
import CommentInput from "@/components/teacher/my-classroom/CommentInput";
import FeedPost from "@/components/teacher/my-classroom/FeedPost";
import UpcomingCard from "@/components/teacher/my-classroom/UpcomingCard";
import { classroom, feed, tabs, upcoming } from "@/lib/data/classroom-data";


export default function ClassroomStreamPage() {
  return (
    <div>
      <ClassTabs tabs={tabs} activeTab="Stream" />

      <div className="px-8 py-8">
        <ClassroomHero
          badge={classroom.badge}
          title={classroom.title}
          semester={classroom.semester}
          students={classroom.students}
          room={classroom.room}
        />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left column */}
          <div className="space-y-5">
            <ClassCodeCard code={classroom.classCode} />
            <UpcomingCard items={upcoming} />
          </div>

          {/* Right column */}
          <div className="space-y-5">
            <AnnouncementComposer initials="CD" />

            {feed.map((item) => (
              <FeedPost key={item.id} item={item} />
            ))}

            <CommentInput avatar="https://i.pravatar.cc/80?img=12" />
          </div>
        </div>
      </div>
    </div>
  );
}