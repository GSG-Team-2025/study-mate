
import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { successResponse, handleApiError } from '@/lib/api-response';

export async function GET(request: NextRequest) {
    try {
        const supabase = await createClient();
        const searchParams = request.nextUrl.searchParams;
        const department = searchParams.get('department');
        const semester = searchParams.get('semester');

        let query = supabase
            .from('university_subjects')
            .select('*')
            .order('name');

        if (department) query = query.eq('department', department);
        if (semester) query = query.eq('semester', semester);

        const { data, error } = await query;

        if (error) throw error;

        return successResponse(data);
    } catch (error) {
        return handleApiError(error);
    }
}
