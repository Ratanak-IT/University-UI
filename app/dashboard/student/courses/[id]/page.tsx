import ClassroomDetailView from "@/components/shared/ClassroomDetailView";

interface StudentCourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function StudentCourseDetailPage({
  params,
}: StudentCourseDetailPageProps) {
  const resolvedParams = await params;
  return <ClassroomDetailView classroomId={resolvedParams.id} isStudent={true} />;
}
