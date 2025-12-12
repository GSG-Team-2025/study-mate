'use client';
import { Database } from '@/types/database.types';
import { Circle, PlayCircle } from 'lucide-react';

type Task = Database['public']['Tables']['tasks']['Row'];

export default function TaskTodo({
    tasks,
    onStart,
}: {
    tasks: Task[];
    onStart: (id: string) => void;
}) {
    return (
        <div className="p-6 rounded-lg bg-card-bg border-t-4 border-primary shadow-md">
            <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 flex items-center text-primary gap-2">
                <Circle className="w-5 h-5 sm:w-6 md:w-7" /> To Do ({tasks.length})
            </h2>

            <div className="space-y-4">
                {tasks.length > 0 ? tasks.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg hover:shadow-md transition bg-gray-50 dark:bg-gray-800/50">
                        <span className="text-sm sm:text-base md:text-base font-medium text-text-primary">{item.title}</span>
                        <button
                            onClick={() => onStart(item.id)}
                            className="mt-2 sm:mt-0 px-3 sm:px-4 md:px-3 py-1.5 rounded-md bg-secondary text-white hover:bg-secondary/90 transition-colors text-sm flex items-center gap-1"
                        >
                            <PlayCircle className="w-4 h-4" /> Start
                        </button>
                    </div>
                )) : (
                    <div className="text-center p-6 rounded-lg bg-accent/10">
                        <p className="text-sm sm:text-base md:text-lg font-semibold text-accent">No new tasks</p>
                    </div>
                )}
            </div>
        </div>
    );
}
