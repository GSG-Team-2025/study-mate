
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { updateProfileSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
        }

        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*, enrollments:subject_enrollments(*, subject:university_subjects(*))')
            .eq('id', user.id)
            .single();

        if (error) {
            return errorResponse('Profile not found', 'NOT_FOUND', 404);
        }

        return successResponse(profile);
    } catch (error) {
        return handleApiError(error);
    }
}

export async function PUT(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
        }

        const body = await request.json();
        const validatedData = updateProfileSchema.parse(body);

        const { data: updatedProfile, error } = await supabase
            .from('profiles')
            .update(validatedData as any)
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return successResponse(updatedProfile);
    } catch (error) {
        return handleApiError(error);
    }
}
