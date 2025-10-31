
import { cn } from "@/lib/utils";

interface SettingsHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
}

export function SettingsHeader({ title, description, className, ...props }: SettingsHeaderProps) {
  return (
    <div className={cn("space-y-1.5", className)} {...props}>
      <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      {description && <p className="text-muted-foreground">{description}</p>}
    </div>
  );
}
