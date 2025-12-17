
import { cn } from "@/lib/utils";

type SettingsShellProps = React.HTMLAttributes<HTMLDivElement>;

export function SettingsShell({ className, children, ...props }: SettingsShellProps) {
  return (
    <div className={cn("space-y-8", className)} {...props}>
      {children}
    </div>
  );
}
