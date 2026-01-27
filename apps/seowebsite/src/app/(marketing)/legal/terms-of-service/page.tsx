'use client';

import { useLanguage } from '@/contexts/LanguageContext';
import React from 'react';

export default function TermsOfService() {
 const { t } = useLanguage();
 
 return (
  <div className="dark min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
   <div className="max-w-3xl mx-auto px-6 sm:px-8 py-20">
    <div className="bg-background">
     {/* Header */}
     <div className="bg-background px-0 py-10 mb-8 border-b border-border animate-fade-in">
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 text-foreground">
       {t('footer.termsOfService')}
      </h1>
      <div className="flex items-center text-muted-foreground text-sm font-medium">
       <span>{t('policy.lastUpdated')}</span>
       <span className="ml-2 bg-muted px-3 py-1 rounded-full text-foreground">November 15, 2025</span>
      </div>
     </div>

     {/* Content */}
     <div className="px-0 py-0 text-foreground space-y-16">
      {/* Introduction */}
      <div className="animate-slide-up">
       <p className="text-muted-foreground leading-relaxed text-xl font-normal">
        These Terms govern your access to and use of the EKA Balance website, applications, and services ("Services"). By using the Services, you agree to these Terms in full. If you do not agree, please discontinue use immediately.
       </p>
      </div>

      {/* Acceptance and Consent */}
      <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
       <h2 className="text-2xl font-semibold text-foreground mb-6 tracking-tight">
        1. Acceptance and Consent
       </h2>
       <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
        By accessing or using our Services, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. Your use of the Services constitutes explicit consent to:
       </p>
       <ul className="space-y-3 text-muted-foreground mb-6">
        <li className="flex items-start">
         <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 shrink-0"></span>
         The collection, processing, and storage of your personal data as described in our Privacy Policy
        </li>
        <li className="flex items-start">
         <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 shrink-0"></span>
         The use of cookies and similar technologies as described in our Cookie Policy
        </li>
        <li className="flex items-start">
         <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 shrink-0"></span>
         International transfers of your data as outlined in our Privacy Policy
        </li>
        <li className="flex items-start">
         <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 shrink-0"></span>
         Our data processing activities for the purposes described in our Privacy Policy
        </li>
       </ul>
       <p className="text-muted-foreground leading-relaxed text-lg">
        If you do not agree to these Terms or our Privacy Policy, you must not access or use our Services.
       </p>
      </div>

      {/* Eligibility and Age Requirements */}
      <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
       <h2 className="text-2xl font-semibold text-foreground mb-6 tracking-tight">
        2. Eligibility and Age Requirements
       </h2>
       <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
        By using the Services, you confirm that:
       </p>
       <ul className="space-y-3 text-muted-foreground mb-8">
        <li className="flex items-start">
         <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 shrink-0"></span>
         You are at least 18 years old, or if you are 16-18 years old, you have obtained parental consent to use our Services
        </li>
        <li className="flex items-start">
         <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 shrink-0"></span>
         You have the legal capacity to enter into binding agreements
        </li>
        <li className="flex items-start">
         <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 shrink-0"></span>
         You will provide accurate and complete information
        </li>
        <li className="flex items-start">
         <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 shrink-0"></span>
         You will comply with all applicable laws and regulations, including data protection laws
        </li>
        <li className="flex items-start">
         <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 shrink-0"></span>
         You understand and accept our data processing practices as described in our Privacy Policy
        </li>
        <li className="flex items-start">
         <span className="w-2 h-2 bg-blue-400 rounded-full mt-2 mr-3 shrink-0"></span>
         You have the authority to provide any personal data you share with us and that such data does not infringe upon the rights of any third party
        </li>
       </ul>
       <div className="bg-amber-900/10 rounded-2xl p-6 border border-amber-900/20">
        <p className="text-amber-400 text-lg">
         <strong>Parental Consent:</strong> If you are under 16 years of age, you may not use our Services. If you are between 16-18 years of age, you may only use our Services with the consent of your parent or legal guardian who must review and accept these Terms and our Privacy Policy on your behalf.
        </p>
       </div>
      </div>

      {/* Nature of Services */}
      <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
       <h2 className="text-2xl font-semibold text-foreground mb-6 tracking-tight">
        3. Nature of Services
       </h2>
       <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
        EKA Balance provides wellness and kinesiology services. Our services are:
       </p>
       <ul className="space-y-3 text-muted-foreground mb-6">
        <li className="flex items-start">
         <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 shrink-0"></span>
         Informational and educational in nature
        </li>
        <li className="flex items-start">
         <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 shrink-0"></span>
         Not intended as medical diagnosis or treatment
        </li>
        <li className="flex items-start">
         <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 shrink-0"></span>
         Not a substitute for professional medical advice
        </li>
        <li className="flex items-start">
         <span className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 shrink-0"></span>
         Provided as complementary wellness support
        </li>
       </ul>
       <div className="bg-blue-900/10 rounded-2xl p-6 border border-blue-900/20">
        <p className="text-blue-400 text-lg">
         <strong>Important:</strong> You acknowledge that all decisions based on information from EKA Balance are made at your own risk.
        </p>
       </div>
      </div>

      {/* Contact Information */}
      <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
       <h2 className="text-2xl font-semibold text-foreground mb-6 tracking-tight">
        18. Contact Information and Data Protection Inquiries
       </h2>
       <p className="text-muted-foreground leading-relaxed mb-6 text-lg">
        For questions about these Terms, privacy matters, or data protection inquiries:
       </p>

       <div className="grid gap-6">
        <div className="bg-muted/30 rounded-2xl p-6 border border-border">
         <h3 className="text-xl font-semibold text-foreground mb-4">Data Protection Officer (DPO)</h3>
         <div className="space-y-3 text-muted-foreground text-lg">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
           <span className="font-semibold text-foreground w-32 shrink-0">Name:</span>
           <span>Olena Kucherova Dryzhak</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
           <span className="font-semibold text-foreground w-32 shrink-0">Email:</span>
           <a href="mailto:dpo@ekabalance.com" className="text-blue-400 hover:text-blue-300">dpo@ekabalance.com</a>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
           <span className="font-semibold text-foreground w-32 shrink-0">Phone:</span>
           <span>+34 658 867 133</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
           <span className="font-semibold text-foreground w-32 shrink-0">Address:</span>
           <span>Calle Plata 1, 08191 Rubí, Barcelona, Spain</span>
          </div>
         </div>
         <p className="text-muted-foreground mt-6 text-sm">
          The DPO is your primary contact for all data protection matters, privacy inquiries, and exercising your data subject rights.
         </p>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
         <h3 className="text-xl font-semibold text-foreground mb-4">Legal and General Inquiries</h3>
         <div className="space-y-3 text-muted-foreground text-lg">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
           <span className="font-semibold text-foreground w-32 shrink-0">Email:</span>
           <a href="mailto:legal@ekabalance.com" className="text-blue-400 hover:text-blue-300">legal@ekabalance.com</a>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
           <span className="font-semibold text-foreground w-32 shrink-0">Address:</span>
           <span>Calle Plata 1, 08191 Rubí, Barcelona, Spain</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-0">
           <span className="font-semibold text-foreground w-32 shrink-0">Phone:</span>
           <span>+34 658 867 133</span>
          </div>
         </div>
        </div>
       </div>

       <div className="bg-green-900/10 rounded-2xl p-6 mt-6 border border-green-900/20">
        <h4 className="text-xl font-semibold text-green-400 mb-3">Response Times</h4>
        <p className="text-green-200/80 text-lg mb-4">We aim to respond to all inquiries within:</p>
        <ul className="space-y-2 text-green-200/70 text-lg">
         <li>• <strong>Data protection inquiries:</strong> 30 days (as required by GDPR)</li>
         <li>• <strong>General inquiries:</strong> 7 business days</li>
         <li>• <strong>Legal matters:</strong> 14 business days</li>
        </ul>
       </div>

       <div className="bg-red-900/10 rounded-2xl p-6 mt-6 border border-red-900/20">
        <h4 className="text-xl font-semibold text-red-400 mb-3">Complaints</h4>
        <p className="text-red-200/80 text-lg">
         If you have a complaint about our handling of your personal data or any other aspect of our Services, please contact our DPO first. If you are not satisfied with our response, you have the right to lodge a complaint with the relevant supervisory authority as outlined in Section 14.2.
        </p>
       </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border pt-8 mt-12 animate-fade-in">
       <p className="text-center text-muted-foreground text-sm">
        These Terms of Service are provided in compliance with applicable data protection regulations and consumer protection laws.
       </p>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
}
