type ClassroomCardProps = {
  title: string;
  code: string;
  track: string;
  initials: string;
  students: number;
  year: string;
  room: string;
  classCode: string;
  toGrade: number;
  headerClass: string;
  initialsTextClass: string;
  badgeClass: string;
};

export default function ClassroomCard({
  title,
  code,
  track,
  initials,
  students,
  year,
  room,
  classCode,
  toGrade,
  headerClass,
  initialsTextClass,
  badgeClass,
}: ClassroomCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Colored header */}
      <div className={`relative px-5 py-5 ${headerClass}`}>
        <h3 className="text-lg font-bold text-white">{title}</h3>
        <p className="mt-0.5 text-sm text-white/80">
          {code} · {track}
        </p>
        <span
          className={`absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-sm font-bold ${initialsTextClass}`}
        >
          {initials}
        </span>
      </div>

      {/* Body */}
      <div className="px-5 py-4">
        <p className="text-sm text-card-foreground">
          {students} students · {year}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {room} · Code {classCode}
        </p>

        <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${badgeClass}`}
          >
            {toGrade} to grade
          </span>
          <a
            href="#"
            className="text-sm font-semibold text-primary hover:underline"
          >
            Open
          </a>
        </div>
      </div>
    </div>
  );
}