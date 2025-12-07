
import { z } from 'zod';

// Pagination Schema
export const paginationSchema = z.object({
    page: z.coerce.number().min(1).default(1),
    limit: z.coerce.number().min(1).max(100).default(20),
});

// Profile Update Schema
// Profile Update Schema
export const updateProfileSchema = z.object({
    full_name: z.string().min(2).optional(),
    bio: z.string().max(500).optional(),
    university_id: z.string().optional(),
    department: z.string().optional(),
    current_semester: z.number().min(1).max(12).optional(),
    tawjihi_year: z.number().min(2000).max(2100).optional(),
    tawjihi_average: z.number().min(50).max(100).optional(),
    current_roadmap_id: z.string().uuid().optional(),
    social_links: z.record(z.string(), z.string().url()).optional(),
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
