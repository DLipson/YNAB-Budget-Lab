import { Block } from "baseui/block";

interface CategoryEmptyStateProps {
  filterActive?: boolean;
}

export function CategoryEmptyState({ filterActive = false }: CategoryEmptyStateProps) {
  return (
    <Block
      overrides={{
        Block: {
          style: {
            padding: "1.5rem",
            color: "#888",
            textAlign: "center",
            backgroundColor: "#f7f7f7",
            borderRadius: "8px",
            margin: "1rem 0",
          },
        },
      }}
    >
      {filterActive ? "No categories match your filter." : "No categories available."}
    </Block>
  );
}
