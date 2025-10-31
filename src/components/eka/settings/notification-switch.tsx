
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface NotificationSwitchProps {
  id: string;
  label: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  icon?: React.ReactNode;
  className?: string;
}

export function NotificationSwitch({ id, label, checked, onCheckedChange, icon, className }: NotificationSwitchProps) {
  return (
    <div className={cn("flex items-center justify-between space-x-4 rounded-lg border p-4", className)}>
      <div className="flex items-center space-x-3">
        {icon}
        <Label htmlFor={id} className="flex flex-col space-y-1">
          <span>{label}</span>
        </Label>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
