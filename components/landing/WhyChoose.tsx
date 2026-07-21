import { GraduationCap, Users, LineChart, Trophy } from "lucide-react";

const FEATURES = [
  { border: "border-teal", icon: GraduationCap, iconColor: "text-teal", title: "Industry-Focused Curriculum", body: "Learn modern technologies aligned with real-world IT careers." },
  { border: "border-cyan", icon: Users, iconColor: "text-cyan", title: "Expert Instructors", body: "Learn from experienced professionals and mentors." },
  { border: "border-[#f59e0b]", icon: LineChart, iconColor: "text-[#f59e0b]", title: "Academic Progress Tracking", body: "Monitor attendance, GPA, courses, and achievements in one place." },
  { border: "border-[#fe3f10]", icon: Trophy, iconColor: "text-[#fe3f10]", title: "Career Opportunities", body: "Build practical skills that prepare you for top technology companies." },
];

export default function WhyChoose() {
  return (
    <section id="about" className="bg-white py-20">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <h2 className="text-center text-[32px] font-bold text-ink sm:text-[38px]">
          Why Thousands Choose <span className="ums-underline">UML</span>
        </h2>
        <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className={`border-l ${f.border} pl-6`}>
              <f.icon className={`h-14 w-14 ${f.iconColor}`} strokeWidth={1.4} />
              <h3 className="mt-10 text-lg text-ink">{f.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-gray-500">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
