'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/platform/ui/button';
import { Input } from '@/components/platform/ui/input';
import { Textarea } from '@/components/platform/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/platform/ui/select';
import { Label } from '@/components/platform/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/platform/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/platform/ui/dialog';
import { sendTherapistEmail, previewTherapistEmail } from '@/app/actions/therapist-email';
import { TransactionalEmailType } from '@/services/transactional-email-service';
import { toast } from 'sonner'; // Assuming sonner or use-toast

interface Patient {
  id: string;
  name: string;
  email: string;
}

interface TherapistEmailFormProps {
  patients: Patient[];
}

export function TherapistEmailForm({ patients }: TherapistEmailFormProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [emailType, setEmailType] = useState<TransactionalEmailType>('homework');
  const [isPending, startTransition] = useTransition();
  const [previewHtml, setPreviewHtml] = useState<string>('');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    // Common
    subject: '',
    // Homework
    assignmentTitle: '',
    description: '',
    dueDate: '',
    // Session Notes
    sessionDate: new Date().toISOString().split('T')[0],
    summary: '',
    keyTakeaways: '',
    nextSessionDate: '',
    // Check-in
    message: '',
    // Actions
    actionLabel: 'View Details',
    actionUrl: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePreview = async () => {
    const data = getEmailData();
    const result = await previewTherapistEmail(emailType, data);
    if (result.success && result.html) {
      setPreviewHtml(result.html);
      setIsPreviewOpen(true);
    } else {
      toast.error('Failed to generate preview');
    }
  };

  const handleSend = async () => {
    if (!selectedPatientId) {
      toast.error('Please select a patient');
      return;
    }

    startTransition(async () => {
      const data = getEmailData();
      const payload = new FormData();
      payload.append('patientId', selectedPatientId);
      payload.append('type', emailType);
      payload.append('subject', formData.subject || getDefaultSubject(emailType));
      payload.append('data', JSON.stringify(data));

      const result = await sendTherapistEmail(payload);
      if (result.success) {
        toast.success('Email sent successfully');
        // Reset form or close
      } else {
        toast.error(typeof result.error === 'string' ? result.error : 'Failed to send email');
      }
    });
  };

  const getDefaultSubject = (type: TransactionalEmailType) => {
    switch (type) {
      case 'homework': return 'New Homework Assignment';
      case 'session_notes': return 'Session Notes';
      case 'check_in': return 'Checking In';
      default: return 'Notification';
    }
  };

  const getEmailData = () => {
    switch (emailType) {
      case 'homework':
        return {
          assignmentTitle: formData.assignmentTitle,
          description: formData.description,
          dueDate: formData.dueDate,
          actionLabel: formData.actionLabel,
          actionUrl: formData.actionUrl,
        };
      case 'session_notes':
        return {
          sessionDate: formData.sessionDate,
          summary: formData.summary,
          keyTakeaways: formData.keyTakeaways.split('\n').filter(line => line.trim() !== ''),
          nextSessionDate: formData.nextSessionDate,
        };
      case 'check_in':
        return {
          message: formData.message,
          actionLabel: formData.actionLabel,
          actionUrl: formData.actionUrl,
        };
      default:
        return {};
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Send Patient Email</CardTitle>
        <CardDescription>Send homework, session notes, or check-ins to your patients.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Patient</Label>
          <Select value={selectedPatientId} onValueChange={setSelectedPatientId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a patient..." />
            </SelectTrigger>
            <SelectContent>
              {patients.map(patient => (
                <SelectItem key={patient.id} value={patient.id}>{patient.name} ({patient.email})</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Email Type</Label>
          <Tabs value={emailType} onValueChange={(v) => setEmailType(v as TransactionalEmailType)} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="homework">Homework</TabsTrigger>
              <TabsTrigger value="session_notes">Session Notes</TabsTrigger>
              <TabsTrigger value="check_in">Check-in</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label>Subject Line</Label>
          <Input 
            name="subject" 
            placeholder={getDefaultSubject(emailType)} 
            value={formData.subject} 
            onChange={handleInputChange} 
          />
        </div>

        {emailType === 'homework' && (
          <div className="space-y-4 border p-4 rounded-md bg-slate-50 dark:bg-slate-900">
            <div className="space-y-2">
              <Label>Assignment Title</Label>
              <Input name="assignmentTitle" value={formData.assignmentTitle} onChange={handleInputChange} placeholder="e.g. CBT Worksheet" />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Instructions for the patient..." />
            </div>
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Action Label</Label>
                    <Input name="actionLabel" value={formData.actionLabel} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label>Action URL</Label>
                    <Input name="actionUrl" value={formData.actionUrl} onChange={handleInputChange} placeholder="https://..." />
                </div>
            </div>
          </div>
        )}

        {emailType === 'session_notes' && (
          <div className="space-y-4 border p-4 rounded-md bg-slate-50 dark:bg-slate-900">
            <div className="space-y-2">
              <Label>Session Date</Label>
              <Input type="date" name="sessionDate" value={formData.sessionDate} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label>Summary</Label>
              <Textarea name="summary" value={formData.summary} onChange={handleInputChange} placeholder="Brief summary of the session..." />
            </div>
            <div className="space-y-2">
              <Label>Key Takeaways (one per line)</Label>
              <Textarea name="keyTakeaways" value={formData.keyTakeaways} onChange={handleInputChange} placeholder="- Practice breathing&#10;- Review journal" className="min-h-[100px]" />
            </div>
            <div className="space-y-2">
              <Label>Next Session Date</Label>
              <Input type="datetime-local" name="nextSessionDate" value={formData.nextSessionDate} onChange={handleInputChange} />
            </div>
          </div>
        )}

        {emailType === 'check_in' && (
          <div className="space-y-4 border p-4 rounded-md bg-slate-50 dark:bg-slate-900">
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea name="message" value={formData.message} onChange={handleInputChange} placeholder="How are you feeling today?" className="min-h-[100px]" />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Action Label (Optional)</Label>
                    <Input name="actionLabel" value={formData.actionLabel} onChange={handleInputChange} />
                </div>
                <div className="space-y-2">
                    <Label>Action URL (Optional)</Label>
                    <Input name="actionUrl" value={formData.actionUrl} onChange={handleInputChange} placeholder="https://..." />
                </div>
            </div>
          </div>
        )}

      </CardContent>
      <CardFooter className="flex justify-between">
        <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={handlePreview}>Preview Email</Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Email Preview</DialogTitle>
                </DialogHeader>
                <div className="border rounded-md p-4 bg-white text-black min-h-[400px]" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            </DialogContent>
        </Dialog>
        
        <Button onClick={handleSend} disabled={isPending || !selectedPatientId}>
          {isPending ? 'Sending...' : 'Send Email'}
        </Button>
      </CardFooter>
    </Card>
  );
}
