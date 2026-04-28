"use client";

import type { Session } from "@/types";

interface SessionCardProps {
    session: Session;
    currentUserId: string;
    onJoin: (sessionId: string) => void;
    onLeave: (sessionId: string) => void;
    onDelete: (sessionId: string) => void;
}

export default function SessionCard({
    session,
    currentUserId,
    onJoin,
    onLeave,
    onDelete,
}: SessionCardProps) {
    const isCreator = session.creator_id == currentUserId;
    const hasJoined = session.participants?.some(
        (p) => p.user_id == currentUserId
    );

    const participantCount = session.participants?.length || 0;

    const dateStr = new Date(session.session_date).toLocaleTimeString("en-GB", {
        weekday: "short",
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">
            {session.title}
          </h3>

          {session.description && (
            <p className="text-sm text-gray-600 mt-1">
              {session.description}
            </p>
          )}

          <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
            <span>📅 {dateStr}</span>
            <span>📍 {session.location}</span>
            <span>👥 {participantCount} joined</span>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            Created by{" "}
            <span className="font-medium text-gray-600">
              {session.creator?.display_name || "Unknown"}
            </span>
          </p>

          {/* Show participant names */}
          {session.participants && session.participants.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {session.participants.map((p) => (
                <span
                  key={p.id}
                  className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full"
                >
                  {p.profile?.display_name || "Anonymous"}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="ml-4">
          {!isCreator && !hasJoined && (
            <button
              onClick={() => onJoin(session.id)}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg
                         hover:bg-blue-700 transition-colors"
            >
              Join
            </button>
          )}

          {!isCreator && hasJoined && (
            <button
              onClick={() => onLeave(session.id)}
              className="px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg
                         hover:bg-gray-300 transition-colors"
            >
              Leave
            </button>
          )}

          {isCreator && (
            <div className="flex flex-col gap-2">
              <span className="text-xs text-green-600 font-medium">
                Your session
              </span>
              <button
                onClick={() => onDelete(session.id)}
                className="px-4 py-2 bg-red-100 text-red-600 text-sm rounded-lg
                 hover:bg-red-200 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}