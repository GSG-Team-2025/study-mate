"use client";

import { useRouter } from "next/navigation";

export default function ProfileRoadmap() {
  const router = useRouter();
  return (
    
    <div
      className="p-6 rounded-xl shadow-md border "
      style={{
        backgroundColor: "var(--color-card-bg)",
        borderColor: "var(--color-border)",
      }}
    >
      <h3
        className="text-xl font-semibold mb-4"
        style={{ color: "var(--color-text-primary)" }}
      >
        Roadmap Details
      </h3>

      <div
        className="flex flex-col md:flex-row justify-between items-center p-4 rounded-lg"
        style={{ backgroundColor: "var(--color-bg)" }}
      >
        <p
          style={{
            color: "var(--color-text-secondary)",
            fontWeight: 500,
          }}
          className="mb-2 md:mb-0"
        >
          Current Roadmap: Full Stack Web Developer
        </p>

        <button
          className="px-4 py-2 font-semibold rounded-lg transition text-sm"
          style={{ backgroundColor: "var(--color-secondary)", color: "#fff" }}
        >
          Change Roadmap
        </button>
        <button
          className="px-4 py-2 font-semibold rounded-lg transition text-sm"
          style={{ backgroundColor: "var(--color-accent)", color: "#fff" }}
          onClick={()=>{router.push('/myroadmap')}}
        >
          My Current Roadmap
        </button>
      </div>
    </div>
  );
}
