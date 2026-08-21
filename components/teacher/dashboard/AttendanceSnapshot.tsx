import { Download, ClipboardList } from "lucide-react";
import { AttendanceRow } from "@/lib/types/dashboard";

export default function AttendanceSnapshot({ rows }: { rows: AttendanceRow[] }) {
  function exportCsv() {
    const header = ["Student", "ID", "Classroom", "Date", "Status", "Note"];
    const lines = rows.map((row) =>
      [row.name, row.id, row.classroom, row.date, row.status, row.note]
        .map((cell) => `"${(cell ?? "").replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header.join(","), ...lines].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `attendance-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mt-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-card-foreground">
          Today&apos;s attendance snapshot
        </h2>
        <div className="flex items-center gap-4">
          <a
            href="/dashboard/teacher/attendance"
            className="text-xs font-semibold tracking-wide text-primary hover:underline"
          >
            VIEW ALL
          </a>
          <button
            type="button"
            onClick={exportCsv}
            disabled={rows.length === 0}
            className="flex items-center gap-1.5 rounded-lg bg-muted px-3 py-1.5 text-sm font-medium text-card-foreground hover:bg-muted/70 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border py-12 text-center">
          <ClipboardList className="h-8 w-8 text-muted-foreground/50" />
          <p className="text-sm font-medium text-card-foreground">No attendance recorded today</p>
          <p className="text-xs text-muted-foreground">
            Take attendance in one of your classrooms to see it here.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left">
            <thead>
              <tr className="bg-muted text-xs font-semibold tracking-wide text-muted-foreground">
                <th className="rounded-l-lg px-4 py-3">STUDENT</th>
                <th className="px-4 py-3">CLASSROOM</th>
                <th className="px-4 py-3">DATE</th>
                <th className="px-4 py-3">STATUS</th>
                <th className="rounded-r-lg px-4 py-3">NOTE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="flex items-center gap-3 px-4 py-4">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {row.name?.charAt(0)?.toUpperCase() ?? "?"}
                    </div>
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
                  <td className="px-4 py-4 text-sm text-muted-foreground">
                    {row.note || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
