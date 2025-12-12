'use client';
import Link from 'next/link';
import { ListCheck , ArrowLeft } from 'lucide-react';

export default function ToDoPageTop({ remainingTasks }: { remainingTasks: number }) {
  return (
    <>
      <Link
        href="/student"
        className="flex items-center gap-1 font-semibold transition duration-150"
        style={{ color: 'var(--color-primary)' }}
      >
        <ArrowLeft size={20} /> Back 
      </Link>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 flex items-center gap-2 text-primary">
        <ListCheck className="w-5 h-5 sm:w-6 md:w-8" /> My Full Task List
      </h1>

      <p className="text-sm sm:text-base md:text-lg border-b pb-4 mb-8 text-secondary">
        All milestones from your roadmap — <b>{remainingTasks} tasks remaining</b>
      </p>
    </>
  );
}
