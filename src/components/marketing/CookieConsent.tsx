'use client';

import { useEffect, useState } from 'react';
import { useConsent } from '@/hooks/useConsent';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { Cookie, Shield, GripVertical } from 'lucide-react';

export function CookieConsent() {
  const { status, preferences, isLoading, acceptAll, denyAll, savePreferences } = useConsent();
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(preferences);

  useEffect(() => {
    if (!isLoading && status === 'undecided') {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isLoading, status]);

  useEffect(() => {
    setLocalPreferences(preferences);
  }, [preferences]);

  if (!isVisible) return null;

  const handleSavePreferences = () => {
    savePreferences(localPreferences);
    setShowDetails(false);
  };

  return (
    <div className="animate-in slide-in-from-bottom-4 fixed right-6 bottom-6 z-50 w-full max-w-md px-4 duration-700">
      <Card className="bg-card/95 overflow-hidden rounded-2xl border-none shadow-2xl ring-1 ring-slate-900/5 backdrop-blur-xl">
        <CardContent className="space-y-6 p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
              <Cookie className="h-5 w-5 text-amber-600" />
            </div>
            <div className="space-y-2">
              <h3 className="text-foreground font-serif text-lg leading-tight font-medium">
                Cookie Preferences
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We use cookies to enhance your experience. By continuing to visit this site you
                agree to our use of cookies.{' '}
                <Link href="/privacy" className="underline transition-colors hover:text-amber-600">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex gap-3 pt-2">
              <Button
                onClick={acceptAll}
                className="bg-primary hover:bg-primary/90 h-11 flex-1 rounded-full text-white shadow-lg transition-all hover:shadow-xl"
              >
                Accept All
              </Button>
              <div className="flex gap-2">
                <Dialog open={showDetails} onOpenChange={setShowDetails}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      className="border-border text-muted-foreground hover:bg-muted/40 h-11 rounded-full px-4"
                    >
                      Customize
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-card overflow-hidden rounded-2xl border-none p-0 shadow-2xl sm:max-w-[425px]">
                    <DialogHeader className="border-border/60 bg-card border-b p-8 pb-6">
                      <div className="mb-2 flex items-center gap-3">
                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                          <Shield className="text-muted-foreground h-5 w-5" />
                        </div>
                        <DialogTitle className="text-foreground font-serif text-2xl">
                          Preferences
                        </DialogTitle>
                      </div>
                      <DialogDescription className="text-muted-foreground">
                        Manage your cookie settings. Essential cookies are always enabled.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="bg-muted/30 space-y-6 p-8 py-6">
                      <div className="bg-card border-border/60 flex items-start gap-3 rounded-2xl border p-4 opacity-60 shadow-sm">
                        <div className="flex-1 space-y-1">
                          <Label htmlFor="essential" className="text-foreground font-medium">
                            Essential
                          </Label>
                          <p className="text-muted-foreground text-xs">
                            Required for the site to function
                          </p>
                        </div>
                        <input
                          type="checkbox"
                          id="essential"
                          checked={true}
                          disabled
                          className="border-input text-foreground h-5 w-5 rounded-md focus:ring-slate-900"
                        />
                      </div>

                      {[
                        {
                          id: 'analytics',
                          label: 'Analytics',
                          desc: 'Help us improve our website',
                        },
                        {
                          id: 'marketing',
                          label: 'Marketing',
                          desc: 'Personalized advertisements',
                        },
                        { id: 'functional', label: 'Functional', desc: 'Enhanced functionality' },
                      ].map((item) => (
                        <div
                          key={item.id}
                          className="bg-card border-border/60 flex items-start gap-3 rounded-2xl border p-4 shadow-sm transition-all hover:border-amber-200/50 hover:shadow-md"
                        >
                          <div className="flex-1 space-y-1">
                            <Label
                              htmlFor={item.id}
                              className="text-foreground cursor-pointer font-medium"
                            >
                              {item.label}
                            </Label>
                            <p className="text-muted-foreground text-xs">{item.desc}</p>
                          </div>
                          <input
                            type="checkbox"
                            id={item.id}
                            checked={(localPreferences as any)[item.id]}
                            onChange={(e) =>
                              setLocalPreferences((prev) => ({
                                ...prev,
                                [item.id]: e.target.checked,
                              }))
                            }
                            className="border-border h-5 w-5 cursor-pointer rounded-md text-amber-600 focus:ring-amber-500"
                          />
                        </div>
                      ))}
                    </div>
                    <DialogFooter className="bg-card border-border/60 border-t p-6">
                      <Button
                        onClick={handleSavePreferences}
                        className="bg-primary hover:bg-primary/90 h-12 w-full rounded-xl text-white shadow-lg transition-all hover:shadow-xl"
                      >
                        Save Preferences
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="ghost"
                  onClick={denyAll}
                  className="text-muted-foreground/80 hover:text-muted-foreground hover:bg-muted/40 h-11 rounded-full"
                >
                  Decline
                </Button>
              </div>
            </div>
            <p className="text-muted-foreground/80 px-4 text-center text-xs leading-relaxed">
              Compliance: CCPA, GDPR, ISO 27001, SOC 2, HIPAA aligned.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
