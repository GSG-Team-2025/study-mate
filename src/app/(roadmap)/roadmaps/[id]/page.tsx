import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";

export default async function RoadmapDetailsPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch roadmap details
  const { data: roadmap, error } = await supabase
    .from('roadmaps')
    .select('id, title, description, icon, color')
    .eq('id', id)
    .single();

  if (error || !roadmap) {
    notFound();
  }

  // Fetch courses for this roadmap
  const { data: roadmapCourses } = await supabase
    .from('roadmap_courses')
    .select(`
      order_index,
      courses (
        id,
        title,
        description
      )
    `)
    .eq('roadmap_id', id)
    .order('order_index');

  const courses = (roadmapCourses
    ?.map(rc => rc.courses)
    .filter((course): course is NonNullable<typeof course> => course !== null)
    || []);

  return (
    <div className="p-[100px] flex flex-col gap-[50px]">
      <div className="flex flex-col gap-5 items-center justify-center">
        <h1 className="text-6xl">{roadmap.icon || '📚'}</h1>
        <h1 className="text-4xl font-bold text-text-primary">
          {roadmap.title} Roadmap
        </h1>
      </div>

      <div className="prose prose-lg max-w-none">
        <p className="text-lg text-text-secondary leading-relaxed">
          {roadmap.description || 'No description available for this roadmap.'}
        </p>
      </div>

      {courses.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Courses in this Roadmap</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses.map((course, index) => (
              <div
                key={course.id}
                className="p-6 bg-card-bg border border-border rounded-lg hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                    <p className="text-text-secondary text-sm">{course.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-between w-full mt-8">
        <Link href="/roadmaps" className="text-primary underline font-medium">
          Back to Roadmaps
        </Link>
        <Link href="/student" className="text-primary underline font-medium">
          Continue with {roadmap.title}
        </Link>
      </div>
    </div>
  );
}
