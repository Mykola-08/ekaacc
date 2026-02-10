'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { createTemplate, updateTemplate, SessionTemplate } from '@/server/therapist/templates';
import { useMorphingFeedback } from '@/hooks/useMorphingFeedback';
import { InlineFeedbackCompact } from '@/components/ui/inline-feedback';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  content: z.string().min(1, {
    message: 'Content cannot be empty.',
  }),
  type: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

interface TemplateFormProps {
  template?: SessionTemplate;
  onSuccess?: () => void;
}

export function TemplateForm({ template, onSuccess }: TemplateFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const saveFeedback = useMorphingFeedback();

  // Parse existing content if it's JSON
  let defaultContent = '';
  if (template?.content) {
    if (typeof template.content === 'string') {
      defaultContent = template.content;
    } else if (template.content.value) {
      defaultContent = template.content.value;
    } else {
      defaultContent = JSON.stringify(template.content, null, 2);
    }
  }

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: template?.name || '',
      content: defaultContent,
      type: template?.type || 'note',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    saveFeedback.setLoading('Saving...');
    try {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('content', values.content);
      formData.append('type', values.type);

      if (template) {
        await updateTemplate(template.id, formData);
        saveFeedback.setSuccess('Template updated');
      } else {
        await createTemplate(formData);
        saveFeedback.setSuccess('Template created');
      }

      router.refresh();
      if (onSuccess) {
        setTimeout(onSuccess, 1000);
      }
    } catch (error) {
      saveFeedback.setError('Something went wrong');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Template Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Initial Consultation" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="note">Clinical Note</SelectItem>
                  <SelectItem value="plan">Treatment Plan</SelectItem>
                  <SelectItem value="email">Email Template</SelectItem>
                  <SelectItem value="task">Task List</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>Categorize this template for easier filtering.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter template content or structure..."
                  className="min-h-50 font-mono text-sm"
                  {...field}
                />
              </FormControl>
              <FormDescription>You can enter text or JSON structure.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex items-center justify-end gap-3">
          <InlineFeedbackCompact
            status={saveFeedback.status}
            message={saveFeedback.message}
            onDismiss={saveFeedback.reset}
          />
          <Button type="button" variant="outline" onClick={onSuccess}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
