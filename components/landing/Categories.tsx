import Link from "next/link";
import { Coffee, Code2, Sparkles, ShieldCheck, MessagesSquare, Rocket, Database, FlaskConical, Palette, ArrowRight } from "lucide-react";

const CATS = [
  { label: "Java & Spring boot", icon: Coffee, bg: "bg-[#eaf2ff]", ring: "border-[#cadfff]", ic: "text-brandblue" },
  { label: "Next Js", icon: Code2, bg: "bg-[#eff0ff]", ring: "border-[#d8daff]", ic: "text-[#5b5bd6]" },
  { label: "New Technology", icon: Sparkles, bg: "bg-[#ffeecb]", ring: "border-[#ffd799]", ic: "text-accent" },
  { label: "Web Security", icon: ShieldCheck, bg: "bg-[#daf7fe]", ring: "border-[#adeaf7]", ic: "text-cyan" },
  { label: "Project Management", icon: MessagesSquare, bg: "bg-[#ffeae4]", ring: "border-[#ffd8cc]", ic: "text-[#fe3f10]" },
  { label: "Build Real Project", icon: Rocket, bg: "bg-[#eff0ff]", ring: "border-[#d8daff]", ic: "text-[#5b5bd6]" },
  { label: "Database", icon: Database, bg: "bg-[#eaf2ff]", ring: "border-[#cadfff]", ic: "text-brandblue" },
  { label: "Research", icon: FlaskConical, bg: "bg-[#ffeecb]", ring: "border-[#ffd799]", ic: "text-accent" },
  { label: "Design & Creativity", icon: Palette, bg: "bg-[#daf7fe]", ring: "border-[#adeaf7]", ic: "text-cyan" },
];

export default function Categories() {
  return (
    <section id="courses" className="bg-white pb-24">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-[32px] font-bold text-ink sm:text-[38px]">Top Course <span className="ums-underline">Categories</span></h2>
          <p className="mt-5 text-[15px] text-muted">Choose from industry-relevant topics curated by experts.</p>
        </div>
        <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATS.map((c) => (
              <button key={c.label} type="button" className={`flex items-center gap-5 rounded-full border ${c.ring} ${c.bg} px-7 py-4 text-left transition-transform hover:-translate-y-0.5`}>
                <c.icon className={`h-9 w-9 shrink-0 ${c.ic}`} strokeWidth={1.6} />
                <span className="text-[17px] text-ink">{c.label}</span>
              </button>
            ))}
          </div>
          <div className="flex justify-center lg:block">
            <Link href="#courses" className="flex h-44 w-44 flex-col items-center justify-center gap-1 rounded-full text-center text-[15px] text-white shadow-lg" style={{ backgroundImage: "linear-gradient(199deg, #1c43fe 8%, #1334b0 92%)" }}>
              <span>View All<br />Categories</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
