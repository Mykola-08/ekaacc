'use client';

import HeroSection from '@/react-app/components/revision360/HeroSection';
import Why360Section from '@/react-app/components/revision360/Why360Section';
import ServiceSection from '@/react-app/components/revision360/ServiceSection';
import VariantsSection from '@/react-app/components/revision360/VariantsSection';
import BenefitsSection from '@/react-app/components/revision360/BenefitsSection';
import FinalInvitationSection from '@/react-app/components/revision360/FinalInvitationSection';
import Footer from '@/react-app/components/revision360/Footer';

export default function Revision360Page() {
  return (
    <div className="min-h-screen bg-black">
      <HeroSection />
      <Why360Section />
      <ServiceSection />
      <VariantsSection />
      <BenefitsSection />
      <FinalInvitationSection />
      <Footer />
    </div>
  );
}
