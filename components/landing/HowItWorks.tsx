import Image from "next/image";
import { LogIn, LayoutGrid, TrendingUp } from "lucide-react";

const STEPS = [
  { bg: "bg-teal", icon: LogIn, title: "Login Securely", body: "Students, teachers, and administrators access the platform using their accounts." },
  { bg: "bg-cyan", icon: LayoutGrid, title: "Manage Academic Activities", body: "View courses, attendance, schedules, assignments, and grades in one place." },
  { bg: "bg-[#f59e0b]", icon: TrendingUp, title: "Track Progress & Performance", body: "Monitor GPA, attendance records, and academic achievements in real time." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-background py-20 text-foreground transition-colors duration-200">
      <div className="mx-auto grid max-w-[1320px] items-center gap-14 px-6 lg:grid-cols-2 lg:px-8">
        <div className="relative flex h-[460px] w-full items-end justify-center">
          {/* Hatched circle decorative background */}
          <Image
            src="/images/deco-circle.png"
            alt=""
            aria-hidden
            width={564}
            height={564}
            className="pointer-events-none absolute left-8 top-6 w-44 select-none opacity-90 dark:opacity-40"
          />
          <div aria-hidden className="absolute bottom-6 left-1/2 h-10 w-3/5 -translate-x-1/2 rounded-full bg-slate-400/20 blur-xl dark:bg-black/40" />
          {/* Main Illustration */}
          <Image
            src="/images/how-it-works.png"
            alt="Student sitting with a laptop"
            width={1172}
            height={1514}
            className="relative z-10 h-[440px] w-auto object-contain dark:brightness-95"
          />
        </div>

        <div>
          <h2 className="max-w-lg text-[32px] font-bold leading-tight text-foreground sm:text-[38px]">
            <span className="ums-underline">How</span> Our University Management System Works
          </h2>
          <div className="mt-12 space-y-8">
            {STEPS.map((s, i) => (
              <div 
                key={s.title} 
                className={`flex gap-5 ${
                  i < STEPS.length - 1 ? "border-b border-border pb-8" : ""
                }`}
              >
                <span className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${s.bg} text-white shadow-xs dark:border dark:border-border/50`}>
                  <s.icon className="h-6 w-6" strokeWidth={2} />
                </span>
                <div>
                  <h3 className="text-xl font-bold text-foreground">{s.title}</h3>
                  <p className="mt-2 max-w-md text-[17px] leading-[1.4] text-muted-foreground">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}