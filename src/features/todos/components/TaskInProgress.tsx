'use client';
import { Database } from '@/types/database.types';

type Task = Database['public']['Tables']['tasks']['Row'];
import { Loader2 } from 'lucide-react';

export default function TaskInProgress({
  tasks,
  onMarkDone,
}: {
  tasks: Task[];
  onMarkDone: (id: string) => void;
}) {
  return (
    <div className="p-6 rounded-lg bg-card-bg border-t-4 border-secondary shadow-md">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 flex items-center text-[#F97316] gap-2">
        <Loader2 className="w-5 h-5 sm:w-6 md:w-7" /> Tasks In Progress ({tasks.length})
      </h2>

      <div className="space-y-4">
        {tasks.length > 0 ? tasks.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg hover:shadow-md transition bg-orange-50">
            <span className="text-sm sm:text-base md:text-base font-medium text-primary">{item.title}</span>
            <button
              onClick={() => onMarkDone(item.id)}
              className="mt-2 sm:mt-0 px-3 sm:px-4 md:px-3 py-1.5 rounded-md bg-primary text-white hover:bg-primary-hover transition-colors text-sm"
            >
              Mark Done
            </button>
          </div>
        )) : (
          <div className="text-center p-6 rounded-lg bg-accent/10">
            <p className="text-sm sm:text-base md:text-lg font-semibold text-accent">You are all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
}
