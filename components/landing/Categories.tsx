import Link from "next/link";
import { Coffee, Code2, Sparkles, ShieldCheck, MessagesSquare, Rocket, Database, FlaskConical, Palette, ArrowRight } from "lucide-react";

const CATS = [
  { label: "Java & Spring boot", icon: Coffee, bg: "bg-[#eaf2ff] dark:bg-card", ring: "border-[#cadfff] dark:border-border", ic: "text-primary dark:text-primary" },
  { label: "Next.js", icon: Code2, bg: "bg-[#eff0ff] dark:bg-card", ring: "border-[#d8daff] dark:border-border", ic: "text-[#5b5bd6] dark:text-indigo-400" },
  { label: "New Technology", icon: Sparkles, bg: "bg-[#ffeecb] dark:bg-card", ring: "border-[#ffd799] dark:border-border", ic: "text-secondary dark:text-secondary" },
  { label: "Web Security", icon: ShieldCheck, bg: "bg-[#daf7fe] dark:bg-card", ring: "border-[#adeaf7] dark:border-border", ic: "text-sky-600 dark:text-sky-400" },
  { label: "Project Management", icon: MessagesSquare, bg: "bg-[#ffeae4] dark:bg-card", ring: "border-[#ffd8cc] dark:border-border", ic: "text-orange-600 dark:text-orange-400" },
  { label: "Build Real Project", icon: Rocket, bg: "bg-[#eff0ff] dark:bg-card", ring: "border-[#d8daff] dark:border-border", ic: "text-[#5b5bd6] dark:text-indigo-400" },
  { label: "Database", icon: Database, bg: "bg-[#eaf2ff] dark:bg-card", ring: "border-[#cadfff] dark:border-border", ic: "text-primary dark:text-primary" },
  { label: "Research", icon: FlaskConical, bg: "bg-[#ffeecb] dark:bg-card", ring: "border-[#ffd799] dark:border-border", ic: "text-secondary dark:text-secondary" },
  { label: "Design & Creativity", icon: Palette, bg: "bg-[#daf7fe] dark:bg-card", ring: "border-[#adeaf7] dark:border-border", ic: "text-sky-600 dark:text-sky-400" },
];

export default function Categories() {
  return (
    <section id="courses" className="bg-background pb-24 text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-[32px] font-bold text-foreground sm:text-[38px]">
            Top Course <span className="ums-underline">Categories</span>
          </h2>
          <p className="mt-5 text-[15px] text-muted-foreground">
            Choose from industry-relevant topics curated by experts.
          </p>
        </div>
        <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:items-center">
          <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CATS.map((c) => (
              <button
                key={c.label}
                type="button"
                className={`flex items-center gap-5 rounded-full border ${c.ring} ${c.bg} px-7 py-4 text-left transition-all hover:-translate-y-0.5 hover:shadow-sm dark:hover:bg-muted/50`}
              >
                <c.icon className={`h-8 w-8 shrink-0 ${c.ic}`} strokeWidth={1.6} />
                <span className="text-[17px] font-medium text-foreground">{c.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}