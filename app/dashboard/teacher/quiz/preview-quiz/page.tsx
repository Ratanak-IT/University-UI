import { QuizPreviewPage } from '@/components/teacher/quiz/preview-quiz/QuizPreviewPage'

interface PageProps {
  params: { quizId: string };
}
 
export default function Page({ params }: PageProps) {
  return <QuizPreviewPage quizId={params.quizId} />;
}