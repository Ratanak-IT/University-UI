import type { Metadata } from "next";

export const metadata: Metadata = { title: "Timetable" };

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const PERIODS = ["08:00", "09:30", "11:00", "13:30", "15:00"];

const TONES = {
  indigo: "bg-indigo-700 text-white",
  amber: "bg-amber-500 text-white",
  emerald: "bg-emerald-600 text-white",
  rose: "bg-rose-500 text-white",
  sky: "bg-sky-600 text-white",
  quiet: "bg-white text-slate-900 border border-slate-200",
} as const;

type Block = {
  code: string;
  room: string;
  day: number;
  period: number;
  span?: number;
  tone: keyof typeof TONES;
};

const BLOCKS: Block[] = [
  { code: "CS-WD201", room: "Room 204", day: 1, period: 1, tone: "indigo" },
  { code: "CS-DB301", room: "Lab 2", day: 1, period: 2, tone: "amber" },
  { code: "CS-SEC401", room: "Lab 3", day: 2, period: 4, span: 2, tone: "rose" },
  { code: "CS-UX202", room: "Room 208", day: 2, period: 5, tone: "emerald" },
  { code: "CS-WD201", room: "Room 204", day: 3, period: 1, span: 2, tone: "indigo" },
  { code: "CS-DS210", room: "Room 110", day: 3, period: 3, tone: "sky" },
  { code: "CS-DB301", room: "Lab 2", day: 4, period: 2, tone: "amber" },
  { code: "CS-UX202", room: "Room 208", day: 4, period: 5, tone: "emerald" },
  { code: "ENG-120", room: "A-101", day: 5, period: 2, tone: "quiet" },
  { code: "CS-SEC401", room: "Lab 3", day: 5, period: 4, tone: "rose" },
];

export default function TimetablePage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-indigo-950">Timetable</h2>
        <p className="mt-1 text-sm text-slate-500">Week 6 · Semester 2</p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6">
        <div className="min-w-[640px]">
          {/* Day headers */}
          <div className="grid grid-cols-[64px_repeat(5,1fr)] gap-2">
            <div />
            {DAYS.map((d) => (
              <p
                key={d}
                className="pb-3 text-center text-[11px] font-bold uppercase tracking-wider text-slate-400"
              >
                {d}
              </p>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-[64px_repeat(5,1fr)] grid-rows-5 gap-2">
            {PERIODS.map((p, rowIdx) => (
              <p
                key={p}
                className="flex items-start pt-2 text-xs font-semibold text-slate-400"
                style={{ gridColumn: 1, gridRow: rowIdx + 1 }}
              >
                {p}
              </p>
            ))}

            {/* Empty cells */}
            {PERIODS.map((_, r) =>
              DAYS.map((_, c) => (
                <div
                  key={`cell-${r}-${c}`}
                  className="min-h-[54px] rounded-lg bg-slate-50"
                  style={{ gridColumn: c + 2, gridRow: r + 1 }}
                />
              ))
            )}

            {/* Class blocks */}
            {BLOCKS.map((b, i) => (
              <div
                key={`${b.code}-${i}`}
                className={`flex flex-col justify-center rounded-lg px-3 py-2 ${TONES[b.tone]}`}
                style={{
                  gridColumn: b.day + 1,
                  gridRow: `${b.period} / span ${b.span ?? 1}`,
                }}
              >
                <p className="text-xs font-bold leading-tight">{b.code}</p>
                <p
                  className={`text-[10px] ${
                    b.tone === "quiet" ? "text-slate-400" : "text-white/70"
                  }`}
                >
                  {b.room}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
