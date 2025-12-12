'use client';
import React from 'react';
import ProfileHeader from '@/features/profile/components/ProfileHeader';

const TodosLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg">
      <main className="max-w-6xl mx-auto px-4 py-4">
        {children}
      </main>
    </div>
  );
};

export default TodosLayout;
