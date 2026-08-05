"use client";

import { useEffect, useState } from "react";

const sections = [
  { id: "one-workspace", label: "One creative workspace" },
  { id: "generation", label: "Generation that stays editable" },
  { id: "intelligence", label: "Editing intelligence" },
  { id: "performance", label: "Preview and delivery" },
  { id: "availability", label: "Availability" },
];

export default function ArticleToc() {
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    const elements = sections
      .map(({ id }) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <nav className="sticky top-28 border-t border-neutral-200 pt-4 text-xs leading-5" aria-label="Article sections">
      <p className="font-medium text-neutral-950">In this release</p>
      {sections.map(({ id, label }) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={activeId === id ? "location" : undefined}
          onClick={() => setActiveId(id)}
          className={`mt-2 block border-l pl-3 transition ${
            activeId === id
              ? "border-neutral-950 font-medium text-neutral-950"
              : "border-transparent text-neutral-500 hover:border-neutral-300 hover:text-neutral-950"
          }`}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}
