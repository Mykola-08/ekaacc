'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { generateTelegramConnectCode } from '@/app/actions/telegram-actions';
import { HugeiconsIcon } from '@hugeicons/react';
import { Loading03Icon, ArrowUpRight01Icon } from '@hugeicons/core-free-icons';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

export function TelegramConnectButton({ botUsername = 'ekabalancebot' }: { botUsername?: string }) {
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState<string | null>(null);

  const handleConnect = async () => {
    try {
      setLoading(true);
      const newCode = await generateTelegramConnectCode();
      setCode(newCode);
    } catch (error) {
      console.error('Failed to generate code:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={handleConnect} disabled={loading}>
        {loading ? <HugeiconsIcon icon={Loading03Icon} className="mr-2 size-4 animate-spin"  /> : null}
        Connect Telegram
      </Button>

      <Dialog open={!!code} onOpenChange={(open) => !open && setCode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Connect Telegram</DialogTitle>
            <DialogDescription>
              Open Telegram and start the EKA Bot to link your account.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center gap-6 py-6 text-center">
            <div className="bg-muted/50 max-w-[280px] rounded-xl p-4">
              <p className="text-muted-foreground mb-4 text-sm">
                Click below to open Telegram. The bot will automatically link your account.
              </p>
              {code && (
                <Button asChild className="w-full">
                  <a
                    href={`https://t.me/${botUsername}?start=${code}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open Telegram <HugeiconsIcon icon={ArrowUpRight01Icon} className="ml-2 size-4"  />
                  </a>
                </Button>
              )}
            </div>

            <p className="text-muted-foreground max-w-[250px] text-xs">
              Or send this command directly to <strong>@{botUsername}</strong>:
            </p>
            <code className="bg-muted rounded-xl px-3 py-2 font-mono text-sm tracking-wider break-all select-all">
              /link {code}
            </code>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
