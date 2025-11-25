"use client";

import { useEffect, useState } from "react";
import { useConsent } from "@/hooks/useConsent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";

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
    <div className="fixed bottom-4 right-4 z-50 max-w-md w-full px-4">
      <Card className="shadow-lg border-primary/20">
        <CardContent className="p-6 space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold leading-none tracking-tight">Cookie Preferences</h3>
            <p className="text-sm text-muted-foreground">
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
              {" "}
              <Link href="http://localhost:9006/privacy" className="underline hover:text-primary">
                Privacy Policy
              </Link>
            </p>
            <p className="text-xs text-muted-foreground italic">
              Compliance Notice: We have implemented comprehensive measures to align with CCPA, GDPR, ISO 27001, SOC 2, and HIPAA standards. However, compliance is an ongoing process, and we cannot guarantee absolute adherence at all times.
            </p>
          </div>
          <div className="flex gap-2 justify-end flex-wrap">
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Customize
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Cookie Preferences</DialogTitle>
                  <DialogDescription>
                    Manage your cookie settings. Essential cookies are always enabled.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="essential" className="flex flex-col space-y-1">
                      <span>Essential</span>
                      <span className="font-normal text-xs text-muted-foreground">Required for the site to function</span>
                    </Label>
                    <input type="checkbox" id="essential" checked={true} disabled className="h-4 w-4" />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="analytics" className="flex flex-col space-y-1">
                      <span>Analytics</span>
                      <span className="font-normal text-xs text-muted-foreground">Help us improve our website</span>
                    </Label>
                    <input
                      type="checkbox"
                      id="analytics"
                      checked={localPreferences.analytics}
                      onChange={(e) => setLocalPreferences(prev => ({ ...prev, analytics: e.target.checked }))}
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="marketing" className="flex flex-col space-y-1">
                      <span>Marketing</span>
                      <span className="font-normal text-xs text-muted-foreground">Personalized advertisements</span>
                    </Label>
                    <input
                      type="checkbox"
                      id="marketing"
                      checked={localPreferences.marketing}
                      onChange={(e) => setLocalPreferences(prev => ({ ...prev, marketing: e.target.checked }))}
                      className="h-4 w-4"
                    />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="functional" className="flex flex-col space-y-1">
                      <span>Functional</span>
                      <span className="font-normal text-xs text-muted-foreground">Enhanced functionality and personalization</span>
                    </Label>
                    <input
                      type="checkbox"
                      id="functional"
                      checked={localPreferences.functional}
                      onChange={(e) => setLocalPreferences(prev => ({ ...prev, functional: e.target.checked }))}
                      className="h-4 w-4"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleSavePreferences}>Save Preferences</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button variant="outline" onClick={denyAll} size="sm">
              Decline All
            </Button>
            <Button onClick={acceptAll} size="sm">
              Accept All
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
