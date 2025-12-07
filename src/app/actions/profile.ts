'use server'

import { createClient } from '@/lib/supabase/server'
import { updateProfileSchema } from '@/lib/validators/index'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

export type ActionState = {
    success?: boolean
    error?: string
    fieldErrors?: Record<string, string[] | undefined>
    message?: string
}

export async function updateProfile(
    prevState: ActionState,
    formData: FormData
): Promise<ActionState> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, error: 'You must be logged in to update your profile.' }
    }

    // 1. Extract and Parse Data
    const socialLinksRaw = formData.get('social_links')
    let socialLinks = {}
    if (typeof socialLinksRaw === 'string' && socialLinksRaw.length > 0) {
        try {
            socialLinks = JSON.parse(socialLinksRaw)
        } catch (e) {
            // invalid json, ignore
        }
    }

    const rawData = {
        full_name: formData.get('full_name') || undefined,
        bio: formData.get('bio') || undefined,
        university_id: formData.get('university_id') || undefined,
        department: formData.get('department') || undefined,
        current_semester: formData.get('current_semester') ? Number(formData.get('current_semester')) : undefined,
        level: formData.get('level') ? Number(formData.get('level')) : undefined,
        tawjihi_year: formData.get('tawjihi_year') ? Number(formData.get('tawjihi_year')) : undefined,
        tawjihi_average: formData.get('tawjihi_average') ? Number(formData.get('tawjihi_average')) : undefined,
        avatar_url: formData.get('avatar_url') || undefined,
        social_links: Object.keys(socialLinks).length > 0 ? socialLinks : undefined
    }

    const validatedFields = updateProfileSchema.safeParse(rawData)

    if (!validatedFields.success) {
        return {
            success: false,
            error: 'Validation failed. Please check the fields.',
            fieldErrors: validatedFields.error.flatten().fieldErrors,
        }
    }

    // Logic Check: Level vs Tawjihi Year
    if (validatedFields.data.tawjihi_year && validatedFields.data.level) {
        const currentYear = new Date().getFullYear();
        const yearDifference = currentYear - validatedFields.data.tawjihi_year;

        if (yearDifference < validatedFields.data.level) {
            return {
                success: false,
                error: `Academic logic error: You cannot be in Level ${validatedFields.data.level} if you graduated Tawjihi in ${validatedFields.data.tawjihi_year}. Invalid timeline.`,
                fieldErrors: {
                    level: ['Level implies an earlier Tawjihi year'],
                    tawjihi_year: ['Year implies a lower Academic Level']
                }
            }
        }
    }

    // 2. Database Update
    const { error } = await supabase
        .from('profiles')
        .update(validatedFields.data)
        .eq('id', user.id)

    if (error) {
        console.error('Profile update error:', error)
        return { success: false, error: 'Failed to update user profile.' }
    }

    // 3. Update Sync (optional, if using full_name in metadata)
    if (validatedFields.data.full_name) {
        await supabase.auth.updateUser({
            data: { full_name: validatedFields.data.full_name }
        })
    }

    revalidatePath('/dashboard/settings')
    revalidatePath('/dashboard') // Update dashboard for completion widget

    return { success: true, message: 'Profile updated successfully!' }
}
