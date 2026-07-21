
import RosterTable from "./RosterTable";
import StatsGrid from "./StatsGrid";
import StudentsHeader from "./StudentsHeader";


export default function StudentsPage() {
  return (
    <div className="flex flex-col gap-6">
      <StudentsHeader />
      <StatsGrid />
      <RosterTable />
    </div>
  );
}