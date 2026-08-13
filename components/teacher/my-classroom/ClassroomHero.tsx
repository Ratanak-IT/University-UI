type ClassroomHeroProps = {
  badge: string;
  title: string;
  semester: string;
  students: number;
  room: string;
};

export default function ClassroomHero({
  badge,
  title,
  semester,
  students,
  room,
}: ClassroomHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 px-8 py-9">
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -right-20 bottom-[-60px] h-40 w-40 rounded-full bg-white/10" />

      <div className="relative">
        <span className="inline-block rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">
          {badge}
        </span>
        <h1 className="mt-4 text-4xl font-bold text-white">{title}</h1>
        <p className="mt-2 text-sm text-white/80">
          {semester} · {students} students · {room}
        </p>
      </div>
    </div>
  );
}