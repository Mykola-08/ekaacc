'use client';

import { useLanguage } from '@/react-app/contexts/LanguageContext';
import React from 'react';

export default function CookiePolicy() {
 const { t } = useLanguage();
 
 return (
  <div className="dark min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
   <div className="max-w-3xl mx-auto px-6 sm:px-8 py-20">
    <div className="bg-background">
     <div className="bg-background px-0 py-10 mb-8 border-b border-border animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground">
       {t('footer.cookiePolicy')}
      </h1>
      <div className="flex items-center text-muted-foreground text-sm font-medium">
       <span>{t('policy.lastUpdated')}</span>
       <span className="ml-2 bg-muted px-3 py-1 rounded-full text-foreground">November 15, 2025</span>
      </div>
     </div>

     <div className="px-0 py-0 text-foreground space-y-16">
      <div className="animate-slide-up">
       <p className="text-muted-foreground leading-relaxed text-xl font-normal">
        This Cookie Policy explains how we use cookies and similar technologies on our website in compliance with GDPR requirements.
       </p>
      </div>
      
      <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
        <h2 className="text-2xl font-semibold text-foreground mb-6 tracking-tight">
        1. What Cookies Are (GDPR Article 4(11))
       </h2>
       <p className="text-muted-foreground leading-relaxed text-lg mb-6">
        Cookies are small text files stored on your device when you visit our website. They help us provide, secure, and improve our Services.
       </p>
       
       <div className="bg-blue-900/10 rounded-2xl p-6 border border-blue-900/20 mt-6">
         <p className="text-blue-400 text-lg">
          We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
         </p>
       </div>
      </div>

      <div className="border-t border-border pt-8 mt-12 animate-fade-in">
       <p className="text-center text-muted-foreground text-sm">
        This Cookie Policy is provided in compliance with the General Data Protection Regulation (EU) 2016/679.
       </p>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
