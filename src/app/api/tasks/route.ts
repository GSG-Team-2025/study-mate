
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response';
import { createTaskSchema, updateTaskSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);

        const { data: tasks, error } = await supabase
            .from('tasks')
            .select('*, subject:university_subjects(name, code)')
            .eq('user_id', user.id)
            .order('is_completed', { ascending: true }) // Pending first
            .order('due_date', { ascending: true }); // Soonest first

        if (error) throw error;

        return successResponse(tasks);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);

        const body = await request.json();
        const validated = createTaskSchema.parse(body);

        const { data, error } = await supabase
            .from('tasks')
            .insert({
                ...validated,
                user_id: user.id,
                status: 'Pending',
                is_completed: false
            })
            .select()
            .single();

        if (error) throw error;

        return successResponse(data, undefined, 201);
    } catch (error) {
        return handleApiError(error);
    }
}
