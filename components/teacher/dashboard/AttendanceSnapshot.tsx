import { Download } from "lucide-react";
import { AttendanceRow } from "@/lib/types/dashboard";

export default function AttendanceSnapshot({ rows }: { rows: AttendanceRow[] }) {
  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-card-foreground">
          Today&apos;s attendance snapshot
        </h2>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-xs font-semibold tracking-wide text-primary hover:underline"
          >
            VIEW ALL
          </a>
          <button className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium text-card-foreground hover:bg-muted/70">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="bg-muted text-xs font-semibold tracking-wide text-muted-foreground">
              <th className="rounded-l-lg px-4 py-3">STUDENT</th>
              <th className="px-4 py-3">CLASSROOM</th>
              <th className="px-4 py-3">DATE</th>
              <th className="px-4 py-3">STATUS</th>
              <th className="px-4 py-3">SCORE</th>
              <th className="rounded-r-lg px-4 py-3">NOTE</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="flex items-center gap-3 px-4 py-4">
                  <img
                    src={row.avatar}
                    alt={row.name}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-card-foreground">
                      {row.name}
                    </p>
                    <p className="text-xs text-muted-foreground">ID: {row.id}</p>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-card-foreground/80">
                  {row.classroom}
                </td>
                <td className="px-4 py-4 text-sm text-card-foreground/80">
                  {row.date}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${row.statusClass}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-card-foreground">
                  {row.score}
                </td>
                <td className="px-4 py-4 text-sm text-muted-foreground">
                  {row.note}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}