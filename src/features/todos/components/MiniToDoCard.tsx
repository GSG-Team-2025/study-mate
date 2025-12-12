"use client";

import Link from "next/link";
import { Database } from '@/types/database.types';

type Task = Database['public']['Tables']['tasks']['Row'];
import { CheckCircle } from "lucide-react"

const MiniToDoCard: React.FC<{ tasks: Task[] }> = ({ tasks }) => {
    const inProgressTasks = tasks.filter(item => item.status === "In Progress");
    const itemsToDisplay = inProgressTasks.slice(0, 2);

    return (
        <div className="bg-white rounded-xl shadow-lg p-5 h-full flex flex-col border border-gray-200">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-xl font-bold text-primary flex items-center gap-1">
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-6 text-green-600" />
                    My Tasks
                </h3>
                <Link
                    href="/dashboard/todos"
                    className="text-sm font-semibold text-[#3B82F6] cursor-pointer transition "
                >
                    View All
                </Link>
            </div>

            <div className="space-y-3 grow">
                {itemsToDisplay.length > 0 ? (
                    itemsToDisplay.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between p-3 bg-gray-50 hover:bg-blue-50 rounded-lg border border-border"
                        >
                            <span className="text-sm text-gray-800 font-medium truncate">
                                {item.title}
                            </span>
                            <span className="text-xs font-semibold text-white bg-primary px-2 py-0.5 rounded-full ml-2">
                                Active
                            </span>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <p className="text-sm text-green-700 font-semibold italic">
                            All tasks completed!
                        </p>
                    </div>
                )}
            </div>

            {inProgressTasks.length > 3 && (
                <p className="text-xs text-center text-gray-500 mt-4 pt-2 border-t border-border">
                    + {inProgressTasks.length - 3} more tasks
                </p>
            )}
        </div>
    );
};

export default MiniToDoCard;
