"use client";

import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

export default function CreateButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.push("/dashboard/teacher/assignments/create")}
      className="ml-auto flex w-fit items-center gap-2 rounded-lg bg-blue-800 px-5 py-2.5 font-medium text-white shadow-sm transition-colors hover:bg-blue-900"
    >
      <Plus className="h-4 w-4" strokeWidth={2.5} />
      Create
    </button>
  );
}