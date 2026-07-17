import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Profile" };

const details = [
  { label: "Student ID", value: "STU-2024-0142" },
  { label: "Full name", value: "Sok Dara" },
  { label: "Email", value: "dara.sok@student.ums.edu.kh" },
  { label: "Phone", value: "+855 12 345 678" },
  { label: "Date of birth", value: "14 March 2004" },
  { label: "Program", value: "B.Sc. Computer Science" },
  { label: "Academic year", value: "Year 4 · Semester 2" },
  { label: "Advisor", value: "Chhay Davin" },
];

export default function ProfilePage() {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-indigo-950">My Profile</h2>
        <p className="mt-1 text-sm text-slate-500">Your enrollment details.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Identity card */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-indigo-700 text-2xl font-black text-white">
            SD
          </div>
          <p className="mt-4 text-lg font-bold text-indigo-950">Sok Dara</p>
          <p className="mt-0.5 text-xs text-slate-400">STU-2024-0142</p>
          <span className="mt-3 inline-block rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-bold text-emerald-700">
            Active
          </span>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-100 pt-5 text-left">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">CGPA</p>
              <p className="mt-1 text-lg font-black text-indigo-950">3.71</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Credits</p>
              <p className="mt-1 text-lg font-black text-indigo-950">98</p>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-2">
          <h3 className="text-base font-bold text-indigo-950">Details</h3>
          <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  {d.label}
                </dt>
                <dd className="mt-1 text-sm font-medium text-indigo-950">{d.value}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-7 flex gap-3 border-t border-slate-100 pt-5">
            <button className="rounded-lg bg-indigo-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-indigo-800">
              Edit profile
            </button>
            <button className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50">
              Change password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
