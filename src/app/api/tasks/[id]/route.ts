
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api/response';
import { updateTaskSchema } from '@/lib/validators';

export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const { id } = params;
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);

        const body = await request.json();
        const validated = updateTaskSchema.parse(body);

        const { data, error } = await supabase
            .from('tasks')
            .update(validated)
            .eq('id', id)
            .eq('user_id', user.id) // Security: Only own tasks
            .select()
            .single();

        if (error) throw error;

        return successResponse(data);
    } catch (error) {
        return handleApiError(error);
    }
}
