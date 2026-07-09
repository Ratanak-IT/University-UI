import LessonsBoard from '@/components/teacher/lessons/LessonsBoard'
import LessonsHeader from '@/components/teacher/lessons/LessonsHeader'
import React from 'react'

export default function page() {
  return (
    <main className="flex-1 px-6 py-8 md:px-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-6">
            <LessonsHeader />
            <LessonsBoard />
          </div>
        </main>
  )
}
