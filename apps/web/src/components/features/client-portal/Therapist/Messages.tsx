import { useState } from 'react';
import { Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MessagesProps {
  therapistId: string;
}

const conversations = [
  {
    id: 1,
    clientName: 'Alex Johnson',
    avatar: '👨',
    lastMessage: 'Thank you! Looking forward to our session tomorrow.',
    timestamp: '10 min ago',
    unread: true
  },
  {
    id: 2,
    clientName: 'Sarah Williams',
    avatar: '👩',
    lastMessage: 'The exercises you recommended really helped!',
    timestamp: '2 hours ago',
    unread: false
  },
  {
    id: 3,
    clientName: 'Michael Chen',
    avatar: '👨‍💼',
    lastMessage: 'Can we reschedule to 5:30 PM?',
    timestamp: 'Yesterday',
    unread: false
  }
];

export function Messages({ therapistId }: MessagesProps) {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const messages = [
    {
      id: 1,
      sender: 'client',
      text: 'Hi Emma, I wanted to ask about tomorrow\'s session.',
      timestamp: '2:30 PM'
    },
    {
      id: 2,
      sender: 'therapist',
      text: 'Hello Alex! Of course, what would you like to know?',
      timestamp: '2:32 PM'
    },
    {
      id: 3,
      sender: 'client',
      text: 'Should I prepare anything specific?',
      timestamp: '2:33 PM'
    },
    {
      id: 4,
      sender: 'therapist',
      text: 'Just wear comfortable clothing and come with an open mind. We\'ll continue working on the shoulder tension we discussed.',
      timestamp: '2:35 PM'
    },
    {
      id: 5,
      sender: 'client',
      text: 'Thank you! Looking forward to our session tomorrow.',
      timestamp: '2:36 PM'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10">
        <div className="p-6">
          <h2 className="text-gray-900 mb-1">Messages</h2>
          <p className="text-gray-500">Communicate with your clients</p>
        </div>
      </div>

      <div className="p-6 space-y-3">
        {selectedConversation === null ? (
          // Conversation List
          <>
            {conversations.map((conv) => (
              <motion.div
                key={conv.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <button
                  onClick={() => setSelectedConversation(conv.id)}
                  className="w-full bg-white rounded-2xl p-5 text-left"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl flex-shrink-0">
                      {conv.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <p className="text-gray-900">{conv.clientName}</p>
                        <span className="text-xs text-gray-500">{conv.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread && (
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2" />
                    )}
                  </div>
                </button>
              </motion.div>
            ))}
          </>
        ) : (
          // Chat View
          <div className="bg-white rounded-2xl overflow-hidden" style={{ height: 'calc(100vh - 240px)' }}>
            {/* Chat Header */}
            <div className="p-5 border-b border-gray-100">
              <button
                onClick={() => setSelectedConversation(null)}
                className="text-sm text-gray-600 mb-3"
              >
                ← Back to messages
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-xl">
                  👨
                </div>
                <div>
                  <p className="text-gray-900">Alex Johnson</p>
                  <p className="text-sm text-gray-500">Active now</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-5 space-y-4 overflow-y-auto" style={{ height: 'calc(100% - 180px)' }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'therapist' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[75%] ${
                    msg.sender === 'therapist'
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } rounded-2xl p-4`}>
                    <p className="text-sm">{msg.text}</p>
                    <p className={`text-xs mt-1 ${
                      msg.sender === 'therapist' ? 'text-gray-300' : 'text-gray-500'
                    }`}>
                      {msg.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100">
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 h-12 rounded-2xl border-0 bg-gray-50"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && message.trim()) {
                      // Send message
                      setMessage('');
                    }
                  }}
                />
                <Button
                  className="w-12 h-12 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white border-0 p-0 flex items-center justify-center"
                  disabled={!message.trim()}
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


