// Generate unique component ID
export function generateComponentId(): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9);
}

// Batch set plugin data untuk mengurangi duplikasi kode
export function setPluginDataBatch(component: ComponentNode | FrameNode, data: Record<string, string | number | undefined>): void {
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      component.setPluginData(key, typeof value === "number" ? value.toString() : value);
    }
  });
}
