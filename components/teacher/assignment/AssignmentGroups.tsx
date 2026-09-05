// import { assignmentGroups } from "@/lib/data/assignmentGroups";
// import AssignmentGroupCard from "./AssignmentGroupCard";


// export default function AssignmentGroups() {
//   return (
//     <div className="flex flex-col gap-10">
//       {assignmentGroups.map((group) => (
//         <AssignmentGroupCard key={group.id} group={group} />
//       ))}
//     </div>
//   );
// }


"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Calendar, Clock, CheckCircle, X } from "lucide-react";
import AssignmentGroupCard from "./AssignmentGroupCard";
import AssignmentsFilterBar from "./AssignmentsFilterBar";
import { ClassroomFilter, AssignmentGroup, AssignmentItem } from "@/lib/types/AssignmentGroup";
import { fetchSavedAssignments, assignSavedAssignment } from "@/lib/api/assignment";
import { fetchTeacherClassrooms } from "@/lib/api/teacher";
import { fetchClassroomAssignments } from "@/lib/api/student";
import { useDeleteAssignmentMutation, useUpdateAssignmentMutation } from "@/lib/redux/apiSlice";
import { toast } from "@/components/shared/Toast";
import ConfirmDialog from "@/components/shared/ConfirmDialog";

export default function AssignmentGroups() {
  const [classroomFilter, setClassroomFilter] = useState<ClassroomFilter>("all");
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<AssignmentGroup[]>([]);
  
  // Assign Modal State
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [selectedClassroomId, setSelectedClassroomId] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [dueTime, setDueTime] = useState<string>("23:59");
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Edit Assignment Modal State
  const [editingItem, setEditingItem] = useState<AssignmentItem | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);

  const [deleteAssignmentMutation] = useDeleteAssignmentMutation();
  const [updateAssignmentMutation] = useUpdateAssignmentMutation();

  // Delete Assignment Confirm State
  const [deletingAssignmentId, setDeletingAssignmentId] = useState<string | null>(null);
  const [deletingAssignment, setDeletingAssignment] = useState(false);

  const [classrooms, setClassrooms] = useState<{ id: string; name: string }[]>([]);

  async function loadData() {
    setLoading(true);
    try {
      const [saved, classes] = await Promise.all([
        fetchSavedAssignments(),
        fetchTeacherClassrooms(),
      ]);

      const allGroups: AssignmentGroup[] = [];

      // Add Saved Templates Group
      if (saved && saved.length > 0) {
        allGroups.push({
          id: "templates",
          title: "Saved Templates",
          classroom: "Templates",
          items: saved.map((a) => ({
            id: a.assignmentId,
            title: a.title,
            postedDate: `Created on ${new Date(a.createdAt).toLocaleDateString()}`,
            icon: "assignment",
            meta: {
              label: "Template",
              variant: "none",
            },
          })),
        });
      }

      // Fetch active assignments for each classroom
      if (classes && classes.length > 0) {
        setClassrooms(classes.map((c) => ({ id: c.classroomId, name: c.className || "Classroom" })));
        
        await Promise.all(
          classes.map(async (c) => {
            const active = await fetchClassroomAssignments(c.classroomId);
            if (active && active.length > 0) {
              allGroups.push({
                id: c.classroomId,
                title: c.className || "Classroom",
                classroom: c.className || "Classroom",
                items: active.map((a) => ({
                  id: a.assignmentId,
                  title: a.title,
                  postedDate: a.dueDate
                    ? `Due on ${new Date(a.dueDate).toLocaleString()}`
                    : "No due date",
                  icon: "assignment",
                  meta: {
                    label: `${a.maxScore || 100} pts`,
                    variant: "none",
                  },
                })),
              });
            }
          })
        );
      }

      setGroups(allGroups);
    } catch (err) {
      console.error("Error loading assignments:", err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadData();
  }, []);

  const classroomOptions = useMemo(() => {
    return classrooms.map((c) => c.name).sort();
  }, [classrooms]);

  const filteredGroups = useMemo(() => {
    if (classroomFilter === "all") return groups;
    return groups.filter((g) => g.classroom === classroomFilter);
  }, [groups, classroomFilter]);

  function handleAssignClick(id: string) {
    setAssigningId(id);
    setSelectedClassroomId("");
    setDueDate("");
    setDueTime("23:59");
    setMessage(null);
  }

  async function handleConfirmAssign() {
    if (!assigningId || !selectedClassroomId || !dueDate) return;
    setActionLoading(true);
    setMessage(null);

    const combinedDueDate = `${dueDate}T${dueTime}:00`;
    const res = await assignSavedAssignment(assigningId, selectedClassroomId, combinedDueDate);
    setActionLoading(false);

    if (res) {
      setMessage({ type: "success", text: "Assignment distributed successfully!" });
      await loadData();
      setTimeout(() => {
        setAssigningId(null);
      }, 1500);
    } else {
      setMessage({ type: "error", text: "Failed to distribute assignment. Please try again." });
    }
  }

  function handleDeleteAssignment(id: string) {
    setDeletingAssignmentId(id);
  }

  async function handleConfirmDeleteAssignment() {
    if (!deletingAssignmentId) return;
    setDeletingAssignment(true);
    try {
      await deleteAssignmentMutation(deletingAssignmentId).unwrap();
      toast.success("Assignment deleted successfully!");
      loadData();
    } catch {
      toast.error("Failed to delete assignment. Please try again.");
    }
    setDeletingAssignment(false);
    setDeletingAssignmentId(null);
  }

  function handleOpenEdit(item: AssignmentItem) {
    setEditingItem(item);
    setEditTitle(item.title);
  }

  async function handleConfirmEdit() {
    if (!editingItem || !editTitle.trim()) return;
    setSavingEdit(true);
    try {
      await updateAssignmentMutation({
        assignmentId: editingItem.id,
        title: editTitle,
      }).unwrap();
      toast.success("Assignment updated successfully!");
      setEditingItem(null);
      loadData();
    } catch {
      toast.error("Failed to update assignment.");
    }
    setSavingEdit(false);
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-650" strokeWidth={2} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <AssignmentsFilterBar
        classroom={classroomFilter}
        onClassroomChange={setClassroomFilter}
        classroomOptions={classroomOptions}
        shownCount={filteredGroups.length}
        totalCount={groups.length}
      />

      {filteredGroups.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-10 text-center text-sm text-slate-500">
          No assignments found.
        </div>
      ) : (
        filteredGroups.map((group) => (
          <AssignmentGroupCard
            key={group.id}
            group={group}
            onAssign={handleAssignClick}
            onEdit={handleOpenEdit}
            onDelete={handleDeleteAssignment}
          />
        ))
      )}

      {/* Assign Template Modal */}
      {assigningId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              Distribute Assignment
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select the classroom and the deadline to assign this assignment template.
            </p>

            {message && (
              <div
                className={`mt-4 flex items-center gap-2 rounded-xl p-3.5 text-sm font-medium ${
                  message.type === "success"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-rose-50 text-rose-700"
                }`}
              >
                {message.type === "success" && <CheckCircle className="h-4 w-4 shrink-0" />}
                {message.text}
              </div>
            )}

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="assign-classroom" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                  Target Classroom
                </label>
                <select
                  id="assign-classroom"
                  value={selectedClassroomId}
                  onChange={(e) => setSelectedClassroomId(e.target.value)}
                  disabled={actionLoading || message?.type === "success"}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  <option value="" disabled>Choose classroom...</option>
                  {classrooms.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="due-date" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Due Date
                  </label>
                  <div className="relative">
                    <input
                      id="due-date"
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      disabled={actionLoading || message?.type === "success"}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-9 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                    <Calendar className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label htmlFor="due-time" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                    Due Time
                  </label>
                  <div className="relative">
                    <input
                      id="due-time"
                      type="time"
                      value={dueTime}
                      onChange={(e) => setDueTime(e.target.value)}
                      disabled={actionLoading || message?.type === "success"}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-3.5 pr-9 py-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
                    />
                    <Clock className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 pt-4 dark:border-slate-850">
              <button
                type="button"
                onClick={() => setAssigningId(null)}
                disabled={actionLoading}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-55 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-850"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmAssign}
                disabled={actionLoading || !selectedClassroomId || !dueDate || message?.type === "success"}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-800 disabled:opacity-55"
              >
                {actionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Assigning...
                  </>
                ) : (
                  "Distribute"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Assignment Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">Edit Assignment</h3>
              <button type="button" onClick={() => setEditingItem(null)} className="rounded-lg p-1 text-slate-400 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Assignment Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-100"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={savingEdit}
                onClick={handleConfirmEdit}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
              >
                {savingEdit ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deletingAssignmentId}
        title="Delete assignment?"
        description="This action cannot be undone. This assignment will be permanently removed."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        loading={deletingAssignment}
        onConfirm={handleConfirmDeleteAssignment}
        onCancel={() => setDeletingAssignmentId(null)}
      />
    </div>
  );
}