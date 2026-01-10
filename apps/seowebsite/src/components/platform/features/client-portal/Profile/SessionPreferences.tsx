import { useState } from 'react';
import { X, Search, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/platform/ui/button';
import { Textarea } from '@/components/platform/ui/textarea';
import { toast } from 'sonner';
import { api } from '@/lib/platform/mobile/api';
import { standardOccupations } from '@/data/occupations';

interface SessionPreferencesProps {
  userId: string;
  onClose: () => void;
}

export function SessionPreferences({ userId, onClose }: SessionPreferencesProps) {
  const [occupation, setOccupation] = useState('Office Worker');
  const [occupationSearch, setOccupationSearch] = useState('Office Worker');
  const [showOccupationDropdown, setShowOccupationDropdown] = useState(false);
  const [concerns, setConcerns] = useState(['Stress management', 'Posture improvement']);
  const [preferences, setPreferences] = useState(['Gentle approach', 'Quiet environment']);
  const [isLoading, setIsLoading] = useState(false);

  const concernOptions = [
    'Stress management',
    'Pain relief',
    'Sleep improvement',
    'Emotional wellbeing',
    'Posture improvement',
    'Energy boost',
    'Relationship issues',
    'Anxiety relief'
  ];

  const preferenceOptions = [
    'Gentle approach',
    'Deep tissue work',
    'Focus on breathing',
    'Quiet environment',
    'Conversational',
    'Energy work',
    'Stretching included',
    'Aromatherapy'
  ];

  // Filter occupations based on search
  const filteredOccupations = standardOccupations.filter(occ =>
    occ.toLowerCase().includes(occupationSearch.toLowerCase())
  );

  const toggleItem = (item: string, list: string[], setList: (items: string[]) => void) => {
    if (list.includes(item)) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleOccupationSelect = (occ: string) => {
    setOccupation(occ);
    setOccupationSearch(occ);
    setShowOccupationDropdown(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    try {
      await api.updatePreferences(userId, {
        occupation,
        concerns,
        sessionPreferences: preferences
      });
      
      toast.success('Preferences updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating preferences:', error);
      toast.error('Failed to update preferences');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center">
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-gray-900">Session Preferences</h3>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <label className="text-sm text-gray-700 mb-2 block">Occupation</label>
            <div className="relative">
              <input
                type="text"
                value={occupationSearch}
                onChange={(e) => {
                  setOccupationSearch(e.target.value);
                  setShowOccupationDropdown(true);
                }}
                onFocus={() => setShowOccupationDropdown(true)}
                placeholder="Search or select your occupation..."
                className="w-full p-4 pr-12 border-0 bg-gray-50 rounded-2xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                {occupationSearch && !showOccupationDropdown && (
                  <button
                    onClick={() => setShowOccupationDropdown(true)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                )}
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            {/* Dropdown */}
            {showOccupationDropdown && filteredOccupations.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg max-h-48 overflow-y-auto z-20">
                {filteredOccupations.map((occ) => (
                  <button
                    key={occ}
                    onClick={() => handleOccupationSelect(occ)}
                    className="w-full p-3 text-left hover:bg-gray-50 text-gray-700 first:rounded-t-2xl last:rounded-b-2xl transition-colors text-sm"
                  >
                    {occ}
                  </button>
                ))}
              </div>
            )}
            
            {/* Click outside to close */}
            {showOccupationDropdown && (
              <div
                className="fixed inset-0 z-10"
                onClick={() => setShowOccupationDropdown(false)}
              />
            )}
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-3 block">Main Concerns</label>
            <div className="grid grid-cols-2 gap-2">
              {concernOptions.map((concern) => (
                <button
                  key={concern}
                  onClick={() => toggleItem(concern, concerns, setConcerns)}
                  className={`p-3 rounded-2xl text-sm transition-all ${
                    concerns.includes(concern)
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  {concern}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-700 mb-3 block">Session Style Preferences</label>
            <div className="grid grid-cols-2 gap-2">
              {preferenceOptions.map((pref) => (
                <button
                  key={pref}
                  onClick={() => toggleItem(pref, preferences, setPreferences)}
                  className={`p-3 rounded-2xl text-sm transition-all ${
                    preferences.includes(pref)
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-50 text-gray-700'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-5">
            <p className="text-sm text-gray-600">
              💡 These preferences help us personalize your session recommendations and match you with the right practitioners.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-0 bg-gray-50 hover:bg-gray-100 rounded-2xl h-12"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white border-0 rounded-2xl h-12"
            >
              {isLoading ? 'Saving...' : 'Save Preferences'}
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}



