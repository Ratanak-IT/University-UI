"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import RosterTable from "./RosterTable";
import StatsGrid from "./StatsGrid";
import StudentsHeader from "./StudentsHeader";
import {
  fetchTeacherClassrooms,
  fetchClassroomStudents,
} from "@/lib/api/teacher";

export type StudentRosterItem = {
  id: string;
  name: string;
  email: string;
  idCode: string;
  className: string;
  year: string;
  gender: "Male" | "Female" | "Other";
  enrollmentDate: string;
  gradStatus: "In Progress" | "Completed" | "At Risk";
  avatarUrl: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentRosterItem[]>([]);
  const [classroomNames, setClassroomNames] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const classData = await fetchTeacherClassrooms();
        if (classData && classData.length > 0) {
          const names = classData.map((c) => c.className || "Classroom");
          setClassroomNames(names);

          const studentMap = new Map<string, StudentRosterItem>();
          
          await Promise.all(
            classData.map(async (c) => {
              const res = await fetchClassroomStudents(c.classroomId);
              if (res && res.length > 0) {
                res.forEach((s) => {
                  if (!studentMap.has(s.studentId)) {
                    studentMap.set(s.studentId, {
                      id: s.studentId,
                      name: s.fullName || "Student",
                      email: s.email || "",
                      idCode: s.studentCode || "",
                      className: c.className || "Classroom",
                      year: s.yearLevel ? `Year ${s.yearLevel}` : "Year 1",
                      gender: s.gender === "FEMALE" ? "Female" : "Male",
                      enrollmentDate: s.joinedAt
                        ? new Date(s.joinedAt).toLocaleDateString()
                        : new Date().toLocaleDateString(),
                      gradStatus: "In Progress", // Default status as backend doesn't have at-risk/grad-status mappings
                      avatarUrl: "/davin.jpg",
                    });
                  }
                });
              }
            })
          );

          setStudents(Array.from(studentMap.values()));
        } else {
          setStudents([]);
          setClassroomNames([]);
        }
      } catch (err) {
        console.error("Error loading roster:", err);
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" strokeWidth={2} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <StudentsHeader />
      <StatsGrid students={students} />
      <RosterTable students={students} classroomNames={classroomNames} />
    </div>
  );
}