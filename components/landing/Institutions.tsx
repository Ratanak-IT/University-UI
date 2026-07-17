const INSTITUTIONS = [
  { name: "Institute of Science & Technology", meta: "4,200 students" },
  { name: "Royal Business College", meta: "1,800 students" },
  { name: "Mekong Polytechnic", meta: "2,600 students" },
  { name: "Angkor University", meta: "6,100 students" },
];

export default function Institutions() {
  return (
    <section className="border-b border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-8 py-12">
        <p className="mb-8 text-center text-xs font-bold tracking-wide text-slate-400">
          KEEPING THE TERM ON SCHEDULE AT
        </p>
        <ul className="grid grid-cols-2 gap-6 lg:grid-cols-4">
          {INSTITUTIONS.map((i) => (
            <li key={i.name} className="text-center">
              <p className="text-sm font-semibold leading-snug text-slate-700">
                {i.name}
              </p>
              <p className="mt-1 text-xs text-slate-400">{i.meta}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
