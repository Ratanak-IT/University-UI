"use client";

import { useEffect } from "react";
import { useGetClassroomAssignmentsQuery } from "@/lib/redux/apiSlice";
import type { AssignmentResponse } from "@/lib/api/student";

// Stable reference: `data = []` as an inline default creates a new array
// every render while the query is still loading/erroring, which re-fires the
// effect below forever (new reference -> setState -> re-render -> repeat).
const EMPTY: AssignmentResponse[] = [];

/**
 * Renders nothing — just owns one classroom's assignments query and reports
 * the result up to the dashboard. One instance per classroom lets the
 * overview merge "due soon" / submission data across all of a teacher's
 * classes without a dedicated aggregate endpoint (the per-classroom
 * assignments list is the only one that carries submittedCount/totalStudents).
 */
export default function AssignmentFetcher({
  classroomId,
  onLoaded,
}: {
  classroomId: string;
  onLoaded: (classroomId: string, items: AssignmentResponse[]) => void;
}) {
  const { data = EMPTY } = useGetClassroomAssignmentsQuery(classroomId);

  useEffect(() => {
    onLoaded(classroomId, data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classroomId, data]);

  return null;
}
