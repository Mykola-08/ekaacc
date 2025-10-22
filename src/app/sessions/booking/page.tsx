"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useData } from "@/context/unified-data-context";
import fxService from '@/lib/fx-service';
import { SessionAssessmentForm } from '@/components/eka/forms';
import { useToast } from "@/hooks/use-toast";
import { Clock, User, Briefcase } from "lucide-react";
import { useRouter } from "next/navigation";
import { AITherapyRecommendations } from "@/components/eka/ai-therapy-recommendations";
import { Sparkles } from "lucide-react";

export default function SessionBookingPage() {
  const { currentUser } = useData();
  const { toast } = useToast();
  const router = useRouter();
  
  const [step, setStep] = useState<'therapy' | 'therapist' | 'service' | 'datetime' | 'confirm'>(
    currentUser?.role === 'Therapist' ? 'therapy' : 'therapy'
  );
  const [showAIRecommendations, setShowAIRecommendations] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState<string>('');
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [isBooked, setIsBooked] = useState(false);

  // Use unified data when available
  const { allUsers, services: dataServices } = useData();
  const therapists = (allUsers || []).filter((u:any) => u.role === 'Therapist').map(t => ({ id: t.id, name: t.displayName || t.email, specialization: (t as any).specialization || 'Therapy' }));
  const services = (dataServices || []).length > 0 ? (dataServices || []).map((s:any) => ({ id: s.id, name: s.name, duration: s.durationMinutes || s.duration || 60, price: s.priceEUR || s.price || 80 })) : [
    { id: 'service1', name: 'Initial Consultation', duration: 60, price: 80 },
    { id: 'service2', name: 'Physical Therapy Session', duration: 45, price: 65 },
    { id: 'service3', name: 'Pain Management Session', duration: 60, price: 75 },
    { id: 'service4', name: 'Follow-up Session', duration: 30, price: 50 },
  ];

  const availableTimes = [
    '09:00', '10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleBook = () => {
    if (!selectedDate || !selectedTime || !selectedService) {
      toast({
        variant: 'destructive',
        title: "Missing Information",
        description: "Please complete all booking details.",
      });
      return;
    }

    setIsBooked(true);
    toast({
      title: "Session Booked Successfully!",
      description: `Your session is scheduled for ${selectedDate.toLocaleDateString()} at ${selectedTime}.`,
    });

    // Redirect to dashboard after 2 seconds
    setTimeout(() => {
      if (currentUser?.role === 'Therapist') {
        router.push('/therapist/dashboard');
      } else {
        router.push('/home');
      }
    }, 2000);
  };

  const canProceedToNext = () => {
    if (step === 'therapist') return selectedTherapist !== '';
    if (step === 'service') return selectedService !== '';
    if (step === 'datetime') return selectedDate !== undefined && selectedTime !== '';
    return false;
  };

  const handleNext = () => {
  if (step === 'therapy') setStep(currentUser?.role === 'Therapist' ? 'service' : 'therapist');
  else if (step === 'therapist') setStep('service');
    else if (step === 'service') setStep('datetime');
    else if (step === 'datetime') setStep('confirm');
  };

  const handleBack = () => {
    if (step === 'confirm') setStep('datetime');
    else if (step === 'datetime') setStep('service');
    else if (step === 'service') {
      setStep(currentUser?.role === 'Therapist' ? 'therapy' : 'therapist');
    }
    else if (step === 'therapist') setStep('therapy');
    else if (step === 'therapy') router.back();
  };

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Book a Therapy Session</h1>
        <p className="text-muted-foreground">Schedule your appointment in a few simple steps.</p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-8">
        {(currentUser?.role !== 'Therapist' ? ['therapy', 'therapist', 'service', 'datetime', 'confirm'] : ['therapy', 'service', 'datetime', 'confirm']).map((s, idx) => (
          <div key={s} className="flex items-center flex-1">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              step === s ? 'border-primary bg-primary text-primary-foreground' : 
              ['therapy', 'therapist', 'service', 'datetime', 'confirm'].indexOf(step) > ['therapy', 'therapist', 'service', 'datetime', 'confirm'].indexOf(s) ?
              'border-primary bg-primary text-primary-foreground' : 'border-muted bg-background'
            }`}>
              {idx + 1}
            </div>
            {idx < (currentUser?.role === 'Therapist' ? 3 : 4) && (
              <div className={`flex-1 h-0.5 mx-2 ${
                ['therapy', 'therapist', 'service', 'datetime', 'confirm'].indexOf(step) > ['therapy', 'therapist', 'service', 'datetime', 'confirm'].indexOf(s) ?
                'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {step === 'therapy' && 'Choose Your Therapy'}
            {step === 'therapist' && 'Select a Therapist'}
            {step === 'service' && 'Choose a Service'}
            {step === 'datetime' && 'Pick Date & Time'}
            {step === 'confirm' && 'Confirm Booking'}
          </CardTitle>
          <CardDescription>
            {step === 'therapy' && 'Browse recommended therapies or explore all available services.'}
            {step === 'therapist' && 'Choose the therapist you would like to see.'}
            {step === 'service' && 'Select the type of session you need.'}
            {step === 'datetime' && 'Choose your preferred date and time.'}
            {step === 'confirm' && 'Review your booking details.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 'therapy' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Button
                  variant={!showAIRecommendations ? 'default' : 'outline'}
                  onClick={() => setShowAIRecommendations(false)}
                  className="flex-1 mr-2"
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  All Therapies
                </Button>
                <Button
                  variant={showAIRecommendations ? 'default' : 'outline'}
                  onClick={() => setShowAIRecommendations(true)}
                  className="flex-1 ml-2"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  AI Recommended
                </Button>
              </div>

              {showAIRecommendations ? (
                <div className="space-y-4">
                  <AITherapyRecommendations />
                  <p className="text-sm text-muted-foreground text-center">
                    These recommendations are based on your profile and recent activity
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                  {services.map((service) => (
                    <Card 
                      key={service.id}
                      className="cursor-pointer transition-all hover:shadow-md"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <Briefcase className="h-8 w-8 text-primary" />
                          <p className="font-semibold text-lg">€{service.price}</p>
                        </div>
                        <h3 className="font-semibold mb-1">{service.name}</h3>
                        <p className="text-sm text-muted-foreground mb-3">{service.duration} minutes</p>
                        <Button 
                          variant="outline" 
                          className="w-full"
                          onClick={() => {
                            setSelectedService(service.id);
                            handleNext();
                          }}
                        >
                          Select Therapy
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 'therapist' && (
            <div className="space-y-4">
              {therapists.map((therapist) => (
                <Card 
                  key={therapist.id}
                  className={`cursor-pointer transition-all ${
                    selectedTherapist === therapist.id ? 'border-primary ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTherapist(therapist.id)}
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <User className="h-10 w-10 text-muted-foreground" />
                    <div>
                      <p className="font-semibold">{therapist.name}</p>
                      <p className="text-sm text-muted-foreground">{therapist.specialization}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {step === 'service' && (
            <div className="space-y-4">
              {services.map((service) => (
                <Card 
                  key={service.id}
                  className={`cursor-pointer transition-all ${
                    selectedService === service.id ? 'border-primary ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedService(service.id)}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <Briefcase className="h-10 w-10 text-muted-foreground" />
                      <div>
                        <p className="font-semibold">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.duration} minutes</p>
                      </div>
                    </div>
                    <p className="font-semibold">€{service.price}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {step === 'datetime' && (
            <div className="space-y-6">
              <div>
                <Label className="mb-2 block">Select Date</Label>
                <Calendar
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="border rounded-md"
                  disabled={(date) => date < new Date()}
                />
              </div>
              {selectedDate && (
                <div>
                  <Label className="mb-2 block">Select Time</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {availableTimes.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? 'default' : 'outline'}
                        onClick={() => setSelectedTime(time)}
                        className="flex items-center gap-2"
                      >
                        <Clock className="h-4 w-4" />
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4 space-y-2">
                  {currentUser?.role !== 'Therapist' && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Therapist:</span>
                      <span className="font-semibold">
                        {therapists.find(t => t.id === selectedTherapist)?.name}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-semibold">
                      {services.find(s => s.id === selectedService)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-semibold">{selectedDate?.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-semibold">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-semibold">
                      {services.find(s => s.id === selectedService)?.duration} minutes
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="font-semibold">Total:</span>
                    <span className="font-semibold text-lg">
                      €{services.find(s => s.id === selectedService)?.price}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            {!isBooked && step !== 'therapy' && (
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
            )}
            {step !== 'confirm' && (
              <Button 
                onClick={handleNext} 
                disabled={!canProceedToNext()}
                className="flex-1"
              >
                Next
              </Button>
            )}
            {step === 'confirm' && (
              <Button 
                onClick={handleBook} 
                disabled={isBooked}
                className="flex-1"
              >
                {isBooked ? "Booked!" : "Confirm Booking"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {isBooked && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 text-center">
            <p className="text-green-700 font-semibold">
              ✓ Your session has been booked successfully!
            </p>
            <p className="text-sm text-green-600 mt-1">
              You will be redirected to your dashboard...
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
