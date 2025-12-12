import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import MyRoadmap from "@/features/roadmaps/components/StudentRoadmap/StudentRoadmap";

export default async function Page() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user's profile to find their current roadmap
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_roadmap_id')
    .eq('id', user.id)
    .single();

  if (!profile?.current_roadmap_id) {
    return (
      <div className="p-[100px] text-center">
        <h1 className="text-2xl mb-4">No Roadmap Selected</h1>
        <p className="text-text-secondary">Please select a roadmap from the roadmaps page to get started.</p>
      </div>
    );
  }

  const { data: roadmapCourses } = await supabase
    .from('roadmap_courses')
    .select(`
      course_id,
      order_index,
      courses (
        id,
        title,
        description,
        icon,
        estimated_hours
      )
    `)
    .eq('roadmap_id', profile.current_roadmap_id)
    .order('order_index');

  const courseIds = roadmapCourses?.map(rc => rc.course_id).filter(Boolean) || [];

  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, course_id, title, duration, order_index')
    .in('course_id', courseIds)
    .order('order_index');

  // Get user's lesson progress
  const lessonIds = lessons?.map(l => l.id) || [];
  const { data: progress } = await supabase
    .from('user_lesson_progress')
    .select('lesson_id, status')
    .eq('user_id', user.id)
    .in('lesson_id', lessonIds);

  // Format data for component
  const coursesWithProgress = roadmapCourses?.map(rc => {
    const course = rc.courses;
    if (!course) return null;

    const courseLessons = lessons?.filter(l => l.course_id === rc.course_id) || [];
    const completedLessons = courseLessons.filter(lesson =>
      progress?.some(p => p.lesson_id === lesson.id && p.status === 'Completed')
    ).length;

    const totalLessons = courseLessons.length;
    const donePercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    let status = 'not started';
    if (donePercentage === 100) status = 'completed';
    else if (donePercentage > 0) status = 'in progress';

    return {
      id: course.id,
      title: course.title,
      description: course.description || '',
      status,
      donePercentage,
      lessons: courseLessons.map(l => ({
        id: l.id,
        course_id: l.course_id,
        title: l.title,
        duration: l.duration || 0,
        order: l.order_index || 0,
      }))
    };
  }).filter((course): course is NonNullable<typeof course> => course !== null) || [];

  return <MyRoadmap courses={coursesWithProgress} />;
}
