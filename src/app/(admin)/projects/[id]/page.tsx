"use client";

import { use } from "react";
import { ProjectDetailsView } from "@/components/shared/ProjectDetailsView";

export default function AdminProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return (
    <div className="max-w-6xl mx-auto pb-10">
      <ProjectDetailsView projectId={resolvedParams.id} role="admin" />
    </div>
  );
}
