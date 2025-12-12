'use client';

import { useActionState } from 'react';
import { updateProfile } from '@/app/actions/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/utils/cn';
import { Loader2, Save, Github, Linkedin, Twitter, GraduationCap, Shield, Share2 } from 'lucide-react';
import type { Tables } from '@/types/database.types';
import { useFormStatus } from 'react-dom';
import { motion } from 'framer-motion';
import { useState } from 'react';

type Profile = Tables<'profiles'>;

import type { ActionState } from '@/app/actions/profile';

const initialState: ActionState = {
    message: '',
    error: '',
    fieldErrors: {},
};

// Animation Variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

function SubmitButton({ isDisabled = false }: { isDisabled?: boolean }) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            disabled={pending || isDisabled}
            className={cn(
                "w-full sm:w-auto min-w-[140px] shadow-lg transition-all",
                isDisabled
                    ? "bg-muted text-muted-foreground cursor-not-allowed opacity-60 shadow-none hover:shadow-none"
                    : "shadow-primary/20 hover:shadow-primary/30"
            )}
        >
            {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : <><Save className="mr-2 h-4 w-4" /> Save Changes</>}
        </Button>
    );
}

export function GeneralForm({ profile }: { profile: Profile }) {
    const [state, action] = useActionState(updateProfile, initialState);
    const [fullName, setFullName] = useState(profile.full_name || '');
    const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url || '');
    const [bioText, setBioText] = useState(profile.bio || '');

    // Calculate word count
    const wordCount = bioText.trim().split(/\s+/).filter(Boolean).length;
    const isBioValid = wordCount >= 4;
    const isNameValid = fullName.trim().length >= 3;

    // Dirty state tracking
    const isDirty =
        fullName !== (profile.full_name || '') ||
        avatarUrl !== (profile.avatar_url || '') ||
        bioText !== (profile.bio || '');

    const isFormValid = isNameValid && isBioValid;
    const isSubmitDisabled = !isDirty || !isFormValid;

    return (
        <form action={action}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
            >
                <div className="grid gap-6 md:grid-cols-2">
                    <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="full_name">Full Name <span className="text-red-500">*</span></Label>
                        <Input
                            id="full_name"
                            name="full_name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="John Doe"
                            minLength={3}
                            className={cn(
                                "transition-colors",
                                state?.fieldErrors?.full_name ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "bg-muted/30 focus:bg-background"
                            )}
                        />
                        {state?.fieldErrors?.full_name && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{state.fieldErrors.full_name[0]}</p>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="avatar_url">Avatar URL</Label>
                        <Input
                            id="avatar_url"
                            name="avatar_url"
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            placeholder="https://..."
                            className="bg-muted/30 focus:bg-background transition-colors"
                        />
                    </motion.div>
                </div>

                <motion.div variants={itemVariants} className="space-y-2">
                    <div className="flex justify-between">
                        <Label htmlFor="bio">Bio <span className="text-red-500">*</span></Label>
                        <span className={cn("text-xs font-medium", isBioValid ? "text-green-500" : "text-amber-500")}>
                            {wordCount} / 4 words required
                        </span>
                    </div>
                    <Textarea
                        id="bio"
                        name="bio"
                        value={bioText}
                        onChange={(e) => setBioText(e.target.value)}
                        placeholder="Tell us about yourself (e.g., 'I am a Software Engineering student at Harvard University')"
                        className={cn(
                            "min-h-[120px] resize-none transition-colors",
                            !isBioValid && bioText.length > 0 ? "border-amber-500/50 bg-amber-50/10" : "bg-muted/30 focus:bg-background"
                        )}
                    />
                    <p className="text-xs text-muted-foreground">Tip: Mention your university, major, or key interests.</p>
                    {state?.fieldErrors?.bio && <p className="text-xs text-red-500 font-medium animate-in slide-in-from-top-1">{state.fieldErrors.bio[0]}</p>}
                </motion.div>

                {state?.error && (
                    <motion.div variants={itemVariants} className="p-3 rounded-lg bg-red-500/10 text-red-600 border border-red-500/20 text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4" /> {state.error}
                    </motion.div>
                )}
                {state?.success && (
                    <motion.div variants={itemVariants} className="p-3 rounded-lg bg-green-500/10 text-green-600 border border-green-500/20 text-sm flex items-center gap-2">
                        <Shield className="w-4 h-4" /> {state.message}
                    </motion.div>
                )}

                <motion.div variants={itemVariants} className="flex justify-end pt-4 border-t border-dashed">
                    <SubmitButton isDisabled={isSubmitDisabled} />
                </motion.div>
            </motion.div>
        </form>
    );
}

const DEPARTMENTS = [
    "Computer Engineering",
    "Computer Science",
    "Information Technology",
    "Software Engineering",
    "Civil Engineering",
    "Architectural Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Medicine",
    "Business Administration",
    "Accounting",
    "Law",
    "Other"
];

export function AcademicForm({ profile }: { profile: Profile }) {
    const [state, action] = useActionState(updateProfile, initialState);
    const [universityId, setUniversityId] = useState(profile.university_id || '');
    const [department, setDepartment] = useState(profile.department || '');
    const [level, setLevel] = useState(profile.level || 1);
    const [currentSemester, setCurrentSemester] = useState(profile.current_semester || 1);
    const [tawjihiYear, setTawjihiYear] = useState(profile.tawjihi_year || 2020);
    const [tawjihiAverage, setTawjihiAverage] = useState(profile.tawjihi_average?.toString() || '');

    // Logic Check
    const currentYear = new Date().getFullYear();
    const gradYearLag = currentYear - tawjihiYear;
    const isLevelInvalid = gradYearLag < level;

    // Dirty state
    const isDirty =
        universityId !== (profile.university_id || '') ||
        department !== (profile.department || '') ||
        level !== (profile.level || 1) ||
        currentSemester !== (profile.current_semester || 1) ||
        tawjihiYear !== (profile.tawjihi_year || 2020) ||
        tawjihiAverage !== (profile.tawjihi_average?.toString() || '');

    // Validation
    const isFormValid = universityId.length > 0 && department.length > 0;
    const isSubmitDisabled = !isDirty || !isFormValid;

    return (
        <form action={action}>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-6"
            >
                <div className="grid gap-6 md:grid-cols-2">
                    <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="university_id">University ID <span className="text-red-500">*</span></Label>
                        <div className="relative">
                            <Input
                                id="university_id"
                                name="university_id"
                                value={universityId}
                                onChange={(e) => setUniversityId(e.target.value)}
                                placeholder="12345678"
                                className="bg-muted/30 focus:bg-background"
                            />
                        </div>
                        {state?.fieldErrors?.university_id && <p className="text-xs text-red-500 font-medium">{state.fieldErrors.university_id[0]}</p>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="department">Department <span className="text-red-500">*</span></Label>
                        <select
                            id="department"
                            name="department"
                            value={department}
                            onChange={(e) => setDepartment(e.target.value)}
                            className="flex h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            <option value="" disabled>Select Department</option>
                            {DEPARTMENTS.map(dept => (
                                <option key={dept} value={dept}>{dept}</option>
                            ))}
                        </select>
                        {state?.fieldErrors?.department && <p className="text-xs text-red-500 font-medium">{state.fieldErrors.department[0]}</p>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="level">Academic Year (Level) <span className="text-red-500">*</span></Label>
                        <Input
                            type="number"
                            id="level"
                            name="level"
                            value={level}
                            onChange={(e) => setLevel(Number(e.target.value))}
                            min={1} max={7}
                            className="bg-muted/30 focus:bg-background"
                        />
                        {isLevelInvalid && (
                            <p className="text-xs text-amber-500 font-medium">Warning: Level {level} seems too high for Tawjihi Year {tawjihiYear}.</p>
                        )}
                        {state?.fieldErrors?.level && <p className="text-xs text-red-500 font-medium">{state.fieldErrors.level[0]}</p>}
                    </motion.div>

                    <motion.div variants={itemVariants} className="space-y-2">
                        <Label htmlFor="current_semester">Current Semester</Label>
                        <select
                            id="current_semester"
                            name="current_semester"
                            value={currentSemester}
                            onChange={(e) => setCurrentSemester(Number(e.target.value))}
                            className="flex h-10 w-full rounded-md border border-input bg-muted/30 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                        >
                            <option value="1">First Semester</option>
                            <option value="2">Second Semester</option>
                            <option value="3">Summer Semester</option>
                        </select>
                    </motion.div>
                </div>

                <div className="p-6 bg-muted/20 rounded-xl border border-border/50">
                    <h4 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                        <GraduationCap className="w-4 h-4" /> High School Info
                    </h4>
                    <div className="grid gap-6 md:grid-cols-2">
                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="tawjihi_year">Tawjihi Year <span className="text-red-500">*</span></Label>
                            <Input
                                type="number"
                                id="tawjihi_year"
                                name="tawjihi_year"
                                value={tawjihiYear}
                                onChange={(e) => setTawjihiYear(Number(e.target.value))}
                                max={currentYear - 1}
                                min={2000}
                                className="bg-background"
                            />
                            <p className="text-[10px] text-muted-foreground">Must be before {currentYear}</p>
                            {state?.fieldErrors?.tawjihi_year && <p className="text-xs text-red-500 font-medium">{state.fieldErrors.tawjihi_year[0]}</p>}
                        </motion.div>
                        <motion.div variants={itemVariants} className="space-y-2">
                            <Label htmlFor="tawjihi_average">Tawjihi Average <span className="text-red-500">*</span></Label>
                            <div className="relative">
                                <span className="absolute right-3 top-2.5 text-sm text-muted-foreground font-bold">%</span>
                                <Input
                                    type="number"
                                    id="tawjihi_average"
                                    name="tawjihi_average"
                                    value={tawjihiAverage}
                                    onChange={(e) => setTawjihiAverage(e.target.value)}
                                    step="0.01"
                                    min="50"
                                    max="99.99"
                                    placeholder="95.50"
                                    className="bg-background"
                                />
                            </div>
                            <p className="text-[10px] text-muted-foreground">Format: 98.50 (Max 99.99)</p>
                            {state?.fieldErrors?.tawjihi_average && <p className="text-xs text-red-500 font-medium">{state.fieldErrors.tawjihi_average[0]}</p>}
                        </motion.div>
                    </div>
                </div>

                {state?.error && <motion.div variants={itemVariants} className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">{state.error}</motion.div>}
                {state?.success && <motion.div variants={itemVariants} className="p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg">{state.message}</motion.div>}

                <motion.div variants={itemVariants} className="flex justify-end pt-4">
                    <SubmitButton isDisabled={isSubmitDisabled} />
                </motion.div>
            </motion.div>
        </form>
    );
}

const SOCIAL_PLATFORMS = [
    { id: 'github', label: 'GitHub', icon: Github, baseUrl: 'https://github.com/', placeholder: 'username' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, baseUrl: 'https://linkedin.com/in/', placeholder: 'username' },
    { id: 'twitter', label: 'X (Twitter)', icon: Twitter, baseUrl: 'https://x.com/', placeholder: 'username' },
    { id: 'website', label: 'Personal Website', icon: Share2, baseUrl: 'https://', placeholder: 'example.com' },
];

export function SocialForm({ profile }: { profile: Profile }) {
    const [state, action] = useActionState(updateProfile, initialState);
    const [links, setLinks] = useState<Record<string, string>>((profile.social_links as Record<string, string>) || {});

    // Derived state
    const availablePlatforms = SOCIAL_PLATFORMS.filter(p => !(p.id in links));

    // Dirty state tracking
    const initialLinks = (profile.social_links as Record<string, string>) || {};
    const isDirty = JSON.stringify(links) !== JSON.stringify(initialLinks);

    const addLink = (platformId: string) => {
        if (!(platformId in links)) {
            setLinks(prev => ({ ...prev, [platformId]: '' }));
        }
    };

    const removeLink = (platformId: string) => {
        const newLinks = { ...links };
        delete newLinks[platformId];
        setLinks(newLinks);
    };

    const handleChange = (platformId: string, value: string) => {
        setLinks(prev => ({ ...prev, [platformId]: value }));
    };

    const getDisplayValue = (platformId: string, value: string) => {
        const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
        if (!platform || !value) return value;
        // If it sends full URL but we want to show only username/handle for some
        if (platform.baseUrl && value.startsWith(platform.baseUrl)) {
            return value.replace(platform.baseUrl, '');
        }
        return value;
    };

    const handleBlur = (platformId: string) => {
        // Validation/Formatting logic kept simple
        // We already format on render via prefixes, but need to ensure we save clean data?
        // Actually, let's keep the raw value in state as the "partial" or "full" depending on input?
        // Strategy: State always stores the FINAL value to be saved. 
        // But Input shows the "User Typed" part.

        // Wait, to simplify:
        // Let's store exactly what the user types if it's "Website" (full URL).
        // For others, we try to store the full URL but let user type username.

        let value = links[platformId];
        if (!value) return;

        const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
        if (!platform) return;

        // Basic cleanup
        value = value.trim();

        if (platform.id === 'website') {
            if (!value.startsWith('http://') && !value.startsWith('https://')) {
                handleChange(platformId, `https://${value}`);
            }
            return;
        }

        // For others, if user typed full URL, we keep it. 
        // If they typed just username, we append baseUrl ONLY IF it's not already there.
        // But UI shows prefix, so user MIGHT type just username.

        // Actually, if we show prefix visual, the input value should be JUST the username?
        // Better pattern: 
        // - visual prefix: https://github.com/
        // - input value: variable part (username)
        // - hidden input: full joined url (for form submission)
        // BUT `setLinks` updates the state used for the hidden input JSON.
        // So we need to be careful.

        // Let's stick to: Store Full URL in state. 
        // Input logic handles strip/append.

        if (value.startsWith(platform.baseUrl)) {
            // It's already full url, nothing to do
        } else if (value.startsWith('http')) {
            // User pasted some other URL? Let's leave it, maybe validation catches it.
        } else {
            // Assume username
            handleChange(platformId, `${platform.baseUrl}${value.replace(/^@/, '')}`);
        }
    };

    // Helper to get the "username" part for the input field from the full URL in state
    const getInputValue = (platformId: string, fullValue: string) => {
        const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
        if (!platform || platform.id === 'website') return fullValue;

        if (fullValue.startsWith(platform.baseUrl)) {
            return fullValue.slice(platform.baseUrl.length);
        }
        return fullValue;
    };

    const handleInputChange = (platformId: string, inputValue: string) => {
        const platform = SOCIAL_PLATFORMS.find(p => p.id === platformId);
        if (!platform || platform.id === 'website') {
            handleChange(platformId, inputValue);
            return;
        }

        // Smart handling: If user pastes a full URL that matches the platform, use it directly
        const lowerInput = inputValue.toLowerCase();
        const baseDomain = platform.baseUrl.replace('https://', '').replace('http://', '').replace('www.', '');

        // Exact match of start (e.g. "https://github.com/foo")
        if (inputValue.startsWith(platform.baseUrl)) {
            handleChange(platformId, inputValue);
            return;
        }

        // Match without protocol (e.g. "github.com/foo")
        if (lowerInput.startsWith(baseDomain)) {
            handleChange(platformId, `https://${inputValue}`);
            return;
        }

        handleChange(platformId, `${platform.baseUrl}${inputValue}`);
    };

    const isValidUrl = (id: string, url: string) => {
        if (!url) return true;
        try {
            const platform = SOCIAL_PLATFORMS.find(p => p.id === id);
            if (platform && platform.id !== 'website') {
                if (url === platform.baseUrl) return false;
            }

            let toCheck = url;
            if (!toCheck.startsWith('http')) toCheck = `https://${toCheck}`;
            const domain = new URL(toCheck).hostname.replace('www.', '');

            if (platform && platform.id !== 'website') {
                const required = new URL(platform.baseUrl).hostname.replace('www.', '');
                return domain.includes(required) || (id === 'twitter' && domain.includes('twitter.com'));
            }
            return true;
        } catch {
            return false;
        }
    };

    return (
        <form action={action}>
            <input type="hidden" name="social_links" value={JSON.stringify(links)} />
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-8"
            >
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <Label className="block text-base">Active Connections</Label>
                        <span className="text-xs text-muted-foreground">{Object.keys(links).length} / {SOCIAL_PLATFORMS.length} connected</span>
                    </div>

                    <div className="space-y-4">
                        {Object.keys(links).map((key) => {
                            const platform = SOCIAL_PLATFORMS.find(p => p.id === key) || { id: key, label: key, icon: Share2, baseUrl: '', placeholder: '' };
                            const Icon = platform.icon;
                            // Check validity on the FULL value
                            const isError = !isValidUrl(key, links[key]) && links[key] !== platform.baseUrl; // don't show error if just baseurl (empty state essentially)

                            const inputValue = getInputValue(key, links[key] || '');

                            return (
                                <motion.div
                                    key={key}
                                    layout
                                    variants={itemVariants}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className={cn(
                                        "group relative flex flex-col gap-2 p-4 rounded-xl border bg-card transition-all",
                                        "focus-within:border-primary/50 focus-within:shadow-md focus-within:shadow-primary/5",
                                        isError ? "border-red-500/50 bg-red-50/10" : "border-border/50 hover:border-border"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                                            "bg-muted group-hover:bg-primary/10 group-hover:text-primary"
                                        )}>
                                            <Icon className="w-5 h-5" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-center mb-1.5">
                                                <Label className="text-sm font-medium">{platform.label}</Label>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => removeLink(key)}
                                                    className="h-6 w-6 text-muted-foreground hover:text-red-500 -mr-2"
                                                >
                                                    <span className="sr-only">Remove</span>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                                </Button>
                                            </div>

                                            <div className={cn(
                                                "flex items-center w-full rounded-md border bg-background px-3 transition-colors",
                                                "focus-within:ring-1 focus-within:ring-primary focus-within:border-primary"
                                            )}>
                                                {platform.id !== 'website' && (
                                                    <span className="text-muted-foreground text-sm select-none mr-0.5 whitespace-nowrap">
                                                        {platform.baseUrl.replace('https://', '')}
                                                    </span>
                                                )}
                                                <input
                                                    value={inputValue}
                                                    onChange={e => handleInputChange(key, e.target.value)}
                                                    placeholder={platform.placeholder}
                                                    className="flex h-9 w-full rounded-md bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground/50"
                                                    autoFocus={inputValue === ''} // Autofocus if empty (newly added)
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    {isError && links[key] !== '' && links[key] !== platform.baseUrl && (
                                        <p className="text-[11px] text-red-500 font-medium pl-[52px]">
                                            Invalid URL for {platform.label}
                                        </p>
                                    )}
                                </motion.div>
                            );
                        })}

                        {Object.keys(links).length === 0 && (
                            <div className="text-center p-8 border-2 border-dashed border-muted rounded-xl bg-muted/5 text-muted-foreground">
                                <Share2 className="w-10 h-10 mx-auto mb-3 opacity-20" />
                                <p className="text-sm font-medium">No social links added yet</p>
                                <p className="text-xs text-muted-foreground/70 mt-1">Connect your profiles to build your network</p>
                            </div>
                        )}
                    </div>
                </div>

                {availablePlatforms.length > 0 && (
                    <div className="pt-2">
                        <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 block">Add More</Label>
                        <div className="flex flex-wrap gap-3">
                            {availablePlatforms.map(platform => (
                                <Button
                                    key={platform.id}
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addLink(platform.id)}
                                    className="gap-2 h-9 border-dashed border-border hover:border-primary hover:text-primary hover:bg-primary/5 transition-all"
                                >
                                    <platform.icon className="w-4 h-4" />
                                    {platform.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                )}

                {state?.error && <p className="text-sm text-red-500 text-center">{state.error}</p>}
                {state?.success && <p className="text-sm text-green-500 text-center">{state.message}</p>}

                <motion.div variants={itemVariants} className="flex justify-end pt-4 border-t">
                    <SubmitButton isDisabled={!isDirty} />
                </motion.div>
            </motion.div>
        </form>
    );
}
