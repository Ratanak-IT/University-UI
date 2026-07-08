"use client";

import { useState } from "react";
import { MoreVertical, Maximize2, Expand, Scan } from "lucide-react";
import InviteCodeModal from "./InviteCodeModal";

type ClassCodeCardProps = {
  code: string;
};

export default function ClassCodeCard({ code }: ClassCodeCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleResetCode = () => {
    // TODO: call your API to regenerate the code, then close the modal
    setIsModalOpen(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold tracking-wide text-muted-foreground">
          CLASS CODE
        </p>
        <button className="text-muted-foreground hover:text-card-foreground">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between">
        <p className="font-mono text-2xl font-bold tracking-wider text-card-foreground">
          {code}
        </p>
        <button
          onClick={() => setIsModalOpen(true)}
          aria-label="Expand class code"
          className="text-muted-foreground hover:text-card-foreground"
        >
          <Scan className="h-6 w-6" />
        </button>
      </div>

      <InviteCodeModal
        code={code}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onReset={handleResetCode}
      />
    </div>
  );
}