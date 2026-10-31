export function workFlowColumnWindow(columns, { left = 0, width = 0, widths = {}, stickyWidth = 394, pinned = '', wrapped = [] } = {}) {
  if (columns.length <= 24) return new Set(columns.map(column => column.id));
  const visible = new Set([...(pinned ? [pinned] : []), ...wrapped]);
  let position = stickyWidth;
  for (const column of columns) {
    const end = position + Number(widths[column.id] || column.width || 150);
    if (end >= left + stickyWidth - 200 && position <= left + width + 200) visible.add(column.id);
    position = end;
  }
  return visible;
}

export function workFlowColumnSegments(columns, visible) {
  const segments = [];
  columns.forEach((column, index) => {
    if (visible.has(column.id)) segments.push({ column, index });
    else {
      const previous = segments.at(-1);
      if (previous && !previous.column) previous.count++;
      else segments.push({ key: column.id, index, count: 1 });
    }
  });
  return segments;
}
