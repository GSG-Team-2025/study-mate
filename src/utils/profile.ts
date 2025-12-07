import type { Tables } from '@/types/database.types';

type Profile = Tables<'profiles'>;

export function calculateProfileCompletion(profile: Profile): number {
    let score = 0;
    let total = 0;

    // Fields to check
    const fields: (keyof Profile)[] = [
        'full_name',
        'avatar_url',
        'bio',
        'university_id',
        'department',
        'level',
        'tawjihi_year',
        'tawjihi_average'
    ];

    fields.forEach(field => {
        total++;
        if (profile[field]) score++;
    });

    // Check social links (bonus/required?) - Let's count them as one item "Social Presence"
    total++;
    const links = profile.social_links as Record<string, string>;
    if (links && Object.keys(links).length > 0) {
        score++;
    }

    return Math.round((score / total) * 100);
}
