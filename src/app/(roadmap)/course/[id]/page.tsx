import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Course from "@/features/courses/components/Course";

export default async function CoursePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Fetch Course
    const { data: course, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('id', id)
        .single();

    if (courseError || !course) {
        notFound();
    }

    // Fetch Lessons
    const { data: lessons } = await supabase
        .from('lessons')
        .select('id, title, duration, order_index')
        .eq('course_id', id)
        .order('order_index');

    // Fetch Progress
    const { data: progress } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id, status')
        .eq('user_id', user.id)
        .in('lesson_id', lessons?.map(l => l.id) || []);

    return (
        <div style={{ padding: "100px" }}>
            <Course
                id={course.id}
                courseTitle={course.title}
                lessons={lessons || []}
                progress={progress || []}
            />
        </div>
    );
}