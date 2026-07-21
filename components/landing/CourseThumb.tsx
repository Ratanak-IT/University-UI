import StudentArt from "./StudentArt";

const SCENES = [
  { bg: "from-[#eaf2ff] to-[#dbe7ff]", skin: "light", top: "blue", hair: "dark" },
  { bg: "from-[#ffeae4] to-[#ffd9cc]", skin: "medium", top: "orange", hair: "brown" },
  { bg: "from-[#daf7fe] to-[#c2eefb]", skin: "tan", top: "teal", hair: "black" },
  { bg: "from-[#eff0ff] to-[#e0e2ff]", skin: "light", top: "yellow", hair: "dark" },
] as const;

export default function CourseThumb({ index = 0, className = "" }: { index?: number; className?: string }) {
  const s = SCENES[index % SCENES.length];
  return (
    <div className={`relative flex items-end justify-center overflow-hidden rounded-xl bg-gradient-to-br ${s.bg} ${className}`} aria-hidden>
      {/* desk line */}
      <div className="absolute bottom-6 left-0 right-0 h-3 bg-white/50" />
      <StudentArt variant="laptop" skin={s.skin} top={s.top} hair={s.hair} className="h-[86%] w-auto translate-y-1" />
    </div>
  );
}
