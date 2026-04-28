"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Session } from "@/types";
import SessionCard from "./SessionCard";

interface SessionFeedProps {
    currentUserId: string;
}

export default function SessionFeed({ currentUserId }: SessionFeedProps) {
    const [sessions, setSessions] = useState<Session[]>([]);
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    // Fetch all upcoming sessions
    async function fetchSessions() {
        const { data, error } = await supabase
        .from("sessions") 
        .select(`
            *,
            creator:profiles!creator_id(*),
            participants:session_participants(
                *,
                profile:profiles!user_id(*)
            )`
        )
        .gte("session_date", new Date().toISOString())
        .order("session_date", { ascending: true});

        if (error) {
            console.error( "Error fetching sessions", error);
            return;
        }

        setSessions(data || []);
        setLoading(false);
    }

    useEffect(() => {
        fetchSessions();

        // Sub to real-time changes on the session table
        const sessionsChannel = supabase
          .channel("sessions-changes")
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "sessions" },
            () => {
              fetchSessions(); // Refresh whenever a session is created/updated/deleted
            }
          )
          .on(
            "postgres_changes",
            { event: "*", schema: "public", table: "session_participants" },
            () => {
              fetchSessions(); // Refresh whenever someone joins/leaves
            }
          )
          .subscribe();

          // Cleanup: unsub when the component unmounts
          return () => {
            supabase.removeChannel(sessionsChannel);
          };
    }, []);

    async function handleJoin(sessionIdL: string) {
        const{ error } = await supabase
        .from("session_participants")
        .insert({ session_id: sessionIdL, user_id: currentUserId });

        if (error) {
            console.error("Error joining session:", error);
            return;
        }

        fetchSessions(); //refresh the list
    }

    async function handleLeave(sessionId: string) {
        const { error } = await supabase
            .from("session_participants")
            .delete()
            .eq("session_id", sessionId)
            .eq("user_id", currentUserId);

        if (error) {
            console.error("Error leaving the session:", error);
            return;
            }
        
        fetchSessions();
    }

    async function handleDelete(sessionId: string) {
    const { error } = await supabase
      .from("sessions")
      .delete()
      .eq("id", sessionId);

    if (error) {
      console.error("Error deleting session:", error);
    }
}
     
  if (loading) {
    return <p className="text-center text-gray-500 py-8">Loading sessions...</p>;
  }

  if (sessions.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 text-lg">No upcoming sessions yet.</p>
        <p className="text-gray-400 text-sm mt-1">Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <SessionCard
          key={session.id}
          session={session}
          currentUserId={currentUserId}
          onJoin={handleJoin}
          onLeave={handleLeave}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}