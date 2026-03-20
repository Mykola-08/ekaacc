import React from 'react';
import { DashboardHeader } from '@/components/dashboard/layout/DashboardHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HugeiconsIcon } from '@hugeicons/react';
import { File01Icon, CheckmarkCircle01Icon, Time01Icon } from '@hugeicons/core-free-icons';


export default function FormsPage() {
  const forms = [
    { title: "Intake Questionnaire", status: "completed", date: "Oct 12, 2023" },
    { title: "Therapy Consent Form", status: "completed", date: "Oct 12, 2023" },
    { title: "Weekly Wellness Check-in", status: "pending", date: "Due Today" }
  ];

  return (
    <div className="flex-1 space-y-6">
      <DashboardHeader 
        title="Forms & Documents" 
        subtitle="Manage your intake forms, consents, and questionnaires."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {forms.map((form, idx) => (
          <Card key={idx} className="rounded-3xl border border-border/50 shadow-sm relative overflow-hidden group">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-2.5 rounded-full ${form.status === 'completed' ? 'bg-primary/10 text-primary' : 'bg-destructive/10 text-destructive'}`}>
                  <HugeiconsIcon icon={File01Icon} className="size-5" />
                </div>
                {form.status === 'completed' ? (
                  <span className="flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-lg">
                    <HugeiconsIcon icon={CheckmarkCircle01Icon} className="size-3" /> Completed
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2.5 py-1 rounded-lg">
                     <HugeiconsIcon icon={Time01Icon} className="size-3" /> Pending
                  </span>
                )}
              </div>
              <CardTitle className="text-lg mt-4">{form.title}</CardTitle>
              <CardDescription>{form.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                variant={form.status === 'completed' ? "outline" : "default"} 
                className="w-full rounded-lg"
              >
                {form.status === 'completed' ? "View Document" : "Fill Out Form"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
