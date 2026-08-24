"use client";

import { useEffect, useState } from "react";

type Course = { name: string; credits: number };

type YearData = {
  year: string;
  sem1: { label: string; courses: Course[] };
  sem2: { label: string; courses: Course[] };
};

const DEFAULT_YEARS: YearData[] = [
  {
    year: "YEAR 1",
    sem1: {
      label: "SEMESTER 1",
      courses: [
        { name: "1. Introduction to Information and Technology", credits: 3 },
        { name: "2. Programming Fundamental", credits: 3 },
        { name: "3. Intensive English Program I", credits: 3 },
        { name: "4. Academic Skill Development", credits: 3 },
        { name: "5. Multimedia and Web Design", credits: 3 },
        { name: "6. Networking Fundamental", credits: 3 },
      ],
    },
    sem2: {
      label: "SEMESTER 2",
      courses: [
        { name: "7. Web Development I (Web Design)", credits: 4 },
        { name: "8. Data Structure and Algorithm", credits: 3 },
        { name: "9. Database Management Systems", credits: 3 },
        { name: "10. Intensive English Program II", credits: 3 },
        { name: "11. Mathematics (Discrete Math)", credits: 3 },
        { name: "12. System Administration", credits: 3 },
      ],
    },
  },
  {
    year: "YEAR 2",
    sem1: {
      label: "SEMESTER 1",
      courses: [
        { name: "13. Application Security", credits: 3 },
        { name: "14. Advanced Web Development", credits: 3 },
        { name: "15. Cloud Computing", credits: 3 },
      ],
    },
    sem2: {
      label: "SEMESTER 2",
      courses: [
        { name: "16. Project Management", credits: 3 },
        { name: "17. Internship Program", credits: 6 },
        { name: "18. Final Thesis", credits: 6 },
      ],
    },
  },
  {
    year: "YEAR 3",
    sem1: {
      label: "SEMESTER 1",
      courses: [
        { name: "19. Data Warehousing", credits: 3 },
        { name: "20. Machine Learning Basics", credits: 3 },
        { name: "21. Advanced SQL", credits: 3 },
        { name: "22. UI/UX Design II", credits: 3 },
        { name: "23. Cloud Architecture", credits: 3 },
      ],
    },
    sem2: {
      label: "SEMESTER 2",
      courses: [
        { name: "24. Big Data Analytics", credits: 4 },
        { name: "25. API Development", credits: 3 },
        { name: "26. Mobile App Development", credits: 3 },
        { name: "27. Agile Methodologies", credits: 3 },
        { name: "28. Ethics in Tech", credits: 3 },
      ],
    },
  },
  {
    year: "YEAR 4",
    sem1: {
      label: "SEMESTER 1",
      courses: [
        { name: "29. Artificial Intelligence", credits: 3 },
        { name: "30. DevOps & CI/CD", credits: 3 },
        { name: "31. Cyber Security Advanced", credits: 3 },
        { name: "32. IT Project Management II", credits: 3 },
        { name: "33. Internship Program II", credits: 6 },
      ],
    },
    sem2: {
      label: "SEMESTER 2",
      courses: [
        { name: "34. Capstone Project", credits: 6 },
        { name: "35. Entrepreneurship in IT", credits: 3 },
        { name: "36. Software Quality Assurance", credits: 3 },
        { name: "37. Final Thesis Defense", credits: 6 },
      ],
    },
  },
];

function SemesterColumn({ label, courses }: { label: string; courses: Course[] }) {
  return (
    <div className="flex-1">
      <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 mb-5">
        {label}
      </h4>
      {courses.length === 0 ? (
        <p className="text-xs italic text-muted-foreground py-2">No courses assigned yet.</p>
      ) : (
        <div className="space-y-3">
          {courses.map((c, idx) => (
            <div
              key={`${c.name}-${idx}`}
              className="flex items-center justify-between border-b border-border pb-2.5 text-xs md:text-sm leading-relaxed"
            >
              <span className="font-normal text-foreground">{c.name}</span>
              <span className="font-extrabold text-primary dark:text-white pl-4 shrink-0">{c.credits}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Curriculum() {
  const [yearsData, setYearsData] = useState<YearData[]>(DEFAULT_YEARS);
  const [programsList, setProgramsList] = useState<{ id: string; name: string }[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<string>("");
  const [loading, setLoading] = useState(true);

  // Helper fetcher with multi-endpoint fallback
  async function apiFetch(endpoint: string): Promise<Response | null> {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("token") ||
          localStorage.getItem("access_token") ||
          sessionStorage.getItem("token") ||
          sessionStorage.getItem("access_token") ||
          localStorage.getItem("ums.access_token") ||
          sessionStorage.getItem("ums.access_token")
        : null;

    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const isLocal = typeof window !== "undefined" && window.location.hostname === "localhost";
    const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const candidates: string[] = [];
    if (envUrl) candidates.push(envUrl);
    if (isLocal) {
      candidates.push("http://localhost:8081/api/v1");
      candidates.push("http://localhost:8080/api/v1");
      candidates.push("http://localhost:3000/backend");
    }


    for (const rawBase of candidates) {
      try {
        const cleanBase = rawBase.replace(/\/$/, "");
        const url = cleanBase.includes("/api/v1") || cleanBase.includes("/backend")
          ? `${cleanBase}${endpoint}`
          : `${cleanBase}/api/v1${endpoint}`;

        const res = await fetch(url, { headers });
        if (res.ok) return res;
      } catch {
        // try next candidate
      }
    }
    return null;
  }

  // Fetch live curriculum entries added by Admin directly from API backend
  useEffect(() => {
    async function fetchAdminCurriculum() {
      try {
        // 1. Fetch curriculums directly (public 200 OK endpoint)
        const currRes = await apiFetch("/curriculums?size=500");
        let allCurriculums: any[] = [];
        
        if (currRes && currRes.ok) {
          const currData = await currRes.json();
          allCurriculums = Array.isArray(currData)
            ? currData
            : currData?.content ?? currData?.data ?? [];
        }

        if (!allCurriculums.length) {
          setLoading(false);
          return;
        }

        // 2. Extract unique programs from curriculum entries
        const progMap = new Map<string, string>();
        for (const item of allCurriculums) {
          const pId = item.programId || item.program_id;
          const pName = item.programName || item.program_name || "Academic Program";
          if (pId && !progMap.has(pId)) {
            progMap.set(pId, pName);
          }
        }

        const progList = Array.from(progMap.entries()).map(([id, name]) => ({ id, name }));
        setProgramsList(progList);

        // 3. Determine active program ID
        const activeId = selectedProgramId || (progList.length > 0 ? progList[0].id : "");
        if (!selectedProgramId && activeId) {
          setSelectedProgramId(activeId);
        }

        // 4. Filter curriculums for active program
        const filteredCurriculums = allCurriculums.filter(
          (item) => (item.programId || item.program_id) === activeId
        );

        if (!filteredCurriculums.length) {
          setLoading(false);
          return;
        }

        // 5. Map into 4-Year structure
        let globalCount = 1;
        const mappedYears: YearData[] = [1, 2, 3, 4].map((yNum) => {
          const sem1Items = filteredCurriculums.filter(
            (c) => Number(c.yearLevel ?? c.year_level) === yNum && Number(c.semester) === 1
          );
          const sem2Items = filteredCurriculums.filter(
            (c) => Number(c.yearLevel ?? c.year_level) === yNum && Number(c.semester) === 2
          );

          const sem1Courses: Course[] = sem1Items.map((sub: any) => ({
            name: `${globalCount++}. ${sub.subjectName || sub.name || sub.subjectCode || "Subject"}`,
            credits: Number(sub.credit ?? sub.credits) || 3,
          }));

          const sem2Courses: Course[] = sem2Items.map((sub: any) => ({
            name: `${globalCount++}. ${sub.subjectName || sub.name || sub.subjectCode || "Subject"}`,
            credits: Number(sub.credit ?? sub.credits) || 3,
          }));

          return {
            year: `YEAR ${yNum}`,
            sem1: {
              label: "SEMESTER 1",
              courses: sem1Courses.length ? sem1Courses : DEFAULT_YEARS[yNum - 1].sem1.courses,
            },
            sem2: {
              label: "SEMESTER 2",
              courses: sem2Courses.length ? sem2Courses : DEFAULT_YEARS[yNum - 1].sem2.courses,
            },
          };
        });

        setYearsData(mappedYears);
      } catch (err) {
        console.warn("Error fetching curriculums:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchAdminCurriculum();
  }, [selectedProgramId]);

  return (
    <section id="curriculum" className="bg-background py-20 text-foreground">
      <div className="mx-auto max-w-[1240px] px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="font-sans text-xs md:text-sm font-extrabold uppercase tracking-widest text-red-600 dark:text-gray-200 mb-1">
            PROGRAM STRUCTURE
          </p>
          <h2 className="font-sans text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-wide text-primary mb-3 dark:text-gray-200">
            CURRICULUM
          </h2>
          <p className="mx-auto max-w-2xl text-center text-sm md:text-lg font-normal text-muted-foreground leading-relaxed dark:text-gray-200">
            A comprehensive roadmap designed to take you from foundational concepts to advanced industry expertise.
          </p>

          {/* Program Selector if multiple programs exist */}
          {programsList.length > 1 && (
            <div className="mt-6 flex justify-center gap-2 flex-wrap">
              {programsList.map((p) => {
                const isSelected = p.id === selectedProgramId;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProgramId(p.id)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-primary text-primary-foreground shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {p.name}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className="space-y-10">
          {yearsData.map((y) => (
            <div key={y.year} className="overflow-hidden rounded-2xl shadow-xs">
              <div className="bg-primary px-8 py-3.5 rounded-t-xl">
                <h3 className="text-lg font-bold tracking-wider text-primary-foreground uppercase">{y.year}</h3>
              </div>
              <div className="border border-border border-t-0 bg-muted/60 px-8 py-8 rounded-b-2xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-3">
                  <SemesterColumn label={y.sem1.label} courses={y.sem1.courses} />
                  <SemesterColumn label={y.sem2.label} courses={y.sem2.courses} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}