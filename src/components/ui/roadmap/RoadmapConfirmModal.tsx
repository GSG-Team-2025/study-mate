"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Course = {
    id: string;
    title: string;
    description: string | null;
};

type RoadmapConfirmModalProps = {
    roadmapId: string;
    roadmapTitle: string;
    roadmapIcon: string | null;
    roadmapDescription: string | null;
    courses: Course[];
    isOpen: boolean;
    onClose: () => void;
    hasCurrentRoadmap: boolean;
};

export default function RoadmapConfirmModal({
    roadmapId,
    roadmapTitle,
    roadmapIcon,
    roadmapDescription,
    courses,
    isOpen,
    onClose,
    hasCurrentRoadmap
}: RoadmapConfirmModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ current_roadmap_id: roadmapId })
            });

            if (response.ok) {
                router.push("/student");
                router.refresh();
            } else {
                alert("Failed to update roadmap. Please try again.");
            }
        } catch (error) {
            console.error("Error updating roadmap:", error);
            alert("An unexpected error occurred. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center 
            bg-black/80 backdrop-blur-md p-4 animate-fadeIn">

            <div className="
                bg-[#0E0E10] 
                border border-[#2A2A2D] 
                rounded-2xl shadow-2xl 
                max-w-3xl w-full 
                max-h-[90vh] 
                overflow-y-auto 
                animate-scaleIn
                ">

                {/* Header */}
                <div className="sticky top-0 
                    bg-[#1A1A1C] 
                    border-b border-[#2A2A2D] 
                    p-6 flex items-center justify-between
                    shadow-md">

                    <div className="flex items-center gap-4">
                        <span className="text-5xl drop-shadow">{roadmapIcon || "📚"}</span>

                        <div>
                            <h2 className="text-2xl font-extrabold text-white tracking-wide">
                                {hasCurrentRoadmap ? "Change Current Roadmap" : "Confirm Roadmap Selection"}
                            </h2>

                            <p className="text-sm text-gray-300 mt-1">
                                {roadmapTitle}
                            </p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="text-gray-300 hover:text-white transition-colors 
                            p-2 rounded-full hover:bg-white/10"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Description */}
                {roadmapDescription && (
                    <div className="p-6 border-b border-[#2A2A2D] bg-[#141416]">
                        <p className="text-gray-300 leading-relaxed">
                            {roadmapDescription}
                        </p>
                    </div>
                )}

                {/* Courses */}
                <div className="p-6">
                    <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                        <span>🗺️</span>
                        Roadmap Courses ({courses.length})
                    </h3>

                    {courses.length > 0 ? (
                        <div className="relative">
                            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-primary/40"></div>

                            <div className="space-y-6">
                                {courses.map((course, index) => (
                                    <div key={course.id} className="relative pl-12 group">

                                        {/* Number circle */}
                                        <div className="
                                            absolute left-0 w-8 h-8 
                                            rounded-full bg-primary 
                                            text-white flex items-center justify-center 
                                            font-bold text-sm shadow-md 
                                            group-hover:scale-110 transition-transform
                                        ">
                                            {index + 1}
                                        </div>

                                        {/* Card */}
                                        <div className="
                                            bg-[#1A1A1C] 
                                            border border-[#2A2A2D]
                                            rounded-xl p-4 
                                            hover:shadow-lg 
                                            transition-all duration-300 
                                            hover:border-primary/60
                                        ">
                                            <h4 className="font-semibold text-lg text-white mb-1">
                                                {course.title}
                                            </h4>

                                            {course.description && (
                                                <p className="text-sm text-gray-400 line-clamp-2">
                                                    {course.description}
                                                </p>
                                            )}
                                        </div>

                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <p className="text-center text-gray-400 py-8">
                            No courses found in this roadmap.
                        </p>
                    )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 
                    bg-[#1A1A1C] 
                    border-t border-[#2A2A2D] 
                    p-6 flex gap-4">

                    <button
                        onClick={onClose}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 rounded-xl 
                            border border-[#2A2A2D] 
                            text-gray-200 font-semibold 
                            hover:bg-[#2A2A2D]/40 
                            transition-all 
                            disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="flex-1 px-6 py-3 rounded-xl 
                            bg-primary text-white 
                            font-semibold 
                            hover:shadow-xl hover:-translate-y-0.5 transition-all
                            disabled:opacity-50 disabled:cursor-not-allowed 
                            flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving...
                            </>
                        ) : (
                            <>
                                {hasCurrentRoadmap ? "Confirm Change" : "Start Roadmap"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
