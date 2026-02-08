'use client';

import HeroSection from '@/components/marketing/revision360/HeroSection';
import Why360Section from '@/components/marketing/revision360/Why360Section';
import ServiceSection from '@/components/marketing/revision360/ServiceSection';
import VariantsSection from '@/components/marketing/revision360/VariantsSection';
import BenefitsSection from '@/components/marketing/revision360/BenefitsSection';
import FinalInvitationSection from '@/components/marketing/revision360/FinalInvitationSection';

export default function Revision360Content() {
  return (
    <div className="min-h-screen bg-[#07090f] text-white">
      <HeroSection />
      <Why360Section />
      <ServiceSection />
      <VariantsSection />
      <BenefitsSection />
      <FinalInvitationSection />
    </div>
  );
}
