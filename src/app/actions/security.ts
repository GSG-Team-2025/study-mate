'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const passwordSchema = z.object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string()
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword']
});

export async function updatePassword(_prevState: any, formData: FormData) {
    try {
        const supabase = await createClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
            return {
                success: false,
                error: 'Not authenticated',
                fieldErrors: {}
            };
        }

        const newPassword = formData.get('newPassword') as string;
        const confirmPassword = formData.get('confirmPassword') as string;

        // Validate
        const validation = passwordSchema.safeParse({ newPassword, confirmPassword });

        if (!validation.success) {
            return {
                success: false,
                error: 'Validation failed',
                fieldErrors: validation.error.flatten().fieldErrors
            };
        }

        // Update password
        const { error } = await supabase.auth.updateUser({
            password: newPassword
        });

        if (error) {
            return {
                success: false,
                error: error.message,
                fieldErrors: {}
            };
        }

        return {
            success: true,
            message: 'Password updated successfully',
            error: '',
            fieldErrors: {}
        };

    } catch (error) {
        return {
            success: false,
            error: 'An unexpected error occurred',
            fieldErrors: {}
        };
    }
}
