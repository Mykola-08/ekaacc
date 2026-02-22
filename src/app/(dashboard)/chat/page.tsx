'use client';

import { Suspense } from 'react';
import { motion } from 'motion/react';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { ChatInterface } from '@/components/dashboard/chat/ChatInterface';

export default function ChatPage() {
  return (
    <motion.div
      className="flex h-[calc(100vh-6rem)] flex-col space-y-4 px-4 py-6 md:px-8"
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
    >
      <DashboardHeader
        title="Messages"
        subtitle="Secure communication with your care team."
      />

      <div className="flex-1 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <Suspense fallback={<div className="flex h-full items-center justify-center text-muted-foreground">Loading chat...</div>}>
          <ChatInterface />
        </Suspense>
      </div>
    </motion.div>
  );
}
