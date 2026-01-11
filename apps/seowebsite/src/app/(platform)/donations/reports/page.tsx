'use client';

import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Skeleton } from '@/components/platform/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/platform/ui/table';
import { useState, useMemo, useEffect } from 'react';
import { Loader2, Bot, Gift } from "lucide-react";
import { useToast } from '@/hooks/platform/ui/use-toast';
import { getDataService } from '@/lib/platform/services/data-service';
import { useUserContext } from '@/context/platform/user-context';
import type { Donation } from '@/lib/platform/types/types';
import { format } from 'date-fns';
import { useLanguage } from '@/react-app/contexts/LanguageContext';

interface GeneratedReport {
    summary: string;
    progress: string;
}

export default function DonationReportsPage() {
  const { currentUser: user, allUsers } = useUserContext();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDonations = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const dataService = await getDataService();
        const userDonations = await dataService.getDonations(user.id);
        setDonations(userDonations as any);
      } catch (error) {
        console.error('Failed to load donations:', error);
        setDonations([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadDonations();
  }, [user]);

  const handleGenerateReport = async () => {
    if (!user || donations.length === 0 || !allUsers) {
        toast({
            variant: "destructive",
            title: t('donations.toast.notEnoughData.title'),
            description: t('donations.toast.notEnoughData.desc')
        });
        return;
    }
      setIsGenerating(true);
      toast({
          title: t('donations.toast.generating.title'),
          description: t('donations.toast.generating.desc'),
      });
      try {
          const { generateSupportSummary } = await import('@/ai/flows/generate-support-summary');
          
          const donorNames = Array.from(new Set(donations.map((d: any) => {
            const donor = allUsers?.find((u: any) => u.id === d.donorId);
            return donor?.name || t('donations.anonymous');
          }))).filter((name): name is string => name !== undefined);

          const supportDetails = donations.map((d: any) => `€${d.amount} on ${format(new Date(d.date), 'PPP')}`).join(', ');

          const input = {
              receiverName: user.name || t('donations.recipient'),
              donorNames: donorNames,
              supportDetails: supportDetails,
              progressDetails: "The recipient is making steady progress towards their therapy goals.",
          };
          const result = await generateSupportSummary(input);

          setGeneratedReport(result);

          toast({
              title: t('donations.toast.success.title'),
              description: t('donations.toast.success.desc'),
          });
      } catch (error) {
          console.error("Failed to generate summary:", error);
          toast({
              variant: "destructive",
              title: t('donations.toast.failure.title'),
              description: t('donations.toast.failure.desc')
          })
      } finally {
          setIsGenerating(false);
      }
  };
  
  const sortedDonations = useMemo(() => {
    if (!donations) return [];
    return [...donations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [donations]);

  return (
    <div className="space-y-8">
        <Card>
            <CardHeader>
                <CardTitle>{t('donations.title')}</CardTitle>
                <CardDescription>{t('donations.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleGenerateReport} disabled={isGenerating || isLoading}>
                    {isGenerating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isGenerating ? t('donations.generating') : t('donations.generate')}
                </Button>
            </CardContent>
        </Card>

        {generatedReport && (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Bot className="text-primary"/> {t('donations.summaryTitle')}</CardTitle>
                    <CardDescription>{generatedReport.progress}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm whitespace-pre-wrap">{generatedReport.summary}</p>
                </CardContent>
            </Card>
        )}

        <Card>
            <CardHeader>
                 <CardTitle>{t('donations.historyTitle')}</CardTitle>
                <CardDescription>{t('donations.historyDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
                 {isLoading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                    </div>
                 )}
                 {!isLoading && sortedDonations && sortedDonations.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('donations.table.date')}</TableHead>
                                <TableHead>{t('donations.table.from')}</TableHead>
                                <TableHead>{t('donations.table.to')}</TableHead>
                                <TableHead className="text-right">{t('donations.table.amount')}</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedDonations.map((donation: any) => {
                                const donor = allUsers?.find((u: any) => u.id === donation.donorId);
                                const receiver = allUsers?.find((u: any) => u.id === donation.receiverId);
                                return (
                                    <TableRow key={donation.id}>
                                        <TableCell>{format(new Date(donation.date), 'PP')}</TableCell>
                                        <TableCell>{donor?.name ?? t('donations.anonymous')}</TableCell>
                                        <TableCell>{receiver?.name ?? t('donations.goodCause')}</TableCell>
                                        <TableCell className="text-right font-medium">€{donation.amount.toFixed(2)}</TableCell>
                                    </TableRow>>
                                )
                            })}
                        </TableBody>
                    </Table>
                 ) : (
                    !isLoading && (
                    <div className="text-center py-12">
                        <Gift className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">{t('donations.noDonationsTitle')}</h3>
                        <p className="mt-1 text-sm text-muted-foreground">{t('donations.noDonationsDesc')}</p>
                    </div>
                    )
                 )}
            </CardContent>
        </Card>

    </div>
  );
}

