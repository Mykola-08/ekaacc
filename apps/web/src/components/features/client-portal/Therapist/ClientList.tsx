import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';

interface ClientListProps {
  therapistId: string;
}

const clients = [
  {
    id: 1,
    name: 'Alex Johnson',
    avatar: '👨',
    lastSession: 'Nov 7, 2024',
    nextSession: 'Nov 15, 2024',
    totalSessions: 12,
    status: 'active',
    concerns: 'Shoulder tension, sleep issues'
  },
  {
    id: 2,
    name: 'Sarah Williams',
    avatar: '👩',
    lastSession: 'Nov 10, 2024',
    nextSession: 'Nov 15, 2024',
    totalSessions: 8,
    status: 'active',
    concerns: 'Lower back pain, posture'
  },
  {
    id: 3,
    name: 'Michael Chen',
    avatar: '👨‍💼',
    lastSession: 'Nov 12, 2024',
    nextSession: 'Nov 15, 2024',
    totalSessions: 3,
    status: 'active',
    concerns: 'Sleep patterns, stress'
  },
  {
    id: 4,
    name: 'Emma Davis',
    avatar: '👩‍🦰',
    lastSession: 'Oct 28, 2024',
    nextSession: null,
    totalSessions: 15,
    status: 'inactive',
    concerns: 'Emotional patterns, anxiety'
  }
];

export function ClientList({ therapistId }: ClientListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filter === 'all' || client.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="p-6">
          <h2 className="text-gray-900 mb-1">Clients</h2>
          <p className="text-gray-500">Manage your client relationships</p>
        </div>

        {/* Search & Filter */}
        <div className="px-6 pb-4 space-y-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search clients..."
              className="pl-12 h-12 rounded-2xl border-0 bg-gray-50"
            />
          </div>

          <div className="flex gap-2">
            {['all', 'active', 'inactive'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as typeof filter)}
                className={`px-4 py-2 rounded-full text-sm transition-colors ${
                  filter === f
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-700'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="p-6 space-y-3">
        {filteredClients.map((client) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-white rounded-2xl p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                  {client.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-gray-900 mb-1">{client.name}</p>
                      <p className="text-sm text-gray-500">{client.totalSessions} sessions</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      client.status === 'active'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {client.status}
                    </span>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-3 mb-3">
                    <p className="text-xs text-gray-600 mb-1">Main Concerns:</p>
                    <p className="text-sm text-gray-700">{client.concerns}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Last Session</p>
                      <p className="text-gray-900">{client.lastSession}</p>
                    </div>
                    {client.nextSession && (
                      <div className="text-right">
                        <p className="text-gray-500 text-xs">Next Session</p>
                        <p className="text-gray-900">{client.nextSession}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


