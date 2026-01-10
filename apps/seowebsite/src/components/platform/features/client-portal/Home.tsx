import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ArrowRight, TrendingUp, Award, Clock, Sparkles, Info } from 'lucide-react';
import { Button } from '@/components/platform/ui/button';
import { Skeleton } from '@/components/platform/ui/skeleton';
import { api } from '@/lib/platform/mobile/api';
import { ResponsiveContainer } from './Layout/ResponsiveContainer';
import { CountdownTimer } from './CountdownTimer';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/platform/ui/tooltip';

interface HomeProps {
  userId: string;
  userName: string;
  onBookAppointment: () => void;
  onViewSession: () => void;
  onViewProfile: () => void;
}

export function Home({ userId, userName, onBookAppointment, onViewSession, onViewProfile }: HomeProps) {
  const [upcomingAppointment, setUpcomingAppointment] = useState<any>(null);
  const [stats, setStats] = useState({ sessionsComplete: 0, goalsAchieved: 0, hoursOfProgress: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      // Load stats
      const statsResponse = await api.getStats(userId);
      setStats(statsResponse.stats);
    } catch (error) {
      console.error('Error loading stats:', error);
      // Use default stats on error
      setStats({ sessionsComplete: 0, goalsAchieved: 0, hoursOfProgress: 0 });
    }

    try {
      // Load upcoming appointment
      const upcomingResponse = await api.getUpcomingAppointment(userId);
      setUpcomingAppointment(upcomingResponse.appointment);
    } catch (error) {
      console.error('Error loading upcoming appointment:', error);
      setUpcomingAppointment(null);
    }

    try {
      // Load recommendations
      const recsResponse = await api.getRecommendations(userId);
      setRecommendations(recsResponse.recommendations);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      setRecommendations(null);
    }

    setIsLoading(false);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const statItems = [
    { label: 'Sessions Complete', value: stats.sessionsComplete, icon: TrendingUp },
    { label: 'Goals Achieved', value: stats.goalsAchieved, icon: Sparkles },
    { label: 'Hours of Progress', value: stats.hoursOfProgress, icon: Clock }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <ResponsiveContainer maxWidth="xl" className="p-6 lg:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 lg:mb-12"
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-gray-500 mb-1">Welcome back</h2>
              <h1 className="text-gray-900">{userName}</h1>
            </div>
            
            {/* Desktop Profile Button */}
            <button
              onClick={onViewProfile}
              className="hidden lg:flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-xl transition-all"
            >
              <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white">
                {userName.charAt(0).toUpperCase()}
              </div>
            </button>
            
            {/* Mobile Profile Button */}
            <button
              onClick={onViewProfile}
              className="lg:hidden w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white"
            >
              {userName.charAt(0).toUpperCase()}
            </button>
          </div>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Upcoming Session Skeleton */}
            <div className="mb-8 lg:mb-12">
              <Skeleton className="w-40 h-6 mb-4 lg:mb-6 rounded-md" />
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl lg:rounded-3xl p-5 lg:p-8">
                <div className="flex items-start justify-between mb-4 lg:mb-6">
                  <div className="flex-1">
                    <Skeleton className="w-48 h-4 mb-2 rounded-md bg-white/20" />
                    <Skeleton className="w-56 h-5 mb-1 rounded-md bg-white/20" />
                    <Skeleton className="w-40 h-4 rounded-md bg-white/20" />
                  </div>
                  <Skeleton className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl bg-white/20" />
                </div>
                <Skeleton className="w-full h-20 mb-4 lg:mb-6 rounded-xl bg-white/20" />
                <div className="flex items-center gap-3 mb-4 lg:mb-6 pb-4 lg:pb-6 border-b border-white/10">
                  <Skeleton className="w-20 h-4 rounded-md bg-white/20" />
                  <Skeleton className="w-16 h-4 rounded-md bg-white/20" />
                </div>
                <Skeleton className="w-full h-11 lg:h-14 rounded-xl bg-white/20" />
              </div>
            </div>

            {/* Stats Grid Skeleton */}
            <div className="grid grid-cols-3 gap-3 lg:gap-6 mb-8 lg:mb-12">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6">
                  <Skeleton className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl mb-3 lg:mb-4" />
                  <Skeleton className="w-12 h-8 mb-1 rounded-md" />
                  <Skeleton className="w-16 h-4 rounded-md" />
                </div>
              ))}
            </div>

            {/* Recommendations Skeleton */}
            <div>
              <div className="flex items-center gap-2 mb-4 lg:mb-6">
                <Skeleton className="w-5 h-5 rounded-md" />
                <Skeleton className="w-24 h-6 rounded-md" />
              </div>
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 lg:p-8">
                  <Skeleton className="w-20 h-4 mb-2 rounded-md" />
                  <Skeleton className="w-full h-6 rounded-md" />
                </div>
                <div className="bg-white rounded-3xl p-6 lg:p-8">
                  <Skeleton className="w-48 h-6 mb-4 rounded-md" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="w-full h-12 rounded-xl" />
                    ))}
                  </div>
                  <Skeleton className="w-full h-12 mt-4 rounded-xl" />
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {/* Upcoming Session - Now at top */}
            {upcomingAppointment && (
              <div className="mb-8 lg:mb-12">
                <h2 className="text-gray-900 mb-4 lg:mb-6">Upcoming Session</h2>
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl lg:rounded-3xl p-5 lg:p-8 text-white">
                  <div className="flex items-start justify-between mb-4 lg:mb-6">
                    <div>
                      <p className="text-white/80 text-xs lg:text-sm mb-1 lg:mb-2">
                        {new Date(upcomingAppointment.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <h3 className="text-white mb-1 lg:mb-2 text-base lg:text-lg">{upcomingAppointment.sessionType}</h3>
                      <p className="text-white/80 text-sm lg:text-base">with {upcomingAppointment.practitioner}</p>
                    </div>
                    <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/10 rounded-xl lg:rounded-2xl flex items-center justify-center">
                      <Calendar className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="mb-4 lg:mb-6">
                    <CountdownTimer 
                      targetDate={upcomingAppointment.date} 
                      targetTime={upcomingAppointment.time} 
                    />
                  </div>

                  <div className="flex items-center gap-3 lg:gap-4 mb-4 lg:mb-6 pb-4 lg:pb-6 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-white/60" />
                      <span className="text-xs lg:text-sm text-white/80">{upcomingAppointment.time}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs lg:text-sm text-white/80">{upcomingAppointment.duration || '60'} min</span>
                    </div>
                  </div>

                  <Button
                    onClick={() => onViewSession()}
                    className="w-full bg-white text-gray-900 hover:bg-gray-100 border-0 h-11 lg:h-14 rounded-xl lg:rounded-2xl text-sm lg:text-base"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            )}

            {/* Stats Grid - Responsive */}
            <div className="grid grid-cols-3 gap-3 lg:gap-6 mb-8 lg:mb-12">
              {[
                { label: 'Sessions', value: stats.sessionsComplete, icon: Award, color: 'bg-blue-50 text-blue-600' },
                { label: 'Goals', value: stats.goalsAchieved, icon: TrendingUp, color: 'bg-green-50 text-green-600' },
                { label: 'Hours', value: stats.hoursOfProgress, icon: Clock, color: 'bg-purple-50 text-purple-600' }
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-white rounded-2xl lg:rounded-3xl p-4 lg:p-6"
                  >
                    <div className={`w-10 h-10 lg:w-12 lg:h-12 ${stat.color} rounded-xl lg:rounded-2xl flex items-center justify-center mb-3 lg:mb-4`}>
                      <Icon className="w-5 h-5 lg:w-6 lg:h-6" />
                    </div>
                    <p className="text-2xl lg:text-3xl text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm lg:text-base text-gray-500">{stat.label}</p>
                  </div>
                );
              })}
            </div>

            {/* Personalized Recommendations */}
            <div>
              <div className="flex items-center gap-2 mb-4 lg:mb-6">
                <Sparkles className="w-5 h-5 text-gray-400" />
                <h2 className="text-gray-900">For You</h2>
              </div>

              {recommendations ? (
                <div className="space-y-4">
                  {/* Insight Card */}
                  {recommendations.insights && recommendations.insights.length > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-6 lg:p-8">
                      <p className="text-sm text-gray-600 mb-2">💡 Insight</p>
                      <p className="text-gray-900">{recommendations.insights[0]}</p>
                    </div>
                  )}

                  {/* Recommended Sessions */}
                  {recommendations.recommendedSessions && recommendations.recommendedSessions.length > 0 && (
                    <div className="bg-white rounded-3xl p-6 lg:p-8">
                      <h3 className="text-gray-900 mb-4">Recommended Sessions</h3>
                      <div className="space-y-3">
                        {recommendations.recommendedSessions.slice(0, 3).map((session: string) => (
                          <div key={session} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="w-2 h-2 bg-gray-900 rounded-full" />
                            <p className="text-gray-700 text-sm flex-1">{session}</p>
                          </div>
                        ))}
                      </div>
                      <Button
                        onClick={onBookAppointment}
                        variant="outline"
                        className="w-full mt-4 border-0 bg-gray-50 hover:bg-gray-100 h-12 rounded-xl"
                      >
                        Book Recommended Session
                      </Button>
                    </div>
                  )}

                  {/* Next Steps */}
                  {recommendations.nextSteps && recommendations.nextSteps.length > 0 && (
                    <div className="bg-white rounded-3xl p-6 lg:p-8">
                      <h3 className="text-gray-900 mb-4">Next Steps</h3>
                      <div className="space-y-3">
                        {recommendations.nextSteps.slice(0, 2).map((step: string, idx: number) => (
                          <div key={idx} className="flex items-start gap-3">
                            <div className="w-6 h-6 rounded-full bg-gray-900 text-white flex items-center justify-center text-sm flex-shrink-0">
                              {idx + 1}
                            </div>
                            <p className="text-gray-700 text-sm pt-0.5">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-6 lg:p-8">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-gray-900 mb-2">Personalized recommendations</h3>
                  <p className="text-gray-500">
                    Complete your profile to get tailored session suggestions
                  </p>
                </div>
              )}
            </div>

            {/* Book Session CTA - Only show if no upcoming appointment */}
            {!upcomingAppointment && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="mt-8 lg:mt-12"
              >
                <div className="bg-white rounded-3xl p-6 lg:p-8">
                  <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4">
                    <Calendar className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-gray-900 mb-2">No upcoming sessions</h3>
                  <p className="text-gray-500 mb-6">
                    Ready to continue your wellness journey?
                  </p>
                  <Button
                    onClick={onBookAppointment}
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white border-0 h-12 lg:h-14 rounded-2xl"
                  >
                    <span className="flex items-center justify-center gap-2">
                      Book Session
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </ResponsiveContainer>
    </div>
  );
}


