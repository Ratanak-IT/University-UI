"use client";

import { useEffect, useState } from "react";
import { AssignmentCard } from "@/components/teacher/assignment/detailAssignment/AssignmentCard";
import { PrivateComments } from "@/components/teacher/assignment/detailAssignment/PrivateComments";
import { YourWorkPanel } from "@/components/teacher/assignment/detailAssignment/YourWorkPanel";
import { getAssignmentDetail } from "@/lib/data/assignmentDetail";
import {
  AssignmentDetail,
  Comment,
  SubmissionAttachment,
  WorkStatus,
} from "@/lib/types/AssignmentDetail";
import { useParams } from "next/navigation";

const currentUser = { id: "me", name: "Keo Kay", initials: "KK" };

export default function AssignmentDetailPage() {
  const params = useParams<{ assignmentId: string }>();
  const assignmentId = params.assignmentId;

  const [assignment, setAssignment] = useState<AssignmentDetail | null>(null);
  const [classComments, setClassComments] = useState<Comment[]>([]);
  const [workStatus, setWorkStatus] = useState<WorkStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const record = await getAssignmentDetail(assignmentId);
        if (cancelled) return;
        if (!record) {
          setError("Assignment not found.");
          return;
        }
        setAssignment(record.assignment);
        setClassComments(record.classComments);
        setWorkStatus(record.workStatus);
      } catch (err) {
        if (!cancelled) setError("Failed to load this assignment.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [assignmentId]);

  function handleSubmit(attachments: SubmissionAttachment[]) {
    // Wire to your Spring Boot endpoint, e.g. multipart/form-data:
    // const formData = new FormData();
    // attachments.forEach((a) => a.file && formData.append("files", a.file));
    // attachments.filter((a) => a.kind === "link").forEach((a) =>
    //   formData.append("links", a.url ?? "")
    // );
    // await submitAssignmentMutation({ assignmentId, formData });
    console.log("turned in:", attachments);
  }

  if (isLoading) {
    return <div className="p-6 text-sm text-muted-foreground">Loading assignment…</div>;
  }

  if (error || !assignment || !workStatus) {
    return (
      <div className="p-6 text-sm text-red-600">
        {error ?? "Assignment not found."}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_320px]">
      <AssignmentCard
        assignment={assignment}
        comments={classComments}
        currentUser={currentUser}
        onSubmitComment={(body) => console.log("class comment:", body)}
      />

      <div className="flex flex-col gap-6">
        <YourWorkPanel
          initialStatus={workStatus}
          onSubmit={handleSubmit}
          onUnsubmit={() => console.log("unsubmitted")}
          onMarkAsDone={() => console.log("marked as done")}
        />
        <PrivateComments
          studentName={currentUser.name}
          onSubmit={(body) => console.log("private comment:", body)}
        />
      </div>
    </div>
  );
}