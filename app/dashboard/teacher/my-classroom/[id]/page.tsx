import ClassroomDetailView from "@/components/shared/ClassroomDetailView";

interface TeacherClassroomDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TeacherClassroomDetailPage({
  params,
}: TeacherClassroomDetailPageProps) {
  const resolvedParams = await params;
  return <ClassroomDetailView classroomId={resolvedParams.id} isStudent={false} />;
}