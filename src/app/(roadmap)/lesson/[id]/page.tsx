import { createClient } from '@/lib/supabase/server';
import Lesson from "@/features/lessons/components/Lesson";
import { notFound, redirect } from "next/navigation";

export default async function LessonPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/login');
    }

    // Resolve params if it's a promise (Next.js 15+ change, just to be safe or handle string directly)
    // Actually in Next 14/15 params is sometimes a Promise in types but usually object. 
    // Let's assume standard object for now or handle simple access. 
    // Wait, the user's previous code was using `useParams`, so this is a migration from client to server page.
    const lessonId = params.id;

    // Fetch Lesson
    const { data: lesson, error: lessonError } = await supabase
        .from('lessons')
        .select(`
            *,
            course:courses(*)
        `)
        .eq('id', lessonId)
        .single();

    if (lessonError || !lesson) {
        notFound();
    }

    // Fetch User Progress for this lesson
    const { data: progress } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('lesson_id', lessonId)
        .single();

    // Fetch all lessons in the course for sidebar
    const { data: courseLessons } = await supabase
        .from('lessons')
        .select('id, title, duration, order_index')
        .eq('course_id', lesson.course_id ?? '')
        .order('order_index');

    // Fetch progress for all lessons in this course to show completion status in sidebar
    const { data: allProgress } = await supabase
        .from('user_lesson_progress')
        .select('lesson_id, status')
        .eq('user_id', user.id)
        .in('lesson_id', courseLessons?.map(l => l.id) || []);


    return (
        <Lesson
            lesson={lesson}
            course={lesson.course}
            userProgress={progress}
            courseLessons={courseLessons || []}
            allProgress={allProgress || []}
        />
    )
}