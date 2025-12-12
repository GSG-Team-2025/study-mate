"use client";
import React, { useRef, ChangeEvent } from "react";

interface ProfileAvatarProps {
  imagePreview: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileAvatar({ imagePreview, onChange }: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="relative w-36 h-36 mx-auto mb-10 group cursor-pointer shadow-md rounded-full ring-2 ring-gray-300">
      <img
        src={imagePreview}
        alt="Profile"
        className="w-full h-full object-cover rounded-full"
      />

      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={onChange}
      />

      <div
        className="absolute inset-0 bg-black/40 text-white flex flex-col items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition duration-300"
        onClick={() => fileInputRef.current?.click()}
      >
        <i className="fas fa-camera text-xl mb-1"></i>
        <span className="text-sm font-medium">Change Picture</span>
      </div>
    </div>
  );
}
