'use client';

import { Badge } from '@/components/platform/ui/badge';
import { Button } from '@/components/platform/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/platform/ui/card';
import { Separator } from '@/components/platform/ui/separator';
import { Input } from '@/components/platform/ui/input';
import { Label } from '@/components/platform/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/platform/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/platform/ui/select';
import { Skeleton } from '@/components/platform/ui/skeleton';
import { Textarea } from '@/components/platform/ui/textarea';
import { ScrollArea } from '@/components/platform/ui/scroll-area';
import React, { useEffect, useState, useMemo } from 'react';
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
import { useAuth } from '@/lib/platform/supabase/auth';
import { useAppStore } from '@/store/platform/app-store';
import { useToast } from '@/hooks/platform/ui/use-toast';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { TherapistTemplate, AutofillData, DEFAULT_TEMPLATES } from '@/lib/platform/types/template-types';
import type { User as UserType, Session } from '@/lib/platform/types/types';
import { cn } from '@/lib/platform/utils/css-utils';

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
   <div className="min-h-screen bg-muted/30">
    <div className="space-y-6">
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
   </div>
  );
 }

 return (
  <div className="min-h-screen bg-muted/30">
   <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className="space-y-6"
   >
    {/* Header */}
    <motion.div
     initial={{ opacity: 0, y: -20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.3 }}
    >
     <div className="flex items-center justify-between">
      <div>
       <h3 className="text-2xl font-bold">Report Templates</h3>
       <p className="text-muted-foreground mt-1">
        Professional templates with smart autofill from client data
       </p>
      </div>
      <Button variant="default" className="gap-2">
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
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground/80" />
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
          <FileText className="w-8 h-8 text-blue-500 mb-2" />
          <Badge 
           color={template.category === 'progress' ? 'primary' : 
               template.category === 'assessment' ? 'purple' :
               template.category === 'treatment-plan' ? 'green' :
               template.category === 'session-notes' ? 'orange' :
               template.category === 'discharge' ? 'red' : 'gray'}
           variant="secondary"
          >
           {template.category.replace('-', ' ')}
          </Badge>
         </div>
         <h5 className="text-lg font-semibold">{template.name}</h5>
         <p className="text-sm text-muted-foreground">
          {template.description}
         </p>
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

     <div className="space-y-4 p-1">
      <div className="space-y-2">
       <Label className="flex items-center gap-2">
        <UserIcon className="w-4 h-4" />
        Select Client *
       </Label>
       <Select value={selectedClient} onValueChange={setSelectedClient}>
        <SelectValue placeholder="Choose a client..." />
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

      {selectedClient && (
       <Card className="bg-muted/30">
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
            <div><p className="text-sm"><span className="font-medium">Client:</span> {data.clientName}</p></div>
            <div><p className="text-sm"><span className="font-medium">Date:</span> {data.sessionDate}</p></div>
            <div><p className="text-sm"><span className="font-medium">Session:</span> #{data.sessionNumber} of {data.totalSessions}</p></div>
            <div><p className="text-sm"><span className="font-medium">Therapist:</span> {data.therapistName}</p></div>
           </>
          );
         })()}
        </CardContent>
       </Card>
      )}

      <div className="space-y-4">
       <h6 className="text-base font-semibold">Additional Information</h6>
       {selectedTemplate?.fields.map((field) => (
        <div key={field.key} className="space-y-2">
         <Label htmlFor={field.key}>
          {field.label} {field.required && <span className="text-red-500">*</span>}
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
           <SelectValue placeholder={`Select ${field.label.toLowerCase()}...`} />
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
      <Button onClick={handleGenerateReport} variant="default" className="gap-2">
       <FileText className="w-4 h-4" />
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
     <ScrollArea className="h-96 p-4 border rounded-xl bg-muted/30">
      <p className="text-sm whitespace-pre-wrap">{previewContent}</p>
     </ScrollArea>
     <DialogFooter>
      <Button variant="outline" onClick={() => setShowPreview(false)}>
       Close
      </Button>
      <Button onClick={handleCopyToClipboard} variant="outline" className="gap-2">
       <Copy className="w-4 h-4" />
       Copy
      </Button>
      <Button onClick={handleDownload} variant="default" className="gap-2">
       <Download className="w-4 h-4" />
       Download
      </Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>
  </div>
 );
}
