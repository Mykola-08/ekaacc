import React from "react";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import { Wallet01Icon, CreditCardIcon, Invoice01Icon, PlusSignIcon, Clock01Icon, BankIcon } from "@hugeicons/core-free-icons";
import { AddFundsDialog } from "./components/AddFundsDialog";
import { PaykitWrapper } from "@/components/paykit-wrapper";

export default function FinancesPage() {
  return (
    <PaykitWrapper>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="flex items-center justify-between px-4 lg:px-6">
          <div>
            <h2 className="text-lg font-semibold">Finances & Wallet</h2>
            <p className="text-muted-foreground text-sm">Manage your balance, payment methods, and transaction history.</p>
          </div>
          <AddFundsDialog>
            <Button className="gap-2">
              <HugeiconsIcon icon={PlusSignIcon} className="size-4" />
              <span>Add Funds</span>
            </Button>
          </AddFundsDialog>
        </div>

        <div className="px-4 lg:px-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="mb-6 w-full max-w-md grid grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 @xl/main:grid-cols-3 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs">
                <Card className="@container/card">
                  <CardHeader>
                    <CardDescription>Current Balance</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$0.00</CardTitle>
                    <CardAction>
                      <Badge variant="outline">
                        <HugeiconsIcon icon={Wallet01Icon} strokeWidth={2} />
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter className="text-sm text-muted-foreground">
                    Available for future bookings
                  </CardFooter>
                </Card>

                <Card className="@container/card">
                  <CardHeader>
                    <CardDescription>Monthly Spend</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$0.00</CardTitle>
                    <CardAction>
                      <Badge variant="outline">
                        <HugeiconsIcon icon={BankIcon} strokeWidth={2} />
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter className="text-sm text-muted-foreground">
                    This month
                  </CardFooter>
                </Card>

                <Card className="@container/card">
                  <CardHeader>
                    <CardDescription>Upcoming</CardDescription>
                    <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">$0.00</CardTitle>
                    <CardAction>
                      <Badge variant="outline">
                        <HugeiconsIcon icon={Clock01Icon} strokeWidth={2} />
                      </Badge>
                    </CardAction>
                  </CardHeader>
                  <CardFooter className="text-sm text-muted-foreground">
                    Scheduled payments
                  </CardFooter>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
                  <HugeiconsIcon icon={Invoice01Icon} className="size-12 mb-4 opacity-20" />
                  <p>No recent activity</p>
                  <p className="text-sm">Your transactions will appear here.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="transactions">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                  <HugeiconsIcon icon={Invoice01Icon} className="size-12 mb-4 opacity-20" />
                  <p>You have no transaction history yet.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing">
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                  <HugeiconsIcon icon={CreditCardIcon} className="size-12 mb-4 opacity-20" />
                  <p>No payment methods found.</p>
                  <Button variant="outline" className="mt-6">Add Payment Method</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PaykitWrapper>
  );
}

