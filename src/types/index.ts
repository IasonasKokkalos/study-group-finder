//A user profile (from the profiles table -in supabase-)
export interface Profile {
    id: string;
    email: string;
    display_name: string;
    created_at: string;
}

// A study session (from the session table)
export interface Session {
    id: string;
    created_at: string;
    title: string;
    description: string;
    location: string;
    session_date: string;
    creator_id: string;
    // These are populated by joins, therefore not always present
    creator?: Profile;
     participants?: Participant[];
}

// A row in the session_participants join table
export interface Participant {
    id: string;
    session_id: string;
    user_id: string;
    joined_at: string;
    profile?: Profile;
}