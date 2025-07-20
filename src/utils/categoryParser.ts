/**
 * Utility to parse category group names in the format "Frequency:Priority:Fixed/Variable"
 * Operates on category_group_name, not category name.
 */
export function parseCategoryGroupName(category_group_name: string): {
  category_group_name: string;
  frequency?: string;
  priority?: string;
  type?: string;
} {
  if (typeof category_group_name !== "string") {
    return { category_group_name: String(category_group_name) };
  }

  const parts = category_group_name.split(":");
  if (parts.length === 3) {
    const [frequency, priority, type] = parts.map((p) => p.trim());
    if (frequency && priority && type) {
      return {
        category_group_name,
        frequency,
        priority,
        type,
      };
    }
  }

  return { category_group_name };
}
