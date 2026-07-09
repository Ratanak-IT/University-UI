
import { statCards } from "@/lib/data/students";
import StatCard from "./StatCard";

export default function StatsGrid() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statCards.map((stat) => (
        <StatCard key={stat.id} data={stat} />
      ))}
    </div>
  );
}