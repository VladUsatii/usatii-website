"use client";

import { useEffect, useRef, useState } from "react";

const CHUNK_SIZE = 20;

function RowChunk({ rows, columnCount, rowHeight, renderRow, pinnedItemId }) {
  const element = useRef(null);
  const [height, setHeight] = useState(0);
  const intersecting = useRef(false);
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined");
  const [focused, setFocused] = useState(false);
  const pinned = rows.some((row) => row.id === pinnedItemId);
  const mounted = visible || focused || pinned;

  useEffect(() => {
    const node = element.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      intersecting.current = entry.isIntersecting;
      if (!entry.isIntersecting && node.querySelector("[data-grid-row]")) setHeight(node.getBoundingClientRect().height);
      setVisible(entry.isIntersecting);
    }, { rootMargin: "700px 0px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <tbody ref={element} onFocusCapture={() => setFocused(true)} onBlurCapture={(event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setHeight(event.currentTarget.getBoundingClientRect().height);
      setFocused(false);
      setVisible(intersecting.current || typeof IntersectionObserver === "undefined");
    }
  }}>
    {mounted ? rows.map(renderRow) : <tr aria-hidden="true"><td colSpan={columnCount} style={{ height: height || rows.length * rowHeight, padding: 0, border: 0 }} /></tr>}
  </tbody>;
}

// Buffer every row's data, but only construct cell editors near the viewport.
export default function WorkFlowBufferedRows({ rows, columnCount, rowHeight = 36, renderRow, pinnedItemId }) {
  const chunks = [];
  for (let start = 0; start < rows.length; start += CHUNK_SIZE) {
    chunks.push(<RowChunk key={start} rows={rows.slice(start, start + CHUNK_SIZE)} columnCount={columnCount} rowHeight={rowHeight} renderRow={renderRow} pinnedItemId={pinnedItemId} />);
  }
  return chunks;
}
