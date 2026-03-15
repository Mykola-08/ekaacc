import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { WalletIcon, CreditCardIcon, ReceiptIcon } from "lucide-react";

export default function FinancesPage() {
  return (
    <div className="flex flex-col space-y-6 max-w-6xl mx-auto py-8 w-full px-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Finances & Wallet</h1>
        <Button>Add Funds</Button>
      </div>
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6 space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Balance</CardTitle>
                <WalletIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent><div className="text-2xl font-bold">$0.00</div></CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="transactions" className="mt-6">
          <Card><CardHeader><CardTitle>Transactions</CardTitle></CardHeader><CardContent><div className="text-center p-8 text-muted-foreground">No transactions</div></CardContent></Card>
        </TabsContent>
        <TabsContent value="billing" className="mt-6">
          <Card><CardHeader><CardTitle>Billing</CardTitle></CardHeader><CardContent><Button variant="outline">Add Card</Button></CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
