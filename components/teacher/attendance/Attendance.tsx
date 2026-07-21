"use client";

import { useState, useRef, ChangeEvent, MouseEvent } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  Users,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  Upload,
  X,
} from "lucide-react";

const PAGE_SIZE = 4;

const avatarPalette = [
  "bg-amber-200 text-amber-800",
  "bg-rose-200 text-rose-800",
  "bg-sky-200 text-sky-800",
  "bg-violet-200 text-violet-800",
  "bg-emerald-200 text-emerald-800",
  "bg-cyan-200 text-cyan-800",
];

type Status = "Present" | "Absent" | "Late";

interface RosterStudent {
  id: number;
  name: string;
  studentId: string;
}

interface AttendanceStatus {
  status: Status;
  score: number;
  remark: string;
}

interface AttendanceRecord extends RosterStudent {
  classroom: string;
  initials: string;
  avatarColor: string;
  status: Status;
  score: number;
  remark: string;
}

type Rosters = Record<string, RosterStudent[]>;
type Overrides = Record<string, AttendanceStatus>;

interface FormState {
  name: string;
  studentId: string;
  status: Status;
  score: number | string;
  remark: string;
}

function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const firstNames = [
  "Alexander", "Beatrix", "Carlos", "Dina", "Farrah", "Grant", "Harriet", "Isaac",
  "Julia", "Kevin", "Laura", "Miguel", "Nina", "Oscar", "Priya", "Quinn",
  "Rosa", "Samuel", "Tara", "Umar", "Vera", "Wyatt", "Ximena", "Yusuf",
  "Zoe", "Adrian", "Bianca", "Caleb", "Delia", "Ethan", "Fiona", "Gabriel",
];
const lastNames = [
  "Thompson", "Vance", "Mendez", "Roberts", "Nolan", "Osei", "Solis", "Park",
  "Chen", "Diaz", "Ibrahim", "Santos", "Kowalski", "Reyes", "Patel", "Nguyen",
  "Okafor", "Silva", "Murphy", "Haddad", "Kim", "Brooks", "Ortiz", "Baptiste",
  "Ferreira", "Lindqvist", "Costa", "Meyer", "Adeyemi", "Fischer", "Alvarado", "Ross",
];

function buildRoster(count: number, offset: number): RosterStudent[] {
  const roster: RosterStudent[] = [];
  for (let i = 0; i < count; i++) {
    const id = offset + i;
    const first = firstNames[(i + offset) % firstNames.length];
    const last = lastNames[(i * 3 + offset) % lastNames.length];
    roster.push({ id, name: `${first} ${last}`, studentId: `STU2026${String(1000 + id)}` });
  }
  return roster;
}

const initialRosters: Rosters = {
  "AP Physics - Section B": buildRoster(32, 0),
  "AP Chemistry - Section A": buildRoster(24, 100),
  "AP Biology - Section C": buildRoster(18, 200),
};

function hashCode(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function statusFromHash(h: number): AttendanceStatus {
  const r = h % 100;
  if (r < 78) return { status: "Present", score: 100, remark: "On time and active." };
  if (r < 90) return { status: "Absent", score: 0, remark: "Parent notified." };
  return { status: "Late", score: 80, remark: "Bus delay." };
}

// Attendance is derived per classroom + date, so paging through dates actually
// filters to a different (but consistent, re-visitable) set of records.
function buildAttendance(
  roster: RosterStudent[],
  classroom: string,
  dateISO: string,
  overrides: Overrides
): AttendanceRecord[] {
  return roster.map((student) => {
    const key = `${classroom}|${dateISO}|${student.id}`;
    const base = overrides[key] || statusFromHash(hashCode(key));
    return {
      ...student,
      classroom,
      initials: initialsOf(student.name),
      avatarColor: avatarPalette[student.id % avatarPalette.length],
      status: base.status,
      score: base.score,
      remark: base.remark,
    };
  });
}

const statusStyles: Record<Status, string> = {
  Present: "bg-emerald-50 text-emerald-600",
  Absent: "bg-rose-50 text-rose-600",
  Late: "bg-slate-100 text-slate-600",
};

interface StatCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
}

function StatCard({ icon, iconBg, label, value, active, onClick }: StatCardProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border bg-white p-4 text-left shadow-sm transition ${
        active ? "border-blue-900 ring-2 ring-blue-900/20" : "border-slate-200 hover:border-slate-300"
      }`}
    >
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-medium tracking-wide text-slate-400">{label}</p>
        <p className="text-xl font-semibold text-slate-800">{value}</p>
      </div>
    </button>
  );
}

function formatDate(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function toISODate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function fromISODate(s: string): Date {
  const [year, month, day] = s.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isSameDay(a: Date, b: Date): boolean {
  return a.toDateString() === b.toDateString();
}

export default function DailyAttendancePage() {
  const [rosters, setRosters] = useState<Rosters>(initialRosters);
  const [overrides, setOverrides] = useState<Overrides>({});
  const [nextId, setNextId] = useState(1000);
  const [selectedClassroom, setSelectedClassroom] = useState("AP Physics - Section B");
  const [classroomOpen, setClassroomOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 9, 24));
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", studentId: "", status: "Present", score: 100, remark: "" });
  const dateInputRef = useRef<HTMLInputElement>(null);

  function handleDateInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (!e.target.value) return;
    setSelectedDate(fromISODate(e.target.value));
    setPage(1);
  }

  const today = new Date(2026, 9, 24);
  const classroomNames = Object.keys(rosters);
  const dateISO = toISODate(selectedDate);
  const students = buildAttendance(rosters[selectedClassroom], selectedClassroom, dateISO, overrides);

  const counts = {
    total: students.length,
    Present: students.filter((s) => s.status === "Present").length,
    Absent: students.filter((s) => s.status === "Absent").length,
    Late: students.filter((s) => s.status === "Late").length,
  };

  const filtered = statusFilter === "all" ? students : students.filter((s) => s.status === statusFilter);
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIdx = (safePage - 1) * PAGE_SIZE;
  const pageItems = filtered.slice(startIdx, startIdx + PAGE_SIZE);
  const rangeStart = filtered.length === 0 ? 0 : startIdx + 1;
  const rangeEnd = Math.min(startIdx + PAGE_SIZE, filtered.length);

  function showToast(message: string) {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  }

  function changeDate(delta: number) {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + delta);
    setSelectedDate(next);
    setPage(1);
  }

  function selectClassroom(name: string) {
    setSelectedClassroom(name);
    setClassroomOpen(false);
    setStatusFilter("all");
    setPage(1);
  }

  function selectStatFilter(key: Status | "all") {
    setStatusFilter(key);
    setPage(1);
  }

  function handleSubmitSheet() {
    showToast(`Attendance submitted for ${formatDate(selectedDate)} — ${selectedClassroom}.`);
  }

  function handleDownloadTemplate() {
    const header = "Student Name,Student ID,Classroom,Date,Status,Score,Remark\n";
    const sampleRow = `Jane Doe,STU20260000,${selectedClassroom},${formatDate(selectedDate)},Present,100,\n`;
    const csv = header + sampleRow;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "attendance-template.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("Template downloaded.");
  }

  function handleAddRecord() {
    if (!form.name.trim()) return;
    const id = nextId;
    setNextId((n) => n + 1);
    const newStudent: RosterStudent = {
      id,
      name: form.name.trim(),
      studentId: form.studentId.trim() || `STU2026${String(1000 + id)}`,
    };
    setRosters((prev) => ({
      ...prev,
      [selectedClassroom]: [...prev[selectedClassroom], newStudent],
    }));
    const key = `${selectedClassroom}|${dateISO}|${id}`;
    setOverrides((prev) => ({
      ...prev,
      [key]: {
        status: form.status,
        score: Number(form.score) || 0,
        remark: form.remark.trim() || "—",
      },
    }));
    setShowBulkModal(false);
    setForm({ name: "", studentId: "", status: "Present", score: 100, remark: "" });
    showToast(`Added ${newStudent.name} to ${selectedClassroom} for ${formatDate(selectedDate)}.`);
  }

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={
        {
          "--font-sans": "var(--font-geist-sans)",
          "--font-mono": "var(--font-geist-mono)",
          fontFamily: "var(--font-sans)",
          fontSize: "18px",
        } as React.CSSProperties
      }
    >
      {toast && (
        <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Page header */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Daily Attendance</h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage student presence and participation records.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Date navigator */}
            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600 shadow-sm">
              <button
                aria-label="Previous day"
                onClick={() => changeDate(-1)}
                className="text-slate-400 hover:text-slate-600"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              {isSameDay(selectedDate, today) && (
                <span className="font-medium text-slate-700">Today,</span>
              )}
              <input
                ref={dateInputRef}
                type="date"
                value={toISODate(selectedDate)}
                onChange={handleDateInputChange}
                onClick={(e) => e.currentTarget.showPicker?.()}
                className="w-[110px] cursor-pointer border-none bg-transparent p-0 text-sm font-medium text-slate-700 focus:outline-none focus:ring-0 [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:opacity-0"
              />
              <button
                aria-label="Open date picker"
                onClick={() => dateInputRef.current?.showPicker?.()}
                className="text-slate-400 hover:text-slate-600"
              >
                <Calendar className="h-4 w-4" />
              </button>
              <button
                aria-label="Next day"
                onClick={() => changeDate(1)}
                className="text-slate-400 hover:text-slate-600"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

            {/* Classroom dropdown */}
            <div className="relative">
              <button
                onClick={() => setClassroomOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
              >
                {selectedClassroom}
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${classroomOpen ? "rotate-180" : ""}`} />
              </button>
              {classroomOpen && (
                <div className="absolute right-0 z-10 mt-1 w-56 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                  {classroomNames.map((name) => (
                    <button
                      key={name}
                      onClick={() => selectClassroom(name)}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                        name === selectedClassroom ? "bg-slate-50 font-medium text-blue-900" : "text-slate-700"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={handleSubmitSheet}
              className="flex items-center gap-2 rounded-lg bg-blue-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-800"
            >
              <Upload className="h-4 w-4" />
              Submit Sheet
            </button>
          </div>
        </div>

        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-4 gap-4">
          <StatCard
            icon={<Users className="h-5 w-5 text-violet-600" />}
            iconBg="bg-violet-100"
            label="TOTAL STUDENTS"
            value={counts.total}
            active={statusFilter === "all"}
            onClick={() => selectStatFilter("all")}
          />
          <StatCard
            icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
            iconBg="bg-emerald-100"
            label="PRESENT"
            value={counts.Present}
            active={statusFilter === "Present"}
            onClick={() => selectStatFilter("Present")}
          />
          <StatCard
            icon={<XCircle className="h-5 w-5 text-rose-600" />}
            iconBg="bg-rose-100"
            label="ABSENT"
            value={counts.Absent}
            active={statusFilter === "Absent"}
            onClick={() => selectStatFilter("Absent")}
          />
          <StatCard
            icon={<Clock className="h-5 w-5 text-slate-600" />}
            iconBg="bg-slate-200"
            label="LATE"
            value={counts.Late}
            active={statusFilter === "Late"}
            onClick={() => selectStatFilter("Late")}
          />
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-400">
                <th className="px-6 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Student ID</th>
                <th className="px-4 py-3 font-medium">Classroom</th>
                <th className="px-4 py-3 font-medium">Date</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Remark</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-slate-400">
                    No students match this filter.
                  </td>
                </tr>
              )}
              {pageItems.map((r) => (
                <tr key={r.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60">
                  <td className="flex items-center gap-3 px-6 py-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${r.avatarColor}`}
                    >
                      {r.initials}
                    </div>
                    <span className="font-medium text-slate-800">{r.name}</span>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{r.studentId}</td>
                  <td className="px-4 py-4 text-slate-500">{r.classroom}</td>
                  <td className="px-4 py-4 text-slate-500">{formatDate(selectedDate)}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`inline-block rounded-md px-2.5 py-1 text-xs font-medium ${statusStyles[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-700">{r.score}</td>
                  <td className="px-4 py-4 text-slate-500">{r.remark}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 text-sm">
            <span className="text-slate-400">
              Showing {rangeStart}-{rangeEnd} of {filtered.length} students
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={safePage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-slate-200 px-3 py-1.5 text-slate-600 disabled:cursor-not-allowed disabled:text-slate-300"
              >
                Previous
              </button>
              <span className="text-slate-400">
                Page {safePage} of {totalPages}
              </span>
              <button
                disabled={safePage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-md bg-blue-900 px-3 py-1.5 font-medium text-white hover:bg-blue-800 disabled:cursor-not-allowed disabled:bg-slate-300"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {/* Bulk add */}
        <div className="mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white px-6 py-10 text-center">
          <button
            onClick={() => setShowBulkModal(true)}
            className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-900 text-white hover:bg-blue-800"
          >
            <Plus className="h-5 w-5" />
          </button>
          <h3 className="text-sm font-semibold text-slate-800">Bulk Add Attendance</h3>
          <p className="mt-1 max-w-sm text-sm text-slate-400">
            Import attendance records from a CSV file or scan student ID badges to speed up the
            marking process.
          </p>
          <button
            onClick={handleDownloadTemplate}
            className="mt-3 text-sm font-medium text-blue-700 hover:underline"
          >
            Download Template
          </button>
        </div>
      </main>

      {/* Bulk add modal */}
      {showBulkModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-900">Add Attendance Record</h3>
              <button onClick={() => setShowBulkModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Student Name</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none"
                  placeholder="e.g. Jamie Foster"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Student ID (optional)</label>
                <input
                  value={form.studentId}
                  onChange={(e) => setForm({ ...form, studentId: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none"
                  placeholder="STU20260099"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value as Status })}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none"
                  >
                    <option>Present</option>
                    <option>Absent</option>
                    <option>Late</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-500">Score</label>
                  <input
                    type="number"
                    value={form.score}
                    onChange={(e) => setForm({ ...form, score: e.target.value })}
                    className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Remark</label>
                <input
                  value={form.remark}
                  onChange={(e) => setForm({ ...form, remark: e.target.value })}
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:border-blue-900 focus:outline-none"
                  placeholder="Optional note"
                />
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                onClick={() => setShowBulkModal(false)}
                className="rounded-md border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRecord}
                className="rounded-md bg-blue-900 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800"
              >
                Add Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}