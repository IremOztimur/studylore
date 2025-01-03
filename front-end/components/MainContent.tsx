"use client";

import { useEffect, useState } from "react";

interface ContentData {
  title: string;
  urlSource: string;
  markdownContent: string;
  imageUrls?: string[];
}

export default function MainContent() {
  const [content, setContent] = useState<ContentData | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("mainContent");
    if (storedData) {
      setContent(JSON.parse(storedData));
    }
  }, []);

  if (!content) {
    return <p>Loading...</p>;
  }

  return (
    <main className="w-full lg:w-1/2 bg-white dark:bg-gray-800 p-6 prose dark:prose-invert max-w-none">
      <h2 className="text-3xl font-bold mb-4">{content.title}</h2>
      <p>
        Source:{" "}
        <a href={content.urlSource} target="_blank" className="text-blue-500 underline">
          {content.urlSource}
        </a>
      </p>
      {/* Render the HTML content */}
      <div
        dangerouslySetInnerHTML={{ __html: content.markdownContent }}
      />
      {content.imageUrls &&
        content.imageUrls.map((url, index) => <img key={index} src={url} alt="" />)}
    </main>
  );
}
