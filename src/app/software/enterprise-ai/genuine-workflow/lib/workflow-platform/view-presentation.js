function mondayJobStatus(columns) {
  return columns.find((column) => column.type === "status" && column.label?.trim().toLowerCase() === "job status" && column.settings?.sourceSystem === "monday");
}

export function resolveWorkFlowViewPresentation(view, columns = []) {
  const presentation = view?.activeVersion?.presentation || {};
  if (presentation.groupByColumnId || presentation.sourceSystem !== "monday" || !/^Job by Status(?:\b|[-–])/i.test(view?.name || "")) return presentation;
  const column = mondayJobStatus(columns);
  return column ? { ...presentation, groupByColumnId: column.id } : presentation;
}

export function resolveWorkFlowMainTablePresentation(board, columns = []) {
  if (board?.name?.trim().toLowerCase() !== "installs") return {};
  const column = mondayJobStatus(columns);
  return column ? { groupByColumnId: column.id } : {};
}
