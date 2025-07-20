import * as React from "react";
import { Table } from "baseui/table";

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

  const data = categories.map((cat) => [cat.name, cat.amount, cat.frequency, cat.priority, cat.type]);

  return <Table columns={columns} data={data} />;
}
