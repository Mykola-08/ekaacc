'use client';

import { useState } from 'react';
import { createBookingAction, submitPaymentProofAction } from '@/app/actions/booking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { StripeWrapper } from '@/components/payment/StripeWrapper';
import { StripePaymentForm } from '@/components/payment/StripePaymentForm';
import { Upload, CreditCard, Wallet, Banknote, CheckCircle } from 'lucide-react';

interface BookingFormProps {
  therapistId: string;
  slot: { start: string; end: string };
  serviceId: string;
  price: number;
  therapistName: string;
}

export function BookingForm({ therapistId, slot, serviceId, price, therapistName }: BookingFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'stripe' | 'pay_at_place' | 'bizum'>('stripe');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'select' | 'payment' | 'upload' | 'success'>('select');
  const [bookingData, setBookingData] = useState<{ bookingId?: string; clientSecret?: string } | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleCreateBooking = async () => {
    setLoading(true);
    const result = await createBookingAction(therapistId, slot, serviceId, price, paymentMethod);
    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.success && result.data) {
      setBookingData(result.data);
      
      if (result.data.status === 'scheduled') {
        setStep('success');
        toast.success('Booking confirmed!');
      } else if (result.data.clientSecret && paymentMethod === 'stripe') {
        setStep('payment');
      } else if (paymentMethod === 'bizum') {
        setStep('upload');
      }
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !bookingData?.bookingId) return;

    setUploading(true);
    
    // In a real app, upload to storage (Supabase Storage) and get URL
    // For this demo, we'll simulate it or assume we have an upload endpoint
    // TODO: Implement actual file upload to Supabase Storage
    // const { data, error } = await supabase.storage.from('proofs').upload(...)
    
    // Mocking URL for now
    const mockUrl = 'https://example.com/proof.jpg'; 
    
    const result = await submitPaymentProofAction(bookingData.bookingId, mockUrl);
    setUploading(false);

    if (result.success && result.data?.verified) {
      setStep('success');
      toast.success('Payment verified and booking confirmed!');
    } else {
      toast.error(result.data?.message || result.error || 'Verification failed');
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Book Session</CardTitle>
        <CardDescription>with {therapistName}</CardDescription>
      </CardHeader>
      <CardContent>
        {step === 'select' && (
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium">Time: {new Date(slot.start).toLocaleString()}</p>
              <p className="text-sm font-medium">Price: €{price}</p>
            </div>
            
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <RadioGroup value={paymentMethod} onValueChange={(v: any) => setPaymentMethod(v)}>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="flex items-center cursor-pointer flex-1">
                    <CreditCard className="w-4 h-4 mr-2" /> Card (Stripe)
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet" className="flex items-center cursor-pointer flex-1">
                    <Wallet className="w-4 h-4 mr-2" /> Wallet
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="bizum" id="bizum" />
                  <Label htmlFor="bizum" className="flex items-center cursor-pointer flex-1">
                    <span className="font-bold mr-2 text-red-500">B</span> Bizum
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border p-3 rounded-md">
                  <RadioGroupItem value="pay_at_place" id="pay_at_place" />
                  <Label htmlFor="pay_at_place" className="flex items-center cursor-pointer flex-1">
                    <Banknote className="w-4 h-4 mr-2" /> Pay at Place
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {step === 'payment' && bookingData?.clientSecret && (
          <StripeWrapper clientSecret={bookingData.clientSecret}>
            <StripePaymentForm onSuccess={() => setStep('success')} />
          </StripeWrapper>
        )}

        {step === 'upload' && (
          <div className="space-y-4 text-center">
            <div className="p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
              Please send €{price} via Bizum to <strong>+34 600 000 000</strong> and upload the screenshot.
            </div>
            <div className="border-2 border-dashed rounded-lg p-8">
              <Label htmlFor="proof" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="w-8 h-8 text-muted-foreground" />
                <span>Upload Payment Proof</span>
                <Input 
                  id="proof" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  disabled={uploading}
                />
              </Label>
            </div>
            {uploading && <p className="text-sm text-muted-foreground">Verifying payment...</p>}
          </div>
        )}

        {step === 'success' && (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
            <h3 className="text-xl font-bold">Booking Confirmed!</h3>
            <p className="text-center text-muted-foreground">
              Your session has been successfully scheduled.
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        {step === 'select' && (
          <Button className="w-full" onClick={handleCreateBooking} disabled={loading}>
            {loading ? 'Processing...' : 'Confirm Booking'}
          </Button>
        )}
        {step === 'success' && (
          <Button className="w-full" variant="outline" onClick={() => window.location.reload()}>
            Book Another
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
