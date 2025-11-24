'use client';

import { useEffect, useState } from 'react';
import { academyService } from '@/services/academy-service';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Calendar, Download, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

export default function CertificatesPage() {
  const { user } = useAuth();
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      if (!user) return;
      try {
        const data = await academyService.getUserCertificates(user.id);
        setCertificates(data);
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [user]);

  if (loading) return <div className="p-8">Loading certificates...</div>;

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full">
          <Award className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">My Certificates</h1>
          <p className="text-muted-foreground">View and download your earned certificates</p>
        </div>
      </div>

      {certificates.length === 0 ? (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Award className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-medium">No certificates yet</h3>
            <p className="text-muted-foreground max-w-sm mt-2 mb-6">
              Complete courses to earn certificates. Start learning today!
            </p>
            <Link href="/academy">
              <Button>Browse Courses</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {certificates.map((cert) => (
            <Card key={cert.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500" />
              <CardHeader>
                <CardTitle className="line-clamp-2">{cert.course.title}</CardTitle>
                <CardDescription>
                  Instructor: {cert.course.instructor?.full_name || 'Academy Instructor'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  Issued: {format(new Date(cert.issued_at), 'MMMM d, yyyy')}
                </div>
                <div className="text-xs font-mono bg-muted p-2 rounded">
                  ID: {cert.verification_code}
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 bg-muted/20 p-4">
                <Link href={`/academy/certificates/${cert.id}`} className="w-full">
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
