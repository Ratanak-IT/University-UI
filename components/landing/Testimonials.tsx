import Image from "next/image";

/**
 * Placeholder quotes — replace before launch. Attributed quotes you can't source
 * are worth less than no quotes at all.
 */
const QUOTES = [
  {
    quote:
      "Registration week used to take four of us and a shared spreadsheet. Last term it took one person and an afternoon.",
    name: "Sophea Chan",
    title: "Registrar, Institute of Science & Technology",
    avatar: "https://i.pravatar.cc/80?img=45",
  },
  {
    quote:
      "I mark attendance walking out of the room. That's the whole review — it just stopped being a task I put off.",
    name: "Chhay Davin",
    title: "Lecturer, Computer Science",
    avatar: "/davin.jpg",
  },
  {
    quote:
      "The clash detection paid for the year in the first week. We published a timetable with zero corrections.",
    name: "Vichea Loem",
    title: "Academic Dean, Mekong Polytechnic",
    avatar: "https://i.pravatar.cc/80?img=15",
  },
];

export default function Testimonials() {
  return (
    <section className="border-b border-slate-100 bg-white">
      <div className="mx-auto max-w-6xl px-8 py-20">
        <p className="text-xs font-bold tracking-wide text-indigo-700">
          FROM THE OFFICE
        </p>

        <ul className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {QUOTES.map((q) => (
            <li
              key={q.name}
              className="flex flex-col rounded-2xl border border-slate-100 bg-white p-6 shadow-sm"
            >
              <blockquote className="flex-1 text-base leading-relaxed text-slate-700">
                &ldquo;{q.quote}&rdquo;
              </blockquote>
              <footer className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-5">
                <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-slate-200">
                  <Image src={q.avatar} alt="" fill className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {q.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">{q.title}</p>
                </div>
              </footer>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
