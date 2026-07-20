import type { AssignmentDetail, Comment, WorkStatus } from "@/lib/types/AssignmentDetail";

// ---------------------------------------------------------------------------
// Swap this out for real API calls once your Spring Boot endpoints exist, e.g.:
//   const res = await fetch(`/api/assignments/${assignmentId}`);
// ---------------------------------------------------------------------------

interface AssignmentRecord {
  assignment: AssignmentDetail;
  classComments: Comment[];
  workStatus: WorkStatus;
}

const ASSIGNMENTS_BY_ID: Record<string, AssignmentRecord> = {
  "eco-1": {
    assignment: {
      id: "eco-1",
      title: "Ecosystem Research Project",
      authorName: "Mr. Sok Dara",
      postedOn: "Oct 12",
      points: 100,
      description: "Research a local ecosystem and document the food web you find.",
      attachments: [],
    },
    classComments: [],
    workStatus: "assigned",
  },
  "eco-2": {
    assignment: {
      id: "eco-2",
      title: "Ecosystem Basics Slide Deck",
      authorName: "Mr. Sok Dara",
      postedOn: "Oct 10",
      points: 50,
      description: "Slide deck covering ecosystem basics.",
      attachments: [],
    },
    classComments: [],
    workStatus: "assigned",
  },
  "eco-3": {
    assignment: {
      id: "eco-3",
      title: "How do keystone species affect their environment?",
      authorName: "Mr. Sok Dara",
      postedOn: "Oct 08",
      points: 20,
      description: "Short-answer question on keystone species.",
      attachments: [],
    },
    classComments: [],
    workStatus: "assigned",
  },
  "water-1": {
    assignment: {
      id: "water-1",
      title: "Water Cycle Chart",
      authorName: "Mr. Sok Dara",
      postedOn: "Sep 28",
      points: 30,
      description: "Create a chart illustrating the water cycle.",
      attachments: [],
    },
    classComments: [],
    workStatus: "assigned",
  },
  "water-2": {
    assignment: {
      id: "water-2",
      title: "Hydrological Cycle Lab Report",
      authorName: "Mr. Sok Dara",
      postedOn: "Sep 25",
      points: 100,
      description: "Lab report on the hydrological cycle.",
      attachments: [],
    },
    classComments: [],
    workStatus: "assigned",
  },
  "atmo-1": {
    assignment: {
      id: "atmo-1",
      title: "Emergency: Hurricane Simulation Quiz",
      authorName: "Mr. Sok Dara",
      postedOn: "Sep 20",
      points: 20,
      description: "Quiz simulating hurricane emergency response.",
      attachments: [],
    },
    classComments: [],
    workStatus: "assigned",
  },
};

export async function getAssignmentDetail(
  assignmentId: string
): Promise<AssignmentRecord | null> {
  // Replace with:
  // const res = await fetch(`/api/assignments/${assignmentId}`);
  // if (!res.ok) return null;
  // return res.json();
  await new Promise((r) => setTimeout(r, 300));
  return ASSIGNMENTS_BY_ID[assignmentId] ?? null;
}