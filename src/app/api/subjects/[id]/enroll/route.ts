
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';

export async function POST(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const { id: subjectId } = params;
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);

        const body = await request.json();
        const semester = body.semester || 'Fall2024'; // Default or from body

        // Check if already enrolled
        const { data: existing } = await supabase
            .from('subject_enrollments')
            .select('id')
            .eq('student_id', user.id)
            .eq('subject_id', subjectId)
            .single();

        if (existing) {
            return errorResponse('Already enrolled in this subject', 'ALREADY_ENROLLED', 400);
        }

        const { data, error } = await supabase
            .from('subject_enrollments')
            .insert({
                student_id: user.id,
                subject_id: subjectId,
                semester: semester,
                status: 'Active'
            })
            .select()
            .single();

        if (error) throw error;

        return successResponse(data, undefined, 201);
    } catch (error) {
        return handleApiError(error);
    }
}

// Update Grade / Status
export async function PATCH(
    request: NextRequest,
    props: { params: Promise<{ id: string }> }
) {
    try {
        const params = await props.params;
        const { id: subjectId } = params;
        const supabase = await createClient();

        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);

        const body = await request.json();
        const { grade, status } = body;

        // Note: Using student_id + subject_id to find the record
        const { data, error } = await supabase
            .from('subject_enrollments')
            .update({ grade, status })
            .eq('student_id', user.id)
            .eq('subject_id', subjectId)
            .select()
            .single();

        if (error) throw error;

        return successResponse(data);
    } catch (error) {
        return handleApiError(error);
    }
}
