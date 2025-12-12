"use client";

interface ProfileActionsProps {
  isEditing: boolean;
  handleSave: () => void;
  handleCancel: () => void;
  setIsEditing: (value: boolean) => void;
}

export default function ProfileActions({
  isEditing,
  handleSave,
  handleCancel,
  setIsEditing,
}: ProfileActionsProps) {
  return (
    <div
      className="flex flex-wrap justify-center gap-4 pt-4 border-t"
      style={{ borderColor: "var(--color-border)" }}
    >
      {!isEditing ? (
        <button
          onClick={() => setIsEditing(true)}
          className="px-6 py-3 font-semibold rounded-lg shadow-md flex items-center transition"
          style={{ backgroundColor: "var(--color-primary)", color: "#fff" }}
        >
          <i className="fas fa-edit mr-2"></i> Edit Profile
        </button>
      ) : (
        <>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-lg shadow-md flex items-center transition"
            style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
          >
            <i className="fas fa-save mr-2"></i> Save Changes
          </button>

          <button
            onClick={handleCancel}
            className="px-6 py-3 rounded-lg shadow-md flex items-center transition"
            style={{ backgroundColor: "var(--color-secondary)", color: "#fff" }}
          >
            <i className="fas fa-times mr-2"></i> Cancel
          </button>
        </>
      )}

      <button
        className="px-6 py-3 rounded-lg shadow-md transition"
        style={{ backgroundColor: "var(--color-text-secondary)", color: "#fff" }}
      >
        Change Password
      </button>
    </div>
  );
}
