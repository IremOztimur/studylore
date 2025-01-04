"use client";

import { useEffect, useState } from "react";

interface ContentData {
  markdownContent: string;
  imageUrls?: string[];
}

export default function MainContent() {
  const [content, setContent] = useState<ContentData | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("mainContent");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setContent({
        markdownContent: parsedData.markdownContent || "",
        imageUrls: parsedData.imageUrls || [],
      });
    }
  }, []);

  if (!content) {
    return <p>Loading...</p>;
  }

  return (
    <main className="w-full lg:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm prose dark:prose-invert max-w-none">
      {/* Render the HTML content */}
      <div
        dangerouslySetInnerHTML={{ __html: content.markdownContent }}
      />
      {content.imageUrls &&
        content.imageUrls.map((url, index) => <img key={index} src={url} alt="" />)}
    </main>
  );
}
