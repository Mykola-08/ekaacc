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
import { Cookie, Shield, GripVertical } from "lucide-react";

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
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full px-4 animate-in slide-in-from-bottom-4 duration-700">
      <Card className="shadow-2xl border-none rounded-[32px] overflow-hidden bg-white/95 backdrop-blur-xl ring-1 ring-slate-900/5">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
               <Cookie className="w-5 h-5 text-amber-600" />
            </div>
            <div className="space-y-2">
                <h3 className="font-serif text-lg font-medium text-slate-900 leading-tight">Cookie Preferences</h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.
                {" "}
                <Link href="/privacy" className="underline hover:text-amber-600 transition-colors">
                    Privacy Policy
                </Link>
                </p>
            </div>
          </div>
          
          <div className="space-y-4">
             <div className="flex gap-3 pt-2">
                <Button onClick={acceptAll} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white rounded-full h-11 shadow-lg hover:shadow-xl transition-all">
                   Accept All
                </Button>
                <div className="flex gap-2">
                    <Dialog open={showDetails} onOpenChange={setShowDetails}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="rounded-full h-11 px-4 border-slate-200 text-slate-600 hover:bg-slate-50">
                            Customize
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white border-none shadow-2xl rounded-[32px] p-0 overflow-hidden">
                        <DialogHeader className="p-8 pb-6 border-b border-slate-100 bg-white">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-slate-600" />
                                </div>
                                <DialogTitle className="font-serif text-2xl text-slate-900">Preferences</DialogTitle>
                            </div>
                            <DialogDescription className="text-slate-500">
                                Manage your cookie settings. Essential cookies are always enabled.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="p-8 py-6 space-y-6 bg-[#FAFAF8]">
                            <div className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm opacity-60">
                                <div className="flex-1 space-y-1">
                                    <Label htmlFor="essential" className="font-medium text-slate-900">Essential</Label>
                                    <p className="text-xs text-slate-500">Required for the site to function</p>
                                </div>
                                <input type="checkbox" id="essential" checked={true} disabled className="h-5 w-5 rounded-md border-slate-300 text-slate-900 focus:ring-slate-900" />
                            </div>
                            
                            {[
                                { id: 'analytics', label: 'Analytics', desc: 'Help us improve our website' },
                                { id: 'marketing', label: 'Marketing', desc: 'Personalized advertisements' },
                                { id: 'functional', label: 'Functional', desc: 'Enhanced functionality' }
                            ].map((item) => (
                                <div key={item.id} className="flex items-start gap-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-amber-200/50">
                                    <div className="flex-1 space-y-1">
                                        <Label htmlFor={item.id} className="font-medium text-slate-900 cursor-pointer">{item.label}</Label>
                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                    </div>
                                    <input
                                        type="checkbox"
                                        id={item.id}
                                        checked={(localPreferences as any)[item.id]}
                                        onChange={(e) => setLocalPreferences(prev => ({ ...prev, [item.id]: e.target.checked }))}
                                        className="h-5 w-5 rounded-md border-slate-200 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                    />
                                </div>
                            ))}
                        </div>
                        <DialogFooter className="p-6 bg-white border-t border-slate-100">
                           <Button onClick={handleSavePreferences} className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-12 shadow-lg hover:shadow-xl transition-all">
                               Save Preferences
                           </Button>
                        </DialogFooter>
                    </DialogContent>
                    </Dialog>
                    <Button variant="ghost" onClick={denyAll} className="h-11 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-50">
                    Decline
                    </Button>
                </div>
             </div>
             <p className="text-[10px] text-slate-400 text-center px-4 leading-relaxed">
                Compliance: CCPA, GDPR, ISO 27001, SOC 2, HIPAA aligned.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
