
import { z } from 'zod';

// Pagination Schema
export const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
});

// Profile Update Schema
// Profile Update Schema
export const updateProfileSchema = z.object({
    full_name: z.string().min(3, "Full name must be at least 3 characters").optional(),
    bio: z.string()
        .refine((val) => !val || val.trim().split(/\s+/).length >= 4, {
            message: "Bio must contain at least 4 words"
        })
        .optional(),
    university_id: z.string()
        .regex(/^\d+$/, "University ID must contain only numbers")
        .min(8, "University ID must be at least 8 digits")
        .optional(),
    department: z.string().min(1, "Department is required").optional(),
    current_semester: z.number().min(1).max(3).optional(), // 1, 2, or 3 (Summer)
    level: z.number().min(1).max(7).optional(),
    tawjihi_year: z.number()
        .max(new Date().getFullYear() - 1, "Tawjihi year must be before the current year")
        .min(2000, "Invalid year")
        .optional(),
    tawjihi_average: z.number()
        .min(50, "Average must be at least 50")
        .max(99.99, "Average must be less than 100")
        .refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val.toString()), {
            message: "Average format must be XX.XX (max 2 decimal places)"
        })
        .optional(),
    current_roadmap_id: z.string().uuid().optional(),
    social_links: z.record(z.string(), z.string().url("Must be a valid URL"))
        .refine((links) => {
            const rules: Record<string, string> = {
                github: 'github.com',
                linkedin: 'linkedin.com',
                twitter: 'x.com', // or twitter.com, but let's stick to strict checking if we can, or just 'x.com' / 'twitter.com'
                instagram: 'instagram.com',
                facebook: 'facebook.com'
            };

            for (const [platform, url] of Object.entries(links)) {
                if (rules[platform]) {
                    try {
                        const domain = new URL(url).hostname;
                        if (!domain.includes(rules[platform]) && !domain.includes(rules[platform].replace('x.com', 'twitter.com'))) {
                            return false;
                        }
                    } catch (e) { return false; }
                }
            }
            return true;
        }, {
            message: "One or more links do not match their platform's domain (e.g., GitHub link must match github.com)"
        })
        .optional(),
    avatar_url: z.string().url().optional(),
});

// Course Filter Schema
export const courseFilterSchema = paginationSchema.extend({
    level: z.enum(['Beginner', 'Intermediate', 'Advanced', 'Expert']).optional(),
    search: z.string().optional(),
    category_id: z.string().uuid().optional(),
});

// Resource Schema
export const resourceFilterSchema = paginationSchema.extend({
    subjectId: z.string().uuid(),
    type: z.enum(['Folder', 'File']).optional(),
    category: z.enum(['Books', 'Assignments', 'Labs', 'Slides', 'Projects', 'Other']).optional(),
});

export const createResourceSchema = z.object({
    subject_id: z.string().uuid(),
    title: z.string().min(3),
    description: z.string().optional(),
    type: z.enum(['Folder', 'File']),
    category: z.enum(['Books', 'Assignments', 'Labs', 'Slides', 'Projects', 'Other']).optional(),
    file_url: z.string().url().optional(),
    file_size: z.number().optional(),
    file_extension: z.string().optional(),
    mime_type: z.string().optional(),
});

// Task Schema
export const createTaskSchema = z.object({
    title: z.string().min(3),
    description: z.string().optional(),
    subject_id: z.string().uuid().optional(), // Can look up subjects to link
    due_date: z.string().datetime().optional(),
    priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
});

export const updateTaskSchema = createTaskSchema.partial().extend({
    is_completed: z.boolean().optional(),
    status: z.enum(['Pending', 'InProgress', 'Completed']).optional(),
});
