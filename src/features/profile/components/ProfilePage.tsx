"use client";

import React, { useState, ChangeEvent } from "react";
import { Database } from '@/types/database.types';
import ProfileIAvatar from "./ProfileAvatar";
import ProfileForm from "./ProfileForm";
import ProfileActions from "./ProfileActions";
import ProfileRoadmap from "./ProfileRoadmap";
import Link from 'next/link';
import { ArrowLeft } from "lucide-react";

type Profile = Database['public']['Tables']['profiles']['Row'];

const initialUserData: Profile = {
  id: "mock_id",
  created_at: new Date().toISOString(),
  full_name: "Basma Kuhail",
  email: "basma.kuhail@example.com",
  department: "Computer Science",
  student_id: "12345678",
  university_id: "university_1",
  avatar_url: "/avatar.jpg",
  badges: [],
  bio: "Passionate CS Student",
  current_roadmap_id: null,
  current_semester: 3,
  last_active: new Date().toISOString(),
  level: 1,
  social_links: {},
  tawjihi_average: 95,
  tawjihi_year: 2022,
  telegram_user_id: null,
  xp: 100
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile>(initialUserData);
  const [imagePreview, setImagePreview] = useState(initialUserData.avatar_url ?? "/avatar.jpg");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setIsEditing(false);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setProfile(initialUserData);
    setImagePreview(initialUserData.avatar_url ?? "/avatar.jpg");
    setIsEditing(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 space-y-5">
      <Link
        href="/student"
        className="flex items-center gap-1 font-semibold transition duration-150"
        style={{ color: 'var(--color-primary)' }}
      >
        <ArrowLeft size={20} /> Back
      </Link>

      <div
        className="p-8 rounded-xl shadow-md border "
        style={{
          backgroundColor: "var(--color-card-bg)",
          borderColor: "var(--color-border)",
        }}
      >
        <h2
          className="text-3xl font-bold border-b pb-4 mb-6"
          style={{ color: "var(--color-text-primary)", borderColor: "var(--color-border)" }}
        >
          My Profile
        </h2>

        <ProfileIAvatar imagePreview={imagePreview} onChange={handleImageChange} />

        <ProfileForm
          profile={profile}
          isEditing={isEditing}
          handleChange={handleChange}
        />

        <ProfileActions
          isEditing={isEditing}
          handleSave={handleSave}
          handleCancel={handleCancel}
          setIsEditing={setIsEditing}
        />
      </div>

      <ProfileRoadmap />
    </div>
  );
}
