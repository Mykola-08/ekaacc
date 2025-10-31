
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface SettingsCardProps extends React.ComponentProps<typeof Card> {
  title: string;
  description?: string;
}

export function SettingsCard({ title, description, className, children, ...props }: SettingsCardProps) {
  return (
    <Card className={cn("shadow-sm", className)} {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
