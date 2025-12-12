"use client";
import RoadmapCard from "@/features/roadmaps/components/Roadmap";
import { useState, useEffect } from "react";
import { Database } from '@/types/database.types';
import RoadmapConfirmModal from "./RoadmapConfirmModal";

type Roadmap = Database['public']['Tables']['roadmaps']['Row'];

type RoadmapsClientProps = {
    roadmaps: Pick<Roadmap, 'id' | 'title' | 'description' | 'icon' | 'color'>[];
    currentRoadmapId: string | null;
};

type Course = {
    id: string;
    title: string;
    description: string | null;
};

export default function RoadmapsClient({ roadmaps, currentRoadmapId }: RoadmapsClientProps) {
    const [selectedId, setSelectedId] = useState(currentRoadmapId || "");
    const [selectedTitle, setSelectedTitle] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);

    const handleSelect = (id: string) => {
        setSelectedId(id);
        const roadmap = roadmaps.find((r) => r.id === id);
        if (roadmap) {
            setSelectedTitle(roadmap.title);
        } else {
            setSelectedTitle(null);
        }
    };

    const handleContinueClick = async () => {
        if (!selectedId) return;

        setIsLoadingCourses(true);
        try {
            // Fetch roadmap courses
            const response = await fetch(`/api/roadmaps/${selectedId}`);
            if (response.ok) {
                const data = await response.json();
                const roadmapData = data.data;

                // Extract courses from roadmap_courses junction table
                const fetchedCourses = roadmapData.courses?.map((rc: any) => rc.course).filter(Boolean) || [];
                setCourses(fetchedCourses);
                setIsModalOpen(true);
            } else {
                alert('Failed to load roadmap details');
            }
        } catch (error) {
            console.error('Error fetching roadmap:', error);
            alert('An error occurred while loading roadmap details');
        } finally {
            setIsLoadingCourses(false);
        }
    };

    const selectedRoadmap = roadmaps.find(r => r.id === selectedId);
    const hasCurrentRoadmap = !!currentRoadmapId;
    const buttonText = hasCurrentRoadmap ? 'Change Current Roadmap' : `Continue with ${selectedTitle}`;

    return (
        <>
            <div className="p-[100px] flex flex-col gap-[100px] items-center justify-between">
                <h1 className="text-text-primary text-3xl font-bold">Choose Your Roadmap</h1>

                <div className="flex flex-row gap-[50px] items-center flex-wrap justify-center">
                    {roadmaps.length === 0 ? (
                        <p className="text-text-secondary">No roadmaps available at the moment.</p>
                    ) : (
                        roadmaps.map((roadmap) => (
                            <RoadmapCard
                                key={roadmap.id}
                                roadmap={roadmap}
                                onSelect={handleSelect}
                                isSelected={roadmap.id === selectedId}
                            />
                        ))
                    )}
                </div>

                {selectedTitle && (
                    <button
                        onClick={handleContinueClick}
                        disabled={isLoadingCourses}
                        className="group inline-flex items-center gap-3 px-6 py-3 rounded-xl
                       bg-primary text-white font-semibold text-lg shadow-md
                       hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 hover:cursor-pointer hover:bg-red-500
                       disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoadingCourses ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                            </>
                        ) : (
                            <>
                                {buttonText}
                                <span className="transition-transform group-hover:translate-x-1">
                                    ➜
                                </span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {selectedRoadmap && (
                <RoadmapConfirmModal
                    roadmapId={selectedId}
                    roadmapTitle={selectedRoadmap.title}
                    roadmapIcon={selectedRoadmap.icon}
                    roadmapDescription={selectedRoadmap.description}
                    courses={courses}
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    hasCurrentRoadmap={hasCurrentRoadmap}
                />
            )}
        </>
    );
}
