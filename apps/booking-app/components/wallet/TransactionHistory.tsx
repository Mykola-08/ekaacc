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
        <div className="text-center py-20 bg-card/50 rounded-[32px] text-muted-foreground">
          <span className="font-medium text-lg">No transactions found.</span>
        </div>
      );
    }
  
    return (
      <div className="rounded-[32px] overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border">
              <TableHead className="text-muted-foreground font-bold uppercase text-[11px] tracking-widest pl-8 py-6">Date</TableHead>
              <TableHead className="text-muted-foreground font-bold uppercase text-[11px] tracking-widest py-6">Description</TableHead>
              <TableHead className="text-right text-muted-foreground font-bold uppercase text-[11px] tracking-widest pr-8 py-6">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx) => {
              const isPositive = tx.amount_cents > 0;
              return (
                <TableRow key={tx.id} className="hover:bg-secondary border-b border-border group transition-colors">
                  <TableCell className="font-medium text-muted-foreground py-6 pl-8">
                    {format(new Date(tx.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="py-6">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        {isPositive ? (
                          <ArrowDownLeft className="h-4 w-4" strokeWidth={2.5} />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" strokeWidth={2.5} />
                        )}
                      </div>
                      <span className="font-semibold text-foreground">{tx.description}</span>
                    </div>
                  </TableCell>
                  <TableCell className={`text-right py-6 pr-8 font-bold tracking-tight text-lg ${isPositive ? 'text-emerald-600' : 'text-foreground'}`}>
                    {isPositive ? '+' : ''}{new Intl.NumberFormat('en-IE', {
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
