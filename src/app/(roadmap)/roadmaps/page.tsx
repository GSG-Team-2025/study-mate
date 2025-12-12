import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import RoadmapsClient from "@/components/ui/roadmap/RoadmapsClient";

export default async function RoadmapsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: roadmaps } = await supabase
    .from('roadmaps')
    .select('id, title, description, icon, color')
    .eq('is_active', true)
    .order('created_at');

  const { data: profile } = await supabase
    .from('profiles')
    .select('current_roadmap_id')
    .eq('id', user.id)
    .single();

  return (
    <RoadmapsClient
      roadmaps={roadmaps || []}
      currentRoadmapId={profile?.current_roadmap_id || null}
    />
  );
}