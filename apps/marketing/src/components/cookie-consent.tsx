"use client";

import { useEffect, useState } from "react";
import { useConsent } from "@/hooks/useConsent";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export function CookieConsent() {
  const { status, isLoading, accept, deny } = useConsent();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isLoading && status === 'undecided') {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [isLoading, status]);

  if (!isVisible) return null;

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
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={deny} size="sm">
              Decline
            </Button>
            <Button onClick={accept} size="sm">
              Accept
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
