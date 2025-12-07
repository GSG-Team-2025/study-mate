
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function GET(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const { id } = params;
        const supabase = await createClient();

        // Fetch Roadmap with ordered Courses
        const { data, error } = await supabase
            .from('roadmaps')
            .select(`
                *,
                courses:roadmap_courses(
                    order_index,
                    course:courses(*)
                )
            `)
            .eq('id', id)
            .single();

        if (error) {
            return errorResponse('Roadmap not found', 'NOT_FOUND', 404);
        }

        // Sort courses by order_index
        // @ts-ignore
        if (data.courses) {
            // @ts-ignore
            data.courses.sort((a, b) => (a.order_index || 0) - (b.order_index || 0));
        }

        return successResponse(data);

    } catch (error) {
        return handleApiError(error);
    }
}
