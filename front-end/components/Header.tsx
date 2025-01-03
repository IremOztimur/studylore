"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface HeaderData {
  title: string;
  urlSource: string;
}

export default function Header() {
  const [headerData, setHeaderData] = useState<HeaderData | null>(null);

  useEffect(() => {
    const storedData = localStorage.getItem("mainContent");
    if (storedData) {
      const parser = new DOMParser();
      const parsedHTML = parser.parseFromString(
        JSON.parse(storedData).markdownContent,
        "text/html"
      );

      // Extract the first <h1> as the title
      const title = parsedHTML.querySelector("h1")?.textContent || "Fallback Title";

      // Extract the first <a> as the source link
      const urlSource = parsedHTML.querySelector("a")?.getAttribute("href") || "";

      setHeaderData({ title, urlSource });
    }
  }, []);

  if (!headerData) {
    return null; // Optionally display a loading indicator
  }

  return (
    <header className="text-center mb-8">
      <Link
        href="/"
        className="text-blue-600 dark:text-blue-400 hover:underline mb-2 inline-block"
      >
        ← Back to Home
      </Link>
      <h1 className="text-4xl md:text-5xl font-bold mb-4">{headerData.title}</h1>
      <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
        Source:{" "}
        {headerData.urlSource ? (
          <a
            href={headerData.urlSource}
            target="_blank"
            className="text-blue-500 underline"
          >
            {headerData.urlSource}
          </a>
        ) : (
          "No source available"
        )}
      </p>
    </header>
  );
}
