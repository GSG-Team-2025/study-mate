import type { Tables } from '@/types/database.types';

type Profile = Tables<'profiles'>;

interface CompletionResult {
    percentage: number;
    missingFields: string[];
}

export function calculateProfileCompletion(profile: Profile): CompletionResult {
    if (!profile) {
        return { percentage: 0, missingFields: ['Profile not found'] };
    }

    const fields = [
        { key: 'full_name', label: 'Full Name', weight: 10 },
        { key: 'avatar_url', label: 'Profile Picture', weight: 10 },
        { key: 'bio', label: 'Bio', weight: 10 },
        { key: 'university_id', label: 'University ID', weight: 10 },
        { key: 'department', label: 'Department', weight: 15 },
        { key: 'current_semester', label: 'Current Semester', weight: 10 },
        { key: 'level', label: 'Academic Level', weight: 10 },
        { key: 'social_links', label: 'Social Links', weight: 10 },
        { key: 'tawjihi_average', label: 'Tawjihi Average', weight: 15 },
    ];

    let score = 0;
    const missingFields: string[] = [];

    for (const field of fields) {
        const value = profile[field.key as keyof Profile];

        if (value !== null && value !== undefined && value !== '') {
            // Special check for empty object/array if needed, but for now simple null/empty check
            if (field.key === 'social_links' && Object.keys(value as object).length === 0) {
                missingFields.push(field.label);
                continue;
            }
            score += field.weight;
        } else {
            missingFields.push(field.label);
        }
    }

    // Normalize to 100% just in case weights don't exactly sum to 100 (they sum to 100 here)
    return {
        percentage: Math.min(score, 100),
        missingFields,
    };
}
