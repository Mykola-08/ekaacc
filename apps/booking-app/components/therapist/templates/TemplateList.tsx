'use client';

import { SessionTemplate, deleteTemplate } from '@/server/therapist/templates';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
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
import { toast } from 'sonner';
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
      await deleteTemplate(id);
      toast.success('Template deleted');
      router.refresh();
    } catch (error) {
      toast.error('Failed to delete template');
    }
  };

  const getTypeColor = (type: string) => {
      switch(type) {
          case 'note': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
          case 'plan': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
          case 'email': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
          default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
      }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
            <h2 className="text-2xl font-semibold tracking-tight">Session Templates</h2>
            <p className="text-muted-foreground text-sm mt-1">
                Manage your clinical note structures and recurring session plans.
            </p>
        </div>
        
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <Button onClick={handleCreate} className="gap-2">
            <Plus className="h-4 w-4" /> Create Template
          </Button>
          <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card key={template.id} className="group hover:shadow-md transition-shadow duration-300 overflow-hidden border-border/60">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start gap-4">
                <div className="bg-primary/5 p-2 rounded-lg">
                    <FileText className="h-5 w-5 text-primary" />
                </div>
                <Badge variant="secondary" className={`capitalize ${getTypeColor(template.type)} border-0`}>
                    {template.type}
                </Badge>
              </div>
              <CardTitle className="mt-4 text-base font-medium leading-none">{template.name}</CardTitle>
              <CardDescription className="text-xs mt-1.5">
                Last updated: {new Date(template.updated_at).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground line-clamp-3 bg-muted/30 p-3 rounded-md font-mono text-xs">
                 {typeof template.content === 'string' 
                    ? template.content 
                    : template.content?.value || JSON.stringify(template.content)}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2 pt-0 pb-4 pr-4">
              <Button variant="ghost" size="sm" onClick={() => handleEdit(template)} className="h-8 w-8 p-0">
                <Pencil className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="sr-only">Edit</span>
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive/70 hover:text-destructive">
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Template?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the template "{template.name}".
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(template.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardFooter>
          </Card>
        ))}
        {templates.length === 0 && (
            <div className="col-span-full py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl">
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
