type Course = { name: string; credits: number };
const YEARS: { year: string; sem1: { label: string; courses: Course[] }; sem2: { label: string; courses: Course[] } }[] = [
  { year: "YEAR 1",
    sem1: { label: "SEMESTER 1", courses: [ {name:"1. Introduction to Information and Technology",credits:3},{name:"2. Programming Fundamental",credits:3},{name:"3. Intensive English Program I",credits:3},{name:"4. Academic Skill Development",credits:3},{name:"5. Multimedia and Web Design",credits:3},{name:"6. Networking Fundamental",credits:3} ] },
    sem2: { label: "SEMESTER 2", courses: [ {name:"7. Web Development I (Web Design)",credits:4},{name:"8. Data Structure and Algorithm",credits:3},{name:"9. Database Management Systems",credits:3},{name:"10. Intensive English Program II",credits:3},{name:"11. Mathematics (Discrete Math)",credits:3},{name:"12. System Administration",credits:3} ] } },
  { year: "YEAR 2",
    sem1: { label: "SEMESTER 1", courses: [ {name:"13. Application Security",credits:3},{name:"14. Advanced Web Development",credits:3},{name:"15. Cloud Computing",credits:3} ] },
    sem2: { label: "SEMESTER 2", courses: [ {name:"16. Project Management",credits:3},{name:"17. Internship Program",credits:6},{name:"18. Final Thesis",credits:6} ] } },
  { year: "YEAR 3",
    sem1: { label: "SEMESTER 1", courses: [ {name:"19. Data Warehousing",credits:3},{name:"20. Machine Learning Basics",credits:3},{name:"21. Advanced SQL",credits:3},{name:"22. UI/UX Design II",credits:3},{name:"23. Cloud Architecture",credits:3} ] },
    sem2: { label: "SEMESTER 2", courses: [ {name:"24. Big Data Analytics",credits:4},{name:"25. API Development",credits:3},{name:"26. Mobile App Development",credits:3},{name:"27. Agile Methodologies",credits:3},{name:"28. Ethics in Tech",credits:3} ] } },
  { year: "YEAR 4",
    sem1: { label: "SEMESTER 1", courses: [ {name:"29. Artificial Intelligence",credits:3},{name:"30. DevOps & CI/CD",credits:3},{name:"31. Cyber Security Advanced",credits:3},{name:"32. IT Project Management II",credits:3},{name:"33. Internship Program II",credits:6} ] },
    sem2: { label: "SEMESTER 2", courses: [ {name:"34. Capstone Project",credits:6},{name:"35. Entrepreneurship in IT",credits:3},{name:"36. Software Quality Assurance",credits:3},{name:"37. Final Thesis Defense",credits:6} ] } },
];

function Semester({ label, courses }: { label: string; courses: Course[] }) {
  return (
    <div className="flex-1">
      <h4 className="font-hanken text-base font-bold text-accent">{label}</h4>
      <div className="mt-4 space-y-4">
        {courses.map((c) => (
          <div key={c.name} className="flex items-center justify-between border-b border-border pb-2">
            <span className="font-hanken text-[18px] text-foreground">{c.name}</span>
            <span className="font-hanken text-[18px] font-bold text-primary">{c.credits}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Curriculum() {
  return (
    <section className="bg-background py-24 text-foreground transition-colors duration-200">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-8">
        <div className="text-center">
          <p className="font-hanken text-2xl font-bold text-secondary">PROGRAM STRUCTURE</p>
          <h2 className="font-hanken mt-3 text-[40px] font-bold text-primary sm:text-[48px]">CURRICULUM</h2>
          <p className="font-hanken mx-auto mt-3 max-w-2xl text-lg text-muted-foreground">
            A comprehensive roadmap designed to take you from foundational concepts to advanced industry expertise.
          </p>
        </div>
        <div className="mt-14 space-y-16">
          {YEARS.map((y) => (
            <div key={y.year}>
              <div className="rounded-t-2xl bg-primary px-8 py-4">
                <h3 className="text-[28px] font-bold text-primary-foreground">{y.year}</h3>
              </div>
              <div className="flex flex-col gap-8 rounded-b-2xl border border-border bg-muted/40 dark:bg-card px-8 py-8 md:flex-row md:gap-8">
                <Semester label={y.sem1.label} courses={y.sem1.courses} />
                <Semester label={y.sem2.label} courses={y.sem2.courses} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}