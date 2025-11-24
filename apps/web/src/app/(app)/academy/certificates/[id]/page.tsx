'use client';

import { useEffect, useState, use } from 'react';
import { academyService } from '@/services/academy-service';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Award, Download, Share2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';

export default function CertificatePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [certificate, setCertificate] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const data = await academyService.getCertificate(id);
        setCertificate(data);
      } catch (error) {
        console.error('Failed to fetch certificate:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="p-8">Loading certificate...</div>;
  if (!certificate) return <div className="p-8">Certificate not found</div>;

  return (
    <div className="container mx-auto py-8 space-y-8 print:p-0 print:space-y-0">
      <div className="flex justify-between items-center print:hidden">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Certificates
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Download className="w-4 h-4 mr-2" />
            Download / Print
          </Button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <Card className="p-12 border-4 border-double border-primary/20 bg-card relative overflow-hidden print:border-4 print:shadow-none">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]" />
          </div>

          <div className="relative z-10 text-center space-y-8">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-primary/10 rounded-full border-2 border-primary/20">
                <Award className="w-16 h-16 text-primary" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight text-primary">
                Certificate of Completion
              </h1>
              <p className="text-muted-foreground uppercase tracking-widest text-sm">
                This certifies that
              </p>
            </div>

            <div className="py-4 border-b-2 border-primary/10 max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold">
                {certificate.user?.raw_user_meta_data?.full_name || certificate.user?.email || 'Student'}
              </h2>
            </div>

            <div className="space-y-2">
              <p className="text-muted-foreground uppercase tracking-widest text-sm">
                Has successfully completed the course
              </p>
              <h3 className="text-2xl md:text-3xl font-serif font-bold text-foreground">
                {certificate.course.title}
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto pt-12">
              <div className="text-center space-y-2">
                <div className="h-px bg-foreground/20 w-full" />
                <p className="font-serif italic text-lg">
                  {certificate.course.instructor?.full_name || 'Academy Instructor'}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Instructor</p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-px bg-foreground/20 w-full" />
                <p className="font-serif italic text-lg">
                  {format(new Date(certificate.issued_at), 'MMMM d, yyyy')}
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Date Issued</p>
              </div>
            </div>

            <div className="pt-12 text-center">
              <p className="text-xs text-muted-foreground font-mono">
                Certificate ID: {certificate.verification_code}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Verify at {typeof window !== 'undefined' ? window.location.origin : ''}/verify/{certificate.verification_code}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
