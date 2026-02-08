/**
 * Generative UI Components for AI Tool Results
 * Basic design - marked for design review and improvement
 *
 * @review - All components need design polish
 */
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import {
  Calendar,
  CreditCard,
  Clock,
  CheckCircle2,
  Award,
  Heart,
  TrendingUp,
  TrendingDown,
  Minus,
  Brain,
  Target,
  Sparkles,
  BookOpen,
  Activity,
  Zap,
  Moon,
  Sun,
  AlertCircle,
  Star,
  Lightbulb,
  ArrowRight,
  Dumbbell,
  Wind,
  Flower2,
  Smile,
  BarChart3,
  ListTodo,
  History,
  ShoppingBag,
  Search,
  Download,
  ArrowUpDown
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRealtimeSubscription } from "@/hooks/useRealtimeSubscription";

// ============================================================================
// BOOKING COMPONENTS
// ============================================================================

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
      <div className="p-4 bg-card rounded-xl border border-border text-sm font-medium text-muted-foreground text-center">
        No bookings found matching your request.
      </div>
    );
  }

  const sortedBookings = [...bookings].sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime());
  const upcoming = sortedBookings.filter(b => b.status === 'scheduled');
  const past = sortedBookings.filter(b => b.status !== 'scheduled');

  const renderBookingCard = (booking: any) => (
    <Card key={booking.id} className="p-5 border-border bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-sm text-foreground">{booking.service?.name || "Service"}</h4>
          <p className="text-xs text-muted-foreground">{booking.staff?.name || "Staff"}</p>
        </div>
        <Badge
          variant={booking.status === 'scheduled' ? 'default' : booking.status === 'canceled' ? 'destructive' : 'secondary'}
          className="text-xs h-5 capitalize"
        >
          {booking.status}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
        <Calendar className="w-3 h-3 text-primary/60" />
        {format(new Date(booking.start_time), 'MMM d, yyyy')}
        <Clock className="w-3 h-3 ml-1 text-primary/60" />
        {format(new Date(booking.start_time), 'h:mm a')}
      </div>
      {booking.status === 'scheduled' && (
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400"
            onClick={() => {
              const event = new CustomEvent('ai_cancel_booking', { detail: booking.id });
              document.dispatchEvent(event);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 text-xs flex-1 border-primary/20 hover:bg-primary/5"
            onClick={() => {
              const event = new CustomEvent('ai_reschedule_request', { detail: booking });
              document.dispatchEvent(event);
            }}
          >
            Reschedule
          </Button>
        </div>
      )}
    </Card>
  );

  return (
    <div className="space-y-4 my-2 w-full">
      {upcoming.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-xs font-bold uppercase tracking-widest text-primary/60 ml-1">Upcoming</h5>
          {upcoming.map(renderBookingCard)}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-2 opacity-80">
          <h5 className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Past & Canceled</h5>
          {past.slice(0, 3).map(renderBookingCard)}
        </div>
      )}
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

export function BookingConfirmation({ bookingId, details, message }: BookingConfirmationProps) {
  return (
    <Card className="p-5 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl my-2 shadow-[0_4px_20px_rgba(16,185,129,0.05)]">
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

interface AvailabilityResultProps {
  slots: any[];
}

export function AvailabilityResult({ slots }: AvailabilityResultProps) {
  if (!slots || slots.length === 0) {
    return <div className="text-sm font-medium text-muted-foreground p-4 bg-card rounded-xl text-center border border-border">No slots available for this date.</div>;
  }

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

// ============================================================================
// SERVICE COMPONENTS
// ============================================================================

interface ServiceResultProps {
  services: any[];
  onSelect?: (serviceId: string) => void;
}

export function ServiceResult({ services, onSelect }: ServiceResultProps) {
  if (!services || services.length === 0) {
    return <div className="text-sm font-medium text-muted-foreground p-4 bg-card rounded-xl text-center border border-border">No services found.</div>;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
      {services.map(service => (
        <Card key={service.id} className="min-w-[220px] p-5 flex-shrink-0 snap-center border-muted bg-white rounded-xl shadow-sm hover:shadow-md transition-all">
          <h4 className="font-semibold text-sm mb-1">{service.name}</h4>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{service.description}</p>
          <div className="flex justify-between items-center text-xs font-medium mb-2">
            <span>${service.price_amount}</span>
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

interface ServiceDetailResultProps {
  service: {
    id: string;
    name: string;
    description: string;
    duration: number;
    price: number;
    category?: string;
    variants?: any[];
  };
}

export function ServiceDetailResult({ service }: ServiceDetailResultProps) {
  return (
    <Card className="p-5 my-2 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 border border-indigo-50/50 rounded-2xl shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-base">{service.name}</h4>
          {service.category && (
            <Badge variant="secondary" className="text-xs mt-1">{service.category}</Badge>
          )}
        </div>
        <div className="text-right">
          <div className="font-bold text-lg">${service.price}</div>
          <div className="text-xs text-muted-foreground">{service.duration} min</div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
      {service.variants && service.variants.length > 0 && (
        <div className="border-t border-indigo-100 dark:border-indigo-800 pt-2 mt-2">
          <p className="text-xs font-medium mb-1">Available Options:</p>
          <div className="flex flex-wrap gap-1">
            {service.variants.map((v: any) => (
              <Badge key={v.id} variant="outline" className="text-xs">
                {v.name || `Option ${v.id}`}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

// ============================================================================
// WALLET & FINANCE COMPONENTS
// ============================================================================

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
      if (payload.new && typeof (payload.new as any).balance_cents === 'number') {
        setBalance((payload.new as any).balance_cents / 100);
      }
    }
  });

  return (
    <Card className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-xl rounded-2xl my-2">
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs font-medium text-indigo-100">Digital Wallet</span>
        <CreditCard className="w-4 h-4 text-indigo-100" />
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold tracking-tight">${balance.toFixed(2)}</div>
        <div className="text-xs text-indigo-100">Current Balance</div>
      </div>
    </Card>
  );
}

interface RewardsResultProps {
  points: number;
  lifetimePoints: number;
  tier: string;
}

export function RewardsResult({ points, lifetimePoints, tier }: RewardsResultProps) {
  const tierColors: Record<string, string> = {
    bronze: 'from-amber-600 to-amber-700',
    silver: 'from-slate-400 to-slate-500',
    gold: 'from-yellow-500 to-amber-500',
    platinum: 'from-indigo-400 to-purple-500'
  };

  return (
    <Card className={`p-6 bg-gradient-to-br ${tierColors[tier] || tierColors.bronze} text-white border-0 shadow-xl rounded-2xl my-2`}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs font-medium opacity-90">Rewards</span>
        <Award className="w-4 h-4 opacity-90" />
      </div>
      <div className="flex items-baseline gap-1 mb-1">
        <div className="text-2xl font-bold">{points.toLocaleString()}</div>
        <div className="text-sm opacity-80">pts</div>
      </div>
      <div className="flex justify-between items-center text-xs opacity-80">
        <span>Lifetime: {lifetimePoints.toLocaleString()}</span>
        <Badge className="bg-white/20 text-white hover:bg-white/30 text-xs capitalize">{tier}</Badge>
      </div>
    </Card>
  );
}

// ============================================================================
// WELLNESS & MOOD COMPONENTS
// ============================================================================

interface MoodCheckInResultProps {
  entry: {
    id: string;
    mood: number;
    energy: string;
    stress: string;
  };
  message?: string;
}

export function MoodCheckInResult({ entry, message }: MoodCheckInResultProps) {
  const moodEmoji = entry.mood >= 8 ? '😊' : entry.mood >= 6 ? '🙂' : entry.mood >= 4 ? '😐' : '😔';

  return (
    <Card className="p-5 bg-gradient-to-br from-pink-50/50 to-purple-50/50 border border-pink-100 rounded-2xl shadow-sm my-2">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-12 w-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-2xl shadow-sm">
          {moodEmoji}
        </div>
        <div>
          <h4 className="font-semibold text-sm">Mood Check-In Saved</h4>
          <p className="text-xs text-muted-foreground">{message || 'Thank you for sharing how you feel!'}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-white/80 rounded-xl p-3 shadow-sm border border-white/50">
          <div className="text-lg font-bold text-pink-600 dark:text-pink-400">{entry.mood}/10</div>
          <div className="text-xs text-muted-foreground">Mood</div>
        </div>
        <div className="bg-white/80 rounded-xl p-3 shadow-sm border border-white/50">
          <div className="text-xs font-medium capitalize text-purple-600 dark:text-purple-400">{entry.energy.replace('_', ' ')}</div>
          <div className="text-xs text-muted-foreground">Energy</div>
        </div>
        <div className="bg-white/80 rounded-xl p-3 shadow-sm border border-white/50">
          <div className="text-xs font-medium capitalize text-indigo-600 dark:text-indigo-400">{entry.stress}</div>
          <div className="text-xs text-muted-foreground">Stress</div>
        </div>
      </div>
    </Card>
  );
}

interface WellnessSummaryResultProps {
  period: string;
  averageMood: number;
  moodTrend: 'improving' | 'stable' | 'declining';
  commonEmotions: { emotion: string; count: number }[];
  averageSleep: number;
  streakDays: number;
  totalEntries: number;
}

export function WellnessSummaryResult({
  period,
  averageMood,
  moodTrend,
  commonEmotions,
  averageSleep,
  streakDays,
  totalEntries
}: WellnessSummaryResultProps) {
  const TrendIcon = moodTrend === 'improving' ? TrendingUp : moodTrend === 'declining' ? TrendingDown : Minus;
  const trendColor = moodTrend === 'improving' ? 'text-green-500' : moodTrend === 'declining' ? 'text-red-500' : 'text-gray-500';

  return (
    <Card className="p-5 my-2 border border-border bg-white rounded-2xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-500" />
          {period.charAt(0).toUpperCase() + period.slice(1)}ly Summary
        </h4>
        <Badge variant="outline" className="text-xs">{totalEntries} entries</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-3 h-3 text-purple-500" />
            <span className="text-xs text-muted-foreground">Avg Mood</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold">{averageMood}</span>
            <span className="text-xs text-muted-foreground">/10</span>
            <TrendIcon className={`w-4 h-4 ml-auto ${trendColor}`} />
          </div>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Moon className="w-3 h-3 text-indigo-500" />
            <span className="text-xs text-muted-foreground">Avg Sleep</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold">{averageSleep}</span>
            <span className="text-xs text-muted-foreground">hrs</span>
          </div>
        </div>
      </div>

      {streakDays > 0 && (
        <div className="flex items-center gap-2 bg-amber-50 dark:bg-amber-950/30 rounded-lg p-2 mb-3">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-sm font-medium">{streakDays} day streak!</span>
        </div>
      )}

      {commonEmotions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {commonEmotions.map(e => (
            <Badge key={e.emotion} variant="secondary" className="text-xs capitalize">
              {e.emotion}
            </Badge>
          ))}
        </div>
      )}
    </Card>
  );
}

interface MoodHistoryResultProps {
  entries: {
    date: Date;
    mood: number;
    energy: string;
    stress: string;
    emotions?: string[];
  }[];
}

export function MoodHistoryResult({ entries }: MoodHistoryResultProps) {
  if (!entries || entries.length === 0) {
    return <div className="text-sm text-muted-foreground p-3 bg-muted/40 rounded-lg">No mood entries found.</div>;
  }

  return (
    <div className="space-y-2 my-2">
      {entries.slice(0, 5).map((entry, i) => (
        <Card key={i} className="p-3 bg-white/50 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-sm font-bold text-purple-600 dark:text-purple-400">
                {entry.mood}
              </div>
              <div>
                <div className="text-xs font-medium">{format(new Date(entry.date), 'MMM d')}</div>
                <div className="text-xs text-muted-foreground capitalize">{entry.energy.replace('_', ' ')} energy</div>
              </div>
            </div>
            <Badge variant={entry.stress === 'minimal' || entry.stress === 'mild' ? 'secondary' : 'destructive'} className="text-xs capitalize">
              {entry.stress}
            </Badge>
          </div>
          {entry.emotions && entry.emotions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.emotions.slice(0, 3).map(e => (
                <Badge key={e} variant="outline" className="text-xs capitalize">{e}</Badge>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

interface WellnessGoalResultProps {
  goal: {
    id: string;
    title: string;
    targetType: string;
    targetValue: number;
  };
  message?: string;
}

export function WellnessGoalResult({ goal, message }: WellnessGoalResultProps) {
  return (
    <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800 border-green-200 dark:border-green-900 my-2">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center">
          <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-green-900 dark:text-green-100">Goal Created!</h4>
          <p className="text-xs text-green-700 dark:text-green-300">{message || goal.title}</p>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="text-xs border-green-200 dark:border-green-800 capitalize">
              {goal.targetType}
            </Badge>
            <span className="text-xs text-green-600 dark:text-green-400">Target: {goal.targetValue}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}

interface WellnessGoalsListResultProps {
  goals: {
    id: string;
    title: string;
    targetType: string;
    targetValue: number;
    currentValue: number;
    progress: number;
    status: string;
  }[];
}

export function WellnessGoalsListResult({ goals }: WellnessGoalsListResultProps) {
  if (!goals || goals.length === 0) {
    return (
      <Card className="p-4 my-2 bg-muted/30">
        <div className="text-center">
          <Target className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No active goals yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Set a goal to start tracking your progress!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2 my-2">
      {goals.map(goal => (
        <Card key={goal.id} className="p-3 bg-white/50 dark:bg-slate-900/50">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h4 className="font-medium text-sm">{goal.title}</h4>
              <Badge variant="outline" className="text-xs mt-1 capitalize">{goal.targetType}</Badge>
            </div>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{goal.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, goal.progress)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Current: {goal.currentValue}</span>
            <span>Target: {goal.targetValue}</span>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// RECOMMENDATION COMPONENTS
// ============================================================================

/*
- When starting a conversation, use getPersonalizedGreeting for a warm, contextual welcome
- Use generateAffirmation when user needs encouragement or is feeling down
- Suggest suggestDailyActions when asked what to do or for recommendations
- Show getProgressReport for weekly/monthly check-ins
- Use `identifyPatterns` if the user asks about their progress, habits, or cycles.
- Use `suggestBreathingExercise` if the user seems stressed, anxious, or explicitly asks for relaxation.
- Use `celebrateAchievement` periodically when the user reaches a milestone or shows consistency.
- Use `startGuidedMeditation` when the user needs a deeper relaxation session or asks to meditate.
- Use `getSleepInsights` if the user mentions poor sleep, tiredness, or asks for sleep advice.
- Use `getInteractiveGoalTracker` to show current progress on wellness goals.
- Use `getMoodCalendar` when the user wants to see a visual history of their mood.
*/
interface RecommendationsResultProps {
  services?: any[];
  exercises?: any[];
  actions?: any[];
}

export function RecommendationsResult({ services, exercises, actions }: RecommendationsResultProps) {
  return (
    <div className="space-y-3 my-2">
      {services && services.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Recommended Services
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {services.slice(0, 3).map(s => (
              <Card key={s.id} className="min-w-[160px] p-2 flex-shrink-0 bg-indigo-50/50 dark:bg-slate-900/50 border-indigo-100 dark:border-indigo-900">
                <h5 className="text-xs font-medium truncate">{s.title}</h5>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{s.reason}</p>
                <Badge className="mt-2 text-xs" variant={s.priority === 'high' ? 'default' : 'secondary'}>
                  {Math.round(s.confidence * 100)}% match
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      {exercises && exercises.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Dumbbell className="w-3 h-3" /> Recommended Exercises
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {exercises.slice(0, 3).map(e => (
              <Card key={e.id} className="min-w-[140px] p-2 flex-shrink-0 bg-green-50/50 dark:bg-slate-900/50 border-green-100 dark:border-green-900">
                <h5 className="text-xs font-medium">{e.title}</h5>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{e.data.duration} min</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {actions && actions.length > 0 && (
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <ArrowRight className="w-3 h-3" /> Suggested Actions
          </h4>
          <div className="space-y-1">
            {actions.slice(0, 3).map(a => (
              <div key={a.id} className="flex items-center gap-2 p-2 bg-amber-50/50 dark:bg-slate-900/50 rounded-lg">
                <Lightbulb className="w-3 h-3 text-amber-500" />
                <span className="text-xs">{a.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface WellnessRecommendationsResultProps {
  recommendations: {
    type: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
  }[];
}

export function WellnessRecommendationsResult({ recommendations }: WellnessRecommendationsResultProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="p-4 my-2 bg-green-50/50 dark:bg-slate-900/50 border-green-100 dark:border-green-900">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-sm">You're doing great! No urgent recommendations.</span>
        </div>
      </Card>
    );
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...recommendations].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return (
    <div className="space-y-2 my-2">
      {sorted.map((rec, i) => (
        <Card
          key={i}
          className={`p-3 ${rec.priority === 'high'
            ? 'bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900'
            : rec.priority === 'medium'
              ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900'
              : 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900'
            }`}
        >
          <div className="flex items-start gap-2">
            {rec.type === 'check_in' && <Activity className="w-4 h-4 mt-0.5 text-purple-500" />}
            {rec.type === 'therapy' && <Heart className="w-4 h-4 mt-0.5 text-red-500" />}
            {rec.type === 'relaxation' && <Wind className="w-4 h-4 mt-0.5 text-blue-500" />}
            {rec.type === 'sleep' && <Moon className="w-4 h-4 mt-0.5 text-indigo-500" />}
            {rec.type === 'celebration' && <Star className="w-4 h-4 mt-0.5 text-amber-500" />}
            {rec.type === 'progress' && <TrendingUp className="w-4 h-4 mt-0.5 text-green-500" />}
            {rec.type === 'support' && <AlertCircle className="w-4 h-4 mt-0.5 text-red-500" />}
            <div>
              <h4 className="text-sm font-medium">{rec.title}</h4>
              <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// INSIGHTS COMPONENTS
// ============================================================================

interface InsightsResultProps {
  insights: {
    id: string;
    type: string;
    title: string;
    description: string;
    priority: string;
    actionItems?: { id: string; title: string; completed: boolean }[];
  }[];
}

export function InsightsResult({ insights }: InsightsResultProps) {
  if (!insights || insights.length === 0) {
    return (
      <Card className="p-4 my-2 bg-muted/30">
        <div className="text-center">
          <Brain className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No insights yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Keep tracking your wellness to generate insights!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2 my-2">
      {insights.map(insight => (
        <Card key={insight.id} className="p-3 bg-white/50 dark:bg-slate-900/50">
          <div className="flex items-start gap-2">
            <Brain className="w-4 h-4 mt-0.5 text-purple-500" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{insight.title}</h4>
                <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                  {insight.priority}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{insight.description}</p>
              {insight.actionItems && insight.actionItems.length > 0 && (
                <div className="mt-2 space-y-1">
                  {insight.actionItems.map(action => (
                    <div key={action.id} className="flex items-center gap-2 text-xs text-muted-foreground">
                      <div className={`w-3 h-3 rounded-full border ${action.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'}`} />
                      <span className={action.completed ? 'line-through' : ''}>{action.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

interface WellnessScoreResultProps {
  overall: number;
  breakdown: {
    mood: number;
    stress: number;
    engagement: number;
    consistency: number;
  };
  trend: 'improving' | 'stable' | 'declining';
}

export function WellnessScoreResult({ overall, breakdown, trend }: WellnessScoreResultProps) {
  const TrendIcon = trend === 'improving' ? TrendingUp : trend === 'declining' ? TrendingDown : Minus;
  const trendColor = trend === 'improving' ? 'text-green-500' : trend === 'declining' ? 'text-red-500' : 'text-gray-500';

  return (
    <Card className="p-4 my-2 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 border-purple-100 dark:border-purple-900">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-500" />
          Wellness Score
        </h4>
        <div className="flex items-center gap-1">
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          <span className={`text-xs capitalize ${trendColor}`}>{trend}</span>
        </div>
      </div>

      <div className="flex items-center justify-center mb-4">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-200 dark:text-gray-700" />
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${overall * 2.51} 251`}
              className="text-purple-500"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold">{overall}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {Object.entries(breakdown).map(([key, value]) => (
          <div key={key} className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-2 text-center">
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{value}</div>
            <div className="text-xs text-muted-foreground capitalize">{key}</div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ============================================================================
// MEMORY & PROFILE COMPONENTS
// ============================================================================

interface MemoriesResultProps {
  memories: {
    content: string;
    type: string;
    importance: number;
    date: Date;
  }[];
}

export function MemoriesResult({ memories }: MemoriesResultProps) {
  if (!memories || memories.length === 0) {
    return (
      <Card className="p-4 my-2 bg-muted/30">
        <div className="text-center">
          <BookOpen className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No memories stored yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2 my-2">
      {memories.map((memory, i) => (
        <Card key={i} className="p-3 bg-white/50 dark:bg-slate-900/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm">{memory.content}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs capitalize">{memory.type}</Badge>
                <span className="text-xs text-muted-foreground">{format(new Date(memory.date), 'MMM d')}</span>
              </div>
            </div>
            <div className="flex">
              {[...Array(memory.importance)].map((_, j) => (
                <Star key={j} className="w-3 h-3 text-amber-400 fill-amber-400" />
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

interface MemoryConfirmationProps {
  message: string;
}

export function MemoryConfirmation({ message }: MemoryConfirmationProps) {
  return (
    <Card className="p-3 my-2 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-blue-500" />
        <span className="text-sm">{message}</span>
      </div>
    </Card>
  );
}

interface ProfileResultProps {
  name?: string;
  email?: string;
  phone?: string;
  language?: string;
  preferences?: Record<string, any>;
}

export function ProfileResult({ name, email, phone, language, preferences }: ProfileResultProps) {
  return (
    <Card className="p-4 my-2 bg-white/50 dark:bg-slate-900/50">
      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <Sun className="w-4 h-4 text-amber-500" />
        Your Profile
      </h4>
      <div className="space-y-2 text-sm">
        {name && <div><span className="text-muted-foreground">Name:</span> {name}</div>}
        {email && <div><span className="text-muted-foreground">Email:</span> {email}</div>}
        {phone && <div><span className="text-muted-foreground">Phone:</span> {phone}</div>}
        {language && <div><span className="text-muted-foreground">Language:</span> {language}</div>}
        {preferences && Object.keys(preferences).length > 0 && (
          <div className="border-t pt-2 mt-2">
            <span className="text-muted-foreground text-xs">Preferences:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {preferences.goals?.map((g: string) => (
                <Badge key={g} variant="secondary" className="text-xs">{g}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

// ============================================================================
// JOURNAL COMPONENTS
// ============================================================================

interface JournalEntryResultProps {
  entryId: string;
  message: string;
}

export function JournalEntryResult({ entryId, message }: JournalEntryResultProps) {
  return (
    <Card className="p-4 my-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 border-amber-200 dark:border-amber-900">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
          <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-amber-900 dark:text-amber-100">Journal Entry Saved</h4>
          <p className="text-xs text-amber-700 dark:text-amber-300">{message}</p>
        </div>
      </div>
    </Card>
  );
}

interface JournalEntriesListResultProps {
  entries: {
    id: string;
    content: string;
    mood?: number;
    tags?: string[];
    date: Date;
  }[];
}

export function JournalEntriesListResult({ entries }: JournalEntriesListResultProps) {
  if (!entries || entries.length === 0) {
    return (
      <Card className="p-4 my-2 bg-muted/30">
        <div className="text-center">
          <BookOpen className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No journal entries yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Start journaling to track your thoughts!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2 my-2">
      {entries.map(entry => (
        <Card key={entry.id} className="p-3 bg-white/50 dark:bg-slate-900/50">
          <div className="flex items-start justify-between mb-2">
            <span className="text-xs text-muted-foreground">{format(new Date(entry.date), 'MMM d, yyyy')}</span>
            {entry.mood && (
              <Badge variant="outline" className="text-xs">Mood: {entry.mood}/10</Badge>
            )}
          </div>
          <p className="text-sm">{entry.content}</p>
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// GENERIC COMPONENTS
// ============================================================================

interface SuccessResultProps {
  message: string;
}

export function SuccessResult({ message }: SuccessResultProps) {
  return (
    <Card className="p-3 my-2 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-green-500" />
        <span className="text-sm text-green-800 dark:text-green-200">{message}</span>
      </div>
    </Card>
  );
}

interface ErrorResultProps {
  error: string;
}

export function ErrorResult({ error }: ErrorResultProps) {
  return (
    <Card className="p-3 my-2 bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900">
      <div className="flex items-center gap-2">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
      </div>
    </Card>
  );
}

// ============================================================================
// PERSONALIZATION COMPONENTS
// @review - All components below need design polish
// ============================================================================

interface PersonalizedGreetingResultProps {
  greeting: string;
  emoji: string;
  contextTip?: string;
  moodAcknowledgment?: string;
}

export function PersonalizedGreetingResult({
  greeting,
  emoji,
  contextTip,
  moodAcknowledgment
}: PersonalizedGreetingResultProps) {
  return (
    <Card className="p-4 my-2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-slate-900 dark:to-slate-800 border-amber-200 dark:border-amber-900">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-2xl">
          {emoji}
        </div>
        <div>
          <h4 className="font-semibold text-base text-amber-900 dark:text-amber-100">{greeting}</h4>
          {moodAcknowledgment && (
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">{moodAcknowledgment}</p>
          )}
          {contextTip && (
            <p className="text-xs text-amber-600/80 dark:text-amber-400/80 mt-1">{contextTip}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

interface DailyAction {
  id: string;
  title: string;
  description: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  estimatedMinutes: number;
  reason: string;
}

interface DailyActionsResultProps {
  actions: DailyAction[];
}

export function DailyActionsResult({ actions }: DailyActionsResultProps) {
  if (!actions || actions.length === 0) {
    return (
      <Card className="p-4 my-2 bg-green-50/50 dark:bg-slate-900/50 border-green-100 dark:border-green-900">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          <span className="text-sm">You're all caught up! No urgent actions for now.</span>
        </div>
      </Card>
    );
  }

  const priorityColors = {
    high: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    medium: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
    low: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800'
  };

  const categoryEmojis: Record<string, string> = {
    wellness: '🧘',
    booking: '📅',
    social: '👥',
    'self-care': '💆',
    learning: '📚'
  };

  return (
    <div className="space-y-2 my-2">
      <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        <Lightbulb className="w-3 h-3" /> Suggested Actions
      </h4>
      {actions.map(action => (
        <Card key={action.id} className={`p-3 ${priorityColors[action.priority]}`}>
          <div className="flex items-start gap-2">
            <span className="text-lg">{categoryEmojis[action.category] || '✨'}</span>
            <div className="flex-1">
              <h5 className="text-sm font-medium">{action.title}</h5>
              <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-2 h-2 mr-1" />{action.estimatedMinutes} min
                </Badge>
                <span className="text-xs text-muted-foreground">{action.reason}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

interface AffirmationResultProps {
  affirmation: {
    text: string;
    category: string;
    relatedToMood: boolean;
  };
}

export function AffirmationResult({ affirmation }: AffirmationResultProps) {
  return (
    <Card className="p-5 my-2 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-slate-900 dark:to-slate-800 border-purple-200 dark:border-purple-900">
      <div className="text-center">
        <Sparkles className="w-6 h-6 mx-auto mb-3 text-purple-500" />
        <p className="text-base font-medium text-purple-900 dark:text-purple-100 leading-relaxed">
          "{affirmation.text}"
        </p>
        {affirmation.relatedToMood && (
          <div className="mt-3 flex items-center justify-center gap-1">
            <Heart className="w-3 h-3 text-pink-500" />
            <span className="text-xs text-muted-foreground">Based on how you're feeling</span>
          </div>
        )}
      </div>
    </Card>
  );
}

interface ProgressReportResultProps {
  report: {
    period: string;
    summary: string;
    stats: {
      moodCheckIns: number;
      averageMood: number;
      bookingsCompleted: number;
      goalsProgress: number;
      streakDays: number;
    };
    highlights: string[];
    areasToImprove: string[];
    nextSteps: string[];
  };
}

export function ProgressReportResult({ report }: ProgressReportResultProps) {
  return (
    <Card className="p-4 my-2 bg-white/50 dark:bg-slate-900/50 border-purple-100 dark:border-purple-900">
      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
        <Activity className="w-4 h-4 text-purple-500" />
        {report.period === 'week' ? 'Weekly' : 'Monthly'} Progress Report
      </h4>

      <p className="text-sm text-muted-foreground mb-4">{report.summary}</p>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{report.stats.averageMood}</div>
          <div className="text-xs text-muted-foreground">Avg Mood</div>
        </div>
        <div className="bg-indigo-50 dark:bg-indigo-950/30 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{report.stats.streakDays}</div>
          <div className="text-xs text-muted-foreground">Day Streak</div>
        </div>
        <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-2 text-center">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">{report.stats.moodCheckIns}</div>
          <div className="text-xs text-muted-foreground">Check-ins</div>
        </div>
      </div>

      {report.highlights.length > 0 && (
        <div className="mb-3">
          <h5 className="text-xs font-medium mb-1 flex items-center gap-1">
            <Star className="w-3 h-3 text-amber-500" /> Highlights
          </h5>
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {report.highlights.slice(0, 3).map((h, i) => (
              <li key={i}>• {h}</li>
            ))}
          </ul>
        </div>
      )}

      {report.nextSteps.length > 0 && (
        <div>
          <h5 className="text-xs font-medium mb-1 flex items-center gap-1">
            <ArrowRight className="w-3 h-3 text-blue-500" /> Next Steps
          </h5>
          <ul className="text-xs text-muted-foreground space-y-0.5">
            {report.nextSteps.slice(0, 3).map((s, i) => (
              <li key={i}>• {s}</li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}

interface PatternInsightResultProps {
  patterns: {
    id: string;
    patternType: string;
    description: string;
    frequency: string;
    insight: string;
    actionSuggestion?: string;
  }[];
}

export function PatternInsightResult({ patterns }: PatternInsightResultProps) {
  if (!patterns || patterns.length === 0) {
    return (
      <Card className="p-4 my-2 bg-muted/30">
        <div className="text-center">
          <Brain className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No patterns detected yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Keep tracking to uncover insights!</p>
        </div>
      </Card>
    );
  }

  const patternIcons: Record<string, typeof TrendingUp> = {
    'positive-trend': TrendingUp,
    'attention-needed': AlertCircle,
    'health-alert': AlertCircle,
    'positive-habit': CheckCircle2,
    'achievement': Award,
    'emotional-pattern': Heart
  };

  const patternColors: Record<string, string> = {
    'positive-trend': 'text-green-500',
    'attention-needed': 'text-amber-500',
    'health-alert': 'text-red-500',
    'positive-habit': 'text-green-500',
    'achievement': 'text-amber-500',
    'emotional-pattern': 'text-purple-500'
  };

  return (
    <div className="space-y-2 my-2">
      <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        <Brain className="w-3 h-3" /> Detected Patterns
      </h4>
      {patterns.map(pattern => {
        const Icon = patternIcons[pattern.patternType] || Brain;
        const color = patternColors[pattern.patternType] || 'text-purple-500';
        return (
          <Card key={pattern.id} className="p-3 bg-white/50 dark:bg-slate-900/50">
            <div className="flex items-start gap-2">
              <Icon className={`w-4 h-4 mt-0.5 ${color}`} />
              <div>
                <h5 className="text-sm font-medium">{pattern.description}</h5>
                <p className="text-xs text-muted-foreground mt-0.5">{pattern.insight}</p>
                {pattern.actionSuggestion && (
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    💡 {pattern.actionSuggestion}
                  </p>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}

interface BreathingExerciseResultProps {
  exercise: {
    id: string;
    name: string;
    description: string;
    duration: number;
    pattern: {
      inhale: number;
      hold?: number;
      exhale: number;
    };
    benefits: string[];
  };
}

export function BreathingExerciseResult({ exercise }: BreathingExerciseResultProps) {
  return (
    <Card className="p-4 my-2 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-cyan-200 dark:border-cyan-900">
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-full bg-cyan-100 dark:bg-cyan-900/50 flex items-center justify-center shrink-0">
          <Wind className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
          <h4 className="font-semibold text-sm text-cyan-900 dark:text-cyan-100">{exercise.name}</h4>
          <p className="text-xs text-cyan-700 dark:text-cyan-300 mt-1">{exercise.description}</p>

          <div className="flex items-center gap-4 mt-3 bg-white/50 dark:bg-slate-800/50 rounded-lg p-2">
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-600">{exercise.pattern.inhale}s</div>
              <div className="text-xs text-muted-foreground">Inhale</div>
            </div>
            {exercise.pattern.hold && (
              <div className="text-center">
                <div className="text-lg font-bold text-cyan-600">{exercise.pattern.hold}s</div>
                <div className="text-xs text-muted-foreground">Hold</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-600">{exercise.pattern.exhale}s</div>
              <div className="text-xs text-muted-foreground">Exhale</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-1 mt-2">
            {exercise.benefits.slice(0, 3).map(b => (
              <Badge key={b} variant="secondary" className="text-xs bg-cyan-100/50 dark:bg-cyan-900/30">
                {b}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

interface AchievementCelebrationResultProps {
  achievements: {
    id: string;
    title: string;
    description: string;
    celebrationMessage: string;
    emoji: string;
  }[];
}

export function AchievementCelebrationResult({ achievements }: AchievementCelebrationResultProps) {
  if (!achievements || achievements.length === 0) {
    return (
      <Card className="p-4 my-2 bg-muted/30">
        <div className="text-center">
          <Award className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No achievements unlocked yet.</p>
          <p className="text-xs text-muted-foreground mt-1">Keep going – you're making progress!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-2 my-2">
      <h4 className="text-xs font-medium text-muted-foreground flex items-center gap-1">
        <Award className="w-3 h-3 text-amber-500" /> Your Achievements
      </h4>
      {achievements.map(achievement => (
        <Card key={achievement.id} className="p-4 bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-slate-900 dark:to-slate-800 border-amber-200 dark:border-amber-900">
          <div className="text-center">
            <div className="text-3xl mb-2">{achievement.emoji}</div>
            <h4 className="font-semibold text-amber-900 dark:text-amber-100">{achievement.title}</h4>
            <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">{achievement.description}</p>
            <p className="text-sm text-amber-800 dark:text-amber-200 mt-2 font-medium">
              {achievement.celebrationMessage}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------------
// PHASE 6 COMPONENTS
// ----------------------------------------------------------------------------

interface MeditationResultProps {
  session: {
    id: string;
    title: string;
    description: string;
    durationMinutes: number;
    breathingPattern: {
      inhale: number;
      hold?: number;
      exhale: number;
    };
    steps: string[];
    calmingQuote?: string;
  };
}

export function MeditationResult({ session }: MeditationResultProps) {
  const [isActive, setIsActive] = useState(false);

  return (
    <Card className="p-4 my-2 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950 dark:to-purple-950 border-indigo-200 dark:border-indigo-900 overflow-hidden relative">
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
            <Flower2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h4 className="font-semibold text-sm">{session.title}</h4>
          <Badge variant="outline" className="ml-auto text-xs">{session.durationMinutes} min</Badge>
        </div>

        <p className="text-xs text-muted-foreground mb-4 italic">"{session.calmingQuote}"</p>

        {!isActive ? (
          <div className="space-y-3">
            <div className="space-y-1">
              {session.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <div className="mt-1 h-3 w-3 rounded-full bg-indigo-200 dark:bg-indigo-800 flex items-center justify-center text-[8px] font-bold">{idx + 1}</div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <Button
              className="w-full h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
              onClick={() => setIsActive(true)}
            >
              Start Session
            </Button>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="flex justify-center mb-4">
              <div className="w-24 h-24 rounded-full border-4 border-indigo-200 dark:border-indigo-800 flex items-center justify-center relative">
                <div className="animate-ping absolute inset-0 rounded-full bg-indigo-400/20"></div>
                <Wind className="h-8 w-8 text-indigo-600 animate-pulse" />
              </div>
            </div>
            <p className="text-sm font-medium animate-pulse text-indigo-600 dark:text-indigo-400">Breathing in...</p>
            <p className="text-xs text-muted-foreground mt-2">Focus on the rhythm of the circle</p>
            <Button variant="ghost" size="sm" className="mt-4 text-xs h-7" onClick={() => setIsActive(false)}>Finish</Button>
          </div>
        )}
      </div>
    </Card>
  );
}

interface SleepInsightResultProps {
  insight: {
    averageSleep: number;
    quality: string;
    trend: string;
    tips: string[];
    summary: string;
  };
}

export function SleepInsightResult({ insight }: SleepInsightResultProps) {
  return (
    <Card className="p-4 my-2 border-slate-200 dark:border-slate-800">
      <div className="flex items-start gap-3 mb-4">
        <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
          <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </div>
        <div>
          <h4 className="font-semibold text-sm">Sleep Quality: {insight.quality}</h4>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">{insight.averageSleep} hours <span className="text-xs font-normal text-muted-foreground text-opacity-70">avg</span></p>
        </div>
        <Badge className={`ml-auto ${insight.trend === 'improving' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}>
          {insight.trend}
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground mb-4">{insight.summary}</p>

      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
        <h5 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
          <Lightbulb className="h-3 w-3" /> Habits for Better Rest
        </h5>
        <ul className="space-y-1">
          {insight.tips.map((tip, idx) => (
            <li key={idx} className="text-xs flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-slate-400" />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
}

interface GoalTrackerResultProps {
  tracker: {
    goals: {
      id: string;
      title: string;
      progress: number;
      target: number;
      unit: string;
      isCompleted: boolean;
    }[];
  };
}

export function GoalTrackerResult({ tracker }: GoalTrackerResultProps) {
  return (
    <Card className="p-4 my-2 border-emerald-100 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center">
          <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h4 className="font-semibold text-sm">Your Wellness Goals</h4>
      </div>

      <div className="space-y-4">
        {tracker.goals.map((goal) => (
          <div key={goal.id} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium">{goal.title}</span>
              <span className="text-muted-foreground">{goal.progress}/{goal.target} {goal.unit}</span>
            </div>
            <div className="h-2 w-full bg-emerald-100 dark:bg-emerald-900 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${goal.isCompleted ? 'bg-emerald-500' : 'bg-emerald-400'}`}
                style={{ width: `${Math.min(100, (goal.progress / goal.target) * 100)}%` }}
              ></div>
            </div>
            {goal.isCompleted && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                <Sparkles className="h-3 w-3" /> Goal Achieved!
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

interface MoodCalendarResultProps {
  days: {
    date: string;
    mood: number;
    emotions: string[];
  }[];
}

export function MoodCalendarResult({ days }: MoodCalendarResultProps) {
  const getMoodColor = (mood: number) => {
    if (mood >= 8) return 'bg-emerald-500';
    if (mood >= 6) return 'bg-emerald-300';
    if (mood >= 4) return 'bg-amber-300';
    return 'bg-red-300';
  };

  return (
    <Card className="p-4 my-2">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Calendar className="h-4 w-4 text-primary" />
        </div>
        <h4 className="font-semibold text-sm">Mood Landscape</h4>
        <Badge variant="secondary" className="ml-auto text-xs">Last 14 Days</Badge>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.length === 0 ? (
          <div className="col-span-7 py-4 text-center text-xs text-muted-foreground italic">
            Check-in more often to see your landscape grow
          </div>
        ) : (
          days.map((day, idx) => (
            <div key={idx} className="space-y-1 text-center">
              <div
                className={`h-6 rounded-sm ${getMoodColor(day.mood)} hover:scale-110 transition-transform cursor-pointer shadow-sm`}
                title={`${day.date}: ${day.mood}/10`}
              ></div>
              <span className="text-[8px] text-muted-foreground">{day.date.split('-')[2]}</span>
            </div>
          ))
        )}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm bg-red-300"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm bg-amber-300"></div>
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm bg-emerald-300"></div>
          <span>Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-sm bg-emerald-500"></div>
          <span>Great</span>
        </div>
      </div>
    </Card>
  );
}

// ----------------------------------------------------------------------------
// PHASE 7 COMPONENTS
// ----------------------------------------------------------------------------

export function BookingPreviewBlock({ preview }: {
  preview: {
    serviceId: string;
    serviceName: string;
    description: string;
    price: number;
    duration: number;
    dateTime: string;
    variantName?: string;
    serviceVariantId?: string;
  }
}) {
  return (
    <Card className="p-4 my-2 overflow-hidden border-0 shadow-xl bg-gradient-to-br from-indigo-50/80 to-purple-50/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-md relative">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="w-16 h-16 text-primary" />
      </div>

      <div className="relative z-10">
        <Badge className="mb-2 bg-primary text-primary-foreground text-xs">Preview Confirmation</Badge>
        <h4 className="text-lg font-bold text-foreground mb-1">{preview.serviceName}</h4>
        {preview.variantName && (
          <p className="text-xs font-semibold text-primary/80 mb-2">{preview.variantName}</p>
        )}
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{preview.description}</p>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div className="bg-white/40 dark:bg-black/20 p-2 rounded-lg border border-white/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Calendar className="w-3 h-3" /> Date & Time
            </div>
            <div className="text-xs font-bold truncate">
              {format(new Date(preview.dateTime), 'MMM d @ h:mm a')}
            </div>
          </div>
          <div className="bg-white/40 dark:bg-black/20 p-2 rounded-lg border border-white/20">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <ShoppingBag className="w-3 h-3" /> Investment
            </div>
            <div className="text-xs font-bold">${preview.price}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-lg shadow-primary/20"
            onClick={() => {
              const event = new CustomEvent('ai_confirm_booking', { detail: preview });
              document.dispatchEvent(event);
            }}
          >
            Confirm Appointment
          </Button>
          <Button
            variant="ghost"
            className="w-full text-xs text-muted-foreground hover:bg-black/5 dark:hover:bg-white/5"
            onClick={() => {
              const event = new CustomEvent('ai_cancel_preview');
              document.dispatchEvent(event);
            }}
          >
            Choose a different time
          </Button>
        </div>
      </div>
    </Card>
  );
}

export function ServiceComparisonBlock({ services }: { services: any[] }) {
  return (
    <div className="my-4 space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-widest text-primary/60 ml-1">Service Comparison</h4>
      <div className="flex gap-3 overflow-x-auto pb-4 snap-x -mx-1 px-1">
        {services.map((s, idx) => (
          <Card key={idx} className="min-w-[240px] flex-shrink-0 snap-center p-0 overflow-hidden border-indigo-100 dark:border-indigo-900 bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm group hover:border-primary/40 transition-all">
            <div className="p-4 bg-gradient-to-br from-indigo-50 to-white dark:from-slate-900 dark:to-slate-950 transition-colors">
              <Badge variant="outline" className="mb-2 text-xs border-primary/20">{s.category}</Badge>
              <h5 className="font-bold text-sm mb-1 line-clamp-1">{s.name}</h5>
              <p className="text-xs text-muted-foreground line-clamp-2 h-8">{s.description}</p>
            </div>
            <div className="p-4 border-t border-indigo-50 dark:border-indigo-900/50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Price</span>
                <span className="font-bold text-sm bg-primary/10 px-2 py-0.5 rounded text-primary">${s.price_amount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">Duration</span>
                <span className="text-xs font-medium">{s.duration_min} min</span>
              </div>
              <Button
                size="sm"
                className="w-full h-8 text-xs font-semibold bg-white dark:bg-slate-900 border border-primary/20 hover:bg-primary hover:text-white transition-all shadow-sm"
                onClick={() => {
                  const event = new CustomEvent('ai_service_selected', { detail: { name: s.name, id: s.id } });
                  document.dispatchEvent(event);
                }}
              >
                Book This
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

export function WalletHistoryBlock({ transactions }: { transactions: any[] }) {
  if (!transactions || transactions.length === 0) {
    return <div className="p-4 text-center text-xs text-muted-foreground bg-muted/20 rounded-lg">No transaction history found.</div>;
  }

  return (
    <div className="my-2 space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-widest text-primary/60 ml-1 flex items-center gap-2">
        <History className="w-3 h-3" /> Recent Transactions
      </h4>
      <div className="space-y-1">
        {transactions.map((t, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between p-3 bg-white/40 dark:bg-slate-900/40 rounded-xl border border-border/40 hover:bg-white/60 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center ${t.amount >= 0 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                }`}>
                {t.type === 'purchase' ? <ShoppingBag className={`w-4 h-4 ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`} /> :
                  t.type === 'deposit' ? <TrendingUp className="w-4 h-4 text-green-600" /> :
                    <CreditCard className="w-4 h-4 text-blue-600" />}
              </div>
              <div>
                <div className="text-xs font-semibold line-clamp-1">{t.description || t.type}</div>
                <div className="text-xs text-muted-foreground">{format(new Date(t.date), 'MMM d, h:mm a')}</div>
              </div>
            </div>
            <div className={`text-xs font-bold ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {t.amount >= 0 ? '+' : ''}{t.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground h-7" onClick={() => window.location.href = '/wallet'}>
        View All in Wallet
      </Button>
    </div>
  );
}

