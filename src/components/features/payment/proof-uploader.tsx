'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Camera, Upload, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const proofSchema = z.object({
  proofType: z.enum(['image', 'reference_code']),
  referenceCode: z.string().optional(),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  }),
});

interface ProofUploaderProps {
  bookingId?: string;
  amountDue?: number; // In Euros usually
  onSuccess?: () => void;
}

export function PaymentProofUploader({ bookingId, amountDue, onSuccess }: ProofUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof proofSchema>>({
    resolver: zodResolver(proofSchema),
    defaultValues: {
      proofType: 'image',
      amount: amountDue ? amountDue.toString() : '',
    },
  });

  const proofType = form.watch('proofType');

  async function onSubmit(values: z.infer<typeof proofSchema>) {
    setIsSubmitting(true);
    try {
      // Simulate submission of data
      // await submitProof({ ...values, bookingId });

      await new Promise((r) => setTimeout(r, 2000)); // Fake delay

      toast.success('Proof Submitted', {
        description: 'Your payment verification is pending review.',
      });
      setIsOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error('Error', {
        description: 'Failed to submit proof.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Verify Payment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify Payment</DialogTitle>
          <DialogDescription>Upload a receipt or enter a transaction reference.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="proofType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Method</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select proof type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="image">Screenshot / Photo</SelectItem>
                      <SelectItem value="reference_code">Reference Number</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount Paid (€)</FormLabel>
                  <FormControl>
                    <Input placeholder="50.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {proofType === 'reference_code' && (
              <FormField
                control={form.control}
                name="referenceCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Transaction ID / Ref</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. TRX-123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {proofType === 'image' && (
              <div className="border-muted-foreground/25 hover:bg-muted/50 flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors">
                <Upload className="text-muted-foreground mb-2 h-8 w-8" />
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-muted-foreground text-xs">JPG, PNG up to 5MB</p>
                <Input type="file" className="hidden" accept="image/*" />
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
                </>
              ) : (
                'Submit Proof'
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
