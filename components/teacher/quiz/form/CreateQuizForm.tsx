"use client";

import { useState } from "react";

import { CourseReferenceSidebar } from "./CourseReferenceSidebar";
import { initialQuizFormData, QuizFormData } from "@/lib/types/createEmptyQuestion";
import { QuizDetailsSection } from "./QuizDetailsSection";
import { ScheduleSidebar } from "./ScheduleSidebar";
import { QuestionsSection } from "./QuestionsSection";


export function CreateQuizForm() {
  const [form, setForm] = useState<QuizFormData>(initialQuizFormData);

  function update<K extends keyof QuizFormData>(key: K, value: QuizFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSaveDraft() {
    console.log("Save draft", form);
  }

  function handlePublish() {
    console.log("Publish quiz", form);
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-foreground">Create New Quiz</h1>
      <p className="mt-1.5 text-muted-foreground">
        Configure high-security assessment parameters and content.
      </p>

      <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-start">
        <div className="flex-1 space-y-6">
          <QuizDetailsSection
            title={form.title}
            onTitleChange={(v) => update("title", v)}
            description={form.description}
            onDescriptionChange={(v) => update("description", v)}
          />

         <QuestionsSection
            questions={form.questions}
            onQuestionsChange={(v) => update("questions", v)}
          />
        </div>

        <div className="w-full space-y-6 lg:max-w-sm">
          <ScheduleSidebar
            openingDate={form.openingDate}
            onOpeningDateChange={(v) => update("openingDate", v)}
            timeLimitMinutes={form.timeLimitMinutes}
            onTimeLimitMinutesChange={(v) => update("timeLimitMinutes", v)}
          />

          <CourseReferenceSidebar
            courseId={form.courseId}
            onCourseIdChange={(v) => update("courseId", v)}
            topicId={form.topicId}
            onTopicIdChange={(v) => update("topicId", v)}
            contributesToFinalGrade={form.contributesToFinalGrade}
            onContributesToFinalGradeChange={(v) => update("contributesToFinalGrade", v)}
            onSaveDraft={handleSaveDraft}
            onPublish={handlePublish}
          />
        </div>
      </div>
    </div>
  );
}