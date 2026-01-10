import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Star, MessageSquare, Repeat2, Heart, Filter, TrendingUp, Award } from 'lucide-react';
import { Button } from '@/components/platform/ui/button';
import { api } from '@/lib/platform/mobile/api';
import { ResponsiveContainer } from './Layout/ResponsiveContainer';
import { toast } from 'sonner';
import { Badge } from '@/components/platform/ui/badge';
import { Skeleton } from '@/components/platform/ui/skeleton';

interface PastAppointmentsProps {
  userId: string;
  onViewFeedback: (sessionType: string, practitioner: string) => void;
  onQuickRebook?: (sessionType: string, practitioner: string) => void;
  onBack?: () => void;
}

export function PastAppointments({ userId, onViewFeedback, onQuickRebook, onBack }: PastAppointmentsProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [favoritePractitioners, setFavoritePractitioners] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'completed' | 'rated'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');

  useEffect(() => {
    async function loadAppointments() {
      try {
        const data = await api.getPastAppointments(userId);
        setAppointments(data.appointments || []);
        if (data.appointments && data.appointments.length > 0) {
          setExpandedId(0);
        }
      } catch (error) {
        console.error('Error loading past appointments:', error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
    
    // Load favorite practitioners from local storage
    const saved = localStorage.getItem(`eka-favorites-${userId}`);
    if (saved) {
      setFavoritePractitioners(new Set(JSON.parse(saved)));
    }
  }, [userId]);

  const toggleFavorite = (practitioner: string) => {
    const newFavorites = new Set(favoritePractitioners);
    if (newFavorites.has(practitioner)) {
      newFavorites.delete(practitioner);
      toast.success(`${practitioner} removed from favorites`);
    } else {
      newFavorites.add(practitioner);
      toast.success(`${practitioner} added to favorites`);
    }
    setFavoritePractitioners(newFavorites);
    localStorage.setItem(`eka-favorites-${userId}`, JSON.stringify(Array.from(newFavorites)));
  };

  const toggleExpand = (index: number) => {
    setExpandedId(expandedId === index ? null : index);
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      <ResponsiveContainer maxWidth="xl" className="p-6 lg:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 lg:mb-12"
        >
          <h1 className="text-gray-900 mb-2">Past Sessions</h1>
          <p className="text-gray-500">Review your wellness journey</p>
        </motion.div>

        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-3xl p-6">
                <Skeleton className="w-full h-24 rounded-xl" />
              </div>
            ))}
          </motion.div>
        ) : appointments.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-center py-12 lg:py-20"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-gray-900 mb-2">No past sessions yet</h3>
            <p className="text-gray-500 mb-8">
              Your completed sessions will appear here
            </p>
          </motion.div>
        ) : (
          <>
            {/* Stats Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 lg:mb-12"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-6 lg:p-8 text-white">
                <div className="flex items-center gap-3 mb-6">
                  <Award className="w-6 h-6 text-yellow-400" />
                  <h3 className="text-white">Your Journey</h3>
                </div>
                
                <div className="grid grid-cols-3 gap-4 lg:gap-6">
                  <div className="text-center">
                    <p className="text-3xl lg:text-4xl text-white mb-1">{appointments.length}</p>
                    <p className="text-sm text-white/70">Sessions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl lg:text-4xl text-white mb-1">
                      {appointments.filter(a => a.rating).length}
                    </p>
                    <p className="text-sm text-white/70">Rated</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl lg:text-4xl text-white mb-1">
                      {favoritePractitioners.size}
                    </p>
                    <p className="text-sm text-white/70">Favorites</p>
                  </div>
                </div>

                {appointments.filter(a => a.rating).length > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-white/70">Average Rating</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-white">
                          {(appointments.filter(a => a.rating).reduce((acc, a) => acc + a.rating, 0) / 
                            appointments.filter(a => a.rating).length).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sessions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
              {appointments.map((appointment, index) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="bg-white rounded-3xl p-6 lg:p-8"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-2">
                        {new Date(appointment.date).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-gray-900">{appointment.sessionType}</h3>
                        <button
                          onClick={() => toggleFavorite(appointment.practitioner)}
                          className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors"
                          title={favoritePractitioners.has(appointment.practitioner) ? 'Remove from favorites' : 'Add to favorites'}
                        >
                          <Heart className={`w-4 h-4 ${
                            favoritePractitioners.has(appointment.practitioner)
                              ? 'fill-red-500 text-red-500'
                              : 'text-gray-400'
                          }`} />
                        </button>
                      </div>
                      <p className="text-gray-500 text-sm">with {appointment.practitioner}</p>
                    </div>
                    <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center">
                      <Calendar className="w-6 h-6 text-gray-400" />
                    </div>
                  </div>

                  {appointment.rating && (
                    <div className="flex items-center gap-1 mb-4 pb-4 border-b border-gray-100">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-5 h-5 ${
                            star <= appointment.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!appointment.rating && (
                      <Button
                        onClick={() => onViewFeedback(appointment.sessionType, appointment.practitioner)}
                        variant="outline"
                        className="flex-1 border-0 bg-gray-50 hover:bg-gray-100 rounded-xl"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <MessageSquare className="w-4 h-4" />
                          Feedback
                        </span>
                      </Button>
                    )}
                    {onQuickRebook && (
                      <Button
                        onClick={() => {
                          onQuickRebook(appointment.sessionType, appointment.practitioner);
                          toast.success('Redirecting to booking with your preferences...');
                        }}
                        className="flex-1 bg-gray-900 hover:bg-gray-800 text-white border-0 rounded-xl"
                      >
                        <span className="flex items-center justify-center gap-2">
                          <Repeat2 className="w-4 h-4" />
                          Rebook
                        </span>
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </ResponsiveContainer>
    </div>
  );
}



