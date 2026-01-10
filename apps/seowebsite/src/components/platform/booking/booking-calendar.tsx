'use client'

import { useState } from 'react'
import { Button } from '@/components/platform/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card'
import { cn } from '@/lib/platform/utils'
import {
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
  User,
  Stethoscope,
  Smile,
  Brain,
  Heart,
  Users,
} from 'lucide-react'
import { format, addDays, startOfWeek, isSameDay, isToday, isPast } from 'date-fns'

interface TimeSlot {
  time: string
  available: boolean
  therapist?: string
}

interface BookingCalendarProps {
  onSelectSlot?: (date: Date, time: string) => void
  selectedDate?: Date
  selectedTime?: string
}

const therapyTypes = [
  {
    id: 'individual',
    name: 'Individual Therapy',
    icon: User,
    description: 'One-on-one session',
    duration: 60,
    price: 80,
    color: 'bg-blue-500',
  },
  {
    id: 'cognitive',
    name: 'Cognitive Behavioral',
    icon: Brain,
    description: 'CBT techniques',
    duration: 60,
    price: 100,
    color: 'bg-purple-500',
  },
  {
    id: 'wellness',
    name: 'Wellness & Mindfulness',
    icon: Smile,
    description: 'Holistic approach',
    duration: 45,
    price: 65,
    color: 'bg-green-500',
  },
  {
    id: 'couples',
    name: "Couples Therapy",
    icon: Heart,
    description: 'Relationship counseling',
    duration: 90,
    price: 120,
    color: 'bg-pink-500',
  },
  {
    id: 'group',
    name: 'Group Session',
    icon: Users,
    description: 'Small group therapy',
    duration: 90,
    price: 45,
    color: 'bg-orange-500',
  },
  {
    id: 'specialist',
    name: 'Specialist Consultation',
    icon: Stethoscope,
    description: 'Expert assessment',
    duration: 75,
    price: 140,
    color: 'bg-indigo-500',
  },
]

const timeSlots: TimeSlot[] = [
  { time: '09:00', available: true },
  { time: '10:00', available: true },
  { time: '11:00', available: false },
  { time: '12:00', available: true },
  { time: '13:00', available: false },
  { time: '14:00', available: true },
  { time: '15:00', available: true },
  { time: '16:00', available: true },
  { time: '17:00', available: false },
  { time: '18:00', available: true },
]

export function BookingCalendar({ onSelectSlot, selectedDate: propSelectedDate, selectedTime: propSelectedTime }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(propSelectedDate)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(propSelectedTime)
  const [selectedTherapy, setSelectedTherapy] = useState<string | undefined>()
  const [view, setView] = useState<'week' | 'day'>('week')

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 }) // Monday
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const handlePreviousWeek = () => {
    setCurrentDate(addDays(currentDate, -7))
  }

  const handleNextWeek = () => {
    setCurrentDate(addDays(currentDate, 7))
  }

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setView('day')
  }

  const handleTimeSelect = (time: string) => {
    if (!selectedDate) return
    setSelectedTime(time)
    onSelectSlot?.(selectedDate, time)
  }

  const isDateSelected = (date: Date) => {
    return selectedDate && isSameDay(date, selectedDate)
  }

  return (
    <div className="space-y-6">
      {/* Therapy Type Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Stethoscope className="h-5 w-5 text-primary" />
          Choose Your Therapy Type
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {therapyTypes.map((therapy) => {
            const Icon = therapy.icon
            return (
              <Card
                key={therapy.id}
                className={cn(
                  'cursor-pointer transition-all hover:shadow-lg',
                  selectedTherapy === therapy.id && 'ring-2 ring-primary shadow-lg scale-[1.02]'
                )}
                onClick={() => setSelectedTherapy(therapy.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold">{therapy.name}</h4>
                      <p className="text-sm text-muted-foreground">{therapy.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {therapy.duration}min
                        </span>
                        <span className="font-semibold text-primary">€{therapy.price}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Calendar Section */}
      {selectedTherapy && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  {view === 'week' ? 'Select a Day' : 'Select a Time'}
                </CardTitle>
                <CardDescription>
                  {view === 'week' 
                    ? 'Choose your preferred date'
                    : format(selectedDate!, 'EEEE, MMMM d, yyyy')
                  }
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {view === 'day' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setView('week')}
                  >
                    Back to Week View
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousWeek}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextWeek}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {view === 'week' ? (
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day) => {
                  const isPastDate = isPast(day) && !isToday(day)
                  const selected = isDateSelected(day)
                  const today = isToday(day)
                  
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => !isPastDate && handleDateSelect(day)}
                      disabled={isPastDate}
                      className={cn(
                        'flex flex-col items-center justify-center p-4 rounded-lg border transition-all',
                        'hover:shadow-md hover:bg-muted/50',
                        isPastDate && 'opacity-40 cursor-not-allowed',
                        selected && 'bg-primary text-primary-foreground border-primary shadow-lg',
                        today && !selected && 'border-primary border-2',
                        !selected && !today && 'hover:border-primary/50'
                      )}
                    >
                      <span className="text-xs font-medium mb-1">
                        {format(day, 'EEE')}
                      </span>
                      <span className="text-2xl font-bold">
                        {format(day, 'd')}
                      </span>
                      <span className="text-xs mt-1">
                        {format(day, 'MMM')}
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? 'default' : 'outline'}
                    className={cn(
                      'h-auto py-3 flex flex-col items-center gap-1',
                      !slot.available && 'opacity-50 cursor-not-allowed'
                    )}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                  >
                    <Clock className="h-4 w-4" />
                    <span className="font-semibold">{slot.time}</span>
                    {!slot.available && (
                      <span className="text-xs">Booked</span>
                    )}
                  </Button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Selection Summary */}
      {selectedTherapy && selectedDate && selectedTime && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Calendar className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold mb-2">Booking Summary</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Therapy Type:</span>
                    <span className="font-medium">
                      {therapyTypes.find(t => t.id === selectedTherapy)?.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium">{format(selectedDate, 'PPP')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-semibold text-primary text-lg">
                      €{therapyTypes.find(t => t.id === selectedTherapy)?.price}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
