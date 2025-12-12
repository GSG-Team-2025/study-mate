"use client";

import { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface ProfileFormProps {
  profile: Profile;
  isEditing: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProfileForm({ profile, isEditing, handleChange }: ProfileFormProps) {
  // Mapping of form fields to display labels
  const fields: { key: keyof Profile; label: string; type?: string }[] = [
    { key: "full_name", label: "Full Name" },
    { key: "email", label: "Email", type: "email" },
    { key: "department", label: "Department" },
    { key: "bio", label: "Bio" },
    { key: "student_id", label: "Student ID" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
      {fields.map((field) => (
        <div key={field.key} className="flex flex-col">
          <label
            className="text-sm font-medium mb-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {field.label}
          </label>

          <input
            type={field.type || "text"}
            name={field.key}
            // @ts-ignore - simplistic handling for now
            value={profile[field.key] ?? ""}
            onChange={handleChange}
            readOnly={!isEditing}
            className="p-3 rounded-lg transition duration-150 focus:outline-none border"
            style={{
              borderColor: isEditing
                ? "var(--color-primary)"
                : "var(--color-border)",
              backgroundColor: "var(--color-card-bg)",
              color: isEditing
                ? "var(--color-text-primary)"
                : "var(--color-text-secondary)",
              cursor: isEditing ? "text" : "default",
            }}
          />
        </div>
      ))}
    </div>
  );
}
