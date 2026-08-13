import { GraduationCap, Users, LineChart, Trophy } from "lucide-react";

const FEATURES = [
  {
    border: "border-primary",
    icon: GraduationCap,
    iconColor: "text-primary",
    title: "Industry-Focused Curriculum",
    body: "Learn modern technologies aligned with real-world IT careers.",
  },
  {
    border: "border-secondary",
    icon: Users,
    iconColor: "text-secondary",
    title: "Expert Instructors",
    body: "Learn from experienced professionals and mentors.",
  },
  {
    border: "border-primary",
    icon: LineChart,
    iconColor: "text-primary",
    title: "Academic Progress Tracking",
    body: "Monitor attendance, GPA, courses, and achievements in one place.",
  },
  {
    border: "border-secondary",
    icon: Trophy,
    iconColor: "text-secondary",
    title: "Career Opportunities",
    body: "Build practical skills that prepare you for top technology companies.",
  },
];

export default function WhyChoose() {
  return (
    <section id="about" className="bg-background py-20 text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <h2 className="text-center text-[32px] font-bold text-foreground sm:text-[38px]">
          Why Thousands Choose <span className="ums-underline">UML</span>
        </h2>
        <div className="mt-14 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className={`border-l-4 ${f.border} pl-6`}>
              <f.icon className={`h-12 w-12 ${f.iconColor}`} strokeWidth={1.5} />
              <h3 className="mt-8 text-lg font-bold text-foreground">{f.title}</h3>
              <p className="mt-3 text-[15px] leading-[1.7] text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}