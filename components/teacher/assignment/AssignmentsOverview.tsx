"use client";

import OverviewHeader from "./OverviewHeader";
import CreateButton from "./CreateButton";
import AssignmentGroups from "./AssignmentGroups";
export default function AssignmentsOverview() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-8 md:px-10">
      <OverviewHeader />
      <CreateButton />
      <AssignmentGroups />
    </div>
  );
}
