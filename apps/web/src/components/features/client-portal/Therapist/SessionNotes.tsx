import { useState } from 'react';
import { FileText, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

interface SessionNotesProps {
  therapistId: string;
}

const notes = [
  {
    id: 1,
    clientName: 'Alex Johnson',
    date: 'Nov 7, 2024',
    sessionType: 'Integrated Therapy',
    notes: 'Deep exploration of the connection between chronic shoulder tension and unexpressed emotions. Used kinesiology muscle-checking to identify stored patterns. Client experienced significant release.',
    nextSteps: ['Daily body scan', 'Shoulder breathing exercises', 'Journal emotional triggers'],
    duration: '60 min'
  },
  {
    id: 2,
    clientName: 'Sarah Williams',
    date: 'Nov 10, 2024',
    sessionType: 'Kinesiology Balance',
    notes: 'Focused on structural alignment and chronic lower back discomfort. Muscle-testing revealed imbalances tied to prolonged sitting. Subtle corrections applied.',
    nextSteps: ['Hourly desk stretches', 'Core strengthening', 'Posture awareness'],
    duration: '50 min'
  },
  {
    id: 3,
    clientName: 'Michael Chen',
    date: 'Nov 12, 2024',
    sessionType: 'Sleep & Restoration',
    notes: 'Addressed restless sleep patterns and morning fatigue. Gentle bodywork combined with breathing techniques to reset the nervous system.',
    nextSteps: ['10 PM wind-down routine', 'Lavender aromatherapy', 'Sleep tracking'],
    duration: '45 min'
  }
];

export function SessionNotes({ therapistId }: SessionNotesProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotes = notes.filter(note =>
    note.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.sessionType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="p-6">
          <h2 className="text-gray-900 mb-1">Session Notes</h2>
          <p className="text-gray-500">Review your client sessions</p>
        </div>

        {/* Search */}
        <div className="px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sessions..."
              className="pl-12 h-12 rounded-2xl border-0 bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Notes List */}
      <div className="p-6 space-y-4">
        {filteredNotes.map((note) => (
          <motion.div
            key={note.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-900 mb-1">{note.clientName}</p>
                  <p className="text-sm text-gray-500">{note.sessionType}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{note.date}</p>
                  <p className="text-xs text-gray-500">{note.duration}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700">Session Notes</span>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{note.notes}</p>
              </div>

              <div>
                <p className="text-sm text-gray-700 mb-2">Recommendations:</p>
                <ul className="space-y-1.5">
                  {note.nextSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      <span className="text-sm text-gray-600">{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


