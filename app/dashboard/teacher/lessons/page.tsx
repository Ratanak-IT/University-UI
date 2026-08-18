import LessonsPage from '@/components/teacher/lessons/LessonsPage'
import LessonsHeader from '@/components/teacher/lessons/LessonsHeader'

export default function page() {
  return (
    <main className="flex-1 px-6 py-8 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-6">
        <LessonsHeader />
        <LessonsPage />
      </div>
    </main>
  );
}
