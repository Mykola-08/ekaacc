import { useState } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Video, Phone, MessageSquare, Edit, X, Star, Heart, Share2, Download, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ResponsiveContainer } from './Layout/ResponsiveContainer';
import { CountdownTimer } from './CountdownTimer';

interface SessionDetailsProps {
  userId: string;
  onBack: () => void;
  onReschedule: () => void;
}

export function SessionDetails({ userId, onBack, onReschedule }: SessionDetailsProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const session = {
    id: 1,
    type: 'Integrated Therapy Session',
    practitioner: {
      name: 'Emma Kowalski',
      specialty: 'Integrated Therapy & Kinesiology',
      bio: 'With over 10 years of experience, Emma specializes in integrative approaches that honor the body\'s wisdom and the mind\'s complexity.',
      image: '👩‍⚕️'
    },
    date: 'Tomorrow, Nov 15',
    time: '2:00 PM - 3:00 PM',
    duration: '60 min',
    price: '€90',
    location: 'EKA Balance Studio, Amsterdam',
    sessionType: 'In-Person',
    notes: 'Focus on shoulder tension and sleep improvement'
  };

  const preparation = [
    { title: 'Wear comfortable clothing', description: 'Loose, breathable clothes that allow movement' },
    { title: 'Arrive 5 minutes early', description: 'Give yourself time to settle and transition' },
    { title: 'Stay hydrated', description: 'Drink water before and after your session' },
    { title: 'Set an intention', description: 'What would you like to explore or release today?' }
  ];

  const handleCancel = () => {
    toast.success('Session cancelled');
    setShowCancelDialog(false);
    setTimeout(() => onBack(), 1000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 lg:pb-8">
      {/* Cancel Dialog */}
      <AnimatePresence>
        {showCancelDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowCancelDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 lg:p-8 max-w-sm w-full"
            >
              <h3 className="text-gray-900 mb-2">Cancel Session?</h3>
              <p className="text-gray-500 mb-6">
                Are you sure you want to cancel this session? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowCancelDialog(false)}
                  className="flex-1 border-0 bg-gray-100 rounded-xl"
                >
                  Keep Session
                </Button>
                <Button
                  onClick={handleCancel}
                  className="flex-1 border-0 bg-gray-900 text-white rounded-xl"
                >
                  Cancel Session
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ResponsiveContainer maxWidth="4xl" className="p-6 lg:p-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 lg:mb-12"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="lg:hidden w-10 h-10 rounded-full bg-white flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-gray-900">Session Details</h1>
              <p className="text-gray-500">View and manage your upcoming session</p>
            </div>
          </div>
          
          {/* Desktop Quick Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="outline"
              className="border-0 bg-white hover:bg-gray-50 rounded-xl"
              onClick={() => toast.success('Session added to calendar')}
            >
              <Download className="w-4 h-4 mr-2" />
              Add to Calendar
            </Button>
            <Button
              variant="outline"
              className="border-0 bg-white hover:bg-gray-50 rounded-xl"
              onClick={() => toast.success('Session shared')}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>
        </motion.div>

        {/* Desktop Two Column Layout */}
        <div className="lg:grid lg:grid-cols-3 lg:gap-8 space-y-6 lg:space-y-0">
          {/* Left Column - Session Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Session Overview Card */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-3xl p-6 lg:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-white/10 px-3 py-1.5 rounded-full">
                        Upcoming
                      </span>
                      <span className="text-xs bg-green-500/20 text-green-300 px-3 py-1.5 rounded-full flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Confirmed
                      </span>
                    </div>
                    <h2 className="text-white mb-2">{session.type}</h2>
                    <p className="text-gray-300 text-sm mb-6">{session.duration} • {session.price}</p>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-200">{session.date}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Clock className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-200">{session.time}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-200 text-sm">{session.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Countdown Timer */}
                    <div className="mb-6">
                      <CountdownTimer targetDate="2024-11-15" targetTime="14:00" />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="flex-1 bg-white text-gray-900 hover:bg-gray-100 border-0 rounded-xl">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message Practitioner
                  </Button>
                  <Button className="flex-1 bg-white/10 text-white hover:bg-white/20 border-0 rounded-xl">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Tabs Content */}
            <Tabs defaultValue="preparation" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-white rounded-2xl p-1">
                <TabsTrigger value="preparation" className="rounded-xl">Preparation</TabsTrigger>
                <TabsTrigger value="details" className="rounded-xl">Session Details</TabsTrigger>
              </TabsList>

              <TabsContent value="preparation" className="space-y-4 mt-6">
                <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">📝</div>
                    <div>
                      <p className="text-gray-900 mb-1">Session Focus</p>
                      <p className="text-sm text-gray-600">{session.notes}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 lg:p-8">
                  <h3 className="text-gray-900 mb-4">How to Prepare</h3>
                  <div className="space-y-3">
                    {preparation.map((item, index) => (
                      <div key={index} className="p-4 bg-gray-50 rounded-2xl">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center flex-shrink-0">
                            <span className="text-sm">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 mb-1">{item.title}</p>
                            <p className="text-sm text-gray-500">{item.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 lg:p-8">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">⏰</div>
                    <div>
                      <p className="text-gray-900 mb-2">Cancellation Policy</p>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        Free cancellation up to 24 hours before your session. Late cancellations may incur a 50% fee. No-shows will be charged the full amount.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4 mt-6">
                <div className="bg-white rounded-3xl p-6 lg:p-8">
                  <h3 className="text-gray-900 mb-4">What to Expect</h3>
                  <div className="space-y-4 text-sm text-gray-600 leading-relaxed">
                    <p>
                      Your Integrated Therapy Session combines kinesiology, emotional release work, and gentle somatic techniques in a holistic approach to wellness.
                    </p>
                    <p>
                      During the session, Emma will guide you through a personalized treatment plan focused on your specific needs, particularly addressing shoulder tension and sleep improvement.
                    </p>
                    <p>
                      The session takes place in a calm, private treatment room with gentle lighting and optional background music to support your relaxation.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 lg:p-8">
                  <h3 className="text-gray-900 mb-4">What's Included</h3>
                  <div className="space-y-3">
                    {[
                      'Initial consultation and assessment',
                      'Personalized treatment plan',
                      '60 minutes of hands-on therapy',
                      'Post-session recommendations',
                      'Follow-up notes via email'
                    ].map((item, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Mobile Action Buttons */}
            <div className="space-y-3 lg:hidden">
              <Button
                onClick={onReschedule}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white border-0 py-6 rounded-2xl"
              >
                Reschedule Session
              </Button>
              
              <Button
                onClick={() => setShowCancelDialog(true)}
                className="w-full text-gray-600 hover:bg-gray-100 border-0 bg-white py-6 rounded-2xl"
              >
                Cancel Session
              </Button>
            </div>
          </div>

          {/* Right Column - Practitioner Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Practitioner Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="bg-white rounded-3xl p-6 lg:p-8"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
                  {session.practitioner.image}
                </div>
                <div className="flex-1">
                  <h3 className="text-gray-900 mb-1">{session.practitioner.name}</h3>
                  <p className="text-sm text-gray-500">{session.practitioner.specialty}</p>
                </div>
                <button className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors">
                  <Heart className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed mb-6">{session.practitioner.bio}</p>

              <div className="grid grid-cols-3 gap-4 py-4 border-t border-b border-gray-100 mb-6">
                <div className="text-center">
                  <p className="text-2xl text-gray-900 mb-1">10+</p>
                  <p className="text-xs text-gray-500">Years</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl text-gray-900 mb-1">500+</p>
                  <p className="text-xs text-gray-500">Clients</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <span className="text-2xl text-gray-900">4.9</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <p className="text-xs text-gray-500">Rating</p>
                </div>
              </div>

              <div>
                <h4 className="text-gray-900 mb-3 text-sm">Specializations</h4>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full">Kinesiology</span>
                  <span className="text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full">Somatic Therapy</span>
                  <span className="text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full">Emotional Release</span>
                  <span className="text-xs bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full">Energy Work</span>
                </div>
              </div>
            </motion.div>

            {/* Desktop Action Buttons */}
            <div className="hidden lg:block space-y-3">
              <Button
                onClick={onReschedule}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white border-0 py-4 rounded-2xl"
              >
                <Edit className="w-4 h-4 mr-2" />
                Reschedule Session
              </Button>
              
              <Button
                onClick={() => setShowCancelDialog(true)}
                variant="outline"
                className="w-full text-red-600 hover:bg-red-50 border-0 bg-white py-4 rounded-2xl"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel Session
              </Button>
            </div>

            {/* Quick Info */}
            <div className="bg-gray-50 rounded-3xl p-6">
              <h4 className="text-gray-900 mb-4 text-sm">Need Help?</h4>
              <div className="space-y-3 text-sm">
                <button className="w-full text-left text-gray-700 hover:text-gray-900 transition-colors">
                  → View location on map
                </button>
                <button className="w-full text-left text-gray-700 hover:text-gray-900 transition-colors">
                  → Parking information
                </button>
                <button className="w-full text-left text-gray-700 hover:text-gray-900 transition-colors">
                  → Contact support
                </button>
              </div>
            </div>
          </div>
        </div>
      </ResponsiveContainer>
    </div>
  );
}


