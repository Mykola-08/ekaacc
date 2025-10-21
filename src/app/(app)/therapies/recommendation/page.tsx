'use client';
import { Suspense, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { TriageResult, Service } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Lightbulb, Star } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useData } from '@/context/unified-data-context';

function RecommendationContent() {
  const searchParams = useSearchParams();
  const resultString = searchParams.get('result');
  const { services: dataServices } = useData();
  const services = dataServices || [];
  const isLoadingServices = !dataServices;

  const result: TriageResult | null = useMemo(() => {
    if (!resultString) return null;
    try {
      return JSON.parse(resultString);
    } catch (error) {
      console.error("Failed to parse recommendation result:", error);
      return null;
    }
  }, [resultString]);

  const topTherapy = useMemo(() => {
    if (!result || !services) return null;
    return services.find(t => t.id === result.top.therapyId);
  }, [result, services]);

  const altTherapies = useMemo(() => {
    if (!result || !services) return [];
    return result.alts
      .map(alt => services.find(t => t.id === alt.therapyId))
      .filter((t): t is Service => !!t);
  }, [result, services]);

  if (isLoadingServices) {
      return <RecommendationSkeleton message="Loading therapy details..." />;
  }

  if (!result || !topTherapy) {
    const message = result ? "Sorry, we couldn't find a suitable therapy match. Please try refining your description." : "No recommendation data found. Please go back and describe your problem.";
    return <RecommendationSkeleton message={message} />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Your AI-Powered Recommendation</h1>
        <p className="text-muted-foreground mt-2">Based on your description, here's what we think is the best fit for you.</p>
      </div>

      {/* Top Recommendation */}
      <Card className="border-2 border-primary/50 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">{topTherapy.name}</CardTitle>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary px-3 py-1 bg-primary/10 rounded-full">
              <Star className="w-4 h-4" />
              <span>Top Match</span>
            </div>
          </div>
          <CardDescription>{topTherapy.descriptionShort}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card className="bg-muted/50 p-4">
            <CardHeader className="p-0 mb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-primary" /> Why we recommend this
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 text-sm">
              <p>{result.top.reason}</p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
                <h4 className="font-semibold">Suggested Plan</h4>
                <p className="text-muted-foreground">{result.top.plan.sessions} sessions, {result.top.plan.freq}</p>
            </div>
             <div className="space-y-2">
                <h4 className="font-semibold">Key Benefits</h4>
                <ul className="space-y-1">
                    {topTherapy.benefits.slice(0, 3).map(benefit => (
                         <li key={benefit} className="flex items-center gap-2 text-muted-foreground">
                            <CheckCircle className="w-4 h-4 text-green-500" />
                            <span>{benefit}</span>
                        </li>
                    ))}
                </ul>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button className="w-full" asChild>
                <a href={result.square.bookingLink} target="_blank" rel="noopener noreferrer">Book with Square</a>
            </Button>
            <Button variant="outline" className="w-full" asChild>
                <Link href={`/therapies`}>View Details</Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alternatives */}
      {altTherapies.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center">Other Good Options</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {altTherapies.map(therapy => (
              <Card key={therapy.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{therapy.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col justify-between">
                  <p className="text-sm text-muted-foreground mb-4">{therapy.descriptionShort}</p>
                  <Button variant="secondary" className="w-full" asChild>
                     <Link href={`/therapies`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
       <div className="text-center">
            <Button variant="ghost" asChild>
                <Link href="/therapies/choose">‹ Start Over</Link>
            </Button>
       </div>
    </div>
  );
}

function RecommendationSkeleton({ message }: { message: string }) {
    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <div className="text-center">
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-7 w-1/2" />
                    <Skeleton className="h-4 w-full mt-2" />
                </CardHeader>
                <CardContent className="space-y-4">
                    <p>{message}</p>
                    <Skeleton className="h-10 w-full" />
                </CardContent>
            </Card>
        </div>
    )
}

export default function RecommendationPage() {
    return (
        <Suspense fallback={<RecommendationSkeleton message="Analyzing your recommendation..." />}>
            <RecommendationContent />
        </Suspense>
    )
}
