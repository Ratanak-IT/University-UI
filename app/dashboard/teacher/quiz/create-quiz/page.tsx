import CreateQuizPage from '@/components/teacher/quiz/form/CreateQuizPage'
import React, { Suspense } from 'react'

export default function page() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-slate-500">Loading quiz editor...</div>}>
      <CreateQuizPage/>
    </Suspense>
  )
}
