import ClassroomDetailView from "@/components/shared/ClassroomDetailView";

interface StudentClassroomDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentClassroomDetailPage({
  params,
}: StudentClassroomDetailPageProps) {
  const resolvedParams = await params;
  return <ClassroomDetailView classroomId={resolvedParams.id} isStudent={true} />;
}
