'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Search, 
  Filter, 
  Download, 
  Copy, 
  Edit, 
  Trash2,
  Plus,
  Clock,
  TrendingUp,
  User,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useData } from '@/context/unified-data-context';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { TherapistTemplate, AutofillData, DEFAULT_TEMPLATES, TemplateField } from '@/lib/template-types';
import { Separator } from '@/components/ui/separator';

export default function TherapistTemplatesPage() {
  const { currentUser, users, sessions } = useData();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<TherapistTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TherapistTemplate | null>(null);
  const [selectedClient, setSelectedClient] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewContent, setPreviewContent] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    // Initialize with default templates
    const initialTemplates: TherapistTemplate[] = DEFAULT_TEMPLATES.map((t, i) => ({
      ...t,
      id: `template-${i + 1}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      useCount: Math.floor(Math.random() * 50),
    }));
    setTemplates(initialTemplates);
  }, []);

  // Get client list (users that are not therapists)
  const clients = useMemo(() => {
    return users.filter(u => u.role !== 'Therapist' && u.role !== 'Admin');
  }, [users]);

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return templates.filter(t => {
      const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           t.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [templates, searchQuery, categoryFilter]);

  // Get autofill data for selected client
  const getAutofillData = (clientId: string): AutofillData => {
    const client = clients.find(c => c.id === clientId);
    const clientSessions = sessions.filter(s => s.userId === clientId);
    const lastSession = clientSessions[clientSessions.length - 1];
    
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

  // Autofill template with data
  const autofillTemplate = (template: TherapistTemplate, clientId: string, customData: Record<string, string> = {}) => {
    const autoData = getAutofillData(clientId);
    let content = template.content;
    
    // Replace autofill fields
    Object.entries(autoData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      const displayValue = Array.isArray(value) ? value.join(', ') : String(value);
      content = content.replace(regex, displayValue);
    });

    // Replace custom fields
    Object.entries(customData).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      content = content.replace(regex, value || '');
    });

    // Replace any remaining placeholders with empty string
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

    // Update use count
    setTemplates(prev => prev.map(t => 
      t.id === selectedTemplate.id ? { ...t, useCount: t.useCount + 1 } : t
    ));
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

  const categoryColors = {
    'progress': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
    'assessment': 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
    'treatment-plan': 'bg-green-500/10 text-green-700 dark:text-green-400',
    'session-notes': 'bg-orange-500/10 text-orange-700 dark:text-orange-400',
    'discharge': 'bg-red-500/10 text-red-700 dark:text-red-400',
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
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

      {/* Search and Filter */}
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

      {/* Templates Grid */}
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
                  <Badge className={categoryColors[template.category]}>
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

      {/* Template Editor Dialog */}
      <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {selectedTemplate?.name}
            </DialogTitle>
            <DialogDescription>
              Fill in the required fields. Client information will be auto-filled.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Client Selection */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Select Client *
              </Label>
              <Select value={selectedClient} onValueChange={setSelectedClient}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a client..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(client => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Separator />

            {/* Auto-fill Information */}
            {selectedClient && (
              <Card className="bg-muted/50">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Auto-filled Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-xs space-y-1">
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

            {/* Custom Fields */}
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
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
                      </SelectTrigger>
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

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTemplate(null)}>
              Cancel
            </Button>
            <Button onClick={handleGenerateReport} className="gap-2">
              <FileText className="w-4 h-4" />
              Generate Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Generated Report</DialogTitle>
            <DialogDescription>
              Preview your report before downloading or copying
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            <Card>
              <CardContent className="pt-6">
                <pre className="whitespace-pre-wrap font-mono text-sm">
                  {previewContent}
                </pre>
              </CardContent>
            </Card>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              Close
            </Button>
            <Button variant="outline" onClick={handleCopyToClipboard} className="gap-2">
              <Copy className="w-4 h-4" />
              Copy
            </Button>
            <Button onClick={handleDownload} className="gap-2">
              <Download className="w-4 h-4" />
              Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
