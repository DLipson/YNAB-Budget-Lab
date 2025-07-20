// Utility to parse category names in the format "Frequency:Priority:Fixed/Variable"

export function parseCategoryName(name: string): {
  name: string;
  frequency?: string;
  priority?: string;
  type?: string;
} {
  if (typeof name !== "string") {
    return { name: String(name) };
  }

  const parts = name.split(":");
  if (parts.length === 3) {
    const [frequency, priority, type] = parts.map((p) => p.trim());
    // Basic validation: all parts must be non-empty
    if (frequency && priority && type) {
      return {
        name,
        frequency,
        priority,
        type,
      };
    }
  }

  // Invalid format or malformed input
  return { name };
}
