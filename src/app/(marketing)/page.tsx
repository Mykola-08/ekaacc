import { Metadata } from 'next';
import HomeContent from '@/components/marketing/HomeContent';

export const dynamic = 'force-dynamic';


export const metadata: Metadata = {
  title: "EKA Balance | Elena Kucherova - Teràpies Somàtiques a Barcelona",
  description: "Restaura la teva vitalitat sistèmica amb Elena Kucherova. Especialista en integració somàtica, kinesiologia i regulació del sistema nerviós a Barcelona.",
  keywords: ["Elena Kucherova", "EKA Balance", "Teràpies Somàtiques", "Barcelona", "Kinesiologia", "Integració Somàtica", "Benestar", "Salut", "Movement Lesson", "JKA"],
  openGraph: {
    title: "EKA Balance | Elena Kucherova",
    description: "Restaura la teva vitalitat sistèmica. Centre de referència en teràpies somàtiques i regulació del sistema nerviós a Barcelona.",
    type: 'website',
    images: [
      {
        url: '/images/eka_logo.png', // Assuming this exists based on layout usage
        width: 800,
        height: 600,
        alt: 'EKA Balance Logo',
      },
    ],
  }
};

export default function Home() {
  return <HomeContent />;
}



