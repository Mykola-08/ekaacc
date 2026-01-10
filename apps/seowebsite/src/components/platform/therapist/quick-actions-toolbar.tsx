'use client'

/**
 * Quick Actions Toolbar for Therapists
 * Provides fast access to common therapist actions during sessions
 */

import React, { useState } from 'react'
import { 
  FileText, 
  Calendar, 
  Clock, 
  Bell, 
  Check,
  AlertCircle,
  Sparkles,
  Archive
} from 'lucide-react'
import { Button } from '@/components/platform/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/platform/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/platform/ui/dialog'
import { Textarea } from '@/components/platform/ui/textarea'
import { Label } from '@/components/platform/ui/label'
import { Input } from '@/components/platform/ui/input'
import { toast } from 'sonner'

interface QuickActionsToolbarProps {
  userId?: string
  sessionId?: string
  onAction?: (action: string, data?: any) => void
}

export function QuickActionsToolbar({ userId, sessionId, onAction }: QuickActionsToolbarProps) {
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false)
  const [isReminderDialogOpen, setIsReminderDialogOpen] = useState(false)
  const [note, setNote] = useState('')
  const [reminder, setReminder] = useState('')
  const [reminderDate, setReminderDate] = useState('')

  const handleQuickNote = () => {
    if (!note.trim()) {
      toast.error('Please enter a note')
      return
    }
    
    onAction?.('quick-note', { note, userId, sessionId, timestamp: new Date().toISOString() })
    toast.success('Quick note saved')
    setNote('')
    setIsNoteDialogOpen(false)
  }

  const handleSetReminder = () => {
    if (!reminder.trim() || !reminderDate) {
      toast.error('Please fill in all fields')
      return
    }
    
    onAction?.('set-reminder', { reminder, date: reminderDate, userId, sessionId })
    toast.success('Reminder set successfully')
    setReminder('')
    setReminderDate('')
    setIsReminderDialogOpen(false)
  }

  const handleGenerateReport = () => {
    onAction?.('generate-report', { userId, sessionId })
    toast.success('Generating AI-powered session report...')
  }

  const handleScheduleFollowUp = () => {
    onAction?.('schedule-followup', { userId, sessionId })
    toast.success('Opening follow-up scheduler...')
  }

  const handleEndSession = () => {
    onAction?.('end-session', { userId, sessionId, endTime: new Date().toISOString() })
    toast.success('Session marked as complete')
  }

  const handleFlagConcern = () => {
    onAction?.('flag-concern', { userId, sessionId, flaggedAt: new Date().toISOString() })
    toast.warning('Session flagged for review')
  }

  const handleArchiveSession = () => {
    onAction?.('archive-session', { userId, sessionId })
    toast.success('Session archived')
  }

  const actions = [
    {
      id: 'quick-note',
      icon: FileText,
      label: 'Quick Note',
      description: 'Add a quick note to this session',
      color: 'text-blue-500',
      dialog: true,
    },
    {
      id: 'generate-report',
      icon: Sparkles,
      label: 'AI Report',
      description: 'Generate AI-powered session summary',
      color: 'text-purple-500',
      onClick: handleGenerateReport,
    },
    {
      id: 'schedule-followup',
      icon: Calendar,
      label: 'Schedule',
      description: 'Schedule follow-up appointment',
      color: 'text-green-500',
      onClick: handleScheduleFollowUp,
    },
    {
      id: 'set-reminder',
      icon: Bell,
      label: 'Reminder',
      description: 'Set a reminder for this patient',
      color: 'text-yellow-500',
      dialog: true,
    },
    {
      id: 'end-session',
      icon: Check,
      label: 'End Session',
      description: 'Mark this session as complete',
      color: 'text-green-600',
      onClick: handleEndSession,
    },
    {
      id: 'flag-concern',
      icon: AlertCircle,
      label: 'Flag',
      description: 'Flag for supervisor review',
      color: 'text-red-500',
      onClick: handleFlagConcern,
    },
    {
      id: 'archive',
      icon: Archive,
      label: 'Archive',
      description: 'Archive this session',
      color: 'text-gray-500',
      onClick: handleArchiveSession,
    },
  ]

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-background border rounded-lg shadow-lg p-2 flex items-center gap-2">
        <TooltipProvider>
          {actions.map((action) => {
            if (action.id === 'quick-note') {
              return (
                <Dialog key={action.id} open={isNoteDialogOpen} onOpenChange={setIsNoteDialogOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10">
                          <action.icon className={`h-5 w-5 ${action.color}`} />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </TooltipContent>
                  </Tooltip>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Quick Note</DialogTitle>
                      <DialogDescription>
                        Add a quick note for this session. It will be saved to the session record.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="note">Note</Label>
                        <Textarea
                          id="note"
                          placeholder="Enter your note here..."
                          value={note}
                          onChange={(e) => setNote(e.target.value)}
                          rows={5}
                          className="mt-2"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsNoteDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleQuickNote}>
                          Save Note
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )
            }

            if (action.id === 'set-reminder') {
              return (
                <Dialog key={action.id} open={isReminderDialogOpen} onOpenChange={setIsReminderDialogOpen}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10">
                          <action.icon className={`h-5 w-5 ${action.color}`} />
                        </Button>
                      </DialogTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">{action.label}</p>
                      <p className="text-xs text-muted-foreground">{action.description}</p>
                    </TooltipContent>
                  </Tooltip>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Set Reminder</DialogTitle>
                      <DialogDescription>
                        Set a reminder for this patient. You'll be notified at the specified time.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="reminder">Reminder Message</Label>
                        <Input
                          id="reminder"
                          placeholder="What should we remind you about?"
                          value={reminder}
                          onChange={(e) => setReminder(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="reminderDate">Date & Time</Label>
                        <Input
                          id="reminderDate"
                          type="datetime-local"
                          value={reminderDate}
                          onChange={(e) => setReminderDate(e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsReminderDialogOpen(false)}>
                          Cancel
                        </Button>
                        <Button onClick={handleSetReminder}>
                          Set Reminder
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              )
            }

            return (
              <Tooltip key={action.id}>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10"
                    onClick={action.onClick}
                  >
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="font-medium">{action.label}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </TooltipContent>
              </Tooltip>
            )
          })}
        </TooltipProvider>
      </div>
      
      {/* Keyboard shortcuts hint */}
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground whitespace-nowrap">
        Press <kbd className="px-1 py-0.5 bg-muted rounded">Ctrl+Q</kbd> for quick actions
      </div>
    </div>
  )
}
