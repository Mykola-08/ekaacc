import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { Calendar, CreditCard, Clock, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

interface BookingResultProps {
  bookings: any[];
}

export function BookingResult({ bookings: initialBookings }: BookingResultProps) {
  const [bookings, setBookings] = useState(initialBookings);

  useEffect(() => {
    setBookings(initialBookings);
  }, [initialBookings]);

  useRealtimeSubscription({
    table: 'booking',
    event: '*',
    callback: (payload) => {
      if (payload.eventType === 'UPDATE') {
        setBookings(prev => prev.map(b => 
          b.id === payload.new.id ? { ...b, ...payload.new } : b
        ));
      } else if (payload.eventType === 'DELETE') {
        setBookings(prev => prev.filter(b => b.id !== payload.old.id));
      }
    }
  });

  if (!bookings || bookings.length === 0) {
    return (
      <div className="p-3 bg-muted/40 rounded-lg text-sm text-muted-foreground">
        No bookings found matching your request.
      </div>
    );
  }

  return (
    <div className="space-y-2 my-2 w-full">
      {bookings.map((booking) => (
        <Card key={booking.id} className="p-3 border-border/60 bg-white/50 dark:bg-slate-900/50 transition-all duration-300">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium text-sm text-foreground">{booking.service?.name || "Service"}</h4>
              <p className="text-xs text-muted-foreground">{booking.staff?.name || "Staff"}</p>
            </div>
            <Badge variant={booking.status === 'scheduled' ? 'default' : 'secondary'} className="text-[10px] h-5">
              {booking.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <Calendar className="w-3 h-3" />
            {format(new Date(booking.start_time), 'MMM d, yyyy')}
            <Clock className="w-3 h-3 ml-1" />
            {format(new Date(booking.start_time), 'h:mm a')}
          </div>
        </Card>
      ))}
    </div>
  );
}

interface ServiceResultProps {
    services: any[];
    onSelect?: (serviceId: string) => void;
}
  
export function ServiceResult({ services, onSelect }: ServiceResultProps) {
    if (!services || services.length === 0) {
        return <div className="text-sm text-muted-foreground">No services found.</div>;
    }

    return (
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
            {services.map(service => (
                <Card key={service.id} className="min-w-[200px] p-3 flex-shrink-0 snap-center border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-slate-900/50">
                    <h4 className="font-semibold text-sm mb-1">{service.name}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{service.description}</p>
                    <div className="flex justify-between items-center text-xs font-medium mb-2">
                        <span>€{service.price_amount}</span>
                        <span>{service.duration_min} min</span>
                    </div>
                    <Button 
                        size="sm" 
                        variant="secondary" 
                        className="w-full text-xs h-7 bg-white/50 hover:bg-white border border-indigo-200 dark:border-indigo-800"
                        onClick={() => {
                            const event = new CustomEvent('ai_service_selected', { detail: { name: service.name, id: service.id } });
                            document.dispatchEvent(event);
                        }}
                    >
                        Check Availability
                    </Button>
                </Card>
            ))}
        </div>
    );
}

interface WalletResultProps {
    balance: number;
    currency: string;
}

export function WalletResult({ balance: initialBalance, currency }: WalletResultProps) {
    const [balance, setBalance] = useState(initialBalance);

    useRealtimeSubscription({
        table: 'user_wallet',
        event: 'UPDATE',
        callback: (payload) => {
            if (payload.new && typeof payload.new.balance_cents === 'number') {
                setBalance(payload.new.balance_cents / 100);
            }
        }
    });

    return (
        <Card className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg my-2">
            <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-medium text-indigo-100">Digital Wallet</span>
                <CreditCard className="w-4 h-4 text-indigo-100" />
            </div>
            <div className="space-y-1">
                <div className="text-2xl font-bold tracking-tight">€{balance.toFixed(2)}</div>
                <div className="text-xs text-indigo-100">Current Balance</div>
            </div>
        </Card>
    )
}

interface AvailabilityResultProps {
  slots: any[];
}

export function AvailabilityResult({ slots }: AvailabilityResultProps) {
  if (!slots || slots.length === 0) {
    return <div className="text-sm text-muted-foreground">No slots available for this date.</div>;
  }

  // Deduplicate slots by start time
  const uniqueStartTimes = Array.from(new Set(slots.map(s => s.startTime))).sort();

  return (
    <div className="flex flex-wrap gap-2 my-2">
      {uniqueStartTimes.map((time) => (
        <Badge 
          key={time} 
          variant="outline" 
          className="cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 py-1.5 px-3 transition-colors border-purple-200 dark:border-purple-800"
          onClick={() => {
            const event = new CustomEvent('ai_slot_selected', { detail: time });
            document.dispatchEvent(event);
          }}
        >
          {format(new Date(time), 'h:mm a')}
        </Badge>
      ))}
    </div>
  );
}

interface BookingConfirmationProps {
    bookingId?: string;
    details?: {
        serviceId: string;
        dateTime: string;
    };
    message?: string;
}

import { CheckCircle2 } from "lucide-react";

export function BookingConfirmation({ bookingId, details, message }: BookingConfirmationProps) {
    return (
        <Card className="p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 my-2">
            <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                    <h4 className="font-semibold text-green-900 dark:text-green-100">Booking Confirmed!</h4>
                    <p className="text-xs text-green-700 dark:text-green-300">
                        {message || "Your appointment has been successfully scheduled."}
                    </p>
                    {details && (
                        <p className="text-xs text-green-600/80 mt-1 font-medium">
                            {format(new Date(details.dateTime), 'EEEE, MMMM d @ h:mm a')}
                        </p>
                    )}
                </div>
            </div>
            <div className="mt-3 flex gap-2">
                 <Button size="sm" variant="outline" className="text-xs h-7 bg-white/50 border-green-200 hover:bg-white" onClick={() => window.location.href = '/bookings'}>
                    View Bookings
                 </Button>
            </div>
        </Card>
    );
}
