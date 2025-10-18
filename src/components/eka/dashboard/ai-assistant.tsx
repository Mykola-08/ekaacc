import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles } from 'lucide-react';

export function AiAssistant() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary"/>
            <span>AI Assistant</span>
        </CardTitle>
        <CardDescription>Ask me anything or tell me what to do. For example: "Summarize my progress this month."</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <Textarea placeholder="Your message to EKA Core..." />
          <Button>Send</Button>
        </form>
      </CardContent>
    </Card>
  );
}
