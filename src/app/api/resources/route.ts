
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, errorResponse, handleApiError } from '@/lib/api-response';
import { createResourceSchema, resourceFilterSchema } from '@/lib/validators';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const searchParams = Object.fromEntries(request.nextUrl.searchParams);

        const validated = resourceFilterSchema.safeParse(searchParams);
        if (!validated.success) {
            return errorResponse('Invalid Filters', 'VALIDATION_ERROR', 400, validated.error.errors);
        }

        const { subjectId, type, category, page, limit } = validated.data;
        const offset = (page - 1) * limit;

        let query = supabase
            .from('subject_resources')
            .select(`
                *,
                uploader:profiles(full_name, avatar_url)
            `, { count: 'exact' })
            .eq('subject_id', subjectId);

        if (type) query = query.eq('type', type);
        if (category) query = query.eq('category', category);

        query = query
            .range(offset, offset + limit - 1)
            .order('is_pinned', { ascending: false }) // Pinned first
            .order('created_at', { ascending: false });

        const { data, count, error } = await query;

        if (error) throw error;

        return successResponse(data, {
            page,
            limit,
            total: count || 0,
            totalPages: Math.ceil((count || 0) / limit)
        });

    } catch (error) {
        return handleApiError(error);
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return errorResponse('Unauthorized', 'UNAUTHORIZED', 401);
        }

        const body = await request.json();
        const validatedData = createResourceSchema.parse(body);

        const { data, error } = await supabase
            .from('subject_resources')
            .insert({
                ...validatedData,
                uploader_id: user.id
            })
            .select()
            .single();

        if (error) throw error;

        // Gamification: Award XP for uploading (Optional logic here)
        // await awardXP(user.id, 10);

        return successResponse(data, undefined, 201);

    } catch (error) {
        return handleApiError(error);
    }
}
