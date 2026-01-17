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
  Wind
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

interface AvailabilityResultProps {
  slots: any[];
}

export function AvailabilityResult({ slots }: AvailabilityResultProps) {
  if (!slots || slots.length === 0) {
    return <div className="text-sm text-muted-foreground p-3 bg-muted/40 rounded-lg">No slots available for this date.</div>;
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
    return <div className="text-sm text-muted-foreground p-3 bg-muted/40 rounded-lg">No services found.</div>;
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 -mx-2 px-2 snap-x">
      {services.map(service => (
        <Card key={service.id} className="min-w-[200px] p-3 flex-shrink-0 snap-center border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-slate-900/50">
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
    <Card className="p-4 my-2 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 border-indigo-100 dark:border-indigo-900">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-base">{service.name}</h4>
          {service.category && (
            <Badge variant="secondary" className="text-[10px] mt-1">{service.category}</Badge>
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
              <Badge key={v.id} variant="outline" className="text-[10px]">
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
    <Card className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0 shadow-lg my-2">
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
    <Card className={`p-4 bg-gradient-to-br ${tierColors[tier] || tierColors.bronze} text-white border-0 shadow-lg my-2`}>
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
        <Badge className="bg-white/20 text-white hover:bg-white/30 text-[10px] capitalize">{tier}</Badge>
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
    <Card className="p-4 bg-gradient-to-br from-pink-50 to-purple-50 dark:from-slate-900 dark:to-slate-800 border-pink-100 dark:border-pink-900 my-2">
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
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-2">
          <div className="text-lg font-bold text-pink-600 dark:text-pink-400">{entry.mood}/10</div>
          <div className="text-[10px] text-muted-foreground">Mood</div>
        </div>
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-2">
          <div className="text-xs font-medium capitalize text-purple-600 dark:text-purple-400">{entry.energy.replace('_', ' ')}</div>
          <div className="text-[10px] text-muted-foreground">Energy</div>
        </div>
        <div className="bg-white/60 dark:bg-slate-800/60 rounded-lg p-2">
          <div className="text-xs font-medium capitalize text-indigo-600 dark:text-indigo-400">{entry.stress}</div>
          <div className="text-[10px] text-muted-foreground">Stress</div>
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
    <Card className="p-4 my-2 border-purple-100 dark:border-purple-900">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-purple-500" />
          {period.charAt(0).toUpperCase() + period.slice(1)}ly Summary
        </h4>
        <Badge variant="outline" className="text-[10px]">{totalEntries} entries</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-3 h-3 text-purple-500" />
            <span className="text-[10px] text-muted-foreground">Avg Mood</span>
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
            <span className="text-[10px] text-muted-foreground">Avg Sleep</span>
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
            <Badge key={e.emotion} variant="secondary" className="text-[10px] capitalize">
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
                <div className="text-[10px] text-muted-foreground capitalize">{entry.energy.replace('_', ' ')} energy</div>
              </div>
            </div>
            <Badge variant={entry.stress === 'minimal' || entry.stress === 'mild' ? 'secondary' : 'destructive'} className="text-[10px] capitalize">
              {entry.stress}
            </Badge>
          </div>
          {entry.emotions && entry.emotions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.emotions.slice(0, 3).map(e => (
                <Badge key={e} variant="outline" className="text-[10px] capitalize">{e}</Badge>
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
            <Badge variant="outline" className="text-[10px] border-green-200 dark:border-green-800 capitalize">
              {goal.targetType}
            </Badge>
            <span className="text-[10px] text-green-600 dark:text-green-400">Target: {goal.targetValue}</span>
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
              <Badge variant="outline" className="text-[10px] mt-1 capitalize">{goal.targetType}</Badge>
            </div>
            <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{goal.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, goal.progress)}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
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
                <p className="text-[10px] text-muted-foreground line-clamp-2 mt-1">{s.reason}</p>
                <Badge className="mt-2 text-[9px]" variant={s.priority === 'high' ? 'default' : 'secondary'}>
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
                  <span className="text-[10px] text-muted-foreground">{e.data.duration} min</span>
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
          className={`p-3 ${
            rec.priority === 'high'
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
                <Badge variant={insight.priority === 'high' ? 'destructive' : 'secondary'} className="text-[10px]">
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
            <div className="text-[10px] text-muted-foreground capitalize">{key}</div>
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
                <Badge variant="outline" className="text-[10px] capitalize">{memory.type}</Badge>
                <span className="text-[10px] text-muted-foreground">{format(new Date(memory.date), 'MMM d')}</span>
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
                <Badge key={g} variant="secondary" className="text-[10px]">{g}</Badge>
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
              <Badge variant="outline" className="text-[10px]">Mood: {entry.mood}/10</Badge>
            )}
          </div>
          <p className="text-sm">{entry.content}</p>
          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {entry.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="text-[10px]">{tag}</Badge>
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
