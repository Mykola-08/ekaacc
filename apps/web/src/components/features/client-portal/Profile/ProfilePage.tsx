import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Camera, Bell, CreditCard, Shield, HelpCircle, LogOut, ChevronRight, Mail, Phone, X, MapPin, User, Lock, Edit2 } from 'lucide-react';
import { api } from '@/lib/mobile/api';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChangePassword } from './ChangePassword';
import { PaymentMethods } from './PaymentMethods';
import { SessionPreferences } from './SessionPreferences';

interface ProfilePageProps {
  userId: string;
  userName: string;
  userEmail: string;
  onBack: () => void;
  onLogout: () => void;
}

export function ProfilePage({ userId, userName, userEmail, onBack, onLogout }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(userName);
  const [editedPhone, setEditedPhone] = useState('+31 6 1234 5678');
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  const [notifications, setNotifications] = useState({
    sessions: true,
    reminders: true,
    newsletter: false,
    promotions: false,
    email: true
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPreferencesModal, setShowPreferencesModal] = useState(false);

  useEffect(() => {
    loadNotificationSettings();
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    try {
      const response = await api.getProfile(userId);
      if (response.profile) {
        setEditedName(response.profile.name || userName);
        setEditedPhone(response.profile.phone || '+31 6 1234 5678');
      }
    } catch (error) {
      console.error('Error loading profile:', error);
    }
  };

  const loadNotificationSettings = async () => {
    try {
      const response = await api.getNotifications(userId);
      if (response.notifications) {
        setNotifications(response.notifications);
      }
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const handleSave = async () => {
    setIsEditing(false);
    try {
      await api.updateProfile(userId, {
        name: editedName,
        phone: editedPhone,
        email: userEmail
      });
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to log out?')) {
      onLogout();
    }
  };

  const handleNotificationToggle = async (type: 'reminders' | 'sessions' | 'newsletter' | 'promotions' | 'email') => {
    const newValue = !notifications[type];
    
    setNotifications({
      ...notifications,
      [type]: newValue
    });

    try {
      await api.updateNotifications(userId, {
        [type]: newValue
      });
      
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} notifications ${newValue ? 'enabled' : 'disabled'}`);
    } catch (error) {
      console.error('Error updating notification settings:', error);
      toast.error('Failed to update notification settings');
      
      // Revert on error
      setNotifications({
        ...notifications,
        [type]: !newValue
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="p-6 flex items-center justify-between">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-gray-900">Profile</h2>
          <button
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {isEditing ? 'Save' : 'Edit'}
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 pb-24">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white rounded-3xl p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 rounded-full bg-gray-900 text-white flex items-center justify-center text-3xl">
                {userName.charAt(0).toUpperCase()}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center">
                  <Edit2 className="w-4 h-4 text-white" />
                </button>
              )}
            </div>
            <h3 className="text-gray-900 mb-1">{userName}</h3>
            <p className="text-sm text-gray-500">{userEmail}</p>
          </div>
        </motion.div>

        {/* Personal Information */}
        <div>
          <h3 className="text-gray-900 mb-3">Personal Information</h3>
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Full Name</p>
                  {isEditing ? (
                    <Input
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="border-0 p-0 h-auto bg-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{userName}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="text-gray-900">{userEmail}</p>
                </div>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-gray-400" />
                <div className="flex-1">
                  <p className="text-sm text-gray-500 mb-1">Phone</p>
                  {isEditing ? (
                    <Input
                      value={editedPhone}
                      onChange={(e) => setEditedPhone(e.target.value)}
                      className="border-0 p-0 h-auto bg-transparent"
                    />
                  ) : (
                    <p className="text-gray-900">{editedPhone}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div>
          <h3 className="text-gray-900 mb-3">Notifications</h3>
          <div className="bg-white rounded-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-900 mb-1">Session Reminders</p>
                    <p className="text-sm text-gray-500">Get notified before appointments</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationToggle('reminders')}
                  className={`w-12 h-7 rounded-full transition-colors ${
                    notifications.reminders ? 'bg-gray-900' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform mt-1 ${
                      notifications.reminders ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-900 mb-1">Session Updates</p>
                    <p className="text-sm text-gray-500">Changes and confirmations</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationToggle('sessions')}
                  className={`w-12 h-7 rounded-full transition-colors ${
                    notifications.sessions ? 'bg-gray-900' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform mt-1 ${
                      notifications.sessions ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="p-5 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-900 mb-1">Wellness Newsletter</p>
                    <p className="text-sm text-gray-500">Weekly tips and insights</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationToggle('newsletter')}
                  className={`w-12 h-7 rounded-full transition-colors ${
                    notifications.newsletter ? 'bg-gray-900' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform mt-1 ${
                      notifications.newsletter ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>

            <div className="p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-gray-900 mb-1">Promotions & Offers</p>
                    <p className="text-sm text-gray-500">Special deals and events</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationToggle('promotions')}
                  className={`w-12 h-7 rounded-full transition-colors ${
                    notifications.promotions ? 'bg-gray-900' : 'bg-gray-200'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full transition-transform mt-1 ${
                      notifications.promotions ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div>
          <h3 className="text-gray-900 mb-3">Account Settings</h3>
          <div className="bg-white rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowPasswordModal(true)}
              className="w-full p-5 border-b border-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-gray-400" />
                <p className="text-gray-900">Change Password</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => setShowPaymentModal(true)}
              className="w-full p-5 border-b border-gray-100 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-gray-400" />
                <p className="text-gray-900">Payment Methods</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button
              onClick={() => setShowPreferencesModal(true)}
              className="w-full p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <p className="text-gray-900">Session Preferences</p>
              </div>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* About */}
        <div>
          <h3 className="text-gray-900 mb-3">About</h3>
          <div className="bg-white rounded-2xl overflow-hidden">
            <button className="w-full p-5 border-b border-gray-100 flex items-center justify-between">
              <p className="text-gray-900">Terms of Service</p>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full p-5 border-b border-gray-100 flex items-center justify-between">
              <p className="text-gray-900">Privacy Policy</p>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>

            <button className="w-full p-5 flex items-center justify-between">
              <p className="text-gray-900">Help & Support</p>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Logout */}
        <Button
          onClick={handleLogout}
          className="w-full bg-white text-red-600 hover:bg-red-50 border-0 py-6 rounded-2xl"
        >
          <LogOut className="w-5 h-5 mr-2" />
          Log Out
        </Button>

        {/* App Version */}
        <p className="text-center text-sm text-gray-500">
          EKA Balance v1.0.0
        </p>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showPasswordModal && (
          <ChangePassword
            userEmail={userEmail}
            onClose={() => setShowPasswordModal(false)}
          />
        )}
        
        {showPaymentModal && (
          <PaymentMethods
            onClose={() => setShowPaymentModal(false)}
          />
        )}
        
        {showPreferencesModal && (
          <SessionPreferences
            userId={userId}
            onClose={() => setShowPreferencesModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}



