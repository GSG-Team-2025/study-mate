'use client';
import React from 'react';

const ProfileHeader: React.FC = () => {
  return (
    <header
  className="w-full py-4 mb-6"
  style={{
    backgroundColor: 'var(--color-primary)',
    boxShadow: 'var(--shadow-appbar)',
  }}
>
  <span className="text-2xl ml-7 text-white">StudyMATE</span>
</header>

  );
};

export default ProfileHeader;
