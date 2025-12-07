'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { User, QrCode, Building2, GraduationCap, Copy, Share2, Eye, EyeOff, ShieldCheck, Mail, Globe, Github, Linkedin, Twitter } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/utils/cn';
import type { Tables } from '@/types/database.types';
import { useState, useEffect } from 'react';
import { calculateProfileCompletion } from '@/features/profile/utils/completion';

type Profile = Tables<'profiles'>;

const SOCIAL_ICONS: Record<string, any> = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
    website: Globe,
};

export function ProfessionalIDCard({ profile }: { profile: Profile }) {
    const [isRevealed, setIsRevealed] = useState(false);
    const completion = calculateProfileCompletion(profile);
    const isComplete = completion.percentage === 100;

    useEffect(() => {
        // Auto-reveal logic on first complete view
        const hasSeen = localStorage.getItem('hasSeenCard');
        if (isComplete && !hasSeen) {
            setIsRevealed(true);
            localStorage.setItem('hasSeenCard', 'true');
        } else if (isComplete) {
            // Default to revealed if complete? or hidden?
            // "تظهر بسكل تلقاأي في أول مرة يتم إكمال البيانات بنسة 100 يعني بعد هيك خلص ما تظهر غير لما تنقر ع العين"
            // So subsequent visits: default hidden.
            setIsRevealed(false);
        }
    }, [isComplete]);

    const handleShare = () => {
        navigator.clipboard.writeText(`Check out my student profile: https://studymate.app/u/${profile.id}`);
        // In a real app, toast notification here
    };

    const toggleReveal = () => setIsRevealed(!isRevealed);

    const socialLinks = (profile.social_links as Record<string, string>) || {};

    return (
        <div className="relative group perspective-1000 w-full max-w-md mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10"
            >
                {/* Control Bar */}
                <div className="absolute -right-12 top-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={toggleReveal}
                        title={isRevealed ? 'Hide Private Details' : 'Reveal Full Card'}
                        className="p-3 bg-background/80 backdrop-blur-md rounded-full shadow-lg border border-border hover:bg-background transition-colors text-primary"
                    >
                        {isRevealed ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                </div>

                <div className={cn(
                    "relative w-full aspect-[1.586] rounded-[2rem] overflow-hidden transition-all duration-500",
                    "shadow-[0_20px_50px_-12px_rgba(0,0,0,0.3)] dark:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]",
                    "border border-white/10 dark:border-white/5",
                    isRevealed ? "ring-2 ring-primary/20 scale-[1.02]" : "hover:scale-[1.01]"
                )}>
                    {/* Backgrounds */}
                    <div className="absolute inset-0 bg-[#0a0a0a] z-0">
                        {/* Abstract Mesh */}
                        <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-primary/20 blur-[120px] rounded-full animate-blob mix-blend-screen"></div>
                        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-violet-500/10 blur-[100px] rounded-full animate-blob animation-delay-2000 mix-blend-screen"></div>

                        {/* Noise Texture */}
                        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 h-full p-8 flex flex-col justify-between text-white">

                        {/* Header */}
                        <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-lg shadow-primary/25 border border-white/10">
                                    <GraduationCap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold tracking-widest text-white leading-none mb-1">STUDY MATE</h3>
                                    <div className="flex items-center gap-1.5">
                                        <div className={`w-1.5 h-1.5 rounded-full ${isComplete ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-amber-500'}`}></div>
                                        <p className="text-[10px] text-white/60 font-medium uppercase tracking-wider">
                                            {isComplete ? 'Verified Student' : 'Incomplete Profile'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-12 h-12 bg-white rounded-xl p-1 shadow-lg">
                                <QrCode className="w-full h-full text-black" />
                            </div>
                        </div>

                        {/* Main Info */}
                        <div className="flex gap-6 items-center mt-2">
                            {/* Avatar */}
                            <div className="relative shrink-0">
                                <div className="w-24 h-24 rounded-full border-[3px] border-white/10 shadow-2xl overflow-hidden bg-zinc-800">
                                    {profile.avatar_url ? (
                                        <Image src={profile.avatar_url} alt={profile.full_name || ''} width={96} height={96} className="object-cover w-full h-full" />
                                    ) : (
                                        <User className="w-full h-full p-5 text-zinc-500" />
                                    )}
                                </div>
                                {isComplete && (
                                    <div className="absolute bottom-0 right-0 w-8 h-8 bg-black/50 backdrop-blur-md rounded-full border border-white/20 flex items-center justify-center text-green-400 shadow-lg">
                                        <ShieldCheck className="w-4 h-4" />
                                    </div>
                                )}
                            </div>

                            {/* Text Info */}
                            <div className="flex-1 min-w-0">
                                <h1 className="text-2xl font-bold text-white truncate mb-1">
                                    {profile.full_name || 'Anonymous User'}
                                </h1>

                                <div className="flex items-center gap-2 text-white/70 text-sm mb-3">
                                    <Building2 className="w-3.5 h-3.5" />
                                    <span className="truncate">{profile.department || 'No Department Selected'}</span>
                                </div>

                                {/* Chips */}
                                <div className="flex flex-wrap gap-2">
                                    <div className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 backdrop-blur-sm text-[10px] uppercase font-bold tracking-wider text-white/80">
                                        ID: <span className={isRevealed ? "" : "blur-sm"}>{isRevealed ? (profile.university_id || 'N/A') : '••••••••'}</span>
                                    </div>
                                    <div className="px-2.5 py-1 rounded-md bg-white/5 border border-white/5 backdrop-blur-sm text-[10px] uppercase font-bold tracking-wider text-primary-foreground/80 bg-primary/20 border-primary/20">
                                        Level {profile.level || '?'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer / Stats */}
                        <div className="mt-auto grid grid-cols-[1fr_auto] gap-6 items-end">
                            {/* Academic Stats */}
                            <div className="grid grid-cols-2 gap-8 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Tawjihi</p>
                                    <p className={cn("text-xl font-bold tabular-nums text-white", !isRevealed && "blur-md")}>
                                        {profile.tawjihi_average ? profile.tawjihi_average + '%' : '--'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Year</p>
                                    <p className={cn("text-xl font-bold tabular-nums text-white", !isRevealed && "blur-md")}>
                                        {profile.tawjihi_year || '----'}
                                    </p>
                                </div>
                            </div>

                            {/* Social Actions */}
                            <div className="flex gap-2">
                                {Object.keys(socialLinks).map(key => {
                                    const Icon = SOCIAL_ICONS[key] || Globe;
                                    const url = socialLinks[key];
                                    if (!url) return null;

                                    return (
                                        <a
                                            key={key}
                                            href={isRevealed ? url : undefined}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className={cn(
                                                "w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 hover:scale-110",
                                                !isRevealed && "opacity-50 cursor-not-allowed"
                                            )}
                                            onClick={(e) => !isRevealed && e.preventDefault()}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </a>
                                    );
                                })}
                                <button onClick={handleShare} className="w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white text-black hover:scale-110 shadow-lg shadow-white/10">
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                    </div>

                    {/* Security Hologram Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-20" style={{ mixBlendMode: 'overlay' }} />
                </div>
            </motion.div>
        </div>
    );
}
