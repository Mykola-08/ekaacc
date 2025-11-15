'use client';

import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Divider, Input, Label, Modal, ModalContent, ModalDescription, ModalFooter, ModalHeader, ModalTitle, Select, SelectContent, SelectItem, SelectValue, Skeleton, Textarea } from '@/components/keep';
import React, { useEffect, useState, useMemo } from 'react';
;
;
;
;
;
;
;
;
;
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Copy, 
  Plus,
  TrendingUp,
  User as UserIcon,
  Sparkles
} from 'lucide-react';
import { useAuth } from '@/lib/supabase-auth';
import { useAppStore } from '@/store/app-store';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { TherapistTemplate, AutofillData, DEFAULT_TEMPLATES } from '@/lib/template-types';
import type { User as UserType, Session } from '@/lib/types';
;
;
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
          useCount: Math.floor(Math.random() * 50),
        }));
        setTemplates(initialTemplates);

      } catch (error) {
        console.error("Failed to load data:", error);
        toast({ title: "Error", description: "Could not load necessary data.", variant: "destructive" });
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, [dataService, toast]);

  const clients = useMemo<UserType[]>(() => {
    return allUsers.filter(user => user.role !== 'Therapist' && user.role !== 'Admin');
  }, [allUsers]);

  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, categoryFilter]);

  const getAutofillData = (clientId: string): AutofillData => {
    const client = clients.find(c => c.id === clientId);
    const clientSessions = sessions.filter(s => s.userId === clientId);
    const lastSession = clientSessions.length > 0 ? clientSessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0] : null;
    
    return {
      clientName: client?.name || 'Client Name',
      therapistName: currentUser?.name || 'Therapist Name',
      sessionDate: format(new Date(), 'MMMM dd, yyyy'),
      sessionType: lastSession?.type || 'Individual Therapy',
      sessionNumber: clientSessions.length + 1,
      totalSessions: clientSessions.length + 10,
      clientAge: client ? Math.floor((new Date().getTime() - new Date(client.createdAt || Date.now()).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) + 25 : 30,
      clientGender: 'Not specified',
      nextSessionDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'MMMM dd, yyyy'),
      diagnosisCodes: ['F41.1 - Generalized Anxiety Disorder'],
      treatmentGoals: ['Reduce anxiety symptoms', 'Improve coping strategies', 'Enhance daily functioning'],
    };
  };

  const autofillTemplate = (template: TherapistTemplate, clientId: string, customData: Record<string, string> = {}) => {
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
    'progress': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    'assessment': 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    'treatment-plan': 'bg-green-500/10 text-green-700 dark:text-green-400',
    'session-notes': 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    'discharge': 'bg-red-500/10 text-red-700 dark:text-red-400',
  };

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-80 mt-2" />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-6 w-24" />
                </div>
                <Skeleton className="h-6 w-3/4 mt-2" />
                <Skeleton className="h-4 w-full mt-1" />
                <Skeleton className="h-4 w-2/3 mt-1" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 space-y-6"
    >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Report Templates</h1>
            <p className="text-muted-foreground mt-1">
              Professional templates with smart autofill from client data
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Create Custom Template
          </Button>
        </div>
      </motion.div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <FileText className="w-8 h-8 text-primary mb-2" />
                  <Badge className={cn(categoryColors[template.category] || 'bg-gray-500/10 text-gray-700 dark:text-gray-400', 'py-1 px-2 text-xs')}>
                    {template.category.replace('-', ' ')}
                  </Badge>
                </div>
                <CardTitle className="text-lg">{template.name}</CardTitle>
                <CardDescription className="text-sm">
                  {template.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-2 text-xs text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    <span>Used {template.useCount} times</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    <span>{template.fields.length} auto-fill fields</span>
                  </div>
                </div>
                <Button 
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

      <Modal open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <ModalContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <ModalHeader>
            <ModalTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {selectedTemplate?.name}
            </ModalTitle>
            <ModalDescription>
              Fill in the required fields. Client information will be auto-filled.
            </ModalDescription>
          </ModalHeader>

          <div className="space-y-4 p-1">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                Select Client *
              </Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectValue placeholder="Choose a client..."  />
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Divider />

            {selectedClient && (
              <Card className="bg-muted/50">
                <CardHeader className="p-4">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Auto-filled Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-xs space-y-1">
                  {(() => {
                    const data = getAutofillData(selectedClient);
                    return (
                      <>
                        <div><span className="font-medium">Client:</span> {data.clientName}</div>
                        <div><span className="font-medium">Date:</span> {data.sessionDate}</div>
                        <div><span className="font-medium">Session:</span> #{data.sessionNumber} of {data.totalSessions}</div>
                        <div><span className="font-medium">Therapist:</span> {data.therapistName}</div>
                      </>
                    );
                  })()}
                </CardContent>
              </Card>
            )}

            <div className="space-y-4">
              <h4 className="font-medium text-sm">Additional Information</h4>
              {selectedTemplate?.fields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <Label htmlFor={field.key}>
                    {field.label} {field.required && <span className="text-destructive">*</span>}
                  </Label>
                  
                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.key}
                      placeholder={field.placeholder}
                      value={formData[field.key] || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                      rows={4}
                    />
                  ) : field.type === 'select' ? (
                    <Select 
                      value={formData[field.key] || ''} 
                      onValueChange={(value) => setFormData(prev => ({ ...prev, [field.key]: value }))}
                    >
                      <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`}  />
                      <SelectContent>
                        {field.options?.map(option => (
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
                      onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <ModalFooter>
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport} className="gap-2">
              <FileText className="w-4 h-4" />
              Generate Report
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal open={showPreview} onOpenChange={setShowPreview}>
        <ModalContent className="max-w-2xl">
          <ModalHeader>
            <ModalTitle>Generated Report Preview</ModalTitle>
          </ModalHeader>
          <ScrollArea className="h-96 p-4 border rounded-md bg-muted/50">
            <pre className="text-sm whitespace-pre-wrap">{previewContent}</pre>
          </ScrollArea>
          <ModalFooter>
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button onClick={handleCopyToClipboard} className="gap-2">
              <Copy className="w-4 h-4" />
              Copy
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </motion.div>
  );
}
