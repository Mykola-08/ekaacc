'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { BookingCalendar } from '@/components/booking/booking-calendar'
import {
  Check,
  ArrowLeft,
  Sparkles,
  CalendarDays,
} from 'lucide-react'
import { format } from 'date-fns'

export default function BookingPageRevised() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [isBooking, setIsBooking] = useState(false)

  const handleSelectSlot = (date: Date, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
  }

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast({
        variant: 'destructive',
        title: 'Missing information',
        description: 'Please select a date and time for your session',
      })
      return
    }

    setIsBooking(true)
    
    // Simulate booking API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    toast({
      title: 'Session booked successfully!',
      description: `Your session is scheduled for ${format(selectedDate, 'PPP')} at ${selectedTime}`,
    })
    
    // Redirect to sessions page after 2 seconds
    setTimeout(() => {
      router.push('/sessions')
    }, 2000)
  }

  return (
    <div className="container mx-auto py-8 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-3xl font-bold">Book a Session</h1>
          </div>
          <p className="text-muted-foreground ml-12">
            Choose your therapy type, select a date, and pick your preferred time
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>AI-powered recommendations available</span>
        </div>
      </div>

      {/* Calendar Component */}
      <BookingCalendar
        onSelectSlot={handleSelectSlot}
        selectedDate={selectedDate}
        selectedTime={selectedTime}
      />

      {/* Confirm Button */}
      {selectedDate && selectedTime && (
        <Card className="border-primary bg-gradient-to-r from-primary/5 to-primary/10">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary text-primary-foreground">
                  <CalendarDays className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Ready to book?</h3>
                  <p className="text-sm text-muted-foreground">
                    Confirm your appointment for {format(selectedDate, 'PPP')} at {selectedTime}
                  </p>
                </div>
              </div>
              <Button
                size="lg"
                onClick={handleConfirmBooking}
                disabled={isBooking}
                className="min-w-[160px]"
              >
                {isBooking ? (
                  <>
                    <Check className="mr-2 h-5 w-5 animate-pulse" />
                    Booking...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-5 w-5" />
                    Confirm Booking
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
