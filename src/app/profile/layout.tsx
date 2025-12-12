'use client';
import React from 'react';
import ProfileHeader from "@/features/profile/components/ProfileHeader";

const ProfileLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileHeader />

      <main className="max-w-5xl mx-auto px-4 py-4">
        {children}
      </main>
    </div>
  );
};

export default ProfileLayout;
