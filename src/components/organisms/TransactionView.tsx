import React, { useEffect, useState } from "react";
import { Block } from "baseui/block";
import Button from "../atoms/Button";
import Input from "../atoms/Input";
import { fetchTransactions } from "../../services/ynab-api";
import type { Transaction } from "../../types/ynab";

interface TransactionViewProps {
  token: string;
  budgetId: string;
  categoryId: string;
}

export function TransactionView({ token, budgetId, categoryId }: TransactionViewProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchTransactions(token, budgetId, categoryId, page, pageSize)
      .then((res) => {
        if (mounted) {
          setTransactions(res.transactions);
          setTotal(res.total);
        }
      })
      .catch((err) => {
        if (mounted) setError(err.message);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [token, budgetId, categoryId, page, pageSize]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <Block>
      <Block marginBottom="scale400">
        <strong>Transactions</strong>
      </Block>
      {error && <Block color="negative">{error}</Block>}
      <Block marginBottom="scale400">
        <label>
          Page Size:{" "}
          <Input type="number" value={String(pageSize)} onChange={(e) => setPageSize(Number(e.target.value))} />
        </label>
      </Block>
      <Block display="flex" alignItems="center" marginBottom="scale400">
        <Button disabled={page <= 1 || loading} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          Previous
        </Button>
        <Block marginLeft="scale600" marginRight="scale600">
          Page {page} of {totalPages || 1}
        </Block>
        <Button disabled={page >= totalPages || loading} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
          Next
        </Button>
      </Block>
      {loading ? (
        <Block>Loading...</Block>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Amount</th>
              <th>Memo</th>
              <th>Cleared</th>
              <th>Approved</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td>{tx.date}</td>
                <td>{(tx.amount / 1000).toFixed(2)}</td>
                <td>{tx.memo || ""}</td>
                <td>{tx.cleared}</td>
                <td>{tx.approved ? "Yes" : "No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Block>
  );
}
