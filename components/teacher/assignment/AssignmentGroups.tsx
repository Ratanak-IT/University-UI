import { assignmentGroups } from "@/lib/data/assignmentGroups";
import AssignmentGroupCard from "./AssignmentGroupCard";


export default function AssignmentGroups() {
  return (
    <div className="flex flex-col gap-10">
      {assignmentGroups.map((group) => (
        <AssignmentGroupCard key={group.id} group={group} />
      ))}
    </div>
  );
}