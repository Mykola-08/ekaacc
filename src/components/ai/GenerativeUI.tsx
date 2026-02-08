/**
 * Generative UI Components for AI Tool Results
 * Basic design - marked for design review and improvement
 *
 * @review - All components need design polish
 */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { format } from 'date-fns';
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
  ArrowUpDown,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useRealtimeSubscription } from '@/hooks/useRealtimeSubscription';

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
        setBookings((prev) =>
          prev.map((b) => (b.id === payload.new.id ? { ...b, ...payload.new } : b))
        );
      } else if (payload.eventType === 'DELETE') {
        setBookings((prev) => prev.filter((b) => b.id !== payload.old.id));
      }
    },
  });

  if (!bookings || bookings.length === 0) {
    return (
      <div className="bg-card border-border text-muted-foreground rounded-xl border p-4 text-center text-sm font-medium">
        No bookings found matching your request.
      </div>
    );
  }

  const sortedBookings = [...bookings].sort(
    (a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
  );
  const upcoming = sortedBookings.filter((b) => b.status === 'scheduled');
  const past = sortedBookings.filter((b) => b.status !== 'scheduled');

  const renderBookingCard = (booking: any) => (
    <Card
      key={booking.id}
      className="border-border rounded-xl bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md"
    >
      <div className="mb-2 flex items-start justify-between">
        <div>
          <h4 className="text-foreground text-sm font-medium">
            {booking.service?.name || 'Service'}
          </h4>
          <p className="text-muted-foreground text-xs">{booking.staff?.name || 'Staff'}</p>
        </div>
        <Badge
          variant={
            booking.status === 'scheduled'
              ? 'default'
              : booking.status === 'canceled'
                ? 'destructive'
                : 'secondary'
          }
          className="h-5 text-xs capitalize"
        >
          {booking.status}
        </Badge>
      </div>
      <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
        <Calendar className="text-primary/60 h-3 w-3" />
        {format(new Date(booking.start_time), 'MMM d, yyyy')}
        <Clock className="text-primary/60 ml-1 h-3 w-3" />
        {format(new Date(booking.start_time), 'h:mm a')}
      </div>
      {booking.status === 'scheduled' && (
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-7 flex-1 border-red-200 text-xs text-red-600 hover:bg-red-50 hover:text-red-700 dark:border-red-900 dark:text-red-400"
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
            className="border-primary/20 hover:bg-primary/5 h-7 flex-1 text-xs"
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
    <div className="my-2 w-full space-y-4">
      {upcoming.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-primary/60 ml-1 text-xs font-bold tracking-widest uppercase">
            Upcoming
          </h5>
          {upcoming.map(renderBookingCard)}
        </div>
      )}

      {past.length > 0 && (
        <div className="space-y-2 opacity-80">
          <h5 className="text-muted-foreground ml-1 text-xs font-bold tracking-widest uppercase">
            Past & Canceled
          </h5>
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
    <Card className="my-2 rounded-[20px] border border-emerald-100/50 bg-emerald-50/50 p-5 shadow-[0_4px_20px_rgba(16,185,129,0.05)]">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
          <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h4 className="font-semibold text-green-900 dark:text-green-100">Booking Confirmed!</h4>
          <p className="text-xs text-green-700 dark:text-green-300">
            {message || 'Your appointment has been successfully scheduled.'}
          </p>
          {details && (
            <p className="mt-1 text-xs font-medium text-green-600/80">
              {format(new Date(details.dateTime), 'EEEE, MMMM d @ h:mm a')}
            </p>
          )}
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-7 border-green-200 bg-white/50 text-xs hover:bg-white"
          onClick={() => (window.location.href = '/bookings')}
        >
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
    return (
      <div className="text-muted-foreground bg-card border-border rounded-xl border p-4 text-center text-sm font-medium">
        No slots available for this date.
      </div>
    );
  }

  const uniqueStartTimes = Array.from(new Set(slots.map((s) => s.startTime))).sort();

  return (
    <div className="my-2 flex flex-wrap gap-2">
      {uniqueStartTimes.map((time) => (
        <Badge
          key={time}
          variant="outline"
          className="cursor-pointer border-purple-200 px-3 py-1.5 transition-colors hover:bg-purple-100 dark:border-purple-800 dark:hover:bg-purple-900/30"
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
    return (
      <div className="text-muted-foreground bg-card border-border rounded-xl border p-4 text-center text-sm font-medium">
        No services found.
      </div>
    );
  }

  return (
    <div className="-mx-2 flex snap-x gap-2 overflow-x-auto px-2 pb-2">
      {services.map((service) => (
        <Card
          key={service.id}
          className="border-muted min-w-[220px] flex-shrink-0 snap-center rounded-xl bg-white p-5 shadow-sm transition-all hover:shadow-md"
        >
          <h4 className="mb-1 text-sm font-semibold">{service.name}</h4>
          <p className="text-muted-foreground mb-2 line-clamp-2 text-xs">{service.description}</p>
          <div className="mb-2 flex items-center justify-between text-xs font-medium">
            <span>${service.price_amount}</span>
            <span>{service.duration_min} min</span>
          </div>
          <Button
            size="sm"
            variant="secondary"
            className="h-7 w-full border border-indigo-200 bg-white/50 text-xs hover:bg-white dark:border-indigo-800"
            onClick={() => {
              const event = new CustomEvent('ai_service_selected', {
                detail: { name: service.name, id: service.id },
              });
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
    <Card className="my-2 rounded-[20px] border border-indigo-50/50 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between">
        <div>
          <h4 className="text-base font-semibold">{service.name}</h4>
          {service.category && (
            <Badge variant="secondary" className="mt-1 text-xs">
              {service.category}
            </Badge>
          )}
        </div>
        <div className="text-right">
          <div className="text-lg font-bold">${service.price}</div>
          <div className="text-muted-foreground text-xs">{service.duration} min</div>
        </div>
      </div>
      <p className="text-muted-foreground mb-3 text-sm">{service.description}</p>
      {service.variants && service.variants.length > 0 && (
        <div className="mt-2 border-t border-indigo-100 pt-2 dark:border-indigo-800">
          <p className="mb-1 text-xs font-medium">Available Options:</p>
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
    },
  });

  return (
    <Card className="my-2 rounded-[20px] border-0 bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-xl">
      <div className="mb-4 flex items-start justify-between">
        <span className="text-xs font-medium text-indigo-100">Digital Wallet</span>
        <CreditCard className="h-4 w-4 text-indigo-100" />
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
    platinum: 'from-indigo-400 to-purple-500',
  };

  return (
    <Card
      className={`bg-gradient-to-br p-6 ${tierColors[tier] || tierColors.bronze} my-2 rounded-[20px] border-0 text-white shadow-xl`}
    >
      <div className="mb-3 flex items-start justify-between">
        <span className="text-xs font-medium opacity-90">Rewards</span>
        <Award className="h-4 w-4 opacity-90" />
      </div>
      <div className="mb-1 flex items-baseline gap-1">
        <div className="text-2xl font-bold">{points.toLocaleString()}</div>
        <div className="text-sm opacity-80">pts</div>
      </div>
      <div className="flex items-center justify-between text-xs opacity-80">
        <span>Lifetime: {lifetimePoints.toLocaleString()}</span>
        <Badge className="bg-white/20 text-xs text-white capitalize hover:bg-white/30">
          {tier}
        </Badge>
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
    <Card className="my-2 rounded-[20px] border border-pink-100 bg-gradient-to-br from-pink-50/50 to-purple-50/50 p-5 shadow-sm">
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-2xl shadow-sm dark:bg-slate-800">
          {moodEmoji}
        </div>
        <div>
          <h4 className="text-sm font-semibold">Mood Check-In Saved</h4>
          <p className="text-muted-foreground text-xs">
            {message || 'Thank you for sharing how you feel!'}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl border border-white/50 bg-white/80 p-3 shadow-sm">
          <div className="text-lg font-bold text-pink-600 dark:text-pink-400">{entry.mood}/10</div>
          <div className="text-muted-foreground text-xs">Mood</div>
        </div>
        <div className="rounded-xl border border-white/50 bg-white/80 p-3 shadow-sm">
          <div className="text-xs font-medium text-purple-600 capitalize dark:text-purple-400">
            {entry.energy.replace('_', ' ')}
          </div>
          <div className="text-muted-foreground text-xs">Energy</div>
        </div>
        <div className="rounded-xl border border-white/50 bg-white/80 p-3 shadow-sm">
          <div className="text-xs font-medium text-indigo-600 capitalize dark:text-indigo-400">
            {entry.stress}
          </div>
          <div className="text-muted-foreground text-xs">Stress</div>
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
  totalEntries,
}: WellnessSummaryResultProps) {
  const TrendIcon =
    moodTrend === 'improving' ? TrendingUp : moodTrend === 'declining' ? TrendingDown : Minus;
  const trendColor =
    moodTrend === 'improving'
      ? 'text-green-500'
      : moodTrend === 'declining'
        ? 'text-red-500'
        : 'text-gray-500';

  return (
    <Card className="border-border my-2 rounded-[20px] border bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-semibold">
          <Activity className="h-4 w-4 text-purple-500" />
          {period.charAt(0).toUpperCase() + period.slice(1)}ly Summary
        </h4>
        <Badge variant="outline" className="text-xs">
          {totalEntries} entries
        </Badge>
      </div>

      <div className="mb-3 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-purple-50 p-3 dark:bg-purple-950/30">
          <div className="mb-1 flex items-center gap-2">
            <Heart className="h-3 w-3 text-purple-500" />
            <span className="text-muted-foreground text-xs">Avg Mood</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold">{averageMood}</span>
            <span className="text-muted-foreground text-xs">/10</span>
            <TrendIcon className={`ml-auto h-4 w-4 ${trendColor}`} />
          </div>
        </div>
        <div className="rounded-lg bg-indigo-50 p-3 dark:bg-indigo-950/30">
          <div className="mb-1 flex items-center gap-2">
            <Moon className="h-3 w-3 text-indigo-500" />
            <span className="text-muted-foreground text-xs">Avg Sleep</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xl font-bold">{averageSleep}</span>
            <span className="text-muted-foreground text-xs">hrs</span>
          </div>
        </div>
      </div>

      {streakDays > 0 && (
        <div className="mb-3 flex items-center gap-2 rounded-lg bg-amber-50 p-2 dark:bg-amber-950/30">
          <Zap className="h-4 w-4 text-amber-500" />
          <span className="text-sm font-medium">{streakDays} day streak!</span>
        </div>
      )}

      {commonEmotions.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {commonEmotions.map((e) => (
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
    return (
      <div className="text-muted-foreground bg-muted/40 rounded-lg p-3 text-sm">
        No mood entries found.
      </div>
    );
  }

  return (
    <div className="my-2 space-y-2">
      {entries.slice(0, 5).map((entry, i) => (
        <Card key={i} className="bg-white/50 p-3 dark:bg-slate-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-purple-600 dark:bg-purple-900/50 dark:text-purple-400">
                {entry.mood}
              </div>
              <div>
                <div className="text-xs font-medium">{format(new Date(entry.date), 'MMM d')}</div>
                <div className="text-muted-foreground text-xs capitalize">
                  {entry.energy.replace('_', ' ')} energy
                </div>
              </div>
            </div>
            <Badge
              variant={
                entry.stress === 'minimal' || entry.stress === 'mild' ? 'secondary' : 'destructive'
              }
              className="text-xs capitalize"
            >
              {entry.stress}
            </Badge>
          </div>
          {entry.emotions && entry.emotions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {entry.emotions.slice(0, 3).map((e) => (
                <Badge key={e} variant="outline" className="text-xs capitalize">
                  {e}
                </Badge>
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
    <Card className="my-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 dark:border-green-900 dark:from-slate-900 dark:to-slate-800">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/50">
          <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-green-900 dark:text-green-100">
            Goal Created!
          </h4>
          <p className="text-xs text-green-700 dark:text-green-300">{message || goal.title}</p>
          <div className="mt-1 flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-green-200 text-xs capitalize dark:border-green-800"
            >
              {goal.targetType}
            </Badge>
            <span className="text-xs text-green-600 dark:text-green-400">
              Target: {goal.targetValue}
            </span>
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
      <Card className="bg-muted/30 my-2 p-4">
        <div className="text-center">
          <Target className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">No active goals yet.</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Set a goal to start tracking your progress!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="my-2 space-y-2">
      {goals.map((goal) => (
        <Card key={goal.id} className="bg-white/50 p-3 dark:bg-slate-900/50">
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h4 className="text-sm font-medium">{goal.title}</h4>
              <Badge variant="outline" className="mt-1 text-xs capitalize">
                {goal.targetType}
              </Badge>
            </div>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {goal.progress}%
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200 dark:bg-gray-700">
            <div
              className="h-2 rounded-full bg-purple-500 transition-all duration-500"
              style={{ width: `${Math.min(100, goal.progress)}%` }}
            />
          </div>
          <div className="text-muted-foreground mt-1 flex justify-between text-xs">
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

export function RecommendationsResult({
  services,
  exercises,
  actions,
}: RecommendationsResultProps) {
  return (
    <div className="my-2 space-y-3">
      {services && services.length > 0 && (
        <div>
          <h4 className="text-muted-foreground mb-2 flex items-center gap-1 text-xs font-medium">
            <Sparkles className="h-3 w-3" /> Recommended Services
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {services.slice(0, 3).map((s) => (
              <Card
                key={s.id}
                className="min-w-[160px] flex-shrink-0 border-indigo-100 bg-indigo-50/50 p-2 dark:border-indigo-900 dark:bg-slate-900/50"
              >
                <h5 className="truncate text-xs font-medium">{s.title}</h5>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-xs">{s.reason}</p>
                <Badge
                  className="mt-2 text-xs"
                  variant={s.priority === 'high' ? 'default' : 'secondary'}
                >
                  {Math.round(s.confidence * 100)}% match
                </Badge>
              </Card>
            ))}
          </div>
        </div>
      )}

      {exercises && exercises.length > 0 && (
        <div>
          <h4 className="text-muted-foreground mb-2 flex items-center gap-1 text-xs font-medium">
            <Dumbbell className="h-3 w-3" /> Recommended Exercises
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {exercises.slice(0, 3).map((e) => (
              <Card
                key={e.id}
                className="min-w-[140px] flex-shrink-0 border-green-100 bg-green-50/50 p-2 dark:border-green-900 dark:bg-slate-900/50"
              >
                <h5 className="text-xs font-medium">{e.title}</h5>
                <div className="mt-1 flex items-center gap-1">
                  <Clock className="text-muted-foreground h-3 w-3" />
                  <span className="text-muted-foreground text-xs">{e.data.duration} min</span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {actions && actions.length > 0 && (
        <div>
          <h4 className="text-muted-foreground mb-2 flex items-center gap-1 text-xs font-medium">
            <ArrowRight className="h-3 w-3" /> Suggested Actions
          </h4>
          <div className="space-y-1">
            {actions.slice(0, 3).map((a) => (
              <div
                key={a.id}
                className="flex items-center gap-2 rounded-lg bg-amber-50/50 p-2 dark:bg-slate-900/50"
              >
                <Lightbulb className="h-3 w-3 text-amber-500" />
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

export function WellnessRecommendationsResult({
  recommendations,
}: WellnessRecommendationsResultProps) {
  if (!recommendations || recommendations.length === 0) {
    return (
      <Card className="my-2 border-green-100 bg-green-50/50 p-4 dark:border-green-900 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="text-sm">You're doing great! No urgent recommendations.</span>
        </div>
      </Card>
    );
  }

  const priorityOrder = { high: 0, medium: 1, low: 2 };
  const sorted = [...recommendations].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  return (
    <div className="my-2 space-y-2">
      {sorted.map((rec, i) => (
        <Card
          key={i}
          className={`p-3 ${
            rec.priority === 'high'
              ? 'border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20'
              : rec.priority === 'medium'
                ? 'border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20'
                : 'border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20'
          }`}
        >
          <div className="flex items-start gap-2">
            {rec.type === 'check_in' && <Activity className="mt-0.5 h-4 w-4 text-purple-500" />}
            {rec.type === 'therapy' && <Heart className="mt-0.5 h-4 w-4 text-red-500" />}
            {rec.type === 'relaxation' && <Wind className="mt-0.5 h-4 w-4 text-blue-500" />}
            {rec.type === 'sleep' && <Moon className="mt-0.5 h-4 w-4 text-indigo-500" />}
            {rec.type === 'celebration' && <Star className="mt-0.5 h-4 w-4 text-amber-500" />}
            {rec.type === 'progress' && <TrendingUp className="mt-0.5 h-4 w-4 text-green-500" />}
            {rec.type === 'support' && <AlertCircle className="mt-0.5 h-4 w-4 text-red-500" />}
            <div>
              <h4 className="text-sm font-medium">{rec.title}</h4>
              <p className="text-muted-foreground mt-0.5 text-xs">{rec.description}</p>
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
      <Card className="bg-muted/30 my-2 p-4">
        <div className="text-center">
          <Brain className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">No insights yet.</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Keep tracking your wellness to generate insights!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="my-2 space-y-2">
      {insights.map((insight) => (
        <Card key={insight.id} className="bg-white/50 p-3 dark:bg-slate-900/50">
          <div className="flex items-start gap-2">
            <Brain className="mt-0.5 h-4 w-4 text-purple-500" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium">{insight.title}</h4>
                <Badge
                  variant={insight.priority === 'high' ? 'destructive' : 'secondary'}
                  className="text-xs"
                >
                  {insight.priority}
                </Badge>
              </div>
              <p className="text-muted-foreground mt-1 text-xs">{insight.description}</p>
              {insight.actionItems && insight.actionItems.length > 0 && (
                <div className="mt-2 space-y-1">
                  {insight.actionItems.map((action) => (
                    <div
                      key={action.id}
                      className="text-muted-foreground flex items-center gap-2 text-xs"
                    >
                      <div
                        className={`h-3 w-3 rounded-full border ${action.completed ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}
                      />
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
  const TrendIcon =
    trend === 'improving' ? TrendingUp : trend === 'declining' ? TrendingDown : Minus;
  const trendColor =
    trend === 'improving'
      ? 'text-green-500'
      : trend === 'declining'
        ? 'text-red-500'
        : 'text-gray-500';

  return (
    <Card className="my-2 border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 p-4 dark:border-purple-900 dark:from-slate-900 dark:to-slate-800">
      <div className="mb-4 flex items-center justify-between">
        <h4 className="flex items-center gap-2 text-sm font-semibold">
          <Activity className="h-4 w-4 text-purple-500" />
          Wellness Score
        </h4>
        <div className="flex items-center gap-1">
          <TrendIcon className={`h-4 w-4 ${trendColor}`} />
          <span className={`text-xs capitalize ${trendColor}`}>{trend}</span>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-center">
        <div className="relative h-24 w-24">
          <svg className="h-full w-full -rotate-90 transform">
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              className="text-gray-200 dark:text-gray-700"
            />
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
          <div key={key} className="rounded-lg bg-white/50 p-2 text-center dark:bg-slate-800/50">
            <div className="text-lg font-bold text-purple-600 dark:text-purple-400">{value}</div>
            <div className="text-muted-foreground text-xs capitalize">{key}</div>
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
      <Card className="bg-muted/30 my-2 p-4">
        <div className="text-center">
          <BookOpen className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">No memories stored yet.</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="my-2 space-y-2">
      {memories.map((memory, i) => (
        <Card key={i} className="bg-white/50 p-3 dark:bg-slate-900/50">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm">{memory.content}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="text-xs capitalize">
                  {memory.type}
                </Badge>
                <span className="text-muted-foreground text-xs">
                  {format(new Date(memory.date), 'MMM d')}
                </span>
              </div>
            </div>
            <div className="flex">
              {[...Array(memory.importance)].map((_, j) => (
                <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />
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
    <Card className="my-2 border-blue-200 bg-blue-50 p-3 dark:border-blue-900 dark:bg-blue-950/20">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-blue-500" />
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
    <Card className="my-2 bg-white/50 p-4 dark:bg-slate-900/50">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Sun className="h-4 w-4 text-amber-500" />
        Your Profile
      </h4>
      <div className="space-y-2 text-sm">
        {name && (
          <div>
            <span className="text-muted-foreground">Name:</span> {name}
          </div>
        )}
        {email && (
          <div>
            <span className="text-muted-foreground">Email:</span> {email}
          </div>
        )}
        {phone && (
          <div>
            <span className="text-muted-foreground">Phone:</span> {phone}
          </div>
        )}
        {language && (
          <div>
            <span className="text-muted-foreground">Language:</span> {language}
          </div>
        )}
        {preferences && Object.keys(preferences).length > 0 && (
          <div className="mt-2 border-t pt-2">
            <span className="text-muted-foreground text-xs">Preferences:</span>
            <div className="mt-1 flex flex-wrap gap-1">
              {preferences.goals?.map((g: string) => (
                <Badge key={g} variant="secondary" className="text-xs">
                  {g}
                </Badge>
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
    <Card className="my-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:border-amber-900 dark:from-slate-900 dark:to-slate-800">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/50">
          <BookOpen className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-100">
            Journal Entry Saved
          </h4>
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
      <Card className="bg-muted/30 my-2 p-4">
        <div className="text-center">
          <BookOpen className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">No journal entries yet.</p>
          <p className="text-muted-foreground mt-1 text-xs">
            Start journaling to track your thoughts!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="my-2 space-y-2">
      {entries.map((entry) => (
        <Card key={entry.id} className="bg-white/50 p-3 dark:bg-slate-900/50">
          <div className="mb-2 flex items-start justify-between">
            <span className="text-muted-foreground text-xs">
              {format(new Date(entry.date), 'MMM d, yyyy')}
            </span>
            {entry.mood && (
              <Badge variant="outline" className="text-xs">
                Mood: {entry.mood}/10
              </Badge>
            )}
          </div>
          <p className="text-sm">{entry.content}</p>
          {entry.tags && entry.tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
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
    <Card className="my-2 border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950/20">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="h-4 w-4 text-green-500" />
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
    <Card className="my-2 border-red-200 bg-red-50 p-3 dark:border-red-900 dark:bg-red-950/20">
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 text-red-500" />
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
  moodAcknowledgment,
}: PersonalizedGreetingResultProps) {
  return (
    <Card className="my-2 border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 p-4 dark:border-amber-900 dark:from-slate-900 dark:to-slate-800">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-2xl dark:bg-amber-900/50">
          {emoji}
        </div>
        <div>
          <h4 className="text-base font-semibold text-amber-900 dark:text-amber-100">{greeting}</h4>
          {moodAcknowledgment && (
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">{moodAcknowledgment}</p>
          )}
          {contextTip && (
            <p className="mt-1 text-xs text-amber-600/80 dark:text-amber-400/80">{contextTip}</p>
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
      <Card className="my-2 border-green-100 bg-green-50/50 p-4 dark:border-green-900 dark:bg-slate-900/50">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="text-sm">You're all caught up! No urgent actions for now.</span>
        </div>
      </Card>
    );
  }

  const priorityColors = {
    high: 'bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    medium: 'bg-amber-100 dark:bg-amber-900/30 border-amber-200 dark:border-amber-800',
    low: 'bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
  };

  const categoryEmojis: Record<string, string> = {
    wellness: '🧘',
    booking: '📅',
    social: '👥',
    'self-care': '💆',
    learning: '📚',
  };

  return (
    <div className="my-2 space-y-2">
      <h4 className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
        <Lightbulb className="h-3 w-3" /> Suggested Actions
      </h4>
      {actions.map((action) => (
        <Card key={action.id} className={`p-3 ${priorityColors[action.priority]}`}>
          <div className="flex items-start gap-2">
            <span className="text-lg">{categoryEmojis[action.category] || '✨'}</span>
            <div className="flex-1">
              <h5 className="text-sm font-medium">{action.title}</h5>
              <p className="text-muted-foreground mt-0.5 text-xs">{action.description}</p>
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <Clock className="mr-1 h-2 w-2" />
                  {action.estimatedMinutes} min
                </Badge>
                <span className="text-muted-foreground text-xs">{action.reason}</span>
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
    <Card className="my-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-5 dark:border-purple-900 dark:from-slate-900 dark:to-slate-800">
      <div className="text-center">
        <Sparkles className="mx-auto mb-3 h-6 w-6 text-purple-500" />
        <p className="text-base leading-relaxed font-medium text-purple-900 dark:text-purple-100">
          "{affirmation.text}"
        </p>
        {affirmation.relatedToMood && (
          <div className="mt-3 flex items-center justify-center gap-1">
            <Heart className="h-3 w-3 text-pink-500" />
            <span className="text-muted-foreground text-xs">Based on how you're feeling</span>
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
    <Card className="my-2 border-purple-100 bg-white/50 p-4 dark:border-purple-900 dark:bg-slate-900/50">
      <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Activity className="h-4 w-4 text-purple-500" />
        {report.period === 'week' ? 'Weekly' : 'Monthly'} Progress Report
      </h4>

      <p className="text-muted-foreground mb-4 text-sm">{report.summary}</p>

      <div className="mb-4 grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-purple-50 p-2 text-center dark:bg-purple-950/30">
          <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {report.stats.averageMood}
          </div>
          <div className="text-muted-foreground text-xs">Avg Mood</div>
        </div>
        <div className="rounded-lg bg-indigo-50 p-2 text-center dark:bg-indigo-950/30">
          <div className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
            {report.stats.streakDays}
          </div>
          <div className="text-muted-foreground text-xs">Day Streak</div>
        </div>
        <div className="rounded-lg bg-green-50 p-2 text-center dark:bg-green-950/30">
          <div className="text-lg font-bold text-green-600 dark:text-green-400">
            {report.stats.moodCheckIns}
          </div>
          <div className="text-muted-foreground text-xs">Check-ins</div>
        </div>
      </div>

      {report.highlights.length > 0 && (
        <div className="mb-3">
          <h5 className="mb-1 flex items-center gap-1 text-xs font-medium">
            <Star className="h-3 w-3 text-amber-500" /> Highlights
          </h5>
          <ul className="text-muted-foreground space-y-0.5 text-xs">
            {report.highlights.slice(0, 3).map((h, i) => (
              <li key={i}>• {h}</li>
            ))}
          </ul>
        </div>
      )}

      {report.nextSteps.length > 0 && (
        <div>
          <h5 className="mb-1 flex items-center gap-1 text-xs font-medium">
            <ArrowRight className="h-3 w-3 text-blue-500" /> Next Steps
          </h5>
          <ul className="text-muted-foreground space-y-0.5 text-xs">
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
      <Card className="bg-muted/30 my-2 p-4">
        <div className="text-center">
          <Brain className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">No patterns detected yet.</p>
          <p className="text-muted-foreground mt-1 text-xs">Keep tracking to uncover insights!</p>
        </div>
      </Card>
    );
  }

  const patternIcons: Record<string, typeof TrendingUp> = {
    'positive-trend': TrendingUp,
    'attention-needed': AlertCircle,
    'health-alert': AlertCircle,
    'positive-habit': CheckCircle2,
    achievement: Award,
    'emotional-pattern': Heart,
  };

  const patternColors: Record<string, string> = {
    'positive-trend': 'text-green-500',
    'attention-needed': 'text-amber-500',
    'health-alert': 'text-red-500',
    'positive-habit': 'text-green-500',
    achievement: 'text-amber-500',
    'emotional-pattern': 'text-purple-500',
  };

  return (
    <div className="my-2 space-y-2">
      <h4 className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
        <Brain className="h-3 w-3" /> Detected Patterns
      </h4>
      {patterns.map((pattern) => {
        const Icon = patternIcons[pattern.patternType] || Brain;
        const color = patternColors[pattern.patternType] || 'text-purple-500';
        return (
          <Card key={pattern.id} className="bg-white/50 p-3 dark:bg-slate-900/50">
            <div className="flex items-start gap-2">
              <Icon className={`mt-0.5 h-4 w-4 ${color}`} />
              <div>
                <h5 className="text-sm font-medium">{pattern.description}</h5>
                <p className="text-muted-foreground mt-0.5 text-xs">{pattern.insight}</p>
                {pattern.actionSuggestion && (
                  <p className="mt-1 text-xs text-purple-600 dark:text-purple-400">
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
    <Card className="my-2 border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 p-4 dark:border-cyan-900 dark:from-slate-900 dark:to-slate-800">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/50">
          <Wind className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-cyan-900 dark:text-cyan-100">
            {exercise.name}
          </h4>
          <p className="mt-1 text-xs text-cyan-700 dark:text-cyan-300">{exercise.description}</p>

          <div className="mt-3 flex items-center gap-4 rounded-lg bg-white/50 p-2 dark:bg-slate-800/50">
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-600">{exercise.pattern.inhale}s</div>
              <div className="text-muted-foreground text-xs">Inhale</div>
            </div>
            {exercise.pattern.hold && (
              <div className="text-center">
                <div className="text-lg font-bold text-cyan-600">{exercise.pattern.hold}s</div>
                <div className="text-muted-foreground text-xs">Hold</div>
              </div>
            )}
            <div className="text-center">
              <div className="text-lg font-bold text-cyan-600">{exercise.pattern.exhale}s</div>
              <div className="text-muted-foreground text-xs">Exhale</div>
            </div>
          </div>

          <div className="mt-2 flex flex-wrap gap-1">
            {exercise.benefits.slice(0, 3).map((b) => (
              <Badge
                key={b}
                variant="secondary"
                className="bg-cyan-100/50 text-xs dark:bg-cyan-900/30"
              >
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
      <Card className="bg-muted/30 my-2 p-4">
        <div className="text-center">
          <Award className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground text-sm">No achievements unlocked yet.</p>
          <p className="text-muted-foreground mt-1 text-xs">Keep going – you're making progress!</p>
        </div>
      </Card>
    );
  }

  return (
    <div className="my-2 space-y-2">
      <h4 className="text-muted-foreground flex items-center gap-1 text-xs font-medium">
        <Award className="h-3 w-3 text-amber-500" /> Your Achievements
      </h4>
      {achievements.map((achievement) => (
        <Card
          key={achievement.id}
          className="border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-4 dark:border-amber-900 dark:from-slate-900 dark:to-slate-800"
        >
          <div className="text-center">
            <div className="mb-2 text-3xl">{achievement.emoji}</div>
            <h4 className="font-semibold text-amber-900 dark:text-amber-100">
              {achievement.title}
            </h4>
            <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
              {achievement.description}
            </p>
            <p className="mt-2 text-sm font-medium text-amber-800 dark:text-amber-200">
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
    <Card className="relative my-2 overflow-hidden border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50 p-4 dark:border-indigo-900 dark:from-indigo-950 dark:to-purple-950">
      <div className="relative z-10">
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 dark:bg-indigo-900">
            <Flower2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h4 className="text-sm font-semibold">{session.title}</h4>
          <Badge variant="outline" className="ml-auto text-xs">
            {session.durationMinutes} min
          </Badge>
        </div>

        <p className="text-muted-foreground mb-4 text-xs italic">"{session.calmingQuote}"</p>

        {!isActive ? (
          <div className="space-y-3">
            <div className="space-y-1">
              {session.steps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs">
                  <div className="mt-1 flex h-3 w-3 items-center justify-center rounded-full bg-indigo-200 text-[8px] font-bold dark:bg-indigo-800">
                    {idx + 1}
                  </div>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <Button
              className="h-8 w-full bg-indigo-600 text-xs text-white hover:bg-indigo-700"
              onClick={() => setIsActive(true)}
            >
              Start Session
            </Button>
          </div>
        ) : (
          <div className="py-4 text-center">
            <div className="mb-4 flex justify-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-indigo-200 dark:border-indigo-800">
                <div className="absolute inset-0 animate-ping rounded-full bg-indigo-400/20"></div>
                <Wind className="h-8 w-8 animate-pulse text-indigo-600" />
              </div>
            </div>
            <p className="animate-pulse text-sm font-medium text-indigo-600 dark:text-indigo-400">
              Breathing in...
            </p>
            <p className="text-muted-foreground mt-2 text-xs">Focus on the rhythm of the circle</p>
            <Button
              variant="ghost"
              size="sm"
              className="mt-4 h-7 text-xs"
              onClick={() => setIsActive(false)}
            >
              Finish
            </Button>
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
    <Card className="my-2 border-slate-200 p-4 dark:border-slate-800">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
          <Moon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </div>
        <div>
          <h4 className="text-sm font-semibold">Sleep Quality: {insight.quality}</h4>
          <p className="text-lg font-bold text-slate-700 dark:text-slate-200">
            {insight.averageSleep} hours{' '}
            <span className="text-muted-foreground text-opacity-70 text-xs font-normal">avg</span>
          </p>
        </div>
        <Badge
          className={`ml-auto ${insight.trend === 'improving' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-700'}`}
        >
          {insight.trend}
        </Badge>
      </div>

      <p className="text-muted-foreground mb-4 text-xs">{insight.summary}</p>

      <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900/50">
        <h5 className="text-muted-foreground mb-2 flex items-center gap-1 text-xs font-bold tracking-wider uppercase">
          <Lightbulb className="h-3 w-3" /> Habits for Better Rest
        </h5>
        <ul className="space-y-1">
          {insight.tips.map((tip, idx) => (
            <li key={idx} className="flex items-center gap-2 text-xs">
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
    <Card className="my-2 border-emerald-100 bg-emerald-50/30 p-4 dark:border-emerald-900 dark:bg-emerald-950/20">
      <div className="mb-4 flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900">
          <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h4 className="text-sm font-semibold">Your Wellness Goals</h4>
      </div>

      <div className="space-y-4">
        {tracker.goals.map((goal) => (
          <div key={goal.id} className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="font-medium">{goal.title}</span>
              <span className="text-muted-foreground">
                {goal.progress}/{goal.target} {goal.unit}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-emerald-100 dark:bg-emerald-900">
              <div
                className={`h-full transition-all duration-500 ${goal.isCompleted ? 'bg-emerald-500' : 'bg-emerald-400'}`}
                style={{ width: `${Math.min(100, (goal.progress / goal.target) * 100)}%` }}
              ></div>
            </div>
            {goal.isCompleted && (
              <p className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400">
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
    <Card className="my-2 p-4">
      <div className="mb-4 flex items-center gap-2">
        <div className="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-lg">
          <Calendar className="text-primary h-4 w-4" />
        </div>
        <h4 className="text-sm font-semibold">Mood Landscape</h4>
        <Badge variant="secondary" className="ml-auto text-xs">
          Last 14 Days
        </Badge>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.length === 0 ? (
          <div className="text-muted-foreground col-span-7 py-4 text-center text-xs italic">
            Check-in more often to see your landscape grow
          </div>
        ) : (
          days.map((day, idx) => (
            <div key={idx} className="space-y-1 text-center">
              <div
                className={`h-6 rounded-sm ${getMoodColor(day.mood)} cursor-pointer shadow-sm transition-transform hover:scale-110`}
                title={`${day.date}: ${day.mood}/10`}
              ></div>
              <span className="text-muted-foreground text-[8px]">{day.date.split('-')[2]}</span>
            </div>
          ))
        )}
      </div>

      <div className="text-muted-foreground mt-4 flex items-center justify-between border-t pt-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-sm bg-red-300"></div>
          <span>Low</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-sm bg-amber-300"></div>
          <span>Moderate</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-sm bg-emerald-300"></div>
          <span>Good</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-sm bg-emerald-500"></div>
          <span>Great</span>
        </div>
      </div>
    </Card>
  );
}

// ----------------------------------------------------------------------------
// PHASE 7 COMPONENTS
// ----------------------------------------------------------------------------

export function BookingPreviewBlock({
  preview,
}: {
  preview: {
    serviceId: string;
    serviceName: string;
    description: string;
    price: number;
    duration: number;
    dateTime: string;
    variantName?: string;
    serviceVariantId?: string;
  };
}) {
  return (
    <Card className="relative my-2 overflow-hidden border-0 bg-gradient-to-br from-indigo-50/80 to-purple-50/80 p-4 shadow-xl backdrop-blur-md dark:from-slate-900/80 dark:to-slate-800/80">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Sparkles className="text-primary h-16 w-16" />
      </div>

      <div className="relative z-10">
        <Badge className="bg-primary text-primary-foreground mb-2 text-xs">
          Preview Confirmation
        </Badge>
        <h4 className="text-foreground mb-1 text-lg font-bold">{preview.serviceName}</h4>
        {preview.variantName && (
          <p className="text-primary/80 mb-2 text-xs font-semibold">{preview.variantName}</p>
        )}
        <p className="text-muted-foreground mb-4 line-clamp-2 text-xs">{preview.description}</p>

        <div className="mb-5 grid grid-cols-2 gap-4">
          <div className="rounded-lg border border-white/20 bg-white/40 p-2 dark:bg-black/20">
            <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs">
              <Calendar className="h-3 w-3" /> Date & Time
            </div>
            <div className="truncate text-xs font-bold">
              {format(new Date(preview.dateTime), 'MMM d @ h:mm a')}
            </div>
          </div>
          <div className="rounded-lg border border-white/20 bg-white/40 p-2 dark:bg-black/20">
            <div className="text-muted-foreground mb-1 flex items-center gap-2 text-xs">
              <ShoppingBag className="h-3 w-3" /> Investment
            </div>
            <div className="text-xs font-bold">${preview.price}</div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-primary/20 w-full font-bold shadow-lg"
            onClick={() => {
              const event = new CustomEvent('ai_confirm_booking', { detail: preview });
              document.dispatchEvent(event);
            }}
          >
            Confirm Appointment
          </Button>
          <Button
            variant="ghost"
            className="text-muted-foreground w-full text-xs hover:bg-black/5 dark:hover:bg-white/5"
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
      <h4 className="text-primary/60 ml-1 text-xs font-bold tracking-widest uppercase">
        Service Comparison
      </h4>
      <div className="-mx-1 flex snap-x gap-3 overflow-x-auto px-1 pb-4">
        {services.map((s, idx) => (
          <Card
            key={idx}
            className="group hover:border-primary/40 min-w-[240px] flex-shrink-0 snap-center overflow-hidden border-indigo-100 bg-white/50 p-0 backdrop-blur-sm transition-all dark:border-indigo-900 dark:bg-slate-950/50"
          >
            <div className="bg-gradient-to-br from-indigo-50 to-white p-4 transition-colors dark:from-slate-900 dark:to-slate-950">
              <Badge variant="outline" className="border-primary/20 mb-2 text-xs">
                {s.category}
              </Badge>
              <h5 className="mb-1 line-clamp-1 text-sm font-bold">{s.name}</h5>
              <p className="text-muted-foreground line-clamp-2 h-8 text-xs">{s.description}</p>
            </div>
            <div className="space-y-3 border-t border-indigo-50 p-4 dark:border-indigo-900/50">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Price</span>
                <span className="bg-primary/10 text-primary rounded px-2 py-0.5 text-sm font-bold">
                  ${s.price_amount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground text-xs">Duration</span>
                <span className="text-xs font-medium">{s.duration_min} min</span>
              </div>
              <Button
                size="sm"
                className="border-primary/20 hover:bg-primary h-8 w-full border bg-white text-xs font-semibold shadow-sm transition-all hover:text-white dark:bg-slate-900"
                onClick={() => {
                  const event = new CustomEvent('ai_service_selected', {
                    detail: { name: s.name, id: s.id },
                  });
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
    return (
      <div className="text-muted-foreground bg-muted/20 rounded-lg p-4 text-center text-xs">
        No transaction history found.
      </div>
    );
  }

  return (
    <div className="my-2 space-y-3">
      <h4 className="text-primary/60 ml-1 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
        <History className="h-3 w-3" /> Recent Transactions
      </h4>
      <div className="space-y-1">
        {transactions.map((t, idx) => (
          <div
            key={idx}
            className="border-border/40 flex items-center justify-between rounded-xl border bg-white/40 p-3 transition-colors hover:bg-white/60 dark:bg-slate-900/40"
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  t.amount >= 0
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}
              >
                {t.type === 'purchase' ? (
                  <ShoppingBag
                    className={`h-4 w-4 ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}
                  />
                ) : t.type === 'deposit' ? (
                  <TrendingUp className="h-4 w-4 text-green-600" />
                ) : (
                  <CreditCard className="h-4 w-4 text-blue-600" />
                )}
              </div>
              <div>
                <div className="line-clamp-1 text-xs font-semibold">{t.description || t.type}</div>
                <div className="text-muted-foreground text-xs">
                  {format(new Date(t.date), 'MMM d, h:mm a')}
                </div>
              </div>
            </div>
            <div
              className={`text-xs font-bold ${t.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              {t.amount >= 0 ? '+' : ''}
              {t.amount.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground h-7 w-full text-xs"
        onClick={() => (window.location.href = '/wallet')}
      >
        View All in Wallet
      </Button>
    </div>
  );
}
