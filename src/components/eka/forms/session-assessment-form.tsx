'use client';

import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Checkbox, Input, Label, Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, Notification, NotificationDescription, Select, SelectContent, SelectItem, SelectValue, Slider, Tabs, TabsContent, TabsItem, TabsList, Textarea } from '@/components/keep';
import { useState } from 'react';
;
;
;
;
;
;
;
import { Loader2, ClipboardCheck, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
;
;
;
;
;

interface SessionAssessmentFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: SessionAssessmentData) => void;
  patientName: string;
  sessionType: 'pre' | 'post';
  readOnly?: boolean;
}

export interface SessionAssessmentData {
  sessionType: 'pre' | 'post';
  timestamp: Date;
  
  // Pre-session
  preSessionMood?: number;
  preSessionAnxiety?: number;
  preSessionGoals?: string;
  preSessionConcerns?: string;
  preSessionMedications?: string;
  crisisRisk?: string;
  
  // Post-session
  postSessionMood?: number;
  postSessionProgress?: number;
  sessionSummary?: string;
  interventionsUsed?: string[];
  homeworkAssigned?: string;
  clientEngagement?: number;
  therapeuticAlliance?: number;
  progressTowardsGoals?: number;
  concernsIdentified?: string;
  followUpNeeded?: string[];
  nextSessionGoals?: string;
  therapistNotes?: string;
}

const interventions = [
  'Cognitive Behavioral Therapy (CBT)',
  'Mindfulness/Meditation',
  'Exposure Therapy',
  'Psychoeducation',
  'Solution-Focused Therapy',
  'Acceptance and Commitment Therapy (ACT)',
  'Dialectical Behavior Therapy (DBT)',
  'Breathing Exercises',
  'Journaling',
  'Role-playing',
];

const followUpOptions = [
  'Crisis intervention plan review',
  'Medication consultation',
  'Family/couples session',
  'Referral to specialist',
  'Increase session frequency',
  'Emergency contact check',
];

export function SessionAssessmentForm({ 
  open, 
  onClose, 
  onSubmit, 
  patientName,
  sessionType 
  , readOnly = false
}: SessionAssessmentFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Pre-session state
  const [preSessionMood, setPreSessionMood] = useState([5]);
  const [preSessionAnxiety, setPreSessionAnxiety] = useState([5]);
  const [preSessionGoals, setPreSessionGoals] = useState('');
  const [preSessionConcerns, setPreSessionConcerns] = useState('');
  const [preSessionMedications, setPreSessionMedications] = useState('');
  const [crisisRisk, setCrisisRisk] = useState('');

  // Post-session state
  const [postSessionMood, setPostSessionMood] = useState([5]);
  const [postSessionProgress, setPostSessionProgress] = useState([5]);
  const [sessionSummary, setSessionSummary] = useState('');
  const [interventionsUsed, setInterventionsUsed] = useState<string[]>([]);
  const [homeworkAssigned, setHomeworkAssigned] = useState('');
  const [clientEngagement, setClientEngagement] = useState([5]);
  const [therapeuticAlliance, setTherapeuticAlliance] = useState([5]);
  const [progressTowardsGoals, setProgressTowardsGoals] = useState([5]);
  const [concernsIdentified, setConcernsIdentified] = useState('');
  const [followUpNeeded, setFollowUpNeeded] = useState<string[]>([]);
  const [nextSessionGoals, setNextSessionGoals] = useState('');
  const [therapistNotes, setTherapistNotes] = useState('');

  const toggleIntervention = (intervention: string) => {
    setInterventionsUsed(prev =>
      prev.includes(intervention)
        ? prev.filter(i => i !== intervention)
        : [...prev, intervention]
    );
  };

  const toggleFollowUp = (item: string) => {
    setFollowUpNeeded(prev =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (readOnly) {
      toast({ variant: 'destructive', title: 'Read-only', description: 'You do not have permission to edit this form.' });
      return;
    }

    if (sessionType === 'pre' && !preSessionGoals) {
      toast({
        variant: 'destructive',
        title: 'Session goals required',
        description: 'Please set goals for this session.',
      });
      return;
    }

    if (sessionType === 'post' && !sessionSummary) {
      toast({
        variant: 'destructive',
        title: 'Session summary required',
        description: 'Please provide a summary of the session.',
      });
      return;
    }

    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1500));

    const data: SessionAssessmentData = {
      sessionType,
      timestamp: new Date(),
      ...(sessionType === 'pre' ? {
        preSessionMood: preSessionMood[0],
        preSessionAnxiety: preSessionAnxiety[0],
        preSessionGoals,
        preSessionConcerns,
        preSessionMedications,
        crisisRisk,
      } : {
        postSessionMood: postSessionMood[0],
        postSessionProgress: postSessionProgress[0],
        sessionSummary,
        interventionsUsed,
        homeworkAssigned,
        clientEngagement: clientEngagement[0],
        therapeuticAlliance: therapeuticAlliance[0],
        progressTowardsGoals: progressTowardsGoals[0],
        concernsIdentified,
        followUpNeeded,
        nextSessionGoals,
        therapistNotes,
      }),
    };

    onSubmit(data);

    toast({
      title: sessionType === 'pre' ? 'Pre-session assessment saved!' : 'Post-session assessment saved!',
      description: sessionType === 'pre' 
        ? 'Session preparation complete. Ready to begin.'
        : 'Session documented successfully. Client progress tracked.',
    });

    setIsLoading(false);
  };

  return (
    <Modal open={open} onOpenChange={onClose}>
      <ModalContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto">
        <ModalHeader>
          <ModalTitle className="text-2xl flex items-center gap-2">
            <ClipboardCheck className="h-6 w-6 text-primary" />
            {sessionType === 'pre' ? 'Pre-Session Assessment' : 'Post-Session Assessment'}
          </ModalTitle>
          <ModalDescription>
            Patient: <strong>{patientName}</strong>
          </ModalDescription>
        </ModalHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {sessionType === 'pre' ? (
            // PRE-SESSION FORM
            <>
              <Notification>
                <AlertCircle className="h-4 w-4" />
                <NotificationDescription>
                  Complete this assessment before the session begins to establish baseline and session goals.
                </NotificationDescription>
              </Notification>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Client's Current State</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Mood */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Client's Reported Mood</Label>
                      <Badge variant="background">{preSessionMood[0]}/10</Badge>
                    </div>
                    <Slider
                      value={preSessionMood}
                      onValueChange={setPreSessionMood}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Very Low</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  {/* Anxiety */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Client's Anxiety Level</Label>
                      <Badge variant="background">{preSessionAnxiety[0]}/10</Badge>
                    </div>
                    <Slider
                      value={preSessionAnxiety}
                      onValueChange={setPreSessionAnxiety}
                      max={10}
                      min={1}
                      step={1}
                      className="mt-2"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Very Calm</span>
                      <span>Very Anxious</span>
                    </div>
                  </div>

                  {/* Crisis Risk */}
                  <div>
                    <Label htmlFor="crisisRisk">Crisis Risk Assessment</Label>
                    <Select value={crisisRisk} onValueChange={setCrisisRisk}>
                      <SelectValue placeholder="Assess current crisis risk"  />
                      <SelectContent>
                        <SelectItem value="none">No risk identified</SelectItem>
                        <SelectItem value="low">Low risk - monitor</SelectItem>
                        <SelectItem value="moderate">Moderate risk - safety plan review</SelectItem>
                        <SelectItem value="high">High risk - immediate intervention needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Session Planning</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="preSessionGoals">Session Goals *</Label>
                    <Textarea
                      id="preSessionGoals"
                      placeholder="What do you want to accomplish in this session?"
                      value={preSessionGoals}
                      onChange={(e) => setPreSessionGoals(e.target.value)}
                      rows={4}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preSessionConcerns">Client's Presenting Concerns</Label>
                    <Textarea
                      id="preSessionConcerns"
                      placeholder="What issues is the client bringing to today's session?"
                      value={preSessionConcerns}
                      onChange={(e) => setPreSessionConcerns(e.target.value)}
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="preSessionMedications">Current Medications/Changes</Label>
                    <Input
                      id="preSessionMedications"
                      placeholder="Any medication updates or side effects?"
                      value={preSessionMedications}
                      onChange={(e) => setPreSessionMedications(e.target.value)}
                      className="mt-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            // POST-SESSION FORM
            <>
              <Notification>
                <TrendingUp className="h-4 w-4" />
                <NotificationDescription>
                  Document session outcomes, progress, and plan next steps for continued care.
                </NotificationDescription>
              </Notification>

              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsItem value="summary">Summary</TabsItem>
                  <TabsItem value="progress">Progress</TabsItem>
                  <TabsItem value="followup">Follow-up</TabsItem>
                </TabsList>

                <TabsContent value="summary" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Session Summary</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="sessionSummary">Session Overview *</Label>
                        <Textarea
                          id="sessionSummary"
                          placeholder="Summarize what was discussed and accomplished in this session..."
                          value={sessionSummary}
                          onChange={(e) => setSessionSummary(e.target.value)}
                          rows={6}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label className="mb-3 block">Interventions/Techniques Used</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {interventions.map((intervention) => (
                            <div key={intervention} className="flex items-center space-x-2">
                              <Checkbox
                                id={intervention}
                                checked={interventionsUsed.includes(intervention)}
                                onCheckedChange={() => toggleIntervention(intervention)}
                              />
                              <label
                                htmlFor={intervention}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {intervention}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="homeworkAssigned">Homework/Tasks Assigned</Label>
                        <Textarea
                          id="homeworkAssigned"
                          placeholder="What should the client work on before next session?"
                          value={homeworkAssigned}
                          onChange={(e) => setHomeworkAssigned(e.target.value)}
                          rows={3}
                          className="mt-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="progress" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Progress Assessment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Post Session Mood */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Client's Mood After Session</Label>
                          <Badge variant="background">{postSessionMood[0]}/10</Badge>
                        </div>
                        <Slider
                          value={postSessionMood}
                          onValueChange={setPostSessionMood}
                          max={10}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      {/* Session Progress */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Session Progress/Productivity</Label>
                          <Badge variant="background">{postSessionProgress[0]}/10</Badge>
                        </div>
                        <Slider
                          value={postSessionProgress}
                          onValueChange={setPostSessionProgress}
                          max={10}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      {/* Client Engagement */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Client Engagement</Label>
                          <Badge variant="background">{clientEngagement[0]}/10</Badge>
                        </div>
                        <Slider
                          value={clientEngagement}
                          onValueChange={setClientEngagement}
                          max={10}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      {/* Therapeutic Alliance */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Therapeutic Alliance</Label>
                          <Badge variant="background">{therapeuticAlliance[0]}/10</Badge>
                        </div>
                        <Slider
                          value={therapeuticAlliance}
                          onValueChange={setTherapeuticAlliance}
                          max={10}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      {/* Progress Towards Goals */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label>Progress Towards Treatment Goals</Label>
                          <Badge variant="background">{progressTowardsGoals[0]}/10</Badge>
                        </div>
                        <Slider
                          value={progressTowardsGoals}
                          onValueChange={setProgressTowardsGoals}
                          max={10}
                          min={1}
                          step={1}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="concernsIdentified">New Concerns Identified</Label>
                        <Textarea
                          id="concernsIdentified"
                          placeholder="Any new issues or concerns that emerged?"
                          value={concernsIdentified}
                          onChange={(e) => setConcernsIdentified(e.target.value)}
                          rows={3}
                          className="mt-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="followup" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Follow-up & Next Steps</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="mb-3 block">Follow-up Actions Needed</Label>
                        <div className="space-y-2">
                          {followUpOptions.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                              <Checkbox
                                id={option}
                                checked={followUpNeeded.includes(option)}
                                onCheckedChange={() => toggleFollowUp(option)}
                              />
                              <label
                                htmlFor={option}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {option}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="nextSessionGoals">Goals for Next Session</Label>
                        <Textarea
                          id="nextSessionGoals"
                          placeholder="What should be the focus of the next session?"
                          value={nextSessionGoals}
                          onChange={(e) => setNextSessionGoals(e.target.value)}
                          rows={4}
                          className="mt-2"
                        />
                      </div>

                      <div>
                        <Label htmlFor="therapistNotes">Private Therapist Notes</Label>
                        <Textarea
                          id="therapistNotes"
                          placeholder="Any additional observations or clinical notes (confidential)..."
                          value={therapistNotes}
                          onChange={(e) => setTherapistNotes(e.target.value)}
                          rows={4}
                          className="mt-2"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </>
          )}

          <ModalFooter className="flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1 sm:flex-initial">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Assessment'
              )}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
