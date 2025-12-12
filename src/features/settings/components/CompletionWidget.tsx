'use client';

import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/utils/cn';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
    percentage: number;
    missingFields: string[];
    compact?: boolean; // For dashboard widget
}

export function CompletionWidget({ percentage, missingFields, compact = false }: Props) {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (compact && percentage < 100) {
            // Show only for 5 seconds on mount
            setIsVisible(true);
            const timer = setTimeout(() => setIsVisible(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [compact, percentage]);

    const radius = 30;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    const color = percentage < 50 ? 'text-red-500' : percentage < 80 ? 'text-amber-500' : 'text-green-500';
    const bgColor = percentage < 50 ? 'bg-red-500/10' : percentage < 80 ? 'bg-amber-500/10' : 'bg-green-500/10';

    if (compact) {
        return (
            <AnimatePresence>
                {isVisible && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="fixed bottom-6 right-6 z-50 pointer-events-none"
                    >
                        <div className="bg-popover/80 border border-border/50 shadow-2xl rounded-full p-2 backdrop-blur-xl flex items-center gap-4 pointer-events-auto pr-6">
                            <div className="relative flex items-center justify-center shrink-0">
                                <svg className="transform -rotate-90 w-12 h-12">
                                    <circle
                                        className="text-muted/20"
                                        strokeWidth="4"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r={20}
                                        cx="24"
                                        cy="24"
                                    />
                                    <circle
                                        className={cn("transition-all duration-1000 ease-out", color)}
                                        strokeWidth="4"
                                        strokeDasharray={2 * Math.PI * 20}
                                        strokeDashoffset={2 * Math.PI * 20 - (percentage / 100) * (2 * Math.PI * 20)}
                                        strokeLinecap="round"
                                        stroke="currentColor"
                                        fill="transparent"
                                        r={20}
                                        cx="24"
                                        cy="24"
                                    />
                                </svg>
                                <span className="absolute text-[10px] font-bold">{percentage}%</span>
                            </div>

                            <div className="flex flex-col">
                                <span className="text-xs font-semibold">Finish Setup</span>
                                <Link href="/dashboard/settings" className="text-[10px] text-primary hover:underline flex items-center">
                                    Continue <ArrowRight className="w-2 h-2 ml-1" />
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        );
    }

    // Full version (for settings page)
    return (
        <div className={cn("rounded-xl border border-border/50 p-6 shadow-sm", bgColor)}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-sm text-foreground">Profile Completion</h3>
                {percentage === 100 ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-1 text-xs font-medium text-green-600">
                        <CheckCircle2 className="w-3 h-3" /> Complete
                    </span>
                ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600">
                        <AlertCircle className="w-3 h-3" /> In Progress
                    </span>
                )}
            </div>

            {/* Progress Circle */}
            <div className="flex items-center gap-6 mb-4">
                <div className="relative flex items-center justify-center shrink-0">
                    <svg className="transform -rotate-90 w-24 h-24">
                        <circle
                            className="text-muted/20"
                            strokeWidth="6"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="48"
                            cy="48"
                        />
                        <circle
                            className={cn("transition-all duration-1000 ease-out", color)}
                            strokeWidth="6"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="48"
                            cy="48"
                        />
                    </svg>
                    <span className="absolute text-2xl font-bold">{percentage}%</span>
                </div>

                <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">
                        {percentage === 100
                            ? "Your profile is complete! 🎉"
                            : `${missingFields.length} field${missingFields.length !== 1 ? 's' : ''} remaining`}
                    </p>
                    <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                        <div
                            className={cn("h-full transition-all duration-1000", color.replace('text-', 'bg-'))}
                            style={{ width: `${percentage}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Missing Fields */}
            {missingFields.length > 0 && (
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Missing Fields:</p>
                    <ul className="space-y-1">
                        {missingFields.slice(0, 5).map((field, idx) => (
                            <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40" />
                                {field}
                            </li>
                        ))}
                        {missingFields.length > 5 && (
                            <li className="text-sm text-muted-foreground italic">
                                and {missingFields.length - 5} more...
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
}
