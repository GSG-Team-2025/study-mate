'use client';
import { Database } from '@/types/database.types';

type Task = Database['public']['Tables']['tasks']['Row'];
import { Check } from 'lucide-react';

export default function TaskDone({ tasks }: { tasks: Task[] }) {
  return (
    <div className="p-6 rounded-lg bg-card-bg border-t-4 border-accent shadow-md">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 flex items-center text-accent gap-2">
        <Check className="w-5 h-5 sm:w-6 md:w-7" /> Completed Tasks ({tasks.length})
      </h2>

      <div className="space-y-4">
        {tasks.length > 0 ? tasks.map((item) => (
          <div key={item.id} className="p-4 rounded-lg bg-accent/15">
            <span className="flex items-center gap-2 font-medium text-text-secondary text-sm sm:text-base md:text-base">
              <Check className="w-4 h-4 sm:w-5 md:w-5 text-accent" /> {item.title}
            </span>
          </div>
        )) : (
          <p className="text-gray-500 italic p-4 text-sm sm:text-base md:text-base">
            Complete your first task to see it here.
          </p>
        )}
      </div>
    </div>
  );
}
