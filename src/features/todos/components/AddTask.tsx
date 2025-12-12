'use client';
import { useState } from 'react';
import { PlusCircle } from 'lucide-react';

export default function AddTask({ onAdd }: { onAdd: (task: string) => void }) {
  const [newTask, setNewTask] = useState("");

  const handleAdd = () => {
    if (!newTask.trim()) return;
    onAdd(newTask);
    setNewTask("");
  };

  return (
    <div className="mb-10 p-6 rounded-lg bg-card-bg border border-border shadow-md">
      <h2 className="text-lg sm:text-xl md:text-2xl font-semibold mb-4 flex items-center text-primary gap-2">
        <PlusCircle className="w-5 h-5 sm:w-6 md:w-7" /> Add New Task
      </h2>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Write your task here..."
          className="w-full p-3 rounded-md border border-border bg-bg text-text-primary text-sm sm:text-base md:text-base"
        />
        <button
          onClick={handleAdd}
          className="px-6 sm:px-8 md:px-10 py-2 rounded-md bg-primary text-white font-semibold hover:bg-primary-hover transition-colors text-sm sm:text-base md:text-base"
        >
          Add
        </button>
      </div>
    </div>
  );
}
