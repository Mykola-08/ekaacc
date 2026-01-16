import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table";
  import { format } from "date-fns";
  import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
  
  interface Transaction {
    id: string;
    amount_cents: number;
    type: string;
    description: string;
    created_at: string;
  }
  
  interface TransactionHistoryProps {
    transactions: Transaction[];
  }
  
  export function TransactionHistory({ transactions }: TransactionHistoryProps) {
    if (!transactions.length) {
      return (
        <div className="text-center py-10 text-muted-foreground">
          No transactions found.
        </div>
      );
    }
  
    return (
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => {
              const isPositive = tx.amount_cents > 0;
              return (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">
                    {format(new Date(tx.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {isPositive ? (
                        <ArrowDownLeft className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4 text-red-500" />
                      )}
                      {tx.description}
                    </div>
                  </TableCell>
                  <TableCell className={`text-right ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {new Intl.NumberFormat('en-IE', {
                      style: 'currency',
                      currency: 'EUR'
                    }).format(tx.amount_cents / 100)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    );
  }
