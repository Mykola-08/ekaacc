import React from 'react';
export function SettingsCard({ title, description, icon: Icon, actions, children }: { title: string; description: string; icon?: any; actions?: React.ReactNode; children?: React.ReactNode }) {
  return (
    <div className='border rounded p-4 mb-4'>
      <div className='flex items-center gap-2 mb-2'>
        {Icon && <Icon className='h-5 w-5' />}
        <div>
          <h3 className='font-semibold'>{title}</h3>
          <p className='text-sm text-muted-foreground'>{description}</p>
        </div>
        {actions && <div className='ml-auto'>{actions}</div>}
      </div>
      {children}
    </div>
  );
}
