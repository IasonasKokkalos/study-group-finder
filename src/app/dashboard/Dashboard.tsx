"use client";

import { useState } from "react";
import SessionFeed from "@/components/SessionFeed";
import CreateSessionForm from "@/components/CreateSessionForm";

interface DashboardProps {
    userId: string;
}

export default function Dashboard({ userId }: DashboardProps) {
    const [refreshKey, setRefreshKey] = useState(0);

    function handleSessionCreated() {
        // Incrementing the key forces SessionFeed to remount and refetch
        setRefreshKey((prev) => prev + 1);
    }
  return (
    <>
      <div className="mb-6">
        <CreateSessionForm
          currentUserId={userId}
          onSessionCreated={handleSessionCreated}
        />
      </div>

      <SessionFeed key={refreshKey} currentUserId={userId} />
    </>
  );
}