import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DashboardHeader } from "@/components/dashboard/layout/DashboardHeader";
import { HugeiconsIcon } from "@hugeicons/react";
import { Wallet01Icon, CreditCardIcon, Invoice01Icon, PlusSignIcon, ArrowUpRight01Icon, ArrowDownLeft01Icon, Clock01Icon, BankIcon } from "@hugeicons/core-free-icons";
import { AddFundsDialog } from "./components/AddFundsDialog";
import { PaykitWrapper } from "@/components/paykit-wrapper";

export default function FinancesPage() {
  return (
    <PaykitWrapper>
      <div className="flex-1 space-y-6">
        <DashboardHeader 
          title="Finances & Wallet" 
          subtitle="Manage your balance, payment methods, and transaction history."
        >
          <AddFundsDialog>
            <Button className="rounded-full gap-2">
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              <span>Add Funds</span>
            </Button>
          </AddFundsDialog>
        </DashboardHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="mb-6 bg-muted/50 p-1 w-full max-w-md grid grid-cols-3 rounded-xl">
            <TabsTrigger value="overview" className="rounded-lg">Overview</TabsTrigger>
            <TabsTrigger value="transactions" className="rounded-lg">Transactions</TabsTrigger>
            <TabsTrigger value="billing" className="rounded-lg">Billing</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="rounded-3xl border-border/50 shadow-sm relative overflow-hidden group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Current Balance</CardTitle>
                  <HugeiconsIcon icon={Wallet01Icon} className="size-4 text-primary/40 group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$0.00</div>
                  <p className="text-xs text-muted-foreground mt-1">Available for future bookings</p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/50 shadow-sm relative overflow-hidden group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Spend</CardTitle>
                  <HugeiconsIcon icon={BankIcon} className="size-4 text-primary/40 group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$0.00</div>
                  <p className="text-xs text-muted-foreground mt-1">This month</p>
                </CardContent>
              </Card>

              <Card className="rounded-3xl border-border/50 shadow-sm relative overflow-hidden group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Upcoming</CardTitle>
                  <HugeiconsIcon icon={Clock01Icon} className="size-4 text-primary/40 group-hover:text-primary transition-colors" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$0.00</div>
                  <p className="text-xs text-muted-foreground mt-1">Scheduled payments</p>
                </CardContent>
              </Card>
            </div>

            <Card className="rounded-3xl border-border/50 shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
                <HugeiconsIcon icon={Invoice01Icon} className="size-12 mb-4 opacity-20" />
                <p>No recent activity</p>
                <p className="text-sm">Your transactions will appear here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className="rounded-3xl border-border/50 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center p-20 text-center text-muted-foreground">
                <HugeiconsIcon icon={Invoice01Icon} className="size-12 mb-4 opacity-20" />
                <p>You have no transaction history yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="billing">
            <Card className="rounded-3xl border-border/50 shadow-sm">
              <CardContent className="flex flex-col items-center justify-center p-20 text-center text-muted-foreground">
                <HugeiconsIcon icon={CreditCardIcon} className="size-12 mb-4 opacity-20" />
                <p>No payment methods found.</p>
                <Button variant="outline" className="mt-6 rounded-full">Add Payment Method</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PaykitWrapper>
  );
}

