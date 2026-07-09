import type { AssignmentGroup } from "../types/AssignmentGroup ";

/**
 * Swap this out for data fetched from your API / database,
 * e.g. inside a Server Component:
 *
 *   const groups = await getAssignmentGroups();
 */
export const assignmentGroups: AssignmentGroup[] = [
  {
    id: "ecosystems",
    title: "Ecosystems",
    items: [
      {
        id: "eco-1",
        title: "Ecosystem Research Project",
        postedDate: "Posted Oct 12",
        icon: "assignment",
        meta: { label: "Due Oct 28", variant: "due" },
      },
      {
        id: "eco-2",
        title: "Ecosystem Basics Slide Deck",
        postedDate: "Posted Oct 10",
        icon: "slides",
      },
      {
        id: "eco-3",
        title: "How do keystone species affect their environment?",
        postedDate: "Posted Oct 08",
        icon: "question",
      },
    ],
  },
  {
    id: "water-cycle",
    title: "Water Cycle",
    items: [
      {
        id: "water-1",
        title: "Water Cycle Chart",
        postedDate: "Posted Sep 28",
        icon: "chart",
      },
      {
        id: "water-2",
        title: "Hydrological Cycle Lab Report",
        postedDate: "Posted Sep 25",
        icon: "assignment",
        meta: { label: "Due Oct 05", variant: "due" },
      },
    ],
  },
  {
    id: "atmospheric-sciences",
    title: "Atmospheric Sciences",
    items: [
      {
        id: "atmo-1",
        title: "Emergency: Hurricane Simulation Quiz",
        postedDate: "Posted Sep 20",
        icon: "alert",
        meta: { label: "Overdue", variant: "overdue" },
      },
    ],
  },
];