/**
 * The hero's signature element: a weekly timetable that assembles itself on load.
 * Colors reuse the classroom palette from ClassroomCard (indigo / amber / emerald
 * / rose) so a class looks the same here as it does inside the product.
 */

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const PERIODS = ["08:00", "09:30", "11:00", "13:30", "15:00"];

type Block = {
  code: string;
  room: string;
  day: number;
  period: number;
  span?: number;
  tone: keyof typeof TONES;
};

const TONES = {
  indigo: "bg-indigo-700 text-white",
  navy: "bg-[#004071] text-white",
  amber: "bg-amber-500 text-white",
  emerald: "bg-emerald-600 text-white",
  rose: "bg-rose-500 text-white",
  quiet: "bg-white text-slate-900 border border-slate-200",
} as const;

const BLOCKS: Block[] = [
  { code: "CS-WD201", room: "Room 204", day: 1, period: 1, tone: "indigo" },
  { code: "CS-DB301", room: "Room 110", day: 1, period: 3, tone: "amber" },
  { code: "CS-SEC401", room: "Lab 3", day: 2, period: 2, span: 2, tone: "rose" },
  { code: "CS-UX202", room: "Room 208", day: 2, period: 5, tone: "quiet" },
  { code: "CS-WD201", room: "Room 204", day: 3, period: 1, span: 2, tone: "indigo" },
  { code: "MATH-210", room: "C-302", day: 3, period: 4, tone: "quiet" },
  { code: "CS-UX202", room: "Room 208", day: 4, period: 1, tone: "emerald" },
  { code: "CS-DB301", room: "Lab 2", day: 4, period: 3, tone: "navy" },
  { code: "ENG-120", room: "A-101", day: 5, period: 2, tone: "quiet" },
  { code: "CS-SEC401", room: "Lab 3", day: 5, period: 4, span: 2, tone: "rose" },
];

export default function Timetable() {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-baseline justify-between">
        <div>
          <p className="text-sm font-bold text-slate-900">Week 6 timetable</p>
          <p className="text-xs text-slate-400">Computer Science · Year 4</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
          No clashes
        </span>
      </div>

      <div
        className="grid gap-1.5"
        style={{
          gridTemplateColumns: "auto repeat(5, minmax(0, 1fr))",
          gridTemplateRows: "auto repeat(5, minmax(0, 1fr))",
        }}
      >
        <div />

        {DAYS.map((d) => (
          <div
            key={d}
            className="pb-1 text-center text-[11px] font-bold tracking-wide text-slate-400"
          >
            {d.toUpperCase()}
          </div>
        ))}

        {PERIODS.map((p, i) => (
          <div
            key={p}
            className="pr-2 pt-1 text-right text-[11px] font-medium text-slate-400"
            style={{ gridColumn: 1, gridRow: i + 2 }}
          >
            {p}
          </div>
        ))}

        {DAYS.map((_, d) =>
          PERIODS.map((__, p) => (
            <div
              key={`${d}-${p}`}
              aria-hidden
              className="rounded-lg bg-slate-50"
              style={{ gridColumn: d + 2, gridRow: p + 2, minHeight: 48 }}
            />
          )),
        )}

        {BLOCKS.map((b, i) => (
          <div
            key={`${b.code}-${b.day}-${b.period}`}
            className={`ums-slot flex flex-col justify-center rounded-lg px-2 py-1.5 ${TONES[b.tone]}`}
            style={{
              gridColumn: b.day + 1,
              gridRow: `${b.period + 1} / span ${b.span ?? 1}`,
              animationDelay: `${120 + i * 70}ms`,
            }}
          >
            <span className="text-[11px] font-bold leading-tight">{b.code}</span>
            <span
              className={`text-[10px] leading-tight ${
                b.tone === "quiet" ? "text-slate-400" : "text-white/70"
              }`}
            >
              {b.room}
            </span>
          </div>
        ))}
      </div>

      <p className="mt-5 border-t border-slate-100 pt-4 text-xs text-slate-400">
        Move a class and every affected student, teacher, and room updates with it.
      </p>
    </div>
  );
}
