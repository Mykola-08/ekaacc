'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import React, { useEffect, useState, useMemo } from 'react';
import {
  FileText,
  Search,
  Filter,
  Download,
  Copy,
  Plus,
  TrendingUp,
  User as UserIcon,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/lib/platform/supabase/auth';
import { useAppStore } from '@/store/platform/app-store';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { format } from 'date-fns';
import { motion } from 'motion/react';
import {
  TherapistTemplate,
  AutofillData,
  DEFAULT_TEMPLATES,
} from '@/lib/platform/types/template-types';
import type { User as UserType, Session } from '@/lib/platform/types/types';
import { cn } from '@/lib/utils';

export default function TherapistTemplatesPage() {
  const { user: currentUser } = useAuth();
  const dataService = useAppStore((state) => state.dataService);
  const { toast } = useToast();

  const [templates, setTemplates] = useState<TherapistTemplate[]>([]);
  const [allUsers, setAllUsers] = useState<UserType[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedTemplate, setSelectedTemplate] = useState<TherapistTemplate | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    const loadInitialData = async () => {
      if (!dataService) return;
      setIsLoading(true);
      try {
        const [users, allSessions] = await Promise.all([
          dataService.getAllUsers(),
          dataService.getSessions(),
        ]);
        setAllUsers(users);
        setSessions(allSessions);

        const initialTemplates: TherapistTemplate[] = DEFAULT_TEMPLATES.map((t, i) => ({
          ...t,
          id: `template-${i + 1}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          useCount: 0,
        }));
        setTemplates(initialTemplates);
      } catch {
        toast({
          title: 'Error',
          description: 'Could not load necessary data.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [dataService, toast]);

  const clients = useMemo<UserType[]>(() => {
    return allUsers.filter((user) => user.role !== 'Therapist' && user.role !== 'Admin');
  }, [allUsers]);

  const filteredTemplates = useMemo(() => {
    return templates.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, categoryFilter]);

  const getAutofillData = (clientId: string): AutofillData => {
    const client = clients.find((c) => c.id === clientId);
    const clientSessions = sessions.filter((s) => s.userId === clientId);
    const lastSession =
      clientSessions.length > 0
        ? clientSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
        : null;

    return {
      clientName: client?.name || 'Client Name',
      therapistName: currentUser?.name || 'Therapist Name',
      sessionDate: format(new Date(), 'MMMM dd, yyyy'),
      sessionType: lastSession?.type || 'Individual Therapy',
      sessionNumber: clientSessions.length + 1,
      totalSessions: clientSessions.length + 10,
      clientAge: client
        ? Math.floor(
            (new Date().getTime() - new Date(client.createdAt || Date.now()).getTime()) /
              (365.25 * 24 * 60 * 60 * 1000)
          ) + 25
        : 30,
      clientGender: 'Not specified',
      nextSessionDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'MMMM dd, yyyy'),
      diagnosisCodes: ['F41.1 - Generalized Anxiety Disorder'],
      treatmentGoals: [
        'Reduce anxiety symptoms',
        'Improve coping strategies',
        'Enhance daily functioning',
      ],
    };
  };

  const autofillTemplate = (
    template: TherapistTemplate,
    clientId: string,
    customData: Record<string, string> = {}
  ) => {
    const autoData = getAutofillData(clientId);
    let content = template.content;

    Object.entries(autoData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
      content = content.replace(regex, displayValue);
    });

    Object.entries(customData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value || '');
    });

    content = content.replace(/{{[^}]+}}/g, '');

    return content;
  };

  const handleUseTemplate = (template: TherapistTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setSelectedClient('');
  };

  const handleGenerateReport = () => {
    if (!selectedTemplate || !selectedClient) {
      toast({
        title: 'Missing Information',
        description: 'Please select both a template and a client',
        variant: 'destructive',
      });
      return;
    }

    const filledContent = autofillTemplate(selectedTemplate, selectedClient, formData);
    setPreviewContent(filledContent);
    setShowPreview(true);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(previewContent);
    toast({
      title: 'Copied to Clipboard',
      description: 'Report content has been copied',
    });
  };

  const handleDownload = () => {
    const blob = new Blob([previewContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedTemplate?.name.replace(/\s+/g, '_')}_${format(new Date(), 'yyyy-MM-dd')}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Report Downloaded',
      description: 'The report has been saved to your device',
    });
  };

  const categoryColors: { [key: string]: string } = {
    progress: 'bg-primary/10 text-primary',
    assessment: 'bg-muted text-primary',
    'treatment-plan': 'bg-success/10 text-success-foreground ',
    'session-notes': 'bg-warning/10 text-warning-foreground ',
    discharge: 'bg-destructive/10 text-destructive ',
  };

  if (isLoading) {
    return (
      <div className="bg-muted/30 min-h-screen">
        <div className="">
          <div className="flex items-center justify-between">
            <div>
              <Skeleton className="h-8 w-64" />
              <Skeleton className="mt-2 h-4 w-80" />
            </div>
            <Skeleton className="h-10 w-48" />
          </div>
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4">
                <Skeleton className="h-10 flex-1" />
                <Skeleton className="h-10 w-48" />
              </div>
            </CardContent>
          </Card>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-6 w-24" />
                  </div>
                  <Skeleton className="mt-2 h-6 w-3/4" />
                  <Skeleton className="mt-1 h-4 w-full" />
                  <Skeleton className="mt-1 h-4 w-2/3" />
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-muted/30 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className=""
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-semibold">Report Templates</h3>
              <p className="text-muted-foreground mt-1">
                Professional templates with smart autofill from client data
              </p>
            </div>
            <Button variant="default" className="gap-2">
              <Plus className="h-4 w-4" />
              Create Custom Template
            </Button>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="text-muted-foreground/80 absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
                <Input
                  placeholder="Search templates..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="assessment">Assessment</SelectItem>
                  <SelectItem value="progress">Progress Notes</SelectItem>
                  <SelectItem value="treatment-plan">Treatment Plans</SelectItem>
                  <SelectItem value="session-notes">Session Notes</SelectItem>
                  <SelectItem value="discharge">Discharge</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <Card className="flex h-full cursor-pointer flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <FileText className="text-primary mb-2 h-8 w-8" />
                    <Badge
                      color={
                        template.category === 'progress'
                          ? 'primary'
                          : template.category === 'assessment'
                            ? 'purple'
                            : template.category === 'treatment-plan'
                              ? 'green'
                              : template.category === 'session-notes'
                                ? 'orange'
                                : template.category === 'discharge'
                                  ? 'red'
                                  : 'gray'
                      }
                      variant="secondary"
                    >
                      {template.category.replace('-', ' ')}
                    </Badge>
                  </div>
                  <h5 className="text-lg font-semibold">{template.name}</h5>
                  <p className="text-muted-foreground text-sm">{template.description}</p>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col justify-between">
                  <div className="text-muted-foreground mb-4 text-xs">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3" />
                      <span>Used {template.useCount} times</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-3 w-3" />
                      <span>{template.fields.length} auto-fill fields</span>
                    </div>
                  </div>
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => handleUseTemplate(template)}
                  >
                    Use Template
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Template Modal */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              Fill in the required fields. Client information will be auto-filled.
            </DialogDescription>
          </DialogHeader>

          <div className="p-1">
            <div className="">
              <Label className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                Select Client *
              </Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectValue placeholder="Choose a client..." />
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {selectedClient && (
              <Card className="bg-muted/30">
                <CardHeader className="p-4">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4" />
                    Auto-filled Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-xs">
                  {(() => {
                    const data = getAutofillData(selectedClient);
                    return (
                      <>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Client:</span> {data.clientName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Date:</span> {data.sessionDate}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Session:</span> #{data.sessionNumber} of{' '}
                            {data.totalSessions}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm">
                            <span className="font-medium">Therapist:</span> {data.therapistName}
                          </p>
                        </div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            )}

            <div className="">
              <h6 className="text-base font-semibold">Additional Information</h6>
              {selectedTemplate?.fields.map((field) => (
                <div key={field.key} className="">
                  <Label htmlFor={field.key}>
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                  </Label>

                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.key}
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                      rows={4}
                    />
                  ) : field.type === 'select' ? (
                    <Select
                      value={formData[field.key] || ''}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, [field.key]: value }))
                      }
                    >
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id={field.key}
                      type={field.type}
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, [field.key]: e.target.value }))
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport} variant="default" className="gap-2">
              <FileText className="h-4 w-4" />
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Generated Report Preview</DialogTitle>
          </DialogHeader>
          <ScrollArea className="bg-muted/30 h-96 rounded-2xl border p-4">
            <p className="text-sm whitespace-pre-wrap">{previewContent}</p>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button onClick={handleCopyToClipboard} variant="outline" className="gap-2">
              <Copy className="h-4 w-4" />
              Copy
            </Button>
            <Button onClick={handleDownload} variant="default" className="gap-2">
              <Download className="h-4 w-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
