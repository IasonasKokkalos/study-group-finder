import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import Dashboard from "../../components/Dashboard";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user } ,
    } = await supabase.auth.getUser();

    // This shouldnt happen cause middleware(proxy) protects this route,
    // but its a safety net 
    if (!user) {
        redirect("/auth/login");
    }

   return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-2xl mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Upcoming Study Sessions
        </h2>

        <Dashboard userId={user.id} />
      </main>
    </div>
  );
}