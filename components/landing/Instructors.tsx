import { Send } from "lucide-react";
import StudentArt from "./StudentArt";

const GUIDES = [
  { name: "Mom Reaksmey", role: "Frontend & Project Management Mentor", up: true, framed: true, bg: "from-[#eaf2ff] to-[#dbe7ff]", skin: "light", top: "blue", hair: "dark" },
  { name: "Chan Chhaya", role: "Java Senior Developer", up: false, framed: false, bg: "from-[#e6f6f3] to-[#d3efe9]", skin: "medium", top: "teal", hair: "black" },
  { name: "Eung Lyzia", role: "UX/UI Design Mentor", up: true, framed: false, bg: "from-[#fff1e6] to-[#ffe3d3]", skin: "light", top: "orange", hair: "brown" },
  { name: "Kit Dara", role: "Lead Database & AI Educator", up: false, framed: false, bg: "from-[#eff0ff] to-[#e0e2ff]", skin: "tan", top: "yellow", hair: "black" },
] as const;

export default function Instructors() {
  return (
    <section id="instructors" className="bg-white py-16">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <p className="text-[15px] font-medium text-teal">Meet Our Instructors</p>
          <h2 className="mt-3 text-[32px] font-bold text-ink sm:text-[38px]">Your Learning <span className="ums-underline">Guides</span></h2>
        </div>
        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {GUIDES.map((g) => (
            <div key={g.name} className={g.up ? "lg:-mt-0" : "lg:mt-10"}>
              <div className={`relative flex aspect-square w-full items-end justify-center overflow-hidden rounded-2xl bg-gradient-to-br ${g.bg} ${g.framed ? "ring-1 ring-brandblue" : ""}`}>
                <StudentArt variant="avatar" skin={g.skin} top={g.top} hair={g.hair} className="h-[92%] w-auto" />
                <span className="absolute bottom-0 right-12 flex h-12 w-14 items-center justify-center rounded-t-[10px] bg-white text-brandblue shadow">
                  <Send className="h-5 w-5" />
                </span>
              </div>
              <h3 className="mt-6 text-2xl text-ink">{g.name}</h3>
              <p className="mt-1 text-[15px] text-ink3">{g.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
