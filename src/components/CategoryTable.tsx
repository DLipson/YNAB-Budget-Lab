import * as React from "react";
import { Table } from "baseui/table";
import { parseCategoryName } from "../utils/categoryParser";

type Category = {
  name: string;
  amount: number;
  frequency: string;
  priority: string;
  type: string;
};

interface CategoryTableProps {
  categories: Category[];
}

export function CategoryTable({ categories }: CategoryTableProps) {
  const columns = ["Category Name", "Amount", "Frequency", "Priority", "Type"];

  const data = categories.map((cat) => {
    const parsed = parseCategoryName(cat.name);
    return [
      parsed.name,
      cat.amount,
      parsed.frequency ?? cat.frequency ?? "",
      parsed.priority ?? cat.priority ?? "",
      parsed.type ?? cat.type ?? "",
    ];
  });

  return <Table columns={columns} data={data} />;
}
