'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, GraduationCap, Share2, Shield, LayoutGrid, ChevronRight, CheckCircle2, X } from 'lucide-react';
import { cn } from '@/utils/cn';
import { CompletionWidget } from './CompletionWidget';
import { GeneralForm, AcademicForm, SocialForm } from './ProfileForms';
import { SecuritySettings } from './SecuritySettings';
import { ProfessionalIDCard } from './ProfessionalIDCard';
import type { Tables } from '@/types/database.types';
import { Button } from '@/components/ui/button';

type Profile = Tables<'profiles'>;

const tabs = [
    { id: 'general', label: 'General', icon: User, description: 'Basic info & bio', component: GeneralForm },
    { id: 'academic', label: 'Academic', icon: GraduationCap, description: 'University details', component: AcademicForm },
    { id: 'social', label: 'Social', icon: Share2, description: 'Links & connections', component: SocialForm },
    { id: 'security', label: 'Security', icon: Shield, description: 'Password & privacy', component: SecuritySettings },
];

export function SettingsLayout({ profile, completion }: { profile: Profile, completion: any }) {
    const [activeTab, setActiveTab] = useState('general');
    const [showIdCard, setShowIdCard] = useState(false);
    const [hasCelebrated, setHasCelebrated] = useState(false);

    const ActiveComponent = tabs.find(t => t.id === activeTab)?.component || GeneralForm;
    const isComplete = completion.percentage === 100;

    // Auto-show ID card on VERY FIRST completion
    useEffect(() => {
        if (isComplete && !hasCelebrated) {
            setShowIdCard(true);
            setHasCelebrated(true);
        }
    }, [isComplete, hasCelebrated]);

    return (
        <div className="space-y-6">
            {/* ID Card Modal/Popup */}
            <AnimatePresence>
                {showIdCard && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowIdCard(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-card border border-border rounded-3xl shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-6 text-center space-y-2 border-b border-border/50 bg-muted/20">
                                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                                    Official Student ID
                                </h3>
                                <p className="text-muted-foreground text-sm">
                                    Your verified academic identity
                                </p>
                                <button
                                    onClick={() => setShowIdCard(false)}
                                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-8 bg-gradient-to-b from-background to-muted/20">
                                <ProfessionalIDCard profile={profile} />

                                <div className="mt-8 flex justify-center">
                                    <Button onClick={() => setShowIdCard(false)} variant="outline">
                                        Close
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/90 via-primary to-blue-800 text-white shadow-2xl">
                <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/20">
                            <span className={cn("flex h-2 w-2 rounded-full", isComplete ? "bg-green-400 animate-pulse" : "bg-amber-400")}></span>
                            {isComplete ? "Verified Student" : "Profile In Progress"}
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Profile Settings</h1>
                        <p className="text-blue-100 max-w-xl text-lg">
                            {isComplete
                                ? "Your profile is fully optimized. You're ready to rock!"
                                : "Customize your academic presence and manage your account details."}
                        </p>
                    </div>
                    {/* Completion Mini-Stat for Hero */}
                    <div className="hidden md:flex flex-col items-end">
                        <div className="text-4xl font-bold">{completion.percentage}%</div>
                        <div className="text-sm text-blue-200">Profile Strength</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Navigation */}
                <aside className="w-full lg:w-72 shrink-0 space-y-6">
                    <nav className="flex flex-col gap-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={cn(
                                    "group relative flex items-center gap-4 px-4 py-4 rounded-xl transition-all duration-300 text-left border overflow-hidden",
                                    activeTab === tab.id
                                        ? "bg-white dark:bg-zinc-900 border-primary/20 shadow-lg"
                                        : "bg-transparent border-transparent hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                )}
                            >
                                {/* Active Indicator Bar */}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute left-0 top-0 bottom-0 w-1 bg-primary"
                                    />
                                )}

                                <div className={cn(
                                    "p-2 rounded-lg transition-colors",
                                    activeTab === tab.id ? "bg-primary/10 text-primary" : "bg-muted group-hover:bg-muted/80"
                                )}>
                                    <tab.icon className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <div className="font-semibold">{tab.label}</div>
                                    <div className="text-xs text-muted-foreground font-normal">{tab.description}</div>
                                </div>
                                {activeTab === tab.id && (
                                    <ChevronRight className="w-4 h-4 text-primary animate-in slide-in-from-left-2" />
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="hidden lg:block">
                        <CompletionWidget
                            percentage={completion.percentage}
                            missingFields={completion.missingFields}
                        />
                    </div>
                </aside>

                {/* Main Content Area */}
                <main className="flex-1 min-w-0 space-y-8">
                    {/* Mobile Completion Widget */}
                    <div className="lg:hidden mb-6">
                        <CompletionWidget
                            percentage={completion.percentage}
                            missingFields={completion.missingFields}
                        />
                    </div>

                    <div className="bg-card border border-border/60 rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden">
                        <div className="mb-8 border-b pb-6">
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                {tabs.find(t => t.id === activeTab)?.label}
                            </h2>
                            <p className="text-muted-foreground mt-1">
                                Manage your {tabs.find(t => t.id === activeTab)?.label.toLowerCase()} information.
                            </p>
                        </div>

                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <ActiveComponent profile={profile} />
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </main>
            </div>
        </div>
    );
}
