'use client';

import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Bot, FileText, Gift } from "lucide-react";
import { useUser, useFirestore, useCollection, collection, query, where, or, useMemoFirebase } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { allUsers } from '@/lib/data';
import type { Donation } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface GeneratedReport {
    summary: string;
    progress: string;
}

export default function DonationReportsPage() {
  const { user } = useUser();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);

  const donationsRef = useMemoFirebase(() => firestore ? collection(firestore, 'donations') : null, [firestore]);
  
  const userDonationsQuery = useMemoFirebase(() => {
    if (!donationsRef || !user) return null;
    return query(
        donationsRef, 
        or(
            where('donorId', '==', user.uid),
            where('receiverId', '==', user.uid)
        )
    );
  }, [donationsRef, user]);

  const { data: userDonations, isLoading: isLoadingDonations } = useCollection<Donation>(userDonationsQuery);

  const handleGenerateReport = async () => {
    if (!user || !userDonations || userDonations.length === 0) {
        toast({
            variant: "destructive",
            title: "Not enough data",
            description: "There are no donations to report on."
        });
        return;
    }
      setIsGenerating(true);
      toast({
          title: "Generating Support Summary...",
          description: "The AI is analyzing your donation history.",
      });
      try {
          const { generateSupportSummary } = await import('@/ai/flows/generate-support-summary');
          
          const donorNames = Array.from(new Set(userDonations.map(d => {
            const donor = allUsers.find(u => u.id === d.donorId);
            return donor ? donor.name : 'Anonymous';
          })));

          const supportDetails = userDonations.map(d => `€${d.amount} on ${format(new Date(d.date.toDate()), 'PPP')}`).join(', ');

          const input = {
              receiverName: user.displayName || 'the recipient',
              donorNames: donorNames,
              supportDetails: supportDetails,
              progressDetails: "The recipient is making steady progress towards their therapy goals.",
          };
          const result = await generateSupportSummary(input);

          setGeneratedReport(result);

          toast({
              title: "Summary Generated!",
              description: "Your AI-powered donation summary is ready.",
          });
      } catch (error) {
          console.error("Failed to generate summary:", error);
          toast({
              variant: "destructive",
              title: "Generation Failed",
              description: "There was an error generating your summary. Please try again."
          })
      } finally {
          setIsGenerating(false);
      }
  };
  
  const sortedDonations = useMemo(() => {
    return userDonations?.sort((a, b) => new Date(b.date.toDate()).getTime() - new Date(a.date.toDate()).getTime());
  }, [userDonations]);


  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>Donation Reports</CardTitle>
                <CardDescription>Generate AI-powered summaries of donation activity or review your history.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleGenerateReport} disabled={isGenerating || isLoadingDonations}>
                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isGenerating ? 'Generating...' : 'Generate Support Summary'}
                </Button>
            </CardContent>
        </Card>

        {generatedReport && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot className="text-primary"/> AI-Generated Summary</CardTitle>
                    <CardDescription>{generatedReport.progress}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{generatedReport.summary}</p>
                </CardContent>
            </Card>
        )}

        <Card>
            <CardHeader>
                 <CardTitle>Donation History</CardTitle>
                <CardDescription>A complete log of all donations you've made or received.</CardDescription>
            </CardHeader>
            <CardContent>
                 {isLoadingDonations && (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                 )}
                 {!isLoadingDonations && sortedDonations && sortedDonations.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Date</TableHead>
                                <TableHead>From</TableHead>
                                <TableHead>To</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedDonations.map(donation => {
                                const donor = allUsers.find(u => u.id === donation.donorId);
                                const receiver = allUsers.find(u => u.id === donation.receiverId);
                                return (
                                    <TableRow key={donation.id}>
                                        <TableCell>{format(donation.date.toDate(), 'PP')}</TableCell>
                                        <TableCell>{donor?.name ?? 'Anonymous'}</TableCell>
                                        <TableCell>{receiver?.name ?? 'A good cause'}</TableCell>
                                        <TableCell className="text-right font-medium">€{donation.amount.toFixed(2)}</TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                 ) : (
                    <div className="text-center py-12">
                        <Gift className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Donations Yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">Your donation history will appear here.</p>
                    </div>
                 )}
            </CardContent>
        </Card>

    </div>
  );
}
