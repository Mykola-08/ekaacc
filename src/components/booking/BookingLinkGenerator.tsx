'use client';

import React, { useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Link01Icon,
  Copy01Icon,
  CheckmarkCircle01Icon,
  Loading03Icon,
} from '@hugeicons/core-free-icons';
import { cn } from '@/lib/utils';
import {
  getActiveServicesAction,
  getTherapistsAction,
  fetchServiceAction,
} from '@/server/actions/booking-actions';
import { toast } from 'sonner';

export function BookingLinkGenerator() {
  const [services, setServices] = useState<any[]>([]);
  const [therapists, setTherapists] = useState<any[]>([]);
  const [serviceVariants, setServiceVariants] = useState<any[]>([]);

  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    async function loadInitialData() {
      setIsLoading(true);
      try {
        const [servicesRes, therapistsRes] = await Promise.all([
          getActiveServicesAction(),
          getTherapistsAction(),
        ]);
        if (servicesRes.success) setServices(servicesRes.data || []);
        if (therapistsRes.success) setTherapists(therapistsRes.data || []);
      } catch (err) {
        toast.error('Failed to load initial data.');
      } finally {
        setIsLoading(false);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function fetchVariants() {
      if (!selectedService) {
        setServiceVariants([]);
        return;
      }
      const res = await fetchServiceAction(selectedService);
      if (res.success && res.data) {
        setServiceVariants(res.data.variants || []);
        // Auto-select first if only one
        if (res.data.variants && res.data.variants.length > 0) {
          setSelectedVariant(res.data.variants[0].id);
        } else {
          setSelectedVariant('');
        }
      }
    }
    fetchVariants();
  }, [selectedService]);

  const generateLink = () => {
    if (!selectedService) return '';
    const serviceObj = services.find((s) => s.id === selectedService);
    if (!serviceObj) return '';

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const params = new URLSearchParams();

    params.set('service', serviceObj.slug || serviceObj.id);
    if (selectedVariant) params.set('variant', selectedVariant);
    if (selectedTherapist && selectedTherapist !== 'none')
      params.set('therapist', selectedTherapist);
    if (notes.trim()) {
      params.set('notes', btoa(unescape(encodeURIComponent(notes.trim()))));
    }

    return `${baseUrl}/sessions/booking?${params.toString()}`;
  };

  const generatedLink = generateLink();

  const handleCopy = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setIsCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy to clipboard.');
    }
  };

  if (isLoading) {
    return (
      <div className="dashboard-theme flex h-64 items-center justify-center">
        <HugeiconsIcon icon={Loading03Icon} className="text-muted-foreground size-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card className="dashboard-theme mx-auto w-full max-w-2xl transition-all">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl font-bold">
          <HugeiconsIcon icon={Link01Icon} className="text-primary size-5" />
          Generate Booking Link
        </CardTitle>
        <CardDescription>Create a personalized booking link to send to a client.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Select Service</Label>
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a service..." />
            </SelectTrigger>
            <SelectContent>
              {services.map((svc) => (
                <SelectItem key={svc.id} value={svc.id}>
                  {svc.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {serviceVariants.length > 0 && (
          <div className="space-y-3 pt-2">
            <Label>Select Variant (Duration / Option)</Label>
            <RadioGroup
              value={selectedVariant}
              onValueChange={setSelectedVariant}
              className="grid gap-3 pt-2"
            >
              {serviceVariants.map((variant) => (
                <div key={variant.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={variant.id} id={`variant-${variant.id}`} />
                  <Label
                    htmlFor={`variant-${variant.id}`}
                    className="cursor-pointer text-sm font-normal"
                  >
                    {variant.duration_minutes} min - ${(variant.price_cents / 100).toFixed(2)}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <div className="space-y-3 pt-2">
          <Label>Assign Therapist (Optional)</Label>
          <Select value={selectedTherapist} onValueChange={setSelectedTherapist}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a therapist..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No Preference (Auto-assign)</SelectItem>
              {therapists.map((t) => (
                <SelectItem key={t.id} value={t.id}>
                  {t.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3 pt-2">
          <Label>Notes for Client (Optional, encoded in link)</Label>
          <Textarea
            placeholder="Add any specific instructions for this session..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="resize-none"
            rows={3}
          />
        </div>
      </CardContent>
      <CardFooter className="bg-muted/40 flex-col items-stretch gap-4 border-t p-6">
        <div className="space-y-2">
          <Label>Generated Link</Label>
          <div className="flex items-center gap-2">
            <div className="bg-background text-muted-foreground flex-1 truncate rounded-[var(--radius)] border p-3 font-mono text-sm select-all">
              {generatedLink || 'Select a service to generate a link'}
            </div>
            <Button
              onClick={handleCopy}
              disabled={!generatedLink}
              size="icon"
              variant="outline"
              className={cn('shrink-0', isCopied && 'border-primary text-primary')}
            >
              {isCopied ? (
                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-4" />
              ) : (
                <HugeiconsIcon icon={Copy01Icon} className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
