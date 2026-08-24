import AssignmentGrader from "@/components/teacher/assignment/grading/AssignmentGrader";

interface AssignmentGradingPageProps {
  params: Promise<{ assignmentId: string }>;
}

export default async function AssignmentGradingPage({
  params,
}: AssignmentGradingPageProps) {
  const { assignmentId } = await params;

  return (
    <main className="px-8 py-8">
      <AssignmentGrader assignmentId={assignmentId} />
    </main>
  );
}
