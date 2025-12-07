import { Sidebar } from '@/components/ui/dashboard/sidebar'
import { getUserMetadata, requireAuth } from '@/lib/auth/helpers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { calculateProfileCompletion } from '@/features/profile/utils/completion'
import { CompletionWidget } from '@/components/settings/CompletionWidget'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // 1. Enforce authentication
    const user = await requireAuth()

    // 2. Fetch user metadata to display name
    const userMeta = await getUserMetadata()

    if (!userMeta) {
        // If auth passed but metadata failed (rare, but good to handle)
        // Optionally log the user out or redirect to login
        // For simplicity, we redirect to login to restart the session
        redirect('/auth/login')
    }

    // 3. Fetch full profile for completion status
    const supabase = await createClient()
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const completion = profile ? calculateProfileCompletion(profile) : { percentage: 0, missingFields: [] }

    // Determine the most appropriate display name
    const displayName = userMeta.fullName || userMeta.email?.split('@')[0] || 'User'

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar (Fixed width on large screens) */}
            <Sidebar userName={displayName} />

            {/* Main Content Area (Takes remaining width and adds margin for sidebar) */}
            <main className="flex-grow p-4 lg:ml-64 lg:p-8 relative">
                {children}

                {/* Floating Completion Widget (Visible if < 100%) */}
                {completion.percentage < 100 && (
                    <CompletionWidget
                        percentage={completion.percentage}
                        missingFields={completion.missingFields}
                        compact={true}
                    />
                )}
            </main>
        </div>
    )
}