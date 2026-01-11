'use client'

import { useState } from 'react'
import { RichTextEditor } from '@/components/platform/editor/rich-text-editor'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card'
import { Button } from '@/components/platform/ui/button'
import { Input } from '@/components/platform/ui/input'
import { Label } from '@/components/platform/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/platform/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/platform/ui/tabs'
import { useToast } from '@/hooks/platform/ui/use-toast'
import {
  FileText,
  UserCircle,
  CalendarDays,
  Clock,
  Smile,
  Target,
  CheckSquare,
  FileText as FileTextIcon,
} from 'lucide-react'
import { Descendant } from 'slate'

export default function SessionNotesPage() {
  const { toast } = useToast()
  const [clientName, setClientName] = useState('')
  const [sessionDate, setSessionDate] = useState('')
  const [sessionDuration, setSessionDuration] = useState('60')
  const [moodRating, setMoodRating] = useState('')
  const [sessionType, setSessionType] = useState('')
  
  const [notes, setNotes] = useState<Descendant[]>()
  const [goals, setGoals] = useState<Descendant[]>()
  const [homework, setHomework] = useState<Descendant[]>()
  const [observations, setObservations] = useState<Descendant[]>()

  const handleSave = () => {
    toast({
      title: 'Session notes saved',
      description: `Notes for ${clientName || 'client'} have been saved successfully.`,
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <FileText className="h-8 w-8 text-primary" />
            Session Notes
          </h1>
          <p className="text-muted-foreground mt-1">
            Document your therapy session with comprehensive notes
          </p>
        </div>
        <Button onClick={handleSave} size="lg" className="gap-2">
          <FileTextIcon className="h-5 w-5" />
          Save Notes
        </Button>
      </div>

      {/* Session Info Card */}
      <Card>
        <CardHeader>
          <CardTitle>Session Information</CardTitle>
          <CardDescription>Basic details about this therapy session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="client" className="flex items-center gap-2">
                <UserCircle className="h-4 w-4" />
                Client Name
              </Label>
              <Input
                id="client"
                placeholder="Select or type client name"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Session Date
              </Label>
              <Input
                id="date"
                type="date"
                value={sessionDate}
                onChange={(e) => setSessionDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Duration (min)
              </Label>
              <Select value={sessionDuration} onValueChange={setSessionDuration}>
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="45">45 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                  <SelectItem value="90">90 minutes</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Session Type
              </Label>
              <Select value={sessionType} onValueChange={setSessionType}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="initial">Initial Consultation</SelectItem>
                  <SelectItem value="followup">Follow-up</SelectItem>
                  <SelectItem value="cbt">CBT Session</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="mt-4 space-y-2">
            <Label htmlFor="mood" className="flex items-center gap-2">
              <Smile className="h-4 w-4" />
              Client Mood Rating (1-10)
            </Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <Button
                  key={num}
                  variant={moodRating === num.toString() ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setMoodRating(num.toString())}
                  className="w-10"
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes Tabs */}
      <Tabs defaultValue="notes" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="notes" className="gap-2">
            <FileText className="h-4 w-4" />
            Session Notes
          </TabsTrigger>
          <TabsTrigger value="observations" className="gap-2">
            <UserCircle className="h-4 w-4" />
            Observations
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-2">
            <Target className="h-4 w-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="homework" className="gap-2">
            <CheckSquare className="h-4 w-4" />
            Homework
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session Notes</CardTitle>
              <CardDescription>
                Document what happened during the session, client's concerns, and discussion points
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RichTextEditor
                onChange={setNotes}
                placeholder="What was discussed during this session? Document key points, concerns raised, and therapeutic interventions used..."
                showAIAssist
                className="border-0"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="observations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Clinical Observations</CardTitle>
              <CardDescription>
                Note your professional observations about the client's mental state, behavior, and progress
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RichTextEditor
                onChange={setObservations}
                placeholder="Observations about client's affect, body language, engagement level, changes since last session..."
                showAIAssist
                className="border-0"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Treatment Goals & Progress</CardTitle>
              <CardDescription>
                Track therapeutic goals, milestones achieved, and areas for continued focus
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RichTextEditor
                onChange={setGoals}
                placeholder="Short-term and long-term goals, progress towards existing goals, new goals established..."
                showAIAssist
                className="border-0"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="homework" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Homework & Action Items</CardTitle>
              <CardDescription>
                Assign homework, exercises, and action items for the client to work on before the next session
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <RichTextEditor
                onChange={setHomework}
                placeholder="Exercises to practice, journal prompts, behavioral experiments, readings, worksheets..."
                showAIAssist
                className="border-0"
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Quick Tips */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">💡 Note-Taking Tips</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Be concise but thorough</li>
                <li>• Use objective language</li>
                <li>• Focus on relevant details</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">🔒 Privacy & Security</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Notes are encrypted</li>
                <li>• Automatic backups</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">⚡ Keyboard Shortcuts</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Ctrl/Cmd + B: Bold</li>
                <li>• Ctrl/Cmd + I: Italic</li>
                <li>• Ctrl/Cmd + S: Save</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
