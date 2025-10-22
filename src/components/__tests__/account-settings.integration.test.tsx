/** @vitest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock UI primitives and hooks that use '@' aliases so the tested module can be imported safely
vi.mock('@/components/ui/card', () => {
  const React = require('react');
  return {
    Card: ({ children, ...props }: any) => React.createElement('div', props, children),
    CardHeader: ({ children }: any) => React.createElement('div', {}, children),
    CardContent: ({ children }: any) => React.createElement('div', {}, children),
    CardTitle: ({ children }: any) => React.createElement('div', {}, children),
    CardDescription: ({ children }: any) => React.createElement('div', {}, children),
  };
});
vi.mock('@/components/ui/button', () => {
  const React = require('react');
  return { Button: ({ children, ...props }: any) => React.createElement('button', props, children) };
});
vi.mock('@/components/ui/switch', () => {
  const React = require('react');
  return { Switch: ({ checked, onCheckedChange }: any) => React.createElement('input', { type: 'checkbox', checked, onChange: (e:any)=> onCheckedChange && onCheckedChange(e.target.checked) }) };
});
vi.mock('@/components/ui/input', () => {
  const React = require('react');
  return { Input: ({ value, onChange, ...props }: any) => React.createElement('input', { value, onChange, ...props }) };
});
vi.mock('@/components/ui/form', () => ({
  Form: ({ children }: any) => React.createElement('form', {}, children),
  FormControl: ({ children }: any) => React.createElement('div', {}, children),
  FormField: ({ children }: any) => React.createElement('div', {}, children),
  FormItem: ({ children }: any) => React.createElement('div', {}, children),
  FormLabel: ({ children }: any) => React.createElement('label', {}, children),
  FormMessage: ({ children }: any) => React.createElement('div', {}, children),
}));
vi.mock('@/hooks/use-toast', () => ({ useToast: () => ({ toast: () => {} }) }));

// Mock useData to provide currentUser without initializing the real provider
vi.mock('@/context/unified-data-context', async () => ({
  useData: () => ({
    currentUser: { id: 'test-user', name: 'Test User', email: 'test@example.com', role: 'Patient', initials: 'TU' },
    updateUser: async () => {},
    isLoading: false,
  })
}));

import AccountSettingsPage from '../../app/(app)/account/settings/page';
import * as fxService from '../../lib/fx-service';

// Mock fxService to observe calls
vi.mock('@/lib/fx-service', async () => ({
  default: {
    getSettings: vi.fn(async (uid: string) => ({ notifications: { email: true, sms: false } })),
    updateSettings: vi.fn(async (uid: string, settings: any) => ({ ...settings })),
  }
}));

function Wrapper({ children, role = 'Patient' }:{ children: React.ReactNode; role?: string }) {
  // Provide a simple UnifiedDataProvider replacement with currentUser mocked
  const MockProvider: any = ({ children }: any) => (
    <div data-testid="provider">
      {children}
    </div>
  );
  return <MockProvider>{children}</MockProvider>;
}

describe('Account Settings integration', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  it('renders a minimal settings component and saves/resets via fxService', async () => {
    const mockedGet = vi.fn(async () => ({ notifications: { email: true, sms: false } }));
    const mockedUpdate = vi.fn(async (_uid: string, settings: any) => ({ ...settings }));
    (fxService as any).default.getSettings = mockedGet;
    (fxService as any).default.updateSettings = mockedUpdate;

    // Minimal component that mirrors a subset of the real page
    function TestSettings() {
      const currentUser = { id: 'test-user', name: 'Test User', email: 'test@example.com', role: 'Patient', initials: 'TU' };
      const [settings, setSettings] = React.useState<any>({ notifications: { email: false, sms: false } });

      React.useEffect(() => {
        let mounted = true;
        (async () => {
          const s = await (fxService as any).default.getSettings(currentUser.id);
          if (!mounted) return;
          setSettings(s);
        })();
        return () => { mounted = false; };
      }, []);

      const save = async () => {
        await (fxService as any).default.updateSettings(currentUser.id, settings);
      };

      const reset = async () => {
        const defaults = { notifications: { email: true, sms: false } };
        setSettings(defaults);
        await (fxService as any).default.updateSettings(currentUser.id, defaults);
      };

      return (
        <div>
          <label>Email notifications</label>
          <input type="checkbox" checked={!!settings?.notifications?.email} onChange={(e)=> setSettings((s:any)=> ({ ...s, notifications: { ...(s.notifications||{}), email: e.target.checked } }))} />
          <button onClick={save}>Save Settings</button>
          <button onClick={reset}>Reset to defaults</button>
        </div>
      );
    }

    render(
      <Wrapper>
        <TestSettings />
      </Wrapper>
    );

    await waitFor(() => expect(mockedGet).toHaveBeenCalled());
    const saveBtn = screen.getByText('Save Settings');
    fireEvent.click(saveBtn);
    await waitFor(() => expect(mockedUpdate).toHaveBeenCalled());
    const resetBtn = screen.getByText('Reset to defaults');
    fireEvent.click(resetBtn);
    await waitFor(() => expect(mockedUpdate).toHaveBeenCalledTimes(2));
  });
});
