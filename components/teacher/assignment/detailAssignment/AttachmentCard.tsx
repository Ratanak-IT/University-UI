import { AssignmentAttachment } from "@/lib/types/AssignmentDetail";
import Image from "next/image";


interface AttachmentCardProps {
  attachment: AssignmentAttachment;
}

export function AttachmentCard({ attachment }: AttachmentCardProps) {
  return (
    <a
      href={attachment.href}
      className="flex items-stretch overflow-hidden rounded-xl border border-border bg-card transition-colors hover:bg-muted/50 sm:max-w-md"
    >
      <div className="flex flex-1 flex-col justify-center gap-1 px-5 py-4">
        <span className="font-medium text-foreground">{attachment.title}</span>
        <span className="text-sm text-muted-foreground">
          {attachment.subtitle}
        </span>
      </div>

      <div className="relative w-28 shrink-0 bg-muted">
        {attachment.thumbnailUrl ? (
          <Image
            src={attachment.thumbnailUrl}
            alt=""
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="h-10 w-16 rounded-sm border border-border bg-background" />
          </div>
        )}
      </div>
    </a>
  );
}