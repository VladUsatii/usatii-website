export default function WorkFlowMentionText({ text = "", people = [] }) {
  const names = [...new Set(["everyone", ...people.map((person) => person.displayName).filter(Boolean)])].sort((a, b) => b.length - a.length);
  const parts = [];
  let start = 0;
  for (let index = 0; index < text.length; index += 1) {
    if (text[index] !== "@" || (index > 0 && /[\w@]/.test(text[index - 1]))) continue;
    const name = names.find((candidate) => text.slice(index + 1, index + 1 + candidate.length).toLowerCase() === candidate.toLowerCase() && !/[\w]/.test(text[index + 1 + candidate.length] || ""));
    if (!name) continue;
    if (index > start) parts.push(text.slice(start, index));
    const end = index + name.length + 1;
    parts.push(<span key={index} className="font-medium text-[#0073ea]">{text.slice(index, end)}</span>);
    index = end - 1;
    start = end;
  }
  if (start < text.length) parts.push(text.slice(start));
  return <>{parts}</>;
}
