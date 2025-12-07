
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();

        // Fetch Roadmaps
        const { data, error } = await supabase
            .from('roadmaps')
            .select('*')
            .eq('is_active', true)
            .order('title');

        if (error) throw error;

        return successResponse(data);
    } catch (error) {
        return handleApiError(error);
    }
}
