import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { calculateProfileCompletion } from '@/features/profile/utils/completion';

export const metadata = {
    title: 'Profile Settings | Study Mate',
    description: 'Manage your profile, academic details, and preferences.',
};

export default async function SettingsPage() {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        redirect('/auth/login');
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!profile) {
        // Handle edge case where auth user exists but profile doesn't (shouldn't happen with triggers)
        redirect('/auth/login');
    }

    const completion = calculateProfileCompletion(profile);

    return (
        <div className="container mx-auto py-8 px-4 max-w-6xl">
            <SettingsLayout profile={profile} completion={completion} />
        </div>
    );
}
