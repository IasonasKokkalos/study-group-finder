"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface CreateSessionFormProps {
    currentUserId: string;
    onSessionCreated: () => void;
}

export default function CreateSessionForm ({
    currentUserId,
    onSessionCreated,
}: CreateSessionFormProps) {
    const [title, setTitle] = useState ("");
    const [description, setDescription] = useState("");
    const [location, setLocation] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);

    const supabase = createClient();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Combine date and time into a single ISO string
          const sessionDate = new Date(`${date}T${time}`);
          const now = new Date();
          const oneMonthFromNow = new Date();
          oneMonthFromNow.setMonth(oneMonthFromNow.getMonth() + 1);

          if (sessionDate < now) {
            setError("Session date can't be in the past.");
            setLoading(false);
            return;
            }

          if (sessionDate > oneMonthFromNow) {
          setError("Sessions can't be more than 1 month from now.");
          setLoading(false);
          return;
          }

        const { error: insertError } = await supabase.from("sessions").insert({
            title,
            description,
            location,
            session_date: sessionDate,
            creator_id: currentUserId,
        });

        if (insertError) {
            setError(insertError.message);
            setLoading(false);
            return;
        }

        // Reset form 
        setTitle("");
        setDescription("");
        setLocation("");
        setDate("");
        setTime("");
        setIsOpen(false);
        setLoading(false);

        onSessionCreated();
    }

    if (!isOpen) {
     return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg
                   text-gray-500 hover:border-blue-400 hover:text-blue-500
                   transition-colors font-medium"
      >
        + Create Study Session
      </button>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          New Study Session
        </h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-600 text-sm"
        >
          Cancel
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Course or topic (e.g., Calculus 2 Review)"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     text-gray-800 placeholder-gray-400"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     text-gray-800 placeholder-gray-400"
        />

        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Location (e.g., MetaForum 3.144)"  
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-lg
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     text-gray-800 placeholder-gray-400"
        />

        <div className="flex gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       text-gray-800"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg
                       focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       text-gray-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium
                     hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors"
        >
          {loading ? "Creating..." : "Create Session"}
        </button>

        {error && (
          <p className="text-red-500 text-sm">{error}</p>
        )}
      </form>
    </div>
  );
}