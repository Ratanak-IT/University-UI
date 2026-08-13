import { AssignmentDetail, CommentAuthor , Comment} from "@/lib/types/AssignmentDetail";
import { AssignmentHeader } from "./AssignmentHeader";
import { AttachmentCard } from "./AttachmentCard";
import { ClassComments } from "./ClassComments";
// import type { AssignmentDetail, Comment, CommentAuthor } from "./types";

interface AssignmentCardProps {
  assignment: AssignmentDetail;
  comments: Comment[];
  currentUser: CommentAuthor;
  onSubmitComment?: (body: string) => void;
}

export function AssignmentCard({
  assignment,
  comments,
  currentUser,
  onSubmitComment,
}: AssignmentCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <AssignmentHeader assignment={assignment} />

      {assignment.description && (
        <p className="mt-6 text-foreground">{assignment.description}</p>
      )}

      {assignment.attachments.length > 0 && (
        <div className="mt-4 space-y-3">
          {assignment.attachments.map((attachment) => (
            <AttachmentCard key={attachment.id} attachment={attachment} />
          ))}
        </div>
      )}

      <ClassComments
        comments={comments}
        currentUser={currentUser}
        onSubmit={onSubmitComment}
      />
    </div>
  );
}