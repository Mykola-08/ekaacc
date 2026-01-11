import { getPendingVerifications } from '@/server/finance/actions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { VerifyButton } from "@/components/admin/verify-button"

export default async function AdminFinancePage() {
  const items = await getPendingVerifications()

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-3xl font-serif text-primary">Finance & Verification</h1>
            <p className="text-muted-foreground">Manage payments and identity verification requests.</p>
        </div>
      </div>

      <Card className="border-border-subtle shadow-sm animate-in fade-in-50 duration-500">
          <CardHeader>
              <CardTitle>Pending Verifications</CardTitle>
              <CardDescription>
                  Bookings requiring identity or payment confirmation.
              </CardDescription>
          </CardHeader>
          <CardContent>
              {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center text-muted-foreground animate-in zoom-in-50">
                      <div className="bg-muted/10 p-4 rounded-full mb-4">
                        <svg className="w-10 h-10 text-muted-foreground/40" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-medium text-foreground">All Clear!</h3>
                      <p className="max-w-xs mt-1 text-sm">No pending verifications found. Good job keeping up!</p>
                  </div>
              ) : (
                  <Table className="animate-in slide-in-from-bottom-2 duration-700">
                      <TableHeader>
                          <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead>Client</TableHead>
                              <TableHead>Service</TableHead>
                              <TableHead>Trust Score</TableHead>
                              <TableHead>Amount</TableHead>
                              <TableHead>Actions</TableHead>
                          </TableRow>
                      </TableHeader>
                      <TableBody>
                          {items.map((item: any) => (
                              <TableRow key={item.id}>
                                  <TableCell className="font-medium">
                                      {format(new Date(item.start_time), 'MMM d, h:mm a')}
                                  </TableCell>
                                  <TableCell>
                                      <div className="flex flex-col">
                                          <span>{item.profiles?.full_name || 'Guest'}</span>
                                          <span className="text-xs text-muted-foreground">{item.profiles?.email}</span>
                                      </div>
                                  </TableCell>
                                  <TableCell>{item.service?.name}</TableCell>
                                  <TableCell>
                                      <Badge variant={item.profiles?.trust_score < 70 ? "destructive" : "secondary"}>
                                          {item.profiles?.trust_score || 'N/A'}
                                      </Badge>
                                  </TableCell>
                                  <TableCell>
                                      ${((item.amount || 0) / 100).toFixed(2)}
                                  </TableCell>
                                  <TableCell>
                                      <VerifyButton bookingId={item.id} />
                                  </TableCell>
                              </TableRow>
                          ))}
                      </TableBody>
                  </Table>
              )}
          </CardContent>
      </Card>
    </div>
  );
}
