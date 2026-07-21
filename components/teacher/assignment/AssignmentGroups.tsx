// import { assignmentGroups } from "@/lib/data/assignmentGroups";
// import AssignmentGroupCard from "./AssignmentGroupCard";


// export default function AssignmentGroups() {
//   return (
//     <div className="flex flex-col gap-10">
//       {assignmentGroups.map((group) => (
//         <AssignmentGroupCard key={group.id} group={group} />
//       ))}
//     </div>
//   );
// }


"use client";

import { useMemo, useState } from "react";
import AssignmentGroupCard from "./AssignmentGroupCard";
import AssignmentsFilterBar from "./AssignmentsFilterBar";
import { ClassroomFilter } from "@/lib/types/AssignmentGroup";
import { assignmentGroups } from "@/lib/data/assignmentGroups";

export default function AssignmentGroups() {
  const [classroom, setClassroom] = useState<ClassroomFilter>("all");

  const classroomOptions = useMemo(() => {
    const names = new Set(assignmentGroups.map((g) => g.classroom));
    return Array.from(names).sort();
  }, []);

  const filteredGroups = useMemo(() => {
    if (classroom === "all") return assignmentGroups;
    return assignmentGroups.filter((g) => g.classroom === classroom);
  }, [classroom]);

  return (
    <div className="flex flex-col gap-8">
      <AssignmentsFilterBar
        classroom={classroom}
        onClassroomChange={setClassroom}
        classroomOptions={classroomOptions}
        shownCount={filteredGroups.length}
        totalCount={assignmentGroups.length}
      />

      {filteredGroups.map((group) => (
        <AssignmentGroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}