'use client';

import HeroSection from '@/components/revision360/HeroSection';
import Why360Section from '@/components/revision360/Why360Section';
import ServiceSection from '@/components/revision360/ServiceSection';
import VariantsSection from '@/components/revision360/VariantsSection';
import BenefitsSection from '@/components/revision360/BenefitsSection';
import FinalInvitationSection from '@/components/revision360/FinalInvitationSection';
import Footer from '@/components/revision360/Footer';

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
