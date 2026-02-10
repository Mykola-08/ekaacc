'use client';

import { SessionTemplate, deleteTemplate } from '@/server/therapist/templates';
import {
 Card,
 CardContent,
 CardDescription,
 CardFooter,
 CardHeader,
 CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, FileText } from 'lucide-react';
import { useState } from 'react';
import {
 Sheet,
 SheetContent,
 SheetDescription,
 SheetHeader,
 SheetTitle,
 SheetTrigger,
} from '@/components/ui/sheet';
import { TemplateForm } from './TemplateForm';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { InlineFeedbackCompact } from '@/components/ui/inline-feedback';
import { useRouter } from 'next/navigation';
import {
 AlertDialog,
 AlertDialogAction,
 AlertDialogCancel,
 AlertDialogContent,
 AlertDialogDescription,
 AlertDialogFooter,
 AlertDialogHeader,
 AlertDialogTitle,
 AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

interface TemplateListProps {
 templates: SessionTemplate[];
}

export function TemplateList({ templates }: TemplateListProps) {
 const [isSheetOpen, setIsSheetOpen] = useState(false);
 const [selectedTemplate, setSelectedTemplate] = useState<SessionTemplate | undefined>(undefined);
 const router = useRouter();
 const deleteFeedback = useMorphingFeedback();

 const handleEdit = (template: SessionTemplate) => {
 setSelectedTemplate(template);
 setIsSheetOpen(true);
 };

 const handleCreate = () => {
 setSelectedTemplate(undefined);
 setIsSheetOpen(true);
 };

 const handleSheetClose = () => {
 setIsSheetOpen(false);
 setSelectedTemplate(undefined);
 };

 const handleDelete = async (id: string) => {
 try {
 deleteFeedback.setLoading('Deleting...');
 await deleteTemplate(id);
 deleteFeedback.setSuccess('Template deleted');
 router.refresh();
 } catch (error) {
 deleteFeedback.setError('Failed to delete template');
 }
 };

 const getTypeColor = (type: string) => {
 switch (type) {
 case 'note':
 return 'bg-primary/10 text-primary';
 case 'plan':
 return 'bg-green-100/80 text-green-800 dark:text-green-200';
 case 'email':
 return 'bg-purple-100/80 text-purple-800 dark:text-purple-200';
 default:
 return 'bg-muted text-foreground ';
 }
 };

 return (
 <div className="space-y-6">
 <div className="flex items-center justify-between">
 <div>
 <h2 className="text-2xl font-semibold tracking-tight">Session Templates</h2>
 <p className="text-muted-foreground mt-1 text-sm">
 Manage your clinical note structures and recurring session plans.
 </p>
 </div>

 <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
 <Button onClick={handleCreate} className="gap-2">
 <Plus className="h-4 w-4" /> Create Template
 </Button>
 <SheetContent className="w-[400px] overflow-y-auto sm:w-[540px]">
 <SheetHeader>
 <SheetTitle>{selectedTemplate ? 'Edit Template' : 'New Template'}</SheetTitle>
 <SheetDescription>
 {selectedTemplate
 ? 'Make changes to your existing template.'
 : 'Create a new reusable template for your sessions.'}
 </SheetDescription>
 </SheetHeader>
 <TemplateForm template={selectedTemplate} onSuccess={handleSheetClose} />
 </SheetContent>
 </Sheet>
 </div>

 <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
 {templates.map((template) => (
 <Card
 key={template.id}
 className="group border-border/60 overflow-hidden transition-shadow duration-300 hover:shadow-md"
 >
 <CardHeader className="pb-3">
 <div className="flex items-start justify-between gap-4">
 <div className="bg-primary/5 rounded-lg p-2">
 <FileText className="text-primary h-5 w-5" />
 </div>
 <Badge
 variant="secondary"
 className={`capitalize ${getTypeColor(template.type)} border-0`}
 >
 {template.type}
 </Badge>
 </div>
 <CardTitle className="mt-4 text-base leading-none font-medium">
 {template.name}
 </CardTitle>
 <CardDescription className="mt-1.5 text-xs">
 Last updated: {new Date(template.updated_at).toLocaleDateString()}
 </CardDescription>
 </CardHeader>
 <CardContent>
 <div className="text-muted-foreground bg-muted/30 line-clamp-3 rounded-md p-3 font-mono text-sm text-xs">
 {typeof template.content === 'string'
 ? template.content
 : template.content?.value || JSON.stringify(template.content)}
 </div>
 </CardContent>
 <CardFooter className="flex justify-end gap-2 pt-0 pr-4 pb-4">
 <Button
 variant="ghost"
 size="sm"
 onClick={() => handleEdit(template)}
 className="h-8 w-8 p-0"
 >
 <Pencil className="text-muted-foreground group-hover:text-primary h-4 w-4 transition-colors" />
 <span className="sr-only">Edit</span>
 </Button>

 <AlertDialog>
 <AlertDialogTrigger asChild>
 <Button
 variant="ghost"
 size="sm"
 className="text-destructive/70 hover:text-destructive h-8 w-8 p-0"
 >
 <Trash2 className="h-4 w-4" />
 <span className="sr-only">Delete</span>
 </Button>
 </AlertDialogTrigger>
 <AlertDialogContent>
 <AlertDialogHeader>
 <AlertDialogTitle>Delete Template?</AlertDialogTitle>
 <AlertDialogDescription>
 This action cannot be undone. This will permanently delete the template "
 {template.name}".
 </AlertDialogDescription>
 </AlertDialogHeader>
 <AlertDialogFooter>
 <AlertDialogCancel>Cancel</AlertDialogCancel>
 <AlertDialogAction
 onClick={() => handleDelete(template.id)}
 className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
 >
 Delete
 </AlertDialogAction>
 </AlertDialogFooter>
 </AlertDialogContent>
 </AlertDialog>
 </CardFooter>
 </Card>
 ))}
 {templates.length === 0 && (
 <div className="text-muted-foreground col-span-full rounded-xl border-2 border-dashed py-12 text-center">
 <p>No templates found. Create your first one to get started.</p>
 <Button variant="link" onClick={handleCreate} className="mt-2">
 Create New
 </Button>
 </div>
 )}
 </div>
 </div>
 );
}
