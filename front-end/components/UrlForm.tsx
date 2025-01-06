"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function UrlForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [url, setUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/process-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("mainContent", JSON.stringify(data)); // Save to localStorage
        router.push("/study");
      } else {
        throw new Error("Failed to process URL");
      }
    } catch (error) {
      console.error("Error processing URL:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      <div className="flex shadow-md rounded-lg overflow-hidden">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter tutorial URL"
          required
          className="flex-grow px-4 py-2 dark:text-gray-900"
        />
        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-500 text-white px-6 py-2"
        >
          {isLoading ? "Processing..." : "Process"}
        </button>
      </div>
    </form>
  );
}
