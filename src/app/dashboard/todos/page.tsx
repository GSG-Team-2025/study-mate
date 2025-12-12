'use client';
import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Database } from '@/types/database.types';
import ToDoPageTop from '@/features/todos/components/ToDoPageTop';
import AddTask from '@/features/todos/components/AddTask';
import TaskTodo from '@/features/todos/components/TaskTodo';
import TaskInProgress from '@/features/todos/components/TaskInProgress';
import TaskDone from '@/features/todos/components/TaskDone';

type Task = Database['public']['Tables']['tasks']['Row'];

export default function ToDoListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return; // Or redirect

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (data) setTasks(data);
      setLoading(false);
    };

    fetchTasks();
  }, [supabase]);

  // Derived state for columns
  const todo = tasks.filter(t => t.status === 'Todo' || !t.status); // Default to Todo if null
  const inProgress = tasks.filter(t => t.status === 'In Progress');
  const done = tasks.filter(t => t.status === 'Done');

  const handleAddTask = async (title: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const newTask = {
      title,
      user_id: user.id,
      status: 'Todo',
      is_completed: false,
      priority: 'normal',
      subject_id: null // Explicitly null as per type
    };

    const { data, error } = await supabase
      .from('tasks')
      .insert(newTask)
      .select()
      .single();

    if (data) {
      setTasks(prev => [data, ...prev]);
    } else if (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleStartTask = async (id: string) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'In Progress' } : t));

    const { error } = await supabase
      .from('tasks')
      .update({ status: 'In Progress' })
      .eq('id', id);

    if (error) {
      console.error('Error starting task:', error);
      // Revert on error? For now, we assume success or user refreshes.
    }
  };

  const handleMarkDone = async (id: string) => {
    // Optimistic update
    setTasks(prev => prev.map(t => t.id === id ? { ...t, status: 'Done', is_completed: true, completed_at: new Date().toISOString() } : t));

    const { error } = await supabase
      .from('tasks')
      .update({ status: 'Done', is_completed: true, completed_at: new Date().toISOString() })
      .eq('id', id);

    if (error) console.error('Error completing task:', error);
  };

  if (loading) return <div className="pt-24 text-center">Loading tasks...</div>;

  return (
    <div style={{ paddingTop: "100px" }} className="mx-auto px-4 space-y-5 pb-10">
      <ToDoPageTop remainingTasks={inProgress.length + todo.length} />
      <AddTask onAdd={handleAddTask} />

      {/* Grid for 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TaskTodo tasks={todo} onStart={handleStartTask} />
        <TaskInProgress tasks={inProgress} onMarkDone={handleMarkDone} />
        <TaskDone tasks={done} />
      </div>
    </div>
  );
}

